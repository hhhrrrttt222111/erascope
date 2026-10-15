import type { SxProps, Theme } from "@mui/material";
import type { OverlayEra } from "../../data/types";

type Frame = NonNullable<OverlayEra["deepDive"]>["portalFrame"];

/** How each era frames a section portal, in 3D (shape, border, glow) and in the HTML cards (css). */
export interface FrameSpec {
  shape: "rect" | "arch" | "round";
  border: number; // fraction of portal width
  glow: boolean;
  css: SxProps<Theme>;
}

export const FRAMES: Record<Frame, FrameSpec> = {
  cartouche: { shape: "round", border: 0.07, glow: false, css: { border: "3px double currentColor", borderRadius: "24px" } },
  column: { shape: "rect", border: 0.05, glow: false, css: { border: "1px solid currentColor", borderTop: "4px double currentColor", borderRadius: 0 } },
  arch: { shape: "arch", border: 0.06, glow: false, css: { border: "2px solid currentColor", borderRadius: "40px 40px 0 0" } },
  slip: { shape: "rect", border: 0.05, glow: false, css: { border: "2px dashed currentColor", borderRadius: "2px" } },
  poster: { shape: "rect", border: 0.1, glow: false, css: { border: "6px solid currentColor", borderRadius: 0 } },
  signboard: { shape: "rect", border: 0.09, glow: false, css: { border: "5px ridge currentColor", borderRadius: "10px" } },
  crt: { shape: "round", border: 0.06, glow: true, css: { border: "2px solid currentColor", borderRadius: "18px", boxShadow: "0 0 14px currentColor" } },
  gif: { shape: "rect", border: 0.06, glow: false, css: { border: "3px outset currentColor", borderRadius: 0 } },
  bevel: { shape: "rect", border: 0.06, glow: false, css: { border: "2px outset #fff", borderRadius: 0, boxShadow: "inset -1px -1px #555, inset 1px 1px #fff" } },
  gloss: { shape: "round", border: 0.05, glow: false, css: { border: "1px solid currentColor", borderRadius: "16px", boxShadow: "inset 0 10px 14px rgba(255,255,255,0.45)" } },
  card: { shape: "rect", border: 0.03, glow: false, css: { border: "none", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" } },
  tile: { shape: "round", border: 0.04, glow: false, css: { border: "2px solid currentColor", borderRadius: "14px" } },
  holo: { shape: "arch", border: 0.03, glow: true, css: { border: "1px solid currentColor", borderRadius: "18px", boxShadow: "0 0 18px currentColor" } },
};
