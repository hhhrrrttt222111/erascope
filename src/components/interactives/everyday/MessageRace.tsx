import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import type { EverydayItem } from "../../../data/types";
import { ofKind, Panel } from "./shared";

/** Race the same message through each medium available that year. Bar time is log-scaled so seconds and weeks share a screen. */
export default function MessageRace({ items }: { items: EverydayItem[] }) {
  const reduced = useReducedMotion();
  const msgs = ofKind(items, "message");
  const [run, setRun] = useState(0);
  if (msgs.length === 0) return null;
  const fastest = Math.min(...msgs.map((m) => m.seconds ?? Infinity));
  const slowest = Math.max(...msgs.map((m) => m.seconds ?? 0));
  const span = Math.max(Math.log10(slowest) - Math.log10(fastest), 1e-6);
  const secs = (s?: number) => (s === undefined ? 0 : 0.8 + (5 * (Math.log10(s) - Math.log10(fastest))) / span);
  return (
    <Panel title="Message race" hint="The same message, sent each way. Bars use a log scale, so read the times beside them.">
      {!reduced && <Button size="small" variant="outlined" onClick={() => setRun((r) => r + 1)}>{run === 0 ? "Start the race" : "Race again"}</Button>}
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", mt: 1.5 }}>
        <thead>
          <tr>{["Medium", "Delivery time", "Cost", ""].map((h) => <th key={h} scope="col" style={{ textAlign: "left", padding: 6, borderBottom: "1px solid currentColor" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {msgs.map((m) => (
            <tr key={m.id}>
              <th scope="row" style={{ textAlign: "left", padding: 6 }}>{m.medium}</th>
              <td style={{ padding: 6 }}>{m.deliveryTime}</td>
              <td style={{ padding: 6 }}>{m.cost ?? "not recorded"}</td>
              <td style={{ padding: 6, width: "30%" }} aria-hidden>
                {!reduced && run > 0 && m.seconds !== undefined && (
                  <Box key={run} sx={{ height: 10, bgcolor: "currentColor", width: 0, animation: `msgrace ${secs(m.seconds)}s linear forwards`, "@keyframes msgrace": { to: { width: "100%" } } }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Box>
    </Panel>
  );
}
