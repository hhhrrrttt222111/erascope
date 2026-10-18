/**
 * The list of countries. To add one: create countries/<id>/ with country.json and eras/<year>.json
 * for every year, then add one entry below. No component changes are needed.
 */
import type { CountryEra, CountryId, CountryOverlay, DeepDive, Everyday, EraId } from "../types";
import worldMeta from "./world/country.json";
import indiaMeta from "./in/country.json";
import { worldEras } from "./world";

export interface CountryMeta {
  id: CountryId;
  name: string;
  nativeNames?: { lang: string; text: string }[];
  selectorLabel: string;
  enabled: boolean; // false hides it from the selector but keeps it buildable
  defaultLocale: { region: string; currency: string; currencySymbol: string };
}

export interface CountryEntry extends CountryMeta {
  /** Resolves one year of this country's content. Non-default countries load lazily, one chunk per file. */
  loadEra: (year: EraId) => Promise<CountryEra>;
  /** The country's theme layer, if it has one. Loaded lazily with its data. */
  loadOverlay?: () => Promise<CountryOverlay>;
  /** Everyday-life sections for the year page. Required for every enabled country. */
  loadEveryday: (year: EraId) => Promise<Everyday>;
  /** The India-style deep dive for a year. Absent for countries without one (World), so no UI appears for them. */
  loadDeepDive?: (year: EraId) => Promise<DeepDive>;
}

const worldByYear = Object.fromEntries(worldEras.map((e) => [e.year, e])) as Record<EraId, CountryEra>;

// India's files are not eagerly imported: Vite splits one small chunk per era, fetched on selection.
const indiaLoaders = import.meta.glob<CountryEra>("./in/eras/*.json", { import: "default" });
// One chunk per year, fetched only when India's deep dive is opened.
const indiaDeepDive = import.meta.glob<DeepDive>("./in/deepdive/[0-9]*.json", { import: "default" });

// One lazy chunk per country-year. World's are lazy too, so its initial bundle does not grow.
const everydayLoaders = import.meta.glob<Everyday>("./*/everyday/*.json", { import: "default" });
const loadEveryday = (c: string) => (year: EraId) => everydayLoaders[`./${c}/everyday/${year}.json`]();

export const countries: CountryEntry[] = [
  { ...(worldMeta as CountryMeta), loadEra: async (year) => worldByYear[year], loadEveryday: loadEveryday("world") },
  { ...(indiaMeta as CountryMeta), loadEra: (year) => indiaLoaders[`./in/eras/${year}.json`](), loadEveryday: loadEveryday("in"), loadOverlay: () => import("./in/theme/overlay").then((m) => m.overlay),
    loadDeepDive: (year) => indiaDeepDive[`./in/deepdive/${year}.json`]() },
];

export const DEFAULT_COUNTRY: CountryId = "world";

export const countryById = (id: string): CountryEntry | undefined => countries.find((c) => c.id === id);

/** Countries offered in the UI. */
export const selectableCountries = () => countries.filter((c) => c.enabled);
