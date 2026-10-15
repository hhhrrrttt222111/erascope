import type { CountryId, DeepDive, Era, EraBase, EraId, ResolvedEra } from "./types";
import { ERA_YEARS, validateCollection, validateEra } from "./validate.ts";
import { resolveEra } from "./resolve.ts";
import { countryById, DEFAULT_COUNTRY } from "./countries/registry";
import { worldEras } from "./countries/world";

export type { Era, EraId, CountryId, ResolvedEra } from "./types";
export { ERA_YEARS };

// eraBase/ holds how each era looks (shared by every country); countries/<id>/eras/ holds what it says.
// `npm run validate` (part of the build) runs the full checks; the same rules run here so a bad edit
// in dev fails loudly instead of rendering wrongly.
const baseFiles = import.meta.glob<EraBase>("./eraBase/*.json", { eager: true, import: "default" });
const baseByYear = Object.fromEntries(Object.values(baseFiles).map((b) => [b.year, b])) as Record<EraId, EraBase>;

/** Merges base look with one country's content for a year. */
export async function getEra(country: CountryId, year: EraId): Promise<ResolvedEra> {
  const entry = countryById(country) ?? countryById(DEFAULT_COUNTRY)!;
  return resolveEra(baseByYear[year], await entry.loadEra(year));
}

/** A country's deep dive for a year, or null when that country has none (World). */
export async function getDeepDive(country: CountryId, year: EraId): Promise<DeepDive | null> {
  const load = countryById(country)?.loadDeepDive;
  return load ? load(year) : null;
}

export const hasDeepDive = (country: CountryId) => Boolean(countryById(country)?.loadDeepDive);

const problems: string[] = [];
const loaded: Era[] = worldEras.map((content) => {
  const merged = resolveEra(baseByYear[content.year], content);
  problems.push(...validateEra(merged, `world/${content.year}.json`));
  return merged;
});
if (problems.length === 0) problems.push(...validateCollection(loaded));
if (problems.length > 0) throw new Error(`[era data]\n${problems.join("\n")}`);

/** The original dataset (country "world"), available synchronously. */
export const eras: Era[] = loaded.sort((a, b) => a.year - b.year);

export const eraByYear = Object.fromEntries(eras.map((e) => [e.year, e])) as Record<EraId, Era>;

export const eraIndex = (year: EraId) => ERA_YEARS.indexOf(year);

export const isEraId = (value: unknown): value is EraId => ERA_YEARS.includes(Number(value) as EraId);

/** The era closest to any year, for deep links like #/1987 (→ 1984). */
export function nearestEra(year: number): EraId {
  return ERA_YEARS.reduce((best, y) => (Math.abs(y - year) < Math.abs(best - year) ? y : best), ERA_YEARS[0]);
}
