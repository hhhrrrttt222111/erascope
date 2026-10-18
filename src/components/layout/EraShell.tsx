import { Box, ThemeProvider, Typography } from "@mui/material";
import { motion } from "framer-motion";
import WbSunny from "@mui/icons-material/WbSunny";
import Place from "@mui/icons-material/Place";
import Sell from "@mui/icons-material/Sell";
import Devices from "@mui/icons-material/Devices";
import Visibility from "@mui/icons-material/Visibility";
import Feed from "@mui/icons-material/Feed";
import Restaurant from "@mui/icons-material/Restaurant";
import Checkroom from "@mui/icons-material/Checkroom";
import Work from "@mui/icons-material/Work";
import School from "@mui/icons-material/School";
import MedicalServices from "@mui/icons-material/MedicalServices";
import DirectionsTransit from "@mui/icons-material/DirectionsTransit";
import Mail from "@mui/icons-material/Mail";
import Celebration from "@mui/icons-material/Celebration";
import BarChart from "@mui/icons-material/BarChart";
import Star from "@mui/icons-material/Star";
import { lazy, Suspense, useEffect, useMemo, type ComponentType, type CSSProperties, type LazyExoticComponent, type ReactNode } from "react";
import { eraByYear, eras, hasDeepDive, type EraId } from "../../data";
import { useEraContext, useShellEra } from "../../context/EraContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { ChromeId, Era } from "../../data/types";

type NoteKey = keyof NonNullable<Era["notes"]>;
import { ShellEraProvider } from "../../context/EraContext";
import { eraThemes } from "../../theme/eraThemes";
import { createCountryTheme } from "../../theme/applyCountryOverlay";
import { CountryBand } from "../common/CountryBand";
import "../../styles/country-css/in/patterns.css";
import { MorningRoutine } from "../sections/MorningRoutine";
import { Headlines } from "../sections/Headlines";
import { PlacesGallery } from "../sections/PlacesGallery";
import { PriceBoard } from "../sections/PriceBoard";
import { TechShelf } from "../sections/TechShelf";
import { FutureVisions } from "../sections/FutureVisions";
import { EverydaySection, SpotlightTeaser } from "../sections/EverydaySection";
import { Defer } from "../common/Defer";
import { EVERYDAY_SECTIONS, PAGE_GROUPS, sectionSlug } from "../../data/pageLayout";
import type { EverydaySectionId } from "../../data/types";
import { scrollToSection, type ChromeProps, type ShellSection } from "./shared";

type ChromeModule = { default: ComponentType<ChromeProps> };

/** Each chrome (and its era CSS) is its own chunk, so adding eras doesn't grow the initial bundle. */
const CHROME_LOADERS: Record<ChromeId, () => Promise<ChromeModule>> = {
  artnouveau: () => import("./ArtNouveauChrome").then((m) => ({ default: m.ArtNouveauChrome })),
  newspaper: () => import("./NewspaperChrome").then((m) => ({ default: m.NewspaperChrome })),
  artdeco: () => import("./ArtDecoChrome").then((m) => ({ default: m.ArtDecoChrome })),
  homefront: () => import("./HomefrontChrome").then((m) => ({ default: m.HomefrontChrome })),
  midcentury: () => import("./MidCenturyChrome").then((m) => ({ default: m.MidCenturyChrome })),
  groovy: () => import("./GroovyChrome").then((m) => ({ default: m.GroovyChrome })),
  terminal: () => import("./TerminalChrome").then((m) => ({ default: m.TerminalChrome })),
  earlyweb: () => import("./EarlyWebChrome").then((m) => ({ default: m.EarlyWebChrome })),
  win98: () => import("./Win98Chrome").then((m) => ({ default: m.Win98Chrome })),
  web2gloss: () => import("./Web2GlossChrome").then((m) => ({ default: m.Web2GlossChrome })),
  flatweb: () => import("./FlatWebChrome").then((m) => ({ default: m.FlatWebChrome })),
  videocall: () => import("./VideoCallChrome").then((m) => ({ default: m.VideoCallChrome })),
  bento: () => import("./BentoChrome").then((m) => ({ default: m.BentoChrome })),
  futureos: () => import("./FutureOSChrome").then((m) => ({ default: m.FutureOSChrome })),
};

// The deep dive (data, UI and any 3D) is its own chunk, fetched only when India's deep dive is opened.
const DeepDiveView = lazy(() => import("../deepdive/DeepDiveView"));

const CHROMES = Object.fromEntries(
  Object.entries(CHROME_LOADERS).map(([id, load]) => [id, lazy(load)]),
) as Record<ChromeId, LazyExoticComponent<ComponentType<ChromeProps>>>;

/** Fetches every chrome chunk in the background once the page is idle, so era switches don't wait. */
export function prefetchChromes() {
  const run = () => eras.forEach((e) => void CHROME_LOADERS[e.theme.chrome]());
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2000);
}

