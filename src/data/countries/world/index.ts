import type { CountryEra } from "../../types";

/** The original (US-centred) dataset is bundled with the app so the default view needs no extra request. */
const files = import.meta.glob<CountryEra>("./eras/*.json", { eager: true, import: "default" });

export const worldEras: CountryEra[] = Object.values(files).sort((a, b) => a.year - b.year);
