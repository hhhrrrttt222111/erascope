import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useDeepDiveStyle } from "../../deepdive/useDeepDiveStyle";
import { Empty, InteractiveShell } from "./Shell";
import { asArray, dataOf, itemsOfKind, type InteractiveProps } from "./types";

interface Buy { label: string; cost: number; unit: string }
const num = (s: string) => {
  const n = parseFloat(s.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

/** Hand-built SVG bars of the year's indicators against 2026, and "what a day's wage buys". */
export default function RupeeDashboard(props: InteractiveProps) {
  const { accent, accent2, theme } = useDeepDiveStyle();
  const data = dataOf(props);
  const indicators = itemsOfKind(props, "indicator");
  const now = (data.now ?? {}) as Record<string, number>;
  const wage = data.wage as { amount: number; unit: string; label?: string } | undefined;
  const buys = asArray<Buy>(data.buys);
  const [mult, setMult] = useState(1);
  const rows = indicators.map((i) => ({ i, v: num(i.value), n: now[i.metric] })).filter((r) => r.v !== null);

  return (
    <InteractiveShell title="Rupee dashboard" hint="The year's indicators next to 2026, and what a wage bought.">
      {rows.length === 0 ? (
        <Empty>Figures for this year are still being researched.</Empty>
      ) : (
        <Box component="ul" sx={{ m: 0, p: 0 }}>
          {rows.map(({ i, v, n }) => {
            const max = Math.max(v!, n ?? 0, 1e-9);
            return (
              <li key={i.id} style={{ listStyle: "none", marginBottom: 14 }}>
                <Typography sx={{ fontWeight: 700 }}>{i.metric}</Typography>
                <svg role="img" aria-label={`${i.metric}: ${i.value} ${i.unit} in ${i.asOf}${n !== undefined ? `, ${n} ${i.unit} in 2026` : ""}`} viewBox="0 0 400 54" width="100%" style={{ maxWidth: 520 }}>
                  <rect x="70" y="4" width={Math.max((v! / max) * 320, 2)} height="20" fill={accent} />
                  <text x="0" y="19" fontSize="12" fill={theme.palette.text.primary}>{i.asOf}</text>
                  {n !== undefined && (
                    <>
                      <rect x="70" y="30" width={Math.max((n / max) * 320, 2)} height="20" fill={accent2} />
                      <text x="0" y="45" fontSize="12" fill={theme.palette.text.primary}>2026</text>
                    </>
                  )}
                </svg>
                <Typography variant="caption" component="p">
                  {i.value} {i.unit}
                  {n !== undefined ? ` (2026: ${n} ${i.unit})` : " (2026 comparison to be researched)"}
                </Typography>
              </li>
            );
          })}
        </Box>
      )}

      <Typography component="h3" variant="h6" sx={{ mt: 2 }}>
        What a day's wage buys
      </Typography>
      {!wage || buys.length === 0 ? (
        <Empty>Wage and price data for this year are still being researched.</Empty>
      ) : (
        <>
          <label>
            <Typography component="span">
              {wage.label ?? "Days of wage"}: {mult} day{mult === 1 ? "" : "s"} ({Math.round(wage.amount * mult * 100) / 100} {wage.unit})
            </Typography>{" "}
            <input type="range" min={1} max={30} value={mult} onChange={(e) => setMult(Number(e.target.value))} aria-label="Number of days" style={{ accentColor: accent, width: "min(320px, 100%)" }} />
          </label>
          <Box component="ul" sx={{ m: 0, mt: 1, pl: 3 }} aria-live="polite">
            {buys.map((b) => (
              <li key={b.label}>
                {b.label}: {Math.round(((wage.amount * mult) / b.cost) * 100) / 100} ({b.cost} {b.unit} each)
              </li>
            ))}
          </Box>
        </>
      )}
    </InteractiveShell>
  );
}