/** The six shared sections. Chromes decide where they go; the sections themselves are written once. */
function Noted({ k, children }: { k: NoteKey; children: ReactNode }) {
  const era = useShellEra();
  const note = era.notes?.[k];
  return (
    <>
      {note && (
        <Typography role="note" variant="body2" sx={{ mb: 1.5, fontStyle: "italic", color: "text.secondary" }}>
          {note}
        </Typography>
      )}
      {children}
    </>
  );
}

const CORE: Record<string, Omit<ShellSection, "id" | "node"> & { node: ReactNode }> = {
  morning: { title: "Morning Routine", Icon: WbSunny, node: <Noted k="morningRoutine"><MorningRoutine /></Noted> },
  headlines: { title: "Headlines", Icon: Feed, node: <Noted k="headlines"><Headlines /></Noted> },
  places: { title: "Places", Icon: Place, node: <Noted k="places"><PlacesGallery /></Noted> },
  prices: { title: "Prices", Icon: Sell, node: <Noted k="prices"><PriceBoard /></Noted> },
  tech: { title: "Technology", Icon: Devices, node: <Noted k="technology"><TechShelf /></Noted> },
  futures: { title: "Imagined Futures", Icon: Visibility, node: <Noted k="futureVisions"><FutureVisions /></Noted> },
};

const EVERYDAY_ICONS: Record<EverydaySectionId, ShellSection["Icon"]> = {
  byTheNumbers: BarChart, foodAndKitchen: Restaurant, clothingAndStyle: Checkroom, workAndWages: Work, schoolAndChildhood: School,
  gettingAround: DirectionsTransit, keepingInTouch: Mail, healthAndMedicine: MedicalServices, leisureAndFun: Celebration, spotlight: Star,
};

/** Page order comes from data/pageLayout.ts. The first group of each group gets its heading; later groups load as they near the viewport. */
function buildSections(anchor: string | null): ShellSection[] {
  return PAGE_GROUPS.flatMap((group, gi) =>
    group.sections.map((id, si) => {
      const base = CORE[id] ?? { title: EVERYDAY_SECTIONS[id as EverydaySectionId].title, Icon: EVERYDAY_ICONS[id as EverydaySectionId], node: <EverydaySection id={id as EverydaySectionId} /> };
      const node = (
        <Defer eager={gi === 0 || anchor === sectionSlug(id)}>
          {si === 0 && <Typography component="p" variant="overline" sx={{ display: "block", mb: 1, letterSpacing: "0.12em", fontWeight: 700 }}>{group.title}</Typography>}
          {base.node}
        </Defer>
      );
      return { id, title: base.title, Icon: base.Icon, node };
    }),
  );
}

/**
 * Renders one era: its theme, its chrome and the shared sections. The year is a
 * prop (not read from context) so a shell that is animating out keeps its own look.
 */
export function EraShell({ year }: { year: EraId }) {
  const { eraFor, displayCountry, overlayFor, deepDive, anchor } = useEraContext();
  const sections = useMemo(() => buildSections(anchor), [anchor]);
  // Deep link #/in/1945/food-and-kitchen: wait a moment for the chrome and the section to mount, then scroll.
  useEffect(() => {
    if (!anchor) return;
    const t = window.setTimeout(() => scrollToSection(PAGE_GROUPS.flatMap((g) => g.sections).find((id) => sectionSlug(id) === anchor) ?? ""), 600);
    return () => window.clearTimeout(t);
  }, [anchor, year]);
  const reduced = useReducedMotion();
  // Looks come from the shared base (identical for every country); only the content differs.
  const era = eraFor(year);
  const Chrome = CHROMES[eraByYear[year].theme.chrome];
  const overlay = overlayFor(year);
  const theme = useMemo(() => createCountryTheme(eraThemes[year], overlay), [year, overlay]);
  const layerStyle = overlay ? ({ "--in-accent": overlay.accent.color, "--in-accent2": overlay.accent.secondaryColor ?? overlay.accent.color } as CSSProperties) : undefined;
  return (
    <ShellEraProvider value={era}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<Box sx={{ minHeight: "100vh", background: theme.palette.background.default }} />}>
          {/* Switching country is a short cross-fade inside the era, not the era's own transition. */}
          <motion.div
            key={displayCountry}
            className={overlay ? `in-layer ${overlay.pattern ?? ""}` : undefined}
            style={layerStyle}
            initial={reduced ? false : { opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <CountryBand />
            {/* The era page stays mounted underneath; make it unreachable by keyboard and screen readers while covered. */}
            <div {...(deepDive && hasDeepDive(displayCountry) ? ({ inert: "" } as Record<string, string>) : {})}>
              <SpotlightTeaser onJump={() => scrollToSection("spotlight")} />
              <Chrome sections={sections} />
            </div>
            {deepDive && hasDeepDive(displayCountry) && (
              <Suspense fallback={null}>
                <DeepDiveView />
              </Suspense>
            )}
          </motion.div>
        </Suspense>
      </ThemeProvider>
    </ShellEraProvider>
  );
}
