import { Box, Button, Chip, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import type { DeepDiveItem } from "../../data/types";
import { ItemCard } from "./ItemCard";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SHOW_FIRST = 6;
const monthOf = (d?: string) => (d && /^\d{4}-\d{2}/.test(d) ? Number(d.slice(5, 7)) : null);

type Filters = { region: string | null; kind: string | null; month: number | null };
const matches = (it: DeepDiveItem, f: Filters) =>
  (f.region === null || it.regionTag === f.region) && (f.kind === null || it.kind === f.kind) && (f.month === null || monthOf(it.date) === f.month);

/** Section item cards: filter by region, kind and month, sort, and show 6 with a "Show all" button. */
export function ItemList({ items }: { items: DeepDiveItem[] }) {
  const [f, setF] = useState<Filters>({ region: null, kind: null, month: null });
  const [sort, setSort] = useState<"date" | "az">("date");
  const [all, setAll] = useState(false);

  const shown = useMemo(() => {
    const out = items.filter((it) => matches(it, f));
    return out.sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title) : (a.date ?? "9").localeCompare(b.date ?? "9")));
  }, [items, f, sort]);

  const groups: { key: keyof Filters; label: string; values: { value: string | number; label: string }[] }[] = [
    { key: "region", label: "Region", values: [...new Set(items.map((i) => i.regionTag).filter((v): v is NonNullable<typeof v> => Boolean(v)))].map((v) => ({ value: v, label: v })) },
    { key: "kind", label: "Kind", values: [...new Set(items.map((i) => i.kind))].map((v) => ({ value: v, label: v })) },
    { key: "month", label: "Month", values: [...new Set(items.map((i) => monthOf(i.date)).filter((v): v is number => v !== null))].sort((a, b) => a - b).map((v) => ({ value: v, label: MONTHS[v - 1] })) },
  ];
  const active = f.region !== null || f.kind !== null || f.month !== null;
  const visible = all ? shown : shown.slice(0, SHOW_FIRST);

  return (
    <>
      <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
        {groups.filter((g) => g.values.length > 1).map((g) => (
          <Box key={g.key} role="group" aria-label={`Filter by ${g.label.toLowerCase()}`} sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", alignItems: "center" }}>
            <Typography variant="caption" sx={{ minWidth: 52 }}>{g.label}</Typography>
            {g.values.map((v) => {
              const on = f[g.key] === v.value;
              // A chip that would leave nothing to show is disabled, not hidden.
              const empty = !on && !items.some((it) => matches(it, { ...f, [g.key]: v.value }));
              return <Chip key={v.value} size="small" label={v.label} clickable disabled={empty} color={on ? "primary" : "default"} aria-pressed={on} onClick={() => { setF({ ...f, [g.key]: on ? null : v.value }); setAll(false); }} />;
            })}
          </Box>
        ))}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <label>
            <Typography component="span" variant="caption">Sort </Typography>
            <select value={sort} onChange={(e) => setSort(e.target.value as "date" | "az")} aria-label="Sort items">
              <option value="date">By date</option>
              <option value="az">A to Z</option>
            </select>
          </label>
          {active && <Button size="small" onClick={() => setF({ region: null, kind: null, month: null })}>Clear filters</Button>}
          <Typography variant="caption" role="status" aria-live="polite">Showing {shown.length} of {items.length} items</Typography>
        </Box>
      </Box>
      <Box component="ul" sx={{ m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" } }}>
        {visible.map((item, i) => (
          <ItemCard key={item.id} item={item} index={i} />
        ))}
      </Box>
      {shown.length > SHOW_FIRST && (
        <Button onClick={() => setAll((a) => !a)} aria-expanded={all} sx={{ mt: 1.5 }}>
          {all ? "Show fewer" : `Show all ${shown.length}`}
        </Button>
      )}
    </>
  );
}
