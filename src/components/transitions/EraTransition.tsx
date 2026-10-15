import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { eraByYear, type EraId } from "../../data";
import type { TransitionId } from "../../data/types";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const steps = (n: number) => (t: number) => Math.min(1, Math.ceil(t * n) / n);

// Each variant must end on identity values (or clear them with transitionEnd): a lingering
// transform, filter or clip-path would break position: fixed/sticky inside the shell.
const VARIANTS: Record<TransitionId, Variants> = {
  // 1900: a circular vignette opens like an early film iris.
  iris: {
    initial: { clipPath: "circle(0% at 50% 35%)" },
    animate: { clipPath: "circle(150% at 50% 35%)", transition: { duration: 0.9, ease: "easeInOut" }, transitionEnd: { clipPath: "none" } },
    exit: { clipPath: "circle(0% at 50% 35%)", transition: { duration: 0.45, ease: "easeIn" } },
  },
  // 1920: the old page turns away, the new one swings in from the spine.
  pageflip: {
    initial: { opacity: 0, rotateY: -70, x: -30, transformOrigin: "0% 50%" },
    animate: { opacity: 1, rotateY: 0, x: 0, transformOrigin: "0% 50%", transition: { duration: 0.65, ease: EASE_OUT } },
    exit: { opacity: 0, rotateY: 70, x: 30, transformOrigin: "100% 50%", transition: { duration: 0.35, ease: "easeIn" } },
  },
  // 1930: content waits behind theatre curtains (see CurtainOverlay), which part.
  curtain: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  },
  // 1945: slams down like a rubber stamp.
  stamp: {
    initial: { opacity: 0, scale: 1.35, rotate: -3 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 520, damping: 22, mass: 0.9 } },
    exit: { opacity: 0, scale: 0.97, transition: { duration: 0.25 } },
  },
  // 1960: the picture tube warms up with a brief flash.
  tvclick: {
    initial: { opacity: 0, scaleY: 0.85, scaleX: 1.04, filter: "brightness(2.4)" },
    animate: { opacity: 1, scaleY: 1, scaleX: 1, filter: "brightness(1)", transition: { duration: 0.5, ease: EASE_OUT }, transitionEnd: { filter: "none" } },
    exit: { opacity: 0, scaleY: 0.92, transition: { duration: 0.3 } },
  },
  // 1970: a gooey blob swells to fill the screen.
  lavablob: {
    initial: { clipPath: "ellipse(9% 7% at 50% 60%)", filter: "blur(16px) saturate(1.6)" },
    animate: {
      clipPath: "ellipse(140% 140% at 50% 50%)",
      filter: "blur(0px) saturate(1)",
      transition: { duration: 0.95, ease: [0.65, 0, 0.35, 1] },
      transitionEnd: { clipPath: "none", filter: "none" },
    },
    exit: { clipPath: "ellipse(9% 7% at 50% 60%)", filter: "blur(12px)", transition: { duration: 0.45, ease: "easeIn" } },
  },
  // 1984: the screen prints line by line, like text typing onto a terminal.
  typeout: {
    initial: { clipPath: "inset(0 0 100% 0)" },
    animate: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.8, ease: steps(16) }, transitionEnd: { clipPath: "none" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: steps(2) } },
  },
  // 1995: a progressive image load: blurry, then sharper in bands (see InterlaceOverlay).
  interlace: {
    initial: { filter: "blur(10px)" },
    animate: { filter: "blur(0px)", transition: { duration: 0.8, ease: steps(4) }, transitionEnd: { filter: "none" } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  // 1999: CRT power-on: a bright line expands to fill the screen. Power-off collapses it.
  crtpoweron: {
    initial: { opacity: 1, scaleY: 0.005, scaleX: 0.6, filter: "brightness(4)" },
    animate: {
      opacity: 1,
      scaleY: [0.005, 0.005, 1],
      scaleX: [0.6, 1, 1],
      filter: ["brightness(4)", "brightness(3)", "brightness(1)"],
      transition: { duration: 0.7, times: [0, 0.35, 1], ease: "easeOut" },
      transitionEnd: { filter: "none" },
    },
    exit: {
      scaleY: [1, 0.005, 0.005],
      scaleX: [1, 1, 0],
      filter: ["brightness(1)", "brightness(4)", "brightness(6)"],
      transition: { duration: 0.45, times: [0, 0.6, 1], ease: "easeIn" },
    },
  },
  // 2005: fades up while a glossy shine sweeps across (see GlossOverlay).
  glossswipe: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  },
  // 2010: a flat slide up.
  flatslide: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  },
  // 2020: "Reconnecting…": a frozen, blurred frame that snaps into focus (see ReconnectOverlay).
  reconnect: {
    initial: { opacity: 0.6, filter: "blur(14px) grayscale(0.6)" },
    animate: {
      opacity: 1,
      filter: "blur(0px) grayscale(0)",
      transition: { duration: 0.35, delay: 0.75, ease: "easeOut" },
      transitionEnd: { filter: "none" },
    },
    exit: { opacity: 0, filter: "blur(8px)", transition: { duration: 0.25 } },
  },
  // 2050: jittering, colour-shifted, blurred, then resolving.
  glitch: {
    initial: { opacity: 0, x: 0, filter: "blur(16px) hue-rotate(90deg)" },
    animate: {
      opacity: [0, 1, 0.55, 1],
      x: [-24, 18, -8, 0],
      filter: ["blur(16px) hue-rotate(90deg)", "blur(4px) hue-rotate(-40deg)", "blur(2px) hue-rotate(20deg)", "blur(0px) hue-rotate(0deg)"],
      transition: { duration: 0.7, ease: "easeOut" },
      transitionEnd: { filter: "none" },
    },
    exit: { opacity: 0, x: 24, filter: "blur(12px)", transition: { duration: 0.35 } },
  },
};

