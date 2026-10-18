/**
 * Era data rules, shared by the app (checked when data loads) and by
 * scripts/validate-eras.ts (`npm run validate`, also run by `npm run build`).
 * Plain TypeScript with no bundler or DOM dependencies so Node can run it directly.
 */
import type { Claim, DeepDive, Everyday, EverydayItem, DeepDiveItem, DeepDiveThread, Era, EraBase, EraId, FactCheckRow, Source } from "./types.ts";
import { DEEP_DIVE_SECTIONS, isSectionId } from "./deepdive.ts";

export const ERA_YEARS: readonly EraId[] = [1900, 1920, 1930, 1945, 1960, 1970, 1984, 1995, 1999, 2005, 2010, 2020, 2026, 2050];

const CHROMES = ["newspaper", "midcentury", "win98", "flatweb", "futureos", "artnouveau", "artdeco", "homefront", "groovy", "terminal", "earlyweb", "web2gloss", "videocall", "bento"];
const TRANSITIONS = ["pageflip", "tvclick", "crtpoweron", "flatslide", "glitch", "iris", "curtain", "stamp", "lavablob", "typeout", "interlace", "glossswipe", "reconnect", "assemble"];
const SCENES = [
  "Radio1920", "Television1960", "CrtPc1999", "Smartphone2010", "Hologram2050", "Gramophone1900", "Projector1930",
  "RationBook1945", "Turntable1970", "FloppyDrive1984", "Modem1995", "MusicPlayer2005", "Laptop2020", "SmartGlasses2026",
];
const PLACE_IDS = ["newspaper", "bedroom", "street"];
const CATEGORIES = ["communication", "entertainment", "home", "transport", "work"];
const CAME_TRUE = ["yes", "partly", "no", "unknown"];
const QUALITIES = ["primary", "reference", "secondary"];

const MINIMUMS = { morningRoutine: 4, prices: 6, technology: 5, futureVisions: 3, headlines: 3 } as const;

/** WCAG AA for normal body text. */
export const MIN_CONTRAST = 4.5;

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const HEX = /^#[0-9a-fA-F]{6}$/;
const DATE = /^\d{4}-\d{2}(-\d{2})?$/;

/** Items that state facts. Each needs a source or an explicit todo unless the era is speculative. */
type FactItem = { id?: string; source?: Source; todo?: boolean; checked?: string };

/** Era JSON list -> the section slug used in claim ids. */
export const ID_SECTIONS = {
  morningRoutine: "morning",
  places: "places",
  prices: "prices",
  technology: "technology",
  futureVisions: "visions",
  headlines: "headlines",
} as const;

/** Every list of claim items in an era, with its id section slug. */
export function claimLists(era: Era): [string, string, Claim[]][] {
  return Object.entries(ID_SECTIONS).map(([key, sec]) => [key, sec, ((era as unknown as Record<string, Claim[]>)[key] ?? [])]);
}

/** Era-level fields that are claims too; each needs a row in the fact-check report. */
export const ERA_FIELD_IDS = ["era.title", "era.tagline", "era.persona", "scene.caption"] as const;

