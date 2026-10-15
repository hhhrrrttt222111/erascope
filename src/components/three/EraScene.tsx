import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import ViewInAr from "@mui/icons-material/ViewInAr";
import { Component, lazy, Suspense, useEffect, useRef, useState, type ComponentType, type LazyExoticComponent, type ReactNode } from "react";
import type { SceneId } from "../../data/types";
import { useShellEra } from "../../context/EraContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SpeculativeBadge } from "../common/SpeculativeBadge";
import type { SceneProps } from "./sceneTypes";

/**
 * Each scene (and three.js itself) is a separate chunk, fetched only when that era's
 * scene is needed. import.meta.glob also keeps TypeScript from following these imports:
 * the scenes are type-checked in their own project (tsconfig.three.json) because
 * R3F's global JSX types make MUI's polymorphic components too complex to check.
 */
const sceneModules = import.meta.glob<{ default: ComponentType<SceneProps> }>("./scenes/*.tsx");
const sceneCache = new Map<SceneId, LazyExoticComponent<ComponentType<SceneProps>>>();

function getScene(id: SceneId) {
  let scene = sceneCache.get(id);
  if (!scene) {
    const load = sceneModules[`./scenes/${id}.tsx`];
    if (!load) throw new Error(`No 3D scene file for "${id}" in components/three/scenes/`);
    scene = lazy(load);
    sceneCache.set(id, scene);
  }
  return scene;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Placeholder({ label }: { label: string }) {
  return (
    <Box sx={{ height: "100%", display: "grid", placeItems: "center", color: "inherit", opacity: 0.75, textAlign: "center", p: 2 }}>
      <Box>
        <ViewInAr sx={{ fontSize: 40, opacity: 0.6 }} aria-hidden />
        <Typography variant="caption" component="p">
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

interface Props {
  height?: number;
  /** Extra class for era effects layered over the canvas (halftone, scanlines). */
  className?: string;
  showCaption?: boolean;
}

export function EraScene({ height, className, showCaption = true }: Props) {
  const era = useShellEra();
  const theme = useTheme();
  const reduced = useReducedMotion();
  const compact = useMediaQuery(theme.breakpoints.down("sm"));
  const coarse = useMediaQuery("(pointer: coarse)");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [webgl] = useState(hasWebGL);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Scene = getScene(era.scene.component);
  const h = height ?? (compact ? 220 : 320);

  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Box ref={ref} className={className} role="img" aria-label={`3D model: ${era.scene.caption}`} sx={{ height: h, position: "relative" }}>
        {!webgl ? (
          <Placeholder label="3D preview unavailable on this device" />
        ) : (
          mounted && (
            <SceneErrorBoundary fallback={<Placeholder label="3D preview could not load" />}>
              <Suspense fallback={<Placeholder label="Loading 3D scene…" />}>
                <Scene animate={!reduced} frameloop={visible && !reduced ? "always" : "demand"} interactive={!compact && !coarse} />
              </Suspense>
            </SceneErrorBoundary>
          )
        )}
      </Box>
      {showCaption && (
        <Typography component="figcaption" variant="caption" sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mt: 1, color: "text.secondary" }}>
          {era.speculative && <SpeculativeBadge />}
          {era.scene.caption}
        </Typography>
      )}
    </Box>
  );
}
