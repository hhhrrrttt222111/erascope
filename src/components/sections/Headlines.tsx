import { Box, Typography } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { EraCard } from "../common/EraCard";
import { SourceNote } from "../common/SourceNote";

/** "1945-05-08" → "Tuesday, May 8, 1945", without time-zone drift. */
function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const utc = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  utc.setUTCFullYear(y);
  return utc.toLocaleDateString("en-US", d ? { timeZone: "UTC", weekday: "long", year: "numeric", month: "long", day: "numeric" } : { timeZone: "UTC", year: "numeric", month: "long" });
}

export function Headlines() {
  const era = useShellEra();
  return (
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))" }}>
      {era.headlines.map((h) => (
        <Box component="li" key={`${h.date}-${h.headline}`}>
          <EraCard>
            <Typography variant="overline" component="p" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
              <time dateTime={h.date}>{formatDate(h.date)}</time>
            </Typography>
            <Typography variant="h3" component="h3" sx={{ my: 0.75 }}>
              {h.verbatim ? `“${h.headline}”` : h.headline}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {h.publication}
            </Typography>
            <Typography variant="caption" component="p" sx={{ mt: 0.75, fontStyle: "italic", color: "text.secondary" }}>
              {era.speculative
                ? "An imagined headline, not a forecast."
                : h.verbatim
                  ? "Exact front-page wording."
                  : "Paraphrased: the real story, not the exact front-page wording."}
            </Typography>
            <SourceNote source={h.source} todo={h.todo} />
          </EraCard>
        </Box>
      ))}
    </Box>
  );
}