/** Returns a list of problems with one era file. Empty means valid. */
export function validateEra(raw: unknown, file: string): string[] {
  const errors: string[] = [];
  const era = raw as Era;
  const err = (msg: string) => errors.push(`${file}: ${msg}`);
  const oneOf = (value: unknown, allowed: readonly (string | number)[], field: string) => {
    if (!allowed.includes(value as string)) err(`${field} must be one of ${allowed.join(", ")} (got "${String(value)}")`);
  };

  if (!era || typeof era !== "object") return [`${file}: not a JSON object`];

  oneOf(era.year, ERA_YEARS, "year");
  if (!era.title) err("title is required");
  if (!era.tagline) err("tagline is required");
  if (typeof era.speculative !== "boolean") err("speculative must be true or false");
  if (era.year === 2050 && era.speculative !== true) err("2050 must be speculative: true");
  if (era.year !== 2050 && era.speculative !== false) err("only 2050 may be speculative; historical eras must be speculative: false");

  if (!era.locale?.region || !era.locale?.currency || !era.locale?.persona) err("locale.region, locale.currency and locale.persona are required");

  const theme = era.theme;
  if (!theme) {
    err("theme is required");
  } else {
    oneOf(theme.chrome, CHROMES, "theme.chrome");
    oneOf(theme.transition, TRANSITIONS, "theme.transition");
    if (!theme.sound) err("theme.sound is required (every era has its own sound)");
    if (!theme.fonts?.heading || !theme.fonts?.body) err("theme.fonts.heading and theme.fonts.body are required");
    const p = theme.palette;
    for (const key of ["primary", "secondary", "background", "paper", "text"] as const) {
      if (!HEX.test(p?.[key] ?? "")) err(`theme.palette.${key} must be a #rrggbb colour`);
    }
    if (p && HEX.test(p.text) && HEX.test(p.background) && HEX.test(p.paper)) {
      for (const surface of ["background", "paper"] as const) {
        const ratio = contrastRatio(p.text, p[surface]);
        if (ratio < MIN_CONTRAST) err(`text on ${surface} has contrast ${ratio.toFixed(2)}:1, below WCAG AA ${MIN_CONTRAST}:1`);
      }
    }
  }
  oneOf(era.scene?.component, SCENES, "scene.component");
  if (!era.scene?.caption) err("scene.caption is required");

  for (const [key, min] of Object.entries(MINIMUMS)) {
    const list = (era as unknown as Record<string, unknown[]>)[key];
    if (!Array.isArray(list)) err(`${key} must be an array`);
    else if (list.length < min && !era.notes?.[key as keyof typeof MINIMUMS]) err(`${key} needs at least ${min} items (has ${list.length}), or a notes.${key} explaining the gap`);
  }

  const places = Array.isArray(era.places) ? era.places : [];
  if (places.length !== 3 || new Set(places.map((p) => p.kind)).size !== 3) err("places must contain exactly newspaper, bedroom and street");
  places.forEach((p, i) => {
    oneOf(p.kind, PLACE_IDS, `places[${i}].kind`);
    if (!p.imageAlt) err(`places[${i}].imageAlt is required`);
    if (!Array.isArray(p.highlights) || p.highlights.length === 0) err(`places[${i}].highlights must not be empty`);
  });
  (era.technology ?? []).forEach((t, i) => oneOf(t.category, CATEGORIES, `technology[${i}].category`));
  (era.futureVisions ?? []).forEach((f, i) => {
    oneOf(f.cameTrue, CAME_TRUE, `futureVisions[${i}].cameTrue`);
    if (era.speculative && f.cameTrue !== "unknown") err(`futureVisions[${i}].cameTrue must be "unknown" in a speculative era`);
  });
  (era.headlines ?? []).forEach((h, i) => {
    if (!DATE.test(h.date ?? "")) err(`headlines[${i}].date must be YYYY-MM-DD or YYYY-MM`);
    else if (Number(h.date.slice(0, 4)) !== era.year) err(`headlines[${i}].date (${h.date}) is not in ${era.year}`);
    if (!h.headline || !h.publication) err(`headlines[${i}] needs headline and publication`);
    if (typeof h.verbatim !== "boolean") err(`headlines[${i}].verbatim must be true or false`);
    if (h.verbatim && !h.source?.url) err(`headlines[${i}] is marked verbatim but has no source url for the scan or archive`);
    if (era.speculative && h.verbatim) err(`headlines[${i}] cannot be verbatim in a speculative era`);
  });

  // Every fact-like item needs a source or an explicit todo (speculative eras are exempt).
  const groups: [string, FactItem[]][] = [
    ["morningRoutine", era.morningRoutine ?? []],
    ["places", era.places ?? []],
    ["prices", era.prices ?? []],
    ["technology", era.technology ?? []],
    ["futureVisions", era.futureVisions ?? []],
    ["headlines", era.headlines ?? []],
  ];
  for (const [group, items] of groups) {
    items.forEach((item, i) => {
      const where = `${group}[${i}]`;
      if (item.source) {
        if (!item.source.label) err(`${where}.source.label is required`);
        if (item.source.url && !/^https?:\/\/\S+$/.test(item.source.url)) err(`${where}.source.url is not a URL`);
        if (item.source.accessed && !/^\d{4}-\d{2}-\d{2}$/.test(item.source.accessed)) err(`${where}.source.accessed must be YYYY-MM-DD`);
        if (item.source.quality) oneOf(item.source.quality, QUALITIES, `${where}.source.quality`);
      }
      if (!era.speculative && !item.source && item.todo !== true) err(`${where} has neither a source nor "todo": true`);
      if (item.checked !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(item.checked)) err(`${where}.checked must be YYYY-MM-DD`);
    });
  }

  // Stable claim ids: "<year>.<section>.<slug>", unique within the era.
  const seen = new Set<string>();
  const country = era.country ?? "world";
  for (const [key, sec, items] of claimLists(era)) {
    items.forEach((item, i) => {
      const where = `${key}[${i}]`;
      if (!item.id) err(`${where} has no id`);
      else if (!new RegExp(`^${country}\\.${era.year}\\.${sec}\\.[a-z0-9-]+$`).test(item.id)) err(`${where}.id "${item.id}" must look like "${country}.${era.year}.${sec}.<slug>"`);
      else if (seen.has(item.id)) err(`${where}.id "${item.id}" is used twice`);
      else seen.add(item.id);
    });
  }

  return errors;
}

