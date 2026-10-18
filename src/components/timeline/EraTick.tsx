import { Box, useTheme } from "@mui/material";
import type { Era } from "../../data";

interface Props {
  era: Era;
  index: number;
  count: number;
  current: boolean;
  /** Show "'84" instead of "1984" (used on narrow screens away from the active era). */
  short?: boolean;
  onSelect: () => void;
}

/** A labelled tick on the timeline. Evenly spaced, not to scale. */
export function EraTick({ era, index, count, current, short = false, onSelect }: Props) {
  const theme = useTheme();
  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      aria-label={`Travel to ${era.year}: ${era.title}${era.speculative ? " (speculative)" : era.contentAsOf ? " (the present)" : ""}`}
      aria-current={current ? "true" : undefined}
      sx={{
        position: "absolute",
        left: `${(index / (count - 1)) * 100}%`,
        top: 0,
        bottom: 0,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "6px",
        minWidth: 44,
        px: 0.5,
        pb: 0.5,
        border: 0,
        background: "none",
        color: "inherit",
        cursor: "pointer",
        font: "inherit",
        fontSize: { xs: 12, sm: 13 },
        fontWeight: current ? 800 : 500,
        opacity: current ? 1 : 0.75,
        borderRadius: 1,
        "&:hover": { opacity: 1 },
        "&:focus-visible": { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
      }}
    >
      {era.contentAsOf && (
        <Box aria-hidden component="span" sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1, px: 0.75, py: 0.4, borderRadius: 999, background: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
          Now
        </Box>
      )}
      <Box aria-hidden sx={{ width: 2, height: current ? 14 : 10, background: "currentColor", borderRadius: 1 }} />
      <span aria-hidden={short || undefined}>{short ? `’${String(era.year).slice(2)}` : era.year}</span>
    </Box>
  );
}
