import { Box, Button, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useEraContext, useShellEra } from "../../context/EraContext";
import { getDeepDive } from "../../data";
import { isSectionId } from "../../data/deepdive";
import type { ChromeId, DeepDive } from "../../data/types";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SpeculativeBadge } from "../common/SpeculativeBadge";
import { Hub } from "./Hub";
import { SectionPage } from "./SectionPage";
import { useDeepDiveStyle } from "./useDeepDiveStyle";

/** Short transitions derived from each era's own: a page turn, a typeout, a window opening… */
const FADE: Variants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: { duration: 0.12 } } };
const TRANSITIONS: Partial<Record<ChromeId, Variants>> = {
  newspaper: { initial: { opacity: 0, rotateY: -35, transformOrigin: "0% 50%" }, animate: { opacity: 1, rotateY: 0, transition: { duration: 0.35 } }, exit: { opacity: 0, transition: { duration: 0.12 } } },
  terminal: { initial: { clipPath: "inset(0 0 100% 0)" }, animate: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.4, ease: "linear" } }, exit: { opacity: 0, transition: { duration: 0.1 } } },
  win98: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: { duration: 0.1 } } },
  artdeco: { initial: { clipPath: "inset(0 50% 0 50%)" }, animate: { clipPath: "inset(0 0% 0 0%)", transition: { duration: 0.4 } }, exit: { opacity: 0, transition: { duration: 0.12 } } },
  futureos: { initial: { opacity: 0, filter: "blur(8px)" }, animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.35 } }, exit: { opacity: 0, transition: { duration: 0.12 } } },
};

/**
 * India Deep Dive for the current year: a hub with a 3D ring (or bento grid) and a page per section.
 * Rendered above the era chrome and styled by the era theme and the Indian overlay.
 */
export default function DeepDiveView() {
  const { year, country, deepDive, openDeepDive, closeDeepDive } = useEraContext();
  const era = useShellEra();
  const reduced = useReducedMotion();
  const { theme, dd: style, accent, accent2, chrome } = useDeepDiveStyle();
  const [dd, setDd] = useState<DeepDive | null>(null);
  const [failed, setFailed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const section = deepDive?.section ?? null;

  useEffect(() => {
    let cancelled = false;
    setDd(null);
    setFailed(false);
    getDeepDive(country, year)
      .then((d) => !cancelled && (d ? setDd(d) : setFailed(true)))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [country, year]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (section) openDeepDive(null);
      else closeDeepDive();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [section, openDeepDive, closeDeepDive]);

  const sec = section && dd ? dd.sections[section] : undefined;
  const variants = reduced ? FADE : TRANSITIONS[chrome] ?? FADE;

  return (
    <Box
      component="div"
      role="region"
      id="dd-root"
      aria-labelledby="dd-heading"
      className={era.country !== "world" ? `in-layer ${style.heroPattern}` : undefined}
      sx={{
        position: "fixed",
        inset: 0,
        bottom: "var(--tm-slider-h)",
        zIndex: 1100,
        overflowY: "auto",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        px: { xs: 2, md: 4 },
        py: 3,
        ...({ "--in-accent": accent, "--in-accent2": accent2 } as object),
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto", position: "relative", zIndex: 2, perspective: "1200px" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", mb: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => (section ? openDeepDive(null) : closeDeepDive())}>
            {section ? "All sections" : `Back to ${year}`}
          </Button>
          {era.speculative && <SpeculativeBadge />}
        </Box>

        {failed && <Typography>The deep dive could not be loaded. Check your connection and try again.</Typography>}
        {!dd && !failed && <Typography aria-busy>Loading the deep dive…</Typography>}

        <AnimatePresence mode="wait" initial={false}>
          {dd && !section && (
            <motion.div key="hub" variants={variants} initial="initial" animate="animate" exit="exit">
              <Hub dd={dd} headingRef={headingRef} />
            </motion.div>
          )}
          {dd && section && isSectionId(section) && sec && (
            <motion.div key={section} variants={variants} initial="initial" animate="animate" exit="exit">
              <SectionPage dd={dd} id={section} section={sec} headingRef={headingRef} />
            </motion.div>
          )}
        </AnimatePresence>
        {dd && section && !sec && <Typography>This section is not available for {year}.</Typography>}
      </Box>
    </Box>
  );
}