/** Rules across all eras: one of each year, and no theme value shared between two eras. */
export function validateCollection(eras: Era[]): string[] {
  const errors: string[] = [];
  const years = eras.map((e) => e.year);
  for (const y of ERA_YEARS) if (!years.includes(y)) errors.push(`missing era ${y}`);
  if (new Set(years).size !== years.length) errors.push("duplicate era years");

  const unique = (label: string, pick: (e: Era) => (string | undefined)[]) => {
    const seen = new Map<string, EraId>();
    for (const era of eras) {
      for (const raw of new Set(pick(era).filter(Boolean) as string[])) {
        const value = raw.toLowerCase();
        const other = seen.get(value);
        if (other !== undefined) errors.push(`${label} "${raw}" is used by both ${other} and ${era.year}`);
        else seen.set(value, era.year);
      }
    }
  };
  unique("chrome", (e) => [e.theme.chrome]);
  unique("transition", (e) => [e.theme.transition]);
  unique("scene", (e) => [e.scene.component]);
  unique("sound", (e) => [e.theme.sound]);
  unique("heading font", (e) => [e.theme.fonts.heading]);
  unique("font", (e) => [e.theme.fonts.heading, e.theme.fonts.body, e.theme.fonts.mono]);
  unique("primary colour", (e) => [e.theme.palette.primary]);
  return errors;
}

export interface EraSummary {
  year: EraId;
  items: number;
  sourced: number;
  todo: number;
}

export function summarize(era: Era): EraSummary {
  const items: FactItem[] = [...era.morningRoutine, ...era.places, ...era.prices, ...era.technology, ...era.futureVisions, ...era.headlines];
  return {
    year: era.year,
    items: items.length,
    sourced: items.filter((i) => i.source).length,
    todo: items.filter((i) => i.todo).length,
  };
}

/** A source label that names an archive, scan or catalogue counts as a reference even without a URL. */
const ARCHIVE_REF = /\b(archive|archives|scan|microfilm|catalogue|catalog|collection)\b/i;
const STATUSES = ["verified", "corrected", "unverifiable", "removed"];

/**
 * Cross-checks the era JSON against docs/fact-check.json (run by scripts/validate-eras.ts only).
 * Every item and era-level field needs a report row; report statuses must agree with the JSON.
 */
