import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import type { EverydayItem } from "../../../data/types";
import { useShellEra } from "../../../context/EraContext";
import { comparisonYear } from "../../../data/present";
import { ofKind, Panel } from "./shared";

/** Pick a journey; compare mode, time and cost with the comparison year (shown where the item has a sourced equivalent). */
export default function JourneyPlanner({ items }: { items: EverydayItem[] }) {
  const era = useShellEra();
  const trips = ofKind(items, "journey");
  const [i, setI] = useState(0);
  if (trips.length === 0) return null;
  const t = trips[Math.min(i, trips.length - 1)];
  const cols = [{ head: String(era.year), v: { mode: t.mode, duration: t.duration, cost: t.cost } }, { head: String(comparisonYear(era.year)), v: t.now }];
  return (
    <Panel title="Journey planner" hint="Choose a journey, then compare it with the same trip today.">
      <Box role="tablist" aria-label="Journeys" sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
        {trips.map((x, n) => (
          <Button key={x.id} role="tab" aria-selected={n === i} size="small" variant={n === i ? "contained" : "outlined"} onClick={() => setI(n)}>{x.from} → {x.to}</Button>
        ))}
      </Box>
      <Box aria-live="polite" sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        {cols.map((c) => (
          <Box key={c.head} sx={{ p: 1.5, border: "1px solid currentColor", borderRadius: 1 }}>
            <Typography variant="overline">{c.head}</Typography>
            {c.v ? (
              <>
                <Typography sx={{ fontWeight: 700 }}>{c.v.mode}</Typography>
                <Typography>Time: {c.v.duration}</Typography>
                <Typography>Cost: {c.v.cost ?? "not recorded"}</Typography>
              </>
            ) : (
              <Typography variant="body2">No sourced equivalent yet.</Typography>
            )}
          </Box>
        ))}
      </Box>
    </Panel>
  );
}
