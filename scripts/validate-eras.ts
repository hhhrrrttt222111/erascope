/**
 * npm run validate
 *
 * Loads eraBase/ (how each era looks) and every country under countries/ (what each era says),
 * merges them, checks the schema and content rules in src/data/validate.ts, cross-checks the
 * result against docs/fact-check.json, then prints a per-country sourcing summary.
 * Exits with code 1 if anything is wrong, which also fails `npm run build`.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { summarize, validateCollection, validateCountry, validateEra, validateDeepDive, validateIndiaPrices, validateOverlay, validateReport, validateThreads } from "../src/data/validate.ts";
import { resolveEra } from "../src/data/resolve.ts";
import type { CountryEra, DeepDive, DeepDiveThread, Era, EraBase, FactCheckRow } from "../src/data/types.ts";

const dataDir = join(import.meta.dirname, "..", "src", "data");
const errors: string[] = [];
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const jsonFiles = (dir: string) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).sort() : []);

// ---- eraBase
const bases = new Map<number, EraBase>();
for (const file of jsonFiles(join(dataDir, "eraBase"))) {
  try {
    const base = readJson(join(dataDir, "eraBase", file)) as EraBase;
    if (String(base.year) !== file.replace(".json", "")) errors.push(`eraBase/${file}: year does not match the file name`);
    bases.set(base.year, base);
  } catch (e) {
    errors.push(`eraBase/${file}: invalid JSON (${(e as Error).message})`);
  }
}

// ---- countries
interface Meta { id: string; enabled: boolean }
const countriesDir = join(dataDir, "countries");
const countryIds = readdirSync(countriesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const byCountry = new Map<string, Era[]>();

for (const dir of countryIds) {
  const metaPath = join(countriesDir, dir, "country.json");
  if (!existsSync(metaPath)) {
    errors.push(`countries/${dir}: country.json is missing`);
    continue;
  }
  const meta = readJson(metaPath) as Meta;
  if (meta.id !== dir) errors.push(`countries/${dir}/country.json: id "${meta.id}" must match the folder name`);

  const raws = new Map<number, Record<string, unknown>>();
  for (const file of jsonFiles(join(countriesDir, dir, "eras"))) {
    try {
      const raw = readJson(join(countriesDir, dir, "eras", file));
      if (String(raw.year) !== file.replace(".json", "")) errors.push(`${dir}/${file}: year does not match the file name`);
      raws.set(raw.year, raw);
    } catch (e) {
      errors.push(`${dir}/${file}: invalid JSON (${(e as Error).message})`);
    }
  }
  errors.push(...validateCountry(dir, raws, meta.enabled));

  const eras: Era[] = [];
  for (const [year, raw] of raws) {
    const base = bases.get(year);
    if (!base) {
      errors.push(`${dir}/${year}.json has no eraBase/${year}.json`);
      continue;
    }
    const merged = resolveEra(base, raw as unknown as CountryEra);
    const fileErrors = validateEra(merged, `${dir}/${year}.json`);
    if (dir === "in") fileErrors.push(...validateIndiaPrices(merged, `${dir}/${year}.json`));
    errors.push(...fileErrors);
    if (fileErrors.length === 0) eras.push(merged);
  }
  byCountry.set(dir, eras.sort((a, b) => a.year - b.year));

  const overlayPath = join(countriesDir, dir, "theme", "overlay.ts");
  if (existsSync(overlayPath)) {
    const { overlay } = (await import(overlayPath)) as { overlay: Record<string, Record<string, unknown>> };
    errors.push(...validateOverlay(dir, overlay, bases));
  }
}

// Theme uniqueness is a property of the shared base, so check it once on the first country's merge.
const first = [...byCountry.values()][0] ?? [];
if (errors.length === 0) errors.push(...validateCollection(first));

// ---- India deep dive (per country that has a deepdive folder)
const root = join(import.meta.dirname, "..");
const reportRows: FactCheckRow[] = existsSync(join(root, "docs", "fact-check.json")) ? readJson(join(root, "docs", "fact-check.json")) : [];
const credits = existsSync(join(root, "CREDITS.md")) ? readFileSync(join(root, "CREDITS.md"), "utf8") : "";
const research = existsSync(join(root, "docs", "RESEARCH.md")) ? readFileSync(join(root, "docs", "RESEARCH.md"), "utf8") : "";
if (existsSync(join(countriesDir, "world", "deepdive"))) errors.push("World must not have a deepdive folder (the deep dive is India-only for now)");
for (const dir of countryIds) {
  const ddDir = join(countriesDir, dir, "deepdive");
  if (!existsSync(ddDir)) continue;
  const files = new Map<number, DeepDive>();
  for (const f of jsonFiles(ddDir).filter((f) => /^\d{4}\.json$/.test(f))) {
    try {
      const dd = readJson(join(ddDir, f)) as DeepDive;
      if (String(dd.year) !== f.replace(".json", "")) errors.push(`${dir}/deepdive/${f}: year does not match the file name`);
      files.set(dd.year, dd);
    } catch (e) {
      errors.push(`${dir}/deepdive/${f}: invalid JSON (${(e as Error).message})`);
    }
  }
  for (const y of bases.keys()) if (!files.has(y)) errors.push(`${dir}/deepdive: missing ${y}.json`);
  for (const y of files.keys()) if (!bases.has(y)) errors.push(`${dir}/deepdive: extra year ${y}`);

  const knownIds = new Set<string>();
  for (const era of byCountry.get(dir) ?? []) {
    for (const list of [era.morningRoutine, era.places, era.prices, era.technology, era.futureVisions, era.headlines]) for (const it of list) knownIds.add(it.id);
  }
  for (const dd of files.values()) for (const sec of Object.values(dd.sections)) for (const it of sec.items) knownIds.add(it.id);
  const reportIds = new Set(reportRows.map((r) => r.id));
  for (const [y, dd] of files) {
    errors.push(...validateDeepDive(`${dir}/deepdive/${y}.json`, dd, { base: bases.get(y), reportIds, knownIds, credits, research }));
  }
  // Every interactive named in the data must exist as a component file.
  const components = new Set<string>();
  for (const dd of files.values()) for (const sec of Object.values(dd.sections)) components.add(sec.interactive.component);
  for (const c of components) {
    if (!existsSync(join(root, "src", "components", "interactives", "deepdive", `${c}.tsx`))) errors.push(`${dir}/deepdive: interactive component ${c} has no file in src/components/interactives/deepdive/`);
  }
  const threadsPath = join(ddDir, "threads.json");
  if (existsSync(threadsPath)) errors.push(...validateThreads((readJson(threadsPath).threads ?? []) as DeepDiveThread[], knownIds));
}

// ---- fact-check report
const reportPath = join(import.meta.dirname, "..", "docs", "fact-check.json");
if (!existsSync(reportPath)) errors.push("docs/fact-check.json is missing (see docs/RESEARCH.md)");
else if (errors.length === 0) {
  const rows = readJson(reportPath) as FactCheckRow[];
  errors.push(...validateReport([...byCountry.values()].flat(), rows));
}

// ---- summary
let totals = { items: 0, sourced: 0, todo: 0 };
for (const [country, eras] of byCountry) {
  console.log(`\n${country}   items  sourced  todo`);
  console.log("-------  -----  -------  ----");
  for (const era of eras) {
    const s = summarize(era);
    totals = { items: totals.items + s.items, sourced: totals.sourced + s.sourced, todo: totals.todo + s.todo };
    const tag = era.speculative ? "  (speculative)" : "";
    console.log(`${s.year}     ${String(s.items).padStart(5)}  ${String(s.sourced).padStart(7)}  ${String(s.todo).padStart(4)}${tag}`);
  }
}
console.log(`total    ${String(totals.items).padStart(5)}  ${String(totals.sourced).padStart(7)}  ${String(totals.todo).padStart(4)}\n`);

if (errors.length > 0) {
  console.error(`✗ ${errors.length} problem(s) in era data:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ ${byCountry.size} countr${byCountry.size === 1 ? "y" : "ies"}, ${[...byCountry.values()].reduce((n, e) => n + e.length, 0)} eras valid`);