export function validateReport(eras: Era[], rows: FactCheckRow[]): string[] {
  const errors: string[] = [];
  const byId = new Map<string, FactCheckRow[]>();
  const keys = new Set<string>();
  rows.forEach((r, i) => {
    if (!r.id || !r.field || !r.claim) errors.push(`fact-check.json[${i}] needs id, field and claim`);
    if (!STATUSES.includes(r.status)) errors.push(`fact-check.json[${i}] (${r.id}) has unknown status "${r.status}"`);
    if ((r.status === "verified" || r.status === "corrected") && !(r.sources?.length > 0)) errors.push(`fact-check ${r.id} [${r.field}] is ${r.status} but lists no sources`);
    if (r.status === "corrected" && r.oldValue === undefined) errors.push(`fact-check ${r.id} [${r.field}] is corrected but has no oldValue`);
    const key = `${r.id}|${r.field}`;
    if (keys.has(key)) errors.push(`fact-check ${r.id} [${r.field}] appears twice`);
    keys.add(key);
    byId.set(r.id, [...(byId.get(r.id) ?? []), r]);
  });

  const live = new Set<string>();
  const allIds = new Map<string, EraId>();
  for (const era of eras) {
    const prefix = `${era.country ?? "world"}.${era.year}`;
    // India's persona and scene caption are editorial labels that state no facts, so only title and tagline need rows.
    for (const f of ERA_FIELD_IDS) {
      if ((era.country ?? "world") !== "world" && (f === "era.persona" || f === "scene.caption")) continue;
      const id = `${prefix}.${f}`;
      live.add(id);
      if (!byId.has(id)) errors.push(`${id} has no entry in docs/fact-check.json`);
    }
    for (const [, , items] of claimLists(era)) {
      for (const item of items) {
        if (!item.id) continue;
        const other = allIds.get(item.id);
        if (other !== undefined) errors.push(`id "${item.id}" is used twice (${other} and ${era.year})`);
        allIds.set(item.id, era.year);
        live.add(item.id);
        const its = byId.get(item.id);
        if (!its) {
          errors.push(`${item.id} has no entry in docs/fact-check.json`);
          continue;
        }
        const statuses = its.map((r) => r.status);
        if (statuses.includes("removed")) errors.push(`${item.id} is marked removed in the report but is still in the JSON`);
        if (!era.speculative && statuses.includes("unverifiable") && item.todo !== true) errors.push(`${item.id} is unverifiable in the report but lacks "todo": true`);
        if (statuses.every((s) => s === "verified" || s === "corrected")) {
          if (!item.source?.url && !ARCHIVE_REF.test(item.source?.label ?? "")) errors.push(`${item.id} is ${statuses.includes("corrected") ? "corrected" : "verified"} but has no source.url or archive reference`);
          if (item.todo) errors.push(`${item.id} is fully verified in the report but still has "todo": true`);
        }
      }
    }
  }
  for (const [id, its] of byId) {
    const isItem = /^[a-z]+\.\d{4}\.(morning|places|prices|technology|visions|headlines)\./.test(id);
    if (isItem && !live.has(id) && !its.every((r) => r.status === "removed")) errors.push(`fact-check ${id} refers to an item that is not in the JSON (mark it removed or fix the id)`);
  }
  return errors;
}

/** Rules across one country's eras: same year list as the base, and no look-and-feel keys in content files. */
export function validateCountry(country: string, files: Map<number, Record<string, unknown>>, enabled: boolean): string[] {
  const errors: string[] = [];
  if (enabled) {
    for (const y of ERA_YEARS) if (!files.has(y)) errors.push(`${country}: missing era ${y}`);
    for (const y of files.keys()) if (!ERA_YEARS.includes(y as EraId)) errors.push(`${country}: has extra year ${y}`);
  }
  for (const [y, raw] of files) {
    for (const key of ["theme", "scene", "speculative"]) {
      if (key in raw) errors.push(`${country}/${y}.json contains "${key}", which belongs in eraBase/${y}.json`);
    }
    if (raw.country !== country) errors.push(`${country}/${y}.json has country "${String(raw.country)}"`);
    if (typeof raw.sceneCaption !== "string" || !raw.sceneCaption) errors.push(`${country}/${y}.json needs a sceneCaption`);
  }
  return errors;
}

/** India-specific content rules (pre-decimal prices, stated inflation method). */
export function validateIndiaPrices(era: Era, file: string): string[] {
  const errors: string[] = [];
  era.prices.forEach((p, i) => {
    if (era.year < 1960 && !p.originalUnits) errors.push(`${file}: prices[${i}] ("${p.item}") is before 1957 and needs originalUnits (annas and pies)`);
    if (p.adjusted2026 && !p.adjustedMethod) errors.push(`${file}: prices[${i}] ("${p.item}") has adjusted2026 but no adjustedMethod`);
  });
  return errors;
}

const OVERLAY_KEYS = ["accent", "accentFont", "pattern", "ornament", "decor", "deepDive"];
const FRAMES = ["cartouche", "column", "arch", "slip", "poster", "signboard", "crt", "gif", "bevel", "gloss", "card", "tile", "holo", "stitch-tile"];
const MOTIF_STYLES = ["woodcut", "deco", "stamp", "poster", "signboard", "pixel", "gif", "bevel", "gloss", "flat", "tile", "holo", "stitch"];
const ORNAMENTS = ["blockprint", "ruled", "perforated", "bars", "lattice", "dots"];
/** Non-text ornaments need 3:1 (WCAG 1.4.11). Body text never uses the accent. */
export const MIN_ORNAMENT_CONTRAST = 3;

