/**
 * The present year. Features that compare a year "then vs now" read these instead of a hard-coded 2026.
 * To roll the site forward, change PRESENT_YEAR and add that era; nothing else names the year.
 */
import type { EraId } from "./types.ts";

export const PRESENT_YEAR: EraId = 2026;
/** In the present era, "then vs now" features compare against this year instead. */
export const COMPARISON_BASELINE_FOR_PRESENT: EraId = 2020;

/** The year a "then vs now" feature should compare `year` with. */
export const comparisonYear = (year: EraId): EraId => (year === PRESENT_YEAR ? COMPARISON_BASELINE_FOR_PRESENT : PRESENT_YEAR);

/** The nearest year in a list; a tie goes to the later year, so 2023 to 2037 resolve to 2026 and 2038 onward to 2050. */
export const nearestYear = <T extends number>(years: readonly T[], year: number): T => years.reduce((best, y) => (Math.abs(y - year) <= Math.abs(best - year) ? y : best), years[0]);