const FADE: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const fixedLayer = { position: "fixed", inset: 0, bottom: "var(--tm-slider-h)", pointerEvents: "none", zIndex: 1050 } as const;

function CurtainOverlay() {
  const panel = (side: "left" | "right") => (
    <motion.div
      key={side}
      initial={{ x: 0 }}
      animate={{ x: side === "left" ? "-101%" : "101%" }}
      transition={{ duration: 0.9, delay: 0.45, ease: [0.7, 0, 0.3, 1] }}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: 0,
        width: "50.5%",
        background: "repeating-linear-gradient(90deg, #5c0a14 0 18px, #7d1220 18px 30px, #4a0810 30px 42px)",
        boxShadow: side === "left" ? "inset -12px 0 24px rgba(0,0,0,0.5)" : "inset 12px 0 24px rgba(0,0,0,0.5)",
        borderBottom: "6px solid #d4af37",
      }}
    />
  );
  return <div aria-hidden style={{ ...fixedLayer, overflow: "hidden" }}>{panel("left")}{panel("right")}</div>;
}

function InterlaceOverlay() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: steps(4) }}
      style={{ ...fixedLayer, background: "repeating-linear-gradient(to bottom, transparent 0 6px, #bfbfbf 6px 12px)" }}
    />
  );
}

function GlossOverlay() {
  return (
    <div aria-hidden style={{ ...fixedLayer, overflow: "hidden" }}>
      <motion.div
        initial={{ x: "-60vw" }}
        animate={{ x: "160vw" }}
        transition={{ duration: 0.9, delay: 0.4, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-20%",
          bottom: "-20%",
          width: "35vw",
          transform: "skewX(-20deg)",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
        }}
      />
    </div>
  );
}

function ReconnectOverlay() {
  return (
    <motion.div aria-hidden initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.0, duration: 0.25 }} style={{ ...fixedLayer, display: "grid", placeItems: "center" }}>
      <div style={{ padding: "10px 18px", borderRadius: 999, background: "rgba(24,24,27,0.9)", color: "#ececf1", font: "600 15px 'DM Sans', system-ui, sans-serif", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f5b942" }} />
        Reconnecting…
      </div>
    </motion.div>
  );
}

const OVERLAYS: Partial<Record<TransitionId, () => ReactNode>> = {
  curtain: CurtainOverlay,
  interlace: InterlaceOverlay,
  glossswipe: GlossOverlay,
  reconnect: ReconnectOverlay,
};

/** Swaps era shells using the transition named in the arriving era's JSON (a plain fade under reduced motion). */
export function EraTransition({ year, children }: { year: EraId; children: ReactNode }) {
  const reduced = useReducedMotion();
  const [animating, setAnimating] = useState(false);
  const firstYear = useRef(year);
  const changed = useRef(false);
  if (year !== firstYear.current) changed.current = true;
  const transition = eraByYear[year].theme.transition;
  const variants = reduced ? FADE : VARIANTS[transition];
  // Overlays play only on an era change, never on first load. They sit outside the animated
  // wrapper so its filters and transforms don't blur or reposition them.
  const Overlay = reduced || !changed.current ? undefined : OVERLAYS[transition];

  return (
    // Perspective only while page-flipping, so it doesn't become a containing block for fixed children afterwards.
    <div style={{ perspective: animating && transition === "pageflip" && !reduced ? 1800 : undefined, overflowX: "clip" }}>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0 })}>
        <motion.div
          key={year}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationStart={() => setAnimating(true)}
          onAnimationComplete={() => setAnimating(false)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {Overlay && <Overlay key={year} />}
    </div>
  );
}