/** A country's theme layer: only allowed keys, unique accent fonts and patterns, no base-font reuse, readable ornaments. */
export function validateOverlay(country: string, overlay: Record<string, Record<string, unknown> | undefined>, bases: Map<number, EraBase>): string[] {
  const errors: string[] = [];
  const baseFonts = new Set<string>();
  for (const b of bases.values()) for (const f of Object.values(b.theme.fonts)) if (f) baseFonts.add(f.toLowerCase());
  const fonts = new Map<string, string>();
  const patterns = new Map<string, string>();

  for (const y of ERA_YEARS) {
    const o = overlay[y] as Record<string, any> | undefined;
    const where = `${country} overlay ${y}`;
    if (!o) {
      errors.push(`${where}: missing`);
      continue;
    }
    for (const key of Object.keys(o)) if (!OVERLAY_KEYS.includes(key)) errors.push(`${where}: key "${key}" is not allowed (allowed: ${OVERLAY_KEYS.join(", ")})`);
    if (!HEX.test(o.accent?.color ?? "")) errors.push(`${where}: accent.color must be #rrggbb`);
    if (o.ornament && !ORNAMENTS.includes(o.ornament)) errors.push(`${where}: unknown ornament "${o.ornament}"`);
    const base = bases.get(y);
    if (base && HEX.test(o.accent?.color ?? "")) {
      for (const surface of ["background", "paper"] as const) {
        for (const c of [o.accent.color, o.accent.secondaryColor].filter(Boolean) as string[]) {
          const ratio = contrastRatio(c, base.theme.palette[surface]);
          if (ratio < MIN_ORNAMENT_CONTRAST) errors.push(`${where}: ${c} on ${surface} has contrast ${ratio.toFixed(2)}:1, below ${MIN_ORNAMENT_CONTRAST}:1`);
        }
      }
    }
    if (o.deepDive) {
      for (const key of Object.keys(o.deepDive)) if (!["portalFrame", "heroPattern", "motifStyle"].includes(key)) errors.push(`${where}: deepDive key "${key}" is not allowed`);
      if (!FRAMES.includes(o.deepDive.portalFrame)) errors.push(`${where}: unknown portalFrame "${o.deepDive.portalFrame}"`);
      if (!MOTIF_STYLES.includes(o.deepDive.motifStyle)) errors.push(`${where}: unknown motifStyle "${o.deepDive.motifStyle}"`);
      if (!o.deepDive.heroPattern) errors.push(`${where}: deepDive.heroPattern is required`);
    }
    const fam = o.accentFont?.family as string | undefined;
    if (fam) {
      if (baseFonts.has(fam.toLowerCase())) errors.push(`${where}: accent font "${fam}" is already used by a base era`);
      if (fonts.has(fam.toLowerCase())) errors.push(`${where}: accent font "${fam}" is also used in ${fonts.get(fam.toLowerCase())}`);
      fonts.set(fam.toLowerCase(), String(y));
    }
    const pat = o.pattern as string | undefined;
    if (pat) {
      if (patterns.has(pat)) errors.push(`${where}: pattern "${pat}" is also used in ${patterns.get(pat)}`);
      patterns.set(pat, String(y));
    }
  }
  return errors;
}

// ---------------------------------------------------------------- India Deep Dive

export interface DeepDiveContext {
  base: EraBase | undefined;
  reportIds: Set<string>; // ids that have at least one fact-check row
  knownIds: Set<string>; // every id relatedIds may point at
  credits: string; // CREDITS.md text
  research: string; // RESEARCH.md text
}

const FULL_DATE = /^\d{4}-\d{2}-\d{2}$/;
const hasDigits = (v: unknown) => /\d/.test(JSON.stringify(v ?? ""));

