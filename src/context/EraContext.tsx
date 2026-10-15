import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { ERA_YEARS, eraByYear, eraIndex, getEra, hasDeepDive, nearestEra, type CountryId, type Era, type EraId } from "../data";
import type { DeepDiveSectionId, OverlayEra } from "../data/types";
import { isSectionId } from "../data/deepdive";
import { DEFAULT_COUNTRY, countryById, selectableCountries } from "../data/countries/registry";

interface EraContextValue {
  /** The committed era: the one whose theme and content are shown. */
  year: EraId;
  setYear: (year: EraId) => void;
  /** Continuous slider position, 0 (first era) to 1 (last era). Updated every drag frame without re-rendering. */
  position: MotionValue<number>;
  isDragging: boolean;
  setDragging: (dragging: boolean) => void;
  showLanding: boolean;
  openLanding: () => void;
  muted: boolean;
  toggleMuted: () => void;
  /** The country the visitor asked for. */
  country: CountryId;
  setCountry: (country: CountryId) => void;
  /** The country whose content is on screen. Lags `country` while its data loads. */
  displayCountry: CountryId;
  countryLoading: boolean;
  /** The era's content for the displayed country (looks come from the shared base). */
  eraFor: (year: EraId) => Era;
  /** The displayed country's theme layer for a year (undefined for World). */
  overlayFor: (year: EraId) => OverlayEra | undefined;
  /** The India Deep Dive view: null when closed, otherwise the open section (null = hub). */
  deepDive: { section: DeepDiveSectionId | null } | null;
  openDeepDive: (section?: DeepDiveSectionId | null) => void;
  closeDeepDive: () => void;
}

const EraContext = createContext<EraContextValue | null>(null);

const MUTE_KEY = "erascope:muted";

interface ParsedHash {
  country: CountryId;
  year: EraId | null;
  /** True when the URL named a country; otherwise a stored choice may preselect one on the landing screen. */
  explicitCountry: boolean;
  /** "#/in/1984/deep-dive/sports" → { section: "sports" }; "/deep-dive" → { section: null } (the hub). */
  deepDive: { section: DeepDiveSectionId | null } | null;
}

/**
 * "#/1945" → World 1945 (the original links keep working); "#/in/1945" → India 1945.
 * Any other year snaps to the nearest era ("#/1987" → 1984). "#/" and "#/in" show the landing screen.
 * An unknown country falls back to World.
 */
function parseHash(hash: string): ParsedHash {
  const match = hash.match(/^#\/(?:([a-z]{2,8})(?:\/|$))?(\d{3,4})?(?:\/deep-dive(?:\/([a-z-]+))?)?$/);
  if (!match) return { country: DEFAULT_COUNTRY, year: null, explicitCountry: false, deepDive: null };
  const named = match[1];
  const entry = named ? countryById(named) : undefined;
  const country = entry?.enabled ? entry.id : DEFAULT_COUNTRY;
  const year = match[2] ? nearestEra(Number(match[2])) : null;
  // Only countries that have a deep dive can open one; for World the link falls back to the era page.
  const wantsDeep = hash.includes("/deep-dive") && year !== null && hasDeepDive(country);
  const deepDive = wantsDeep ? { section: isSectionId(match[3]) ? match[3] : null } : null;
  return { country, year, explicitCountry: Boolean(entry?.enabled), deepDive };
}

const hashFor = (country: CountryId, year: EraId | null, deep?: { section: DeepDiveSectionId | null } | null) =>
  `#/${country === DEFAULT_COUNTRY ? "" : `${country}/`}${year ?? ""}${year !== null && deep ? `/deep-dive${deep.section ? `/${deep.section}` : ""}` : ""}`;

/** Rewrites a non-canonical URL (e.g. #/1987) to what is actually shown, without a history entry. */
function canonicalizeHash(country: CountryId, year: EraId, deep?: { section: DeepDiveSectionId | null } | null) {
  const want = hashFor(country, year, deep);
  if (window.location.hash !== want) window.history.replaceState(null, "", want);
}

const COUNTRY_KEY = "erascope:country";

function readStoredCountry(): CountryId {
  try {
    const stored = window.localStorage.getItem(COUNTRY_KEY);
    const entry = stored ? countryById(stored) : undefined;
    if (entry?.enabled) return entry.id;
  } catch {
    // Storage unavailable; fall back to the default.
  }
  return DEFAULT_COUNTRY;
}

function storeCountry(country: CountryId) {
  try {
    window.localStorage.setItem(COUNTRY_KEY, country);
  } catch {
    // Private mode: the choice lasts for this visit only.
  }
}

export const positionOf = (year: EraId) => eraIndex(year) / (ERA_YEARS.length - 1);

function readMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) !== "false";
  } catch {
    return true;
  }
}

