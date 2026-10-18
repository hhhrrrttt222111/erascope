import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useState } from "react";
import { useShellEra } from "../../../context/EraContext";
import type { EverydayItem } from "../../../data/types";
import { ofKind, Panel } from "./shared";

const PARSE = /^(\D*?)(\d+(?:\.\d+)?)\s*$/;

/** Pick a day's meals; each meal's priced ingredients (linked through relatedIds) are listed with their sourced prices. */
export default function PlateBuilder({ items }: { items: EverydayItem[] }) {
  const era = useShellEra();
  const meals = ofKind(items, "meal");
  const [picked, setPicked] = useState<string[]>([]);
  // Prices come from the era's price board and from this section's own price items; unsourced ones are skipped.
  const prices = new Map<string, { label: string; price: string }>();
  for (const p of era.prices) if (p.source) prices.set(p.id, { label: p.item, price: p.price });
  for (const p of ofKind(items, "price")) if (p.sources.length > 0 && !p.todo) prices.set(p.id, { label: p.title, price: p.price });

  const lines = meals.filter((m) => picked.includes(m.id)).flatMap((m) => (m.relatedIds ?? []).map((id) => prices.get(id)).filter((p): p is { label: string; price: string } => Boolean(p)));
  const parsed = lines.map((l) => PARSE.exec(l.price));
  const same = parsed.length > 0 && parsed.every((m) => m && m[1] === parsed[0]![1]);
  const total = same ? parsed.reduce((n, m) => n + Number(m![2]), 0) : null;

  if (meals.length === 0) return null;
  return (
    <Panel title="Plate builder" hint="Choose the meals of a day to see the priced ingredients behind them.">
      <Box role="group" aria-label="Meals" sx={{ display: "grid" }}>
        {meals.map((m) => (
          <FormControlLabel key={m.id} control={<Checkbox checked={picked.includes(m.id)} onChange={() => setPicked((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]))} />} label={`${m.mealTime}: ${m.dishes.join(", ")}`} />
        ))}
      </Box>
      <Box aria-live="polite" sx={{ mt: 1 }}>
        {picked.length > 0 && lines.length === 0 && <Typography variant="body2">No sourced prices are linked to these meals yet.</Typography>}
        {lines.length > 0 && (
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {lines.map((l, i) => <li key={i}>{l.label}: {l.price}</li>)}
          </Box>
        )}
        {total !== null && <Typography sx={{ fontWeight: 700, mt: 1 }}>Total of the listed items: {parsed[0]![1]}{Math.round(total * 100) / 100}</Typography>}
      </Box>
    </Panel>
  );
}