/** Rules for one year of deep-dive content. Returns problems; empty means valid. */
export function validateDeepDive(file: string, dd: DeepDive, ctx: DeepDiveContext): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(`${file}: ${m}`);
  const year = dd.year;
  if (dd.country !== "in") err(`country must be "in"`);
  if (!ctx.base) err(`has no eraBase/${year}.json`);
  else if (dd.speculative !== ctx.base.speculative) err(`speculative (${dd.speculative}) must match eraBase (${ctx.base.speculative})`);
  const spec = Boolean(ctx.base?.speculative);

  if (!dd.intro?.headline || !dd.intro?.summary) err("intro needs headline and summary");
  if (!Array.isArray(dd.highlights) || dd.highlights.length < 5 || dd.highlights.length > 7) err("highlights must list 5 to 7 item ids");

  const seen = new Set<string>();
  for (const spec_ of DEEP_DIVE_SECTIONS) {
    const sec = dd.sections?.[spec_.id];
    const where = `section ${spec_.id}`;
    if (!sec) {
      err(`${where} is missing`);
      continue;
    }
    if (!sec.title || !sec.standfirst) err(`${where} needs title and standfirst`);
    if (sec.items.length < spec_.min && !sec.scarcityNote) err(`${where} has ${sec.items.length} items (minimum ${spec_.min}) and no scarcityNote`);
    if (spec_.id === "economy-business" && sec.items.filter((i) => i.kind === "indicator").length < Math.min(2, sec.items.length)) err(`${where} needs at least 2 indicator items`);
    if (sec.interactive?.component !== spec_.component) err(`${where}: interactive must be ${spec_.component} (got "${String(sec.interactive?.component)}")`);
    if (hasDigits(sec.interactive?.data) && !(sec.interactive.sources?.length) && !sec.interactive.todo && !spec) err(`${where}: interactive data has numbers but no sources`);

    sec.items.forEach((item: DeepDiveItem, i) => {
      const w = `${where}[${i}] (${item.id})`;
      if (!new RegExp(`^in\\.${year}\\.dd\\.${spec_.id}\\.[a-z0-9-]+$`).test(item.id ?? "")) err(`${w}: id must look like in.${year}.dd.${spec_.id}.<slug>`);
      if (seen.has(item.id)) err(`${w}: duplicate id`);
      seen.add(item.id);
      if (!ctx.reportIds.has(item.id)) err(`${w}: has no entry in docs/fact-check.json`);
      if (!isSectionId(spec_.id) || (item.kind !== spec_.kind && !(spec_.kind === "work" && item.kind === "work"))) err(`${w}: kind "${item.kind}" does not belong in ${spec_.id} (expects ${spec_.kind})`);
      if (!item.title || !item.summary) err(`${w}: needs title and summary`);

      const needsTwo =
        item.kind === "sport" || item.kind === "indicator" || (item.kind === "person" && item.quote) || FULL_DATE.test(item.date ?? "") || (item.kind === "film" && item.releaseDate);
      if (!spec) {
        if (item.sources.length === 0 && !item.todo) err(`${w}: has neither sources nor "todo": true`);
        else if (needsTwo && item.sources.length < 2 && !item.todo) err(`${w}: dates, scores, statistics and quotes need two sources (or todo)`);
      }
      item.sources.forEach((src) => {
        if (!src.label) err(`${w}: source needs a label`);
        if (src.url && !/^https?:\/\/\S+$/.test(src.url)) err(`${w}: source url is not a URL`);
      });

      if (item.date) {
        if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(item.date)) err(`${w}: date "${item.date}" must be YYYY, YYYY-MM or YYYY-MM-DD`);
        else if (Number(item.date.slice(0, 4)) !== year) {
          if (!item.context || item.kind !== "event" || !(item.relatedIds?.length)) err(`${w}: date ${item.date} is outside ${year}; only context events with relatedIds may be`);
        }
      }
      if (item.kind === "person") {
        if (!item.whyThisYear) err(`${w}: person needs whyThisYear`);
        if (item.quote && !item.quote.source?.label) err(`${w}: quote needs its own source`);
        if (item.quote && !item.quote.lang) err(`${w}: quote needs a lang`);
      }
      if (item.kind === "work") {
        if (item.originalTitle && !item.originalTitle.lang) err(`${w}: originalTitle needs a lang`);
        if (item.publicDomainExcerpt) {
          if (!item.publicDomainExcerpt.lang) err(`${w}: publicDomainExcerpt needs a lang`);
          if (!ctx.research.includes(item.id)) err(`${w}: publicDomainExcerpt needs a copyright note naming this id in docs/RESEARCH.md`);
        }
      }
      if (item.media?.type === "licensed-image") {
        if (!item.media.credit || !item.media.src) err(`${w}: licensed-image needs src and credit`);
        else if (!ctx.credits.includes(item.media.src)) err(`${w}: licensed image ${item.media.src} is not listed in CREDITS.md`);
      }
      if (item.kind === "event" && (item.eventType === "conflict" || item.eventType === "disaster") && item.sensitivity?.level !== "content-note") {
        err(`${w}: ${item.eventType} items need sensitivity.level "content-note"`);
      }
      item.relatedIds?.forEach((rid) => {
        if (!ctx.knownIds.has(rid)) err(`${w}: relatedIds "${rid}" does not exist`);
      });
    });
  }
  for (const h of dd.highlights ?? []) if (!seen.has(h)) err(`highlight "${h}" is not an item in this year`);
  return errors;
}

