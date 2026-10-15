import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { motion } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { useEraContext } from "../../context/EraContext";
import { DEEP_DIVE_SECTIONS } from "../../data/deepdive";
import type { DeepDive, DeepDiveItem, DeepDiveSectionId } from "../../data/types";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { HubRingProps } from "../three/ringTypes";
import { Motif } from "./motifs";
import { useDeepDiveStyle } from "./useDeepDiveStyle";

// The 3D ring (and three.js) is its own chunk, fetched only when the 3D hub is actually shown.
// import.meta.glob also keeps the app's TypeScript project from following it (see tsconfig.three.json).
const ringModules = import.meta.glob<{ default: ComponentType<HubRingProps> }>("../three/deepdive/HubRing.tsx");
const HubRing = lazy(Object.values(ringModules)[0]);
const CrossYear = lazy(() => import("./CrossYear"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

interface Props {
  dd: DeepDive;
  headingRef: React.RefObject<HTMLHeadingElement>;
}

export function Hub({ dd, headingRef }: Props) {
  const { openDeepDive } = useEraContext();
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width:900px)");
  const { theme, dd: style, accent, accent2, frame, accentFamily } = useDeepDiveStyle();
  const webgl = useMemo(hasWebGL, []);
  const use3d = webgl && wide && !reduced;
  const [index, setIndex] = useState(0);
  const [flying, setFlying] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const wheelAt = useRef(0);
  const dragX = useRef<number | null>(null);
  const carousel = useRef<HTMLUListElement>(null);
  const count = DEEP_DIVE_SECTIONS.length;
  const live = useRef<HTMLDivElement>(null);

  // Focus the page heading once the hub is on screen (after navigating from a section or the era page).
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [headingRef]);

  const turn = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  // Slow idle turn; stops on hover, focus, reduced motion or while flying.
  useEffect(() => {
    if (!use3d || paused || flying) return;
    const t = window.setInterval(() => turn(1), 5000);
    return () => window.clearInterval(t);
  }, [use3d, paused, flying, turn]);

  useEffect(() => {
    if (live.current) live.current.textContent = `${DEEP_DIVE_SECTIONS[index].label}, section ${index + 1} of ${count}`;
  }, [index, count]);

  const open = useCallback(
    (id: DeepDiveSectionId) => {
      if (use3d) {
        setFlying(id);
        // If the flight never reports arrival (slow device), open anyway.
        window.setTimeout(() => openDeepDive(id), 1800);
      } else openDeepDive(id);
    },
    [use3d, openDeepDive],
  );

  const itemIndex = useMemo(() => {
    const map = new Map<string, { item: DeepDiveItem; section: DeepDiveSectionId }>();
    for (const [sid, sec] of Object.entries(dd.sections)) for (const it of sec!.items) map.set(it.id, { item: it, section: sid as DeepDiveSectionId });
    return map;
  }, [dd]);
  const highlights = dd.highlights.map((id) => itemIndex.get(id)).filter(Boolean) as { item: DeepDiveItem; section: DeepDiveSectionId }[];

  const portals = DEEP_DIVE_SECTIONS.map((s, i) => ({
    id: s.id,
    label: (
      <div style={{ color: accent, textAlign: "center", width: 120, font: `700 14px ${accentFamily ?? "inherit"}` }}>
        <Motif id={s.id} style={style.motifStyle} size={44} accent={accent} accent2={accent2} />
        <div style={{ color: theme.palette.text.primary, marginTop: 4 }}>{i + 1}</div>
      </div>
    ),
  }));

  return (
    <Box
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") turn(1);
        else if (e.key === "ArrowLeft") turn(-1);
      }}
    >
      <Typography variant="overline" component="p">
        India Deep Dive · {dd.year}
      </Typography>
      <Typography component="h1" id="dd-heading" tabIndex={-1} ref={headingRef} variant="h3" sx={{ outline: "none", mb: 1, fontFamily: accentFamily }}>
        {dd.intro.headline}
      </Typography>
      <Typography sx={{ maxWidth: 720, mb: 3 }}>{dd.intro.summary}</Typography>

      {use3d && (
        <Box
          sx={{ position: "relative", mb: 2 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <Box
            aria-hidden="true"
            onPointerDown={(e) => (dragX.current = e.clientX)}
            onPointerUp={(e) => {
              if (dragX.current !== null && Math.abs(e.clientX - dragX.current) > 40) turn(e.clientX < dragX.current ? 1 : -1);
              dragX.current = null;
            }}
            onWheel={(e) => {
              const now = Date.now();
              if (now - wheelAt.current > 450 && Math.abs(e.deltaX) + Math.abs(e.deltaY) > 20) {
                wheelAt.current = now;
                turn(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1);
              }
            }}
            sx={{ height: { md: 360, lg: 420 }, touchAction: "pan-y", cursor: "grab", opacity: flying ? 0.95 : 1 }}
          >
            <Suspense fallback={null}>
              <HubRing
                portals={portals}
                index={index}
                frame={{ shape: frame.shape, border: frame.border, glow: frame.glow }}
                colors={{ frame: accent, inner: theme.palette.background.paper, accent: accent2 }}
                reduced={reduced}
                flying={flying}
                onSelect={(id, i) => (i === index ? open(id as DeepDiveSectionId) : setIndex(i))}
                onArrive={(id) => openDeepDive(id as DeepDiveSectionId)}
              />
            </Suspense>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
            <Button onClick={() => turn(-1)} startIcon={<ChevronLeft />} aria-label="Previous section">
              Previous
            </Button>
            <Button variant="contained" onClick={() => open(DEEP_DIVE_SECTIONS[index].id)}>
              Open {DEEP_DIVE_SECTIONS[index].label}
            </Button>
            <Button onClick={() => turn(1)} endIcon={<ChevronRight />} aria-label="Next section">
              Next
            </Button>
          </Box>
        </Box>
      )}
      <div ref={live} aria-live="polite" className="tm-visually-hidden" />

      {highlights.length > 0 && (
        <Box component="section" aria-label="Highlights" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography component="h2" variant="h5">
              Highlights
            </Typography>
            <Box>
              <Button size="small" aria-label="Scroll highlights left" onClick={() => carousel.current?.scrollBy({ left: -320, behavior: reduced ? "auto" : "smooth" })}>
                <ChevronLeft />
              </Button>
              <Button size="small" aria-label="Scroll highlights right" onClick={() => carousel.current?.scrollBy({ left: 320, behavior: reduced ? "auto" : "smooth" })}>
                <ChevronRight />
              </Button>
            </Box>
          </Box>
          <Box
            component="ul"
            ref={carousel}
            tabIndex={0}
            aria-label="Highlight cards, scrollable"
            sx={{ m: 0, p: 0, display: "flex", gap: 2, overflowX: "auto", scrollSnapType: "x mandatory", pb: 1 }}
          >
            {highlights.map(({ item, section }) => (
              <motion.li key={item.id} layout={!reduced} style={{ listStyle: "none", flex: "0 0 min(280px, 80%)", scrollSnapAlign: "start" }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => openDeepDive(section)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    textAlign: "left",
                    font: "inherit",
                    color: "inherit",
                    cursor: "pointer",
                    p: 2,
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderTop: `4px solid ${accent}`,
                    "&:focus-visible": { outline: `3px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
                  }}
                >
                  <Motif id={section} style={style.motifStyle} size={32} accent={accent} accent2={accent2} css={{ color: accent }} />
                  <Typography component="span" variant="subtitle1" sx={{ display: "block", fontWeight: 700, mt: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography component="span" variant="body2" sx={{ display: "block" }}>
                    {item.summary}
                  </Typography>
                </Box>
              </motion.li>
            ))}
          </Box>
        </Box>
      )}

      <Typography component="h2" variant="h5" sx={{ mb: 1.5 }}>
        Sections
      </Typography>
      <Box component="ul" sx={{ m: 0, p: 0, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
        {DEEP_DIVE_SECTIONS.map((spec, i) => {
          const s = dd.sections[spec.id];
          const unverified = s?.items.filter((it) => it.todo).length ?? 0;
          const current = use3d && i === index;
          return (
            <motion.li
              key={spec.id}
              style={{ listStyle: "none" }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <Box
                component="button"
                type="button"
                aria-current={current ? "true" : undefined}
                onClick={() => open(spec.id)}
                onFocus={() => use3d && setIndex(i)}
                onMouseEnter={() => use3d && setIndex(i)}
                sx={{
                  width: "100%",
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                  textAlign: "left",
                  font: "inherit",
                  color: theme.palette.text.primary,
                  cursor: "pointer",
                  p: 2,
                  minHeight: 96,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderLeft: `6px solid ${current ? accent2 : accent}`,
                  ...(frame.css as object),
                  borderColor: current ? accent2 : theme.palette.divider,
                  "&:focus-visible": { outline: `3px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
                }}
              >
                <Motif id={spec.id} style={style.motifStyle} size={44} accent={accent} accent2={accent2} css={{ color: accent, flex: "none" }} />
                <span>
                  <Typography component="span" variant="h6" sx={{ display: "block", fontWeight: 700, fontFamily: accentFamily }}>
                    {s?.title ?? spec.label}
                  </Typography>
                  <Typography component="span" variant="body2" sx={{ display: "block", mt: 0.5 }}>
                    {s ? `${s.items.length} items${unverified ? ` · ${unverified} unverified` : ""}` : "No items yet"}
                  </Typography>
                </span>
              </Box>
            </motion.li>
          );
        })}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Suspense fallback={<Typography aria-busy>Loading the cross-year features…</Typography>}>
          <CrossYear />
        </Suspense>
      </Box>
    </Box>
  );
}
