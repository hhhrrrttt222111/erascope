import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AppsIcon from "@mui/icons-material/Apps";
import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ERA_YEARS, eraByYear, eraIndex, eras } from "../../data";
import { useEraContext } from "../../context/EraContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { scrubYear } from "../../theme/interpolate";
import { BEVEL_OUT } from "../../theme/eraThemes";
import { CountrySelector } from "../common/CountrySelector";
import { DeepDiveButton } from "../common/DeepDiveButton";
import { SoundToggle } from "../common/SoundToggle";
import { EraTick } from "./EraTick";

const LAST = ERA_YEARS.length - 1;
/** Narrowest gap between ticks before the track scrolls sideways (keeps 44px touch targets). */
const MIN_TICK_GAP = 48;
const HANDLE_W = 68;
const HANDLE_H = 34;
const RAIL_Y = 22;
const SPRING = { type: "spring", stiffness: 420, damping: 36 } as const;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export function TimelineSlider() {
  const { year, setYear, position, setDragging, openLanding } = useEraContext();
  const theme = useTheme();
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const narrow = useMediaQuery(theme.breakpoints.down("md"));
  const widthRef = useRef(0);
  const draggingRef = useRef(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const idx = eraIndex(year);
  const chrome = theme.era.chrome;

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      widthRef.current = entry.contentRect.width;
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // On first measure and on resize, jump the handle to the committed era. Deliberately keyed on
  // width only: era changes animate in the effect below instead of jumping.
  useLayoutEffect(() => {
    if (width && !draggingRef.current) x.set((idx / LAST) * width);
  }, [width]);

  // When the era changes from elsewhere (ticks, keyboard, landing, URL), glide the handle there.
  useEffect(() => {
    if (!widthRef.current || draggingRef.current) return;
    const target = (idx / LAST) * widthRef.current;
    if (reduced) {
      x.set(target);
      return;
    }
    const controls = animate(x, target, SPRING);
    return () => controls.stop();
  }, [idx, reduced, x]);

  // On narrow screens the track scrolls; keep the committed era centred.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !widthRef.current || scroller.scrollWidth <= scroller.clientWidth) return;
    const left = (idx / LAST) * widthRef.current + HANDLE_W / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [idx, width, reduced]);

  // The handle's pixel offset drives the shared 0..1 position and the scrubbing year label
  // every frame, written straight to the DOM with no React re-render.
  useMotionValueEvent(x, "change", (v) => {
    if (!widthRef.current) return;
    const p = clamp01(v / widthRef.current);
    position.set(p);
    if (labelRef.current) labelRef.current.textContent = String(scrubYear(p));
  });

  const go = (i: number) => {
    const next = ERA_YEARS[Math.min(Math.max(i, 0), LAST)];
    if (next !== year) setYear(next);
  };

  const onDragEnd = () => {
    draggingRef.current = false;
    setDragging(false);
    const nearest = Math.round(clamp01(x.get() / widthRef.current) * LAST);
    const target = (nearest / LAST) * widthRef.current;
    if (reduced) x.set(target);
    else animate(x, target, SPRING);
    go(nearest);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: idx + 1,
      ArrowUp: idx + 1,
      PageUp: idx + 1,
      ArrowLeft: idx - 1,
      ArrowDown: idx - 1,
      PageDown: idx - 1,
      Home: 0,
      End: LAST,
    };
    if (e.key in keys) {
      e.preventDefault();
      go(keys[e.key]);
    }
  };

  const onRailClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    go(Math.round(clamp01((e.clientX - rect.left) / rect.width) * LAST));
  };

  const era = eraByYear[year];
  const barSx =
    chrome === "win98"
      ? { background: "#c0c0c0", color: "#000", boxShadow: BEVEL_OUT }
      : chrome === "futureos"
        ? { background: alpha("#05060f", 0.82), backdropFilter: "blur(16px)", color: theme.palette.text.primary, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.35)}` }
        : {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderTop: `${chrome === "newspaper" ? 3 : 1}px ${chrome === "newspaper" ? "double" : "solid"} ${chrome === "artdeco" || chrome === "terminal" ? theme.palette.primary.main : theme.palette.divider}`,
          };

  const square = ["win98", "newspaper", "terminal", "earlyweb", "artdeco", "homefront"].includes(chrome);
  const handleRadius = square ? 0 : chrome === "flatweb" ? 4 : 999;
  const handleBg =
    chrome === "futureos"
      ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
      : chrome === "win98"
        ? "#c0c0c0"
        : theme.palette.primary.main;
  const handleColor = chrome === "win98" ? "#000" : chrome === "futureos" ? "#05060f" : theme.palette.primary.contrastText;
  const handleShadow =
    chrome === "win98"
      ? BEVEL_OUT
      : chrome === "futureos" || chrome === "terminal"
        ? `0 0 18px ${alpha(theme.palette.primary.main, 0.6)}`
        : "0 2px 8px rgba(0,0,0,0.25)";

  return (
    <Box
      component="nav"
      aria-label="Timeline"
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "var(--tm-slider-h)",
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 2 },
        px: { xs: 0.5, sm: 2 },
        boxShadow: "0 -6px 24px rgba(0,0,0,0.12)",
        fontFamily: theme.typography.h1.fontFamily,
        ...barSx,
      }}
    >
      <Tooltip title="Choose a year">
        <IconButton onClick={openLanding} aria-label="Back to the year picker" color="inherit">
          <AppsIcon />
        </IconButton>
      </Tooltip>

      <Box
        ref={scrollerRef}
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          // Fade the edges so it's clear the track continues when it scrolls.
          maskImage: narrow ? "linear-gradient(90deg, transparent, #000 24px, #000 calc(100% - 24px), transparent)" : undefined,
        }}
      >
        <Box sx={{ position: "relative", height: "100%", minWidth: LAST * MIN_TICK_GAP + HANDLE_W, px: `${HANDLE_W / 2}px`, boxSizing: "border-box" }}>
          <Box ref={trackRef} sx={{ position: "relative", height: "100%" }}>
            {/* rail (click to jump) */}
            <Box aria-hidden onClick={onRailClick} sx={{ position: "absolute", left: -12, right: -12, top: RAIL_Y - 12, height: 24, cursor: "pointer" }}>
              <Box sx={{ position: "absolute", left: 12, right: 12, top: 10, height: 4, borderRadius: "2px", background: alpha(theme.palette.text.primary, 0.18) }} />
            </Box>

            {/* handle */}
            <motion.div
              role="slider"
              tabIndex={0}
              aria-label="Travel through time"
              aria-valuemin={ERA_YEARS[0]}
              aria-valuemax={ERA_YEARS[LAST]}
              aria-valuenow={year}
              aria-valuetext={`${year}: ${era.title}${era.speculative ? " (speculative)" : ""}`}
              onKeyDown={onKeyDown}
              drag="x"
              dragConstraints={{ left: 0, right: width }}
              dragElastic={0.06}
              dragMomentum={false}
              onDragStart={() => {
                draggingRef.current = true;
                setDragging(true);
              }}
              onDragEnd={onDragEnd}
              whileTap={{ scale: reduced ? 1 : 1.06 }}
              style={{
                x,
                position: "absolute",
                left: -HANDLE_W / 2,
                top: RAIL_Y - HANDLE_H / 2 + 2,
                width: HANDLE_W,
                height: HANDLE_H,
                zIndex: 2,
                display: "grid",
                placeItems: "center",
                cursor: "grab",
                touchAction: "none",
                userSelect: "none",
                borderRadius: handleRadius,
                background: handleBg,
                color: handleColor,
                boxShadow: handleShadow,
                fontWeight: 800,
                fontSize: 16,
                fontVariantNumeric: "tabular-nums",
                outlineOffset: 3,
              }}
            >
              <span ref={labelRef}>{year}</span>
            </motion.div>

            {eras.map((e, i) => (
              <EraTick
                key={e.year}
                era={e}
                index={i}
                count={eras.length}
                current={e.year === year}
                short={narrow && Math.abs(i - idx) > 1}
                onSelect={() => go(i)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <CountrySelector />
      <DeepDiveButton />
      <SoundToggle />
    </Box>
  );
}