export function EraProvider({ children }: { children: ReactNode }) {
  // Read once; canonicalizing on every render would keep restoring the first URL.
  const [initial] = useState(() => {
    const parsed = parseHash(window.location.hash);
    if (parsed.year !== null) canonicalizeHash(parsed.country, parsed.year, parsed.deepDive);
    return parsed;
  });
  // A year in the URL decides the country; the stored choice only preselects one on the landing screen.
  const [country, setCountryState] = useState<CountryId>(initial.year !== null || initial.explicitCountry ? initial.country : readStoredCountry());
  const [displayCountry, setDisplayCountry] = useState<CountryId>(DEFAULT_COUNTRY);
  const [loaded, setLoaded] = useState<Partial<Record<CountryId, Record<EraId, Era>>>>({ [DEFAULT_COUNTRY]: eraByYear });
  const [overlays, setOverlays] = useState<Partial<Record<CountryId, Partial<Record<EraId, OverlayEra>>>>>({});
  const [year, setYearState] = useState<EraId>(initial.year ?? ERA_YEARS[0]);
  const [showLanding, setShowLanding] = useState(initial.year === null);
  const [deepDive, setDeepDive] = useState<{ section: DeepDiveSectionId | null } | null>(initial.deepDive);
  const [isDragging, setDragging] = useState(false);
  const [muted, setMuted] = useState(readMuted);
  const position = useMotionValue(positionOf(year));

  // Load a country's 13 eras once; keep showing the previous country's content until they arrive.
  useEffect(() => {
    if (loaded[country]) {
      setDisplayCountry(country);
      return;
    }
    let cancelled = false;
    Promise.all([Promise.all(ERA_YEARS.map((y) => getEra(country, y))), countryById(country)?.loadOverlay?.() ?? Promise.resolve({})])
      .then(([list, overlay]) => {
        if (cancelled) return;
        setOverlays((prev) => ({ ...prev, [country]: overlay }));
        setLoaded((prev) => ({ ...prev, [country]: Object.fromEntries(list.map((e) => [e.year, e])) as Record<EraId, Era> }));
        setDisplayCountry(country);
      })
      .catch(() => {
        // Data failed to load (offline): fall back to the original dataset instead of a blank page.
        if (!cancelled) setCountryState(DEFAULT_COUNTRY);
      });
    return () => {
      cancelled = true;
    };
  }, [country, loaded]);

  // The URL hash is the source of truth, so back/forward and shared links work.
  useEffect(() => {
    const onHashChange = () => {
      const next = parseHash(window.location.hash);
      if (next.year === null) {
        setShowLanding(true);
        if (next.explicitCountry) setCountryState(next.country);
      } else {
        setShowLanding(false);
        setCountryState(next.country);
        setYearState(next.year);
        setDeepDive(next.deepDive);
        canonicalizeHash(next.country, next.year, next.deepDive);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setYear = useCallback(
    (next: EraId) => {
      setYearState(next);
      setShowLanding(false);
      setDeepDive(null); // changing year always returns to that year's era page
      const want = hashFor(country, next);
      if (window.location.hash !== want) window.location.hash = want.slice(1);
    },
    [country],
  );

  const setCountry = useCallback(
    (next: CountryId) => {
      if (!selectableCountries().some((c) => c.id === next)) return;
      setCountryState(next);
      storeCountry(next);
      const stillDeep = deepDive !== null && hasDeepDive(next);
      if (!stillDeep) setDeepDive(null);
      const want = hashFor(next, showLanding ? null : year, stillDeep ? deepDive : null);
      if (window.location.hash !== want) window.history.replaceState(null, "", want);
    },
    [showLanding, year, deepDive],
  );

  const openDeepDive = useCallback(
    (section: DeepDiveSectionId | null = null) => {
      if (!hasDeepDive(country)) return;
      const next = { section };
      setDeepDive(next);
      window.location.hash = hashFor(country, year, next).slice(1);
    },
    [country, year],
  );

  const closeDeepDive = useCallback(() => {
    setDeepDive(null);
    window.location.hash = hashFor(country, year).slice(1);
  }, [country, year]);

  const openLanding = useCallback(() => {
    setShowLanding(true);
    setDeepDive(null);
    window.location.hash = hashFor(country, null).slice(1) || "/";
  }, [country]);

  const eraFor = useCallback((y: EraId): Era => loaded[displayCountry]?.[y] ?? eraByYear[y], [loaded, displayCountry]);
  const overlayFor = useCallback((y: EraId) => overlays[displayCountry]?.[y], [overlays, displayCountry]);

  const toggleMuted = useCallback(() => {
    setMuted((m) => {
      try {
        window.localStorage.setItem(MUTE_KEY, String(!m));
      } catch {
        // Storage unavailable (private mode); the toggle still works for this visit.
      }
      return !m;
    });
  }, []);

  const value = useMemo(
    () => ({
      year, setYear, position, isDragging, setDragging, showLanding, openLanding, muted, toggleMuted,
      country, setCountry, displayCountry, countryLoading: country !== displayCountry, eraFor, overlayFor, deepDive, openDeepDive, closeDeepDive,
    }),
    [year, setYear, position, isDragging, showLanding, openLanding, muted, toggleMuted, country, setCountry, displayCountry, eraFor, overlayFor, deepDive, openDeepDive, closeDeepDive],
  );

  return <EraContext.Provider value={value}>{children}</EraContext.Provider>;
}

export function useEraContext() {
  const ctx = useContext(EraContext);
  if (!ctx) throw new Error("useEraContext must be used inside <EraProvider>");
  return ctx;
}

/**
 * The era a shell is rendering. An exiting shell keeps its own era during the
 * transition, so sections read from here rather than from the global year.
 */
const ShellEraContext = createContext<Era>(eraByYear[ERA_YEARS[0]]);

export const ShellEraProvider = ShellEraContext.Provider;

export const useShellEra = () => useContext(ShellEraContext);
