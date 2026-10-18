import { Box } from "@mui/material";
import EventAvailable from "@mui/icons-material/EventAvailable";

/** "18 October 2026" from an ISO date. */
export const formatAsOf = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Marks the present year: content is real, checked on this date, and the year is not over. Only 2026 shows it. */
export function AsOfBadge({ date }: { date: string }) {
  return (
    <Box
      component="span"
      title="The present year: checked facts up to this date. Later events are not described as having happened."
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.4, borderRadius: "999px", border: "1px solid currentColor", fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", lineHeight: 1.4 }}
    >
      <EventAvailable sx={{ fontSize: 14 }} aria-hidden />
      As of {formatAsOf(date)}
    </Box>
  );
}
