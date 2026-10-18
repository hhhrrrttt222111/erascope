/** Boundary years for the "#/<year>" fallback: 2023 to 2037 land on 2026, 2038 onward on 2050. Run by `npm run validate`. */
import assert from "node:assert/strict";
import { nearestYear } from "../src/data/present.ts";
import { ERA_YEARS } from "../src/data/validate.ts";

const cases: [number, number][] = [[1987, 1984], [2021, 2020], [2022, 2020], [2023, 2026], [2026, 2026], [2037, 2026], [2038, 2050], [2049, 2050], [2100, 2050], [1800, 1900]];
for (const [input, want] of cases) assert.equal(nearestYear(ERA_YEARS, input), want, `#/${input} should land on ${want}`);
console.log(`check-routing: ${cases.length} boundary years ok`);
