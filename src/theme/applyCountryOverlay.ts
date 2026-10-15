import { createTheme, type Theme } from "@mui/material/styles";
import type { OverlayEra } from "../data/types";

/**
 * Layers a country's overlay on top of an era theme. Only these things may change:
 * the accent colours (exposed as theme.era.country, used for ornaments and borders), and the
 * h3 card-title font. Chrome, transition, layout, text colour and body font are never touched.
 */
export function createCountryTheme(base: Theme, overlay: OverlayEra | undefined): Theme {
  if (!overlay) return base;
  const family = overlay.accentFont ? `"${overlay.accentFont.family}", ${base.typography.h3.fontFamily ?? "serif"}` : undefined;
  const next = createTheme(base, family ? { typography: { h3: { fontFamily: family } } } : {});
  next.era = { ...base.era, country: overlay };
  return next;
}
