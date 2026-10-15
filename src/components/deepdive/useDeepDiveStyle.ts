import { useTheme } from "@mui/material";
import { FRAMES, type FrameSpec } from "./frames";
import type { OverlayEra } from "../../data/types";

type DD = NonNullable<OverlayEra["deepDive"]>;

/** The deep dive's art direction for the current era, read from the theme and the Indian overlay. */
export function useDeepDiveStyle() {
  const theme = useTheme();
  const overlay = theme.era.country;
  const dd: DD = overlay?.deepDive ?? { portalFrame: "card", heroPattern: overlay?.pattern ?? "", motifStyle: "flat" };
  const accent = overlay?.accent.color ?? theme.palette.primary.main;
  const accent2 = overlay?.accent.secondaryColor ?? accent;
  const frame: FrameSpec = FRAMES[dd.portalFrame];
  const accentFamily = overlay?.accentFont ? `"${overlay.accentFont.family}", ${theme.typography.h3.fontFamily ?? "serif"}` : undefined;
  return { theme, dd, accent, accent2, frame, accentFamily, chrome: theme.era.chrome };
}
