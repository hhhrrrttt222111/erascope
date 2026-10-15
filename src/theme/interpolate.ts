import { eras, type Era } from "../data";
import { CHROME_RADIUS } from "./eraThemes";

type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toHex = (v: number) => Math.round(v).toString(16).padStart(2, "0");

export function mixColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return `#${toHex(ar + (br - ar) * t)}${toHex(ag + (bg - ag) * t)}${toHex(ab + (bb - ab) * t)}`;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where a 0..1 slider position falls between two neighbouring eras. */
export function locate(position: number) {
  const scaled = Math.min(Math.max(position, 0), 1) * (eras.length - 1);
  const fromIndex = Math.min(Math.floor(scaled), eras.length - 2);
  const t = scaled - fromIndex;
  return { from: eras[fromIndex], to: eras[fromIndex + 1], t, nearest: eras[Math.round(scaled)] };
}

/** The year number shown while scrubbing (1920 → 1960 counts up through the 1930s etc). */
export const scrubYear = (position: number) => {
  const { from, to, t } = locate(position);
  return Math.round(lerp(from.year, to.year, t));
};

/** How strongly each era's look applies at this position: 1 at its tick, falling to 0 at the neighbouring ticks. */
export function eraWeight(era: Era, position: number) {
  const idx = eras.indexOf(era);
  const distance = Math.abs(position * (eras.length - 1) - idx);
  return Math.max(0, 1 - distance);
}

const MORPH_KEYS = ["background", "paper", "text", "primary", "secondary"] as const;

/** Blended palette colours for an in-between slider position. */
export function morphPalette(position: number): Record<(typeof MORPH_KEYS)[number], string> {
  const { from, to, t } = locate(position);
  return Object.fromEntries(
    MORPH_KEYS.map((key) => [key, mixColor(from.theme.palette[key], to.theme.palette[key], t)]),
  ) as Record<(typeof MORPH_KEYS)[number], string>;
}

/** Writes the blended palette as CSS variables (--tm-morph-*) on the root element. */
export function applyMorphVars(position: number, el: HTMLElement = document.documentElement) {
  const palette = morphPalette(position);
  for (const key of MORPH_KEYS) el.style.setProperty(`--tm-morph-${key}`, palette[key]);
  const { from, to, t } = locate(position);
  el.style.setProperty("--tm-morph-radius", `${lerp(radiusOf(from), radiusOf(to), t).toFixed(1)}px`);
}

const radiusOf = (era: Era) => CHROME_RADIUS[era.theme.chrome];
