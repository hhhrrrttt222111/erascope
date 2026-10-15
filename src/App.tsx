import { CssBaseline, ThemeProvider } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect, type MouseEvent } from "react";
import { useEraContext } from "./context/EraContext";
import { selectableCountries } from "./data/countries/registry";
import { useEraSound } from "./hooks/useEraSound";
import { eraThemes } from "./theme/eraThemes";
import { loadEraFonts } from "./theme/fontLoader";
import { Landing } from "./components/Landing";

// Everything past the landing page is fetched on demand, then the rest is prefetched when idle.
const loadShell = () => import("./components/layout/EraShell");
const EraShell = lazy(() => loadShell().then((m) => ({ default: m.EraShell })));
const EraTransition = lazy(() => import("./components/transitions/EraTransition").then((m) => ({ default: m.EraTransition })));
const MorphOverlay = lazy(() => import("./components/transitions/MorphOverlay").then((m) => ({ default: m.MorphOverlay })));
const TimelineSlider = lazy(() => import("./components/timeline/TimelineSlider").then((m) => ({ default: m.TimelineSlider })));

/** The skip link can't be a plain #main anchor because the hash holds the era. */
function skipToMain(e: MouseEvent) {
  e.preventDefault();
  // When the deep dive covers the era page, "main content" means its heading.
  const main = document.getElementById("dd-heading") ?? document.getElementById("main");
  main?.focus();
  main?.scrollIntoView();
}

export default function App() {
  const { year, showLanding, muted, eraFor, displayCountry } = useEraContext();
  const era = eraFor(year);
  const countryName = selectableCountries().find((c) => c.id === displayCountry)?.name ?? "";
  useEraSound(year, muted);

  useEffect(() => {
    if (!showLanding) loadEraFonts(era);
  }, [era, showLanding]);

  useEffect(() => {
    const run = () => void loadShell().then((m) => m.prefetchChromes());
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <ThemeProvider theme={eraThemes[year]}>
      <CssBaseline />
      <a className="tm-skip-link" href="#main" onClick={skipToMain}>
        Skip to content
      </a>
      <div aria-live="polite" className="tm-visually-hidden">
        {showLanding ? "Choose your year" : `Showing ${countryName}, ${era.year}: ${era.title}${era.speculative ? ". Speculative content." : ""}`}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {showLanding ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Landing />
          </motion.div>
        ) : (
          <motion.div key="shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Suspense fallback={null}>
              <EraTransition year={year}>
                <EraShell year={year} />
              </EraTransition>
              <MorphOverlay />
              <TimelineSlider />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}
