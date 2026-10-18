import { Box } from "@mui/material";
import type { Forecast } from "../../data/types";
import { formatAsOf } from "./AsOfBadge";

/** Marks a present-year item that is not a past event: a dated plan ("Scheduled") or a named institution's forecast. Visible text, never colour alone. */
export function TimeTag({ item }: { item: { scheduled?: boolean; forecast?: Forecast } }) {
  const text = item.scheduled ? "Scheduled: a plan, not yet happened" : item.forecast ? `Forecast by ${item.forecast.publisher}, published ${formatAsOf(item.forecast.published)}` : null;
  if (!text) return null;
  return (
    <Box component="span" role="note" sx={{ display: "inline-block", mt: 0.5, mr: 0.75, px: 1, py: 0.25, border: "1px dashed currentColor", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.02em" }}>
      {text}
    </Box>
  );
}