export function validateThreads(threads: DeepDiveThread[], knownIds: Set<string>): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const t of threads) {
    if (ids.has(t.id)) errors.push(`threads.json: duplicate thread id "${t.id}"`);
    ids.add(t.id);
    if (t.section && !isSectionId(t.section)) errors.push(`threads.json: "${t.id}" has unknown section "${t.section}"`);
    for (const id of t.itemIds) if (!knownIds.has(id)) errors.push(`threads.json: "${t.id}" points at missing id "${id}"`);
  }
  return errors;
}

// ---------------------------------------------------------------- Everyday sections (year page)

export interface EverydayContext {
  base: EraBase | undefined;
  reportIds: Set<string>;
  knownIds: Set<string>; // every id relatedIds may point at
}

const SENSITIVE = /\b(famine|epidemic|plague|pandemic|cholera|influenza|war|wartime|disaster|cyclone|floods?|massacre)\b/i;
const SPECULATIVE_WORDS = /\b(speculative|scenario)\b/i;
const kebab = (id: string) => id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Rules for one country-year of everyday content. Counts are checked separately by scripts/check-counts.ts. */
export function validateEveryday(file: string, ev: Everyday, ctx: EverydayContext, ids = new Set<string>()): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(`${file}: ${m}`);
  if (!ctx.base) err(`has no eraBase/${ev.year}.json`);
  else if (ev.speculative !== ctx.base.speculative) err(`speculative (${ev.speculative}) must match eraBase (${ctx.base.speculative})`);
  const spec = Boolean(ctx.base?.speculative);
  for (const [sec, section] of Object.entries(ev.sections ?? {})) {
    for (const it of section.items as EverydayItem[]) {
      const where = `${it.id ?? "(no id)"}`;
      const e = (m: string) => err(`${where}: ${m}`);
      if (!new RegExp(`^${ev.country}\\.${ev.year}\\.everyday\\.${kebab(sec)}\\.[a-z0-9-]+$`).test(it.id ?? "")) e(`id must be ${ev.country}.${ev.year}.everyday.${kebab(sec)}.<slug>`);
      if (ids.has(it.id)) e("duplicate id");
      ids.add(it.id);
      if (!ctx.reportIds.has(it.id)) e("has no row in docs/fact-check.json");
      if (!spec && (it.sources?.length ?? 0) === 0 && !it.todo) e("needs sources or todo: true");
      if (["stat", "price", "wage", "journey", "message"].includes(it.kind) && (it.sources?.length ?? 0) < 2 && !it.todo) e(`a ${it.kind} item needs two sources (or todo: true)`);
      if (it.kind === "stat" && !it.asOf) e("stat needs asOf");
      if (ev.country === "in" && ev.year < 1957 && (it.kind === "price" || it.kind === "wage") && !it.originalUnits) e("pre-1957 India price or wage needs originalUnits");
      if (it.kind === "price" && it.adjusted2026 && !it.adjustedMethod) e("adjusted2026 needs adjustedMethod");
      if (SENSITIVE.test(`${it.title} ${it.summary}`) && it.sensitivity?.level !== "content-note") e('mentions famine, epidemic, war or disaster: needs sensitivity.level "content-note"');
      const text = JSON.stringify(it);
      if (ev.country === "world" && /₹|\bannas?\b|\bpies?\b/i.test(text)) e("World item uses India-specific currency");
      if (ev.country === "in" && /\$|\bUSD\b/.test(text)) e("India item uses USD prices");
      if (!spec && SPECULATIVE_WORDS.test(`${it.title} ${it.summary}`)) e("historical item uses speculative wording");
      for (const r of it.relatedIds ?? []) if (!ctx.knownIds.has(r)) e(`relatedIds points at unknown id "${r}"`);
    }
  }
  return errors;
}
