/** Present-year rules. Kept out of validate.ts so the browser bundle does not carry them (only `npm run validate` uses this file). */
import type { EraId, Source } from "./types.ts";
import { PRESENT_YEAR } from "./present.ts";

const DATE = /^\d{4}-\d{2}(-\d{2})?$/;

type Dated = { id?: string; date?: string; todo?: boolean; checked?: string; scheduled?: boolean; forecast?: { publisher?: string; published?: string }; source?: Source; sources?: Source[]; cameTrue?: string };
const DAY = 86_400_000;

/**
 * Rules for the present year's files (era, everyday or deep dive). `items` are every claim item in the file.
 * Other years must not carry contentAsOf, scheduled or forecast at all.
 */
export function validatePresent(file: string, year: EraId, contentAsOf: string | undefined, items: Dated[], futureVisions: Dated[] = []): string[] {
  const errors: string[] = [];
  const err = (id: string | undefined, m: string) => errors.push(`${file}: ${id ? `${id}: ` : ""}${m}`);
  const present = year === PRESENT_YEAR;
  if (present && !DATE.test(contentAsOf ?? "")) err(undefined, "contentAsOf (ISO date) is required for the present year");
  if (!present && contentAsOf !== undefined) err(undefined, "contentAsOf is only allowed in the present year");
  for (const it of items) {
    if (!present) {
      if (it.scheduled !== undefined) err(it.id, "scheduled is only allowed in the present year");
      if (it.forecast !== undefined) err(it.id, "forecast is only allowed in the present year");
      continue;
    }
    const srcs = [...(it.sources ?? []), ...(it.source ? [it.source] : [])];
    if (contentAsOf && it.date && it.date > contentAsOf && !it.scheduled) err(it.id, `date ${it.date} is after contentAsOf ${contentAsOf}: mark it scheduled: true and word it as a plan`);
    // Narrator speculation ("people will…") belongs only in 2050; forecasts and quoted predictions name who said them.
    const { sources: _s, source: _o, ...rest } = it as Dated & Record<string, unknown>;
    if (!it.forecast && !String(it.id).includes(".visions.") && /\b(people will|we will all|by then|will soon|one day we)\b/i.test(JSON.stringify(rest))) err(it.id, "uses speculative narrator wording; only 2050, a named forecast or a quoted prediction may");
    if (it.scheduled && !srcs.some((x) => x.url)) err(it.id, "a scheduled item needs an official source with a url");
    if (it.forecast && (!it.forecast.publisher || !DATE.test(it.forecast.published ?? "") || !srcs.some((x) => x.url))) err(it.id, "a forecast needs forecast.publisher, forecast.published (a date) and a source url");
    if (!it.todo && contentAsOf) {
      if (!it.checked) err(it.id, "present-year item needs a checked date (or todo: true)");
      else if (Date.parse(it.checked) < Date.parse(contentAsOf) - 30 * DAY) err(it.id, `checked ${it.checked} is more than 30 days before contentAsOf ${contentAsOf}`);
      if (srcs.some((x) => !x.accessed)) err(it.id, "every source needs an accessed date");
    }
  }
  for (const f of futureVisions) if (present && f.cameTrue !== "unknown") err(f.id, 'present-year future visions must have cameTrue: "unknown"');
  return errors;
}
