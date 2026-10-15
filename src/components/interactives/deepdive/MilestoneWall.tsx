import { Box, Button, Typography } from "@mui/material";
import { animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useDeepDiveStyle } from "../../deepdive/useDeepDiveStyle";
import { Empty, InteractiveShell } from "./Shell";
import { asArray, dataOf, itemsOfKind, monthOf, type InteractiveProps } from "./types";

interface Counter { label: string; value: number; unit?: string }

function CountUp({ value, unit, reduced }: { value: number; unit?: string; reduced: boolean }) {
  const [shown, setShown] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    const c = animate(0, value, { duration: 1.1, onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [value, reduced]);
  return (
    <span>
      {shown.toLocaleString("en-IN")}
      {unit ? ` ${unit}` : ""}
    </span>
  );
}

/** Tiles light up in date order as the visitor scrubs through the year. */
export default function MilestoneWall(props: InteractiveProps) {
  const reduced = useReducedMotion();
  const { accent, theme } = useDeepDiveStyle();
  const items = itemsOfKind(props, "achievement");
  const counters = asArray<Counter>(dataOf(props).counters);
  const [month, setMonth] = useState(12);
  const [open, setOpen] = useState<string | null>(null);
  const chosen = items.find((i) => i.id === open);

  if (items.length === 0) return <InteractiveShell title="Milestone wall"><Empty>No achievements listed for this year yet.</Empty></InteractiveShell>;
  return (
    <InteractiveShell title="Milestone wall" hint="Drag the slider through the year; milestones light up as their month arrives.">
      {counters.length > 0 && (
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 2 }}>
          {counters.map((c) => (
            <Box key={c.label}>
              <Typography variant="h5" component="p" sx={{ fontWeight: 800 }}>
                <CountUp value={c.value} unit={c.unit} reduced={reduced} />
              </Typography>
              <Typography variant="caption">{c.label}</Typography>
            </Box>
          ))}
        </Box>
      )}
      <label>
        <Typography component="span" variant="body2">Through month</Typography>{" "}
        <input type="range" min={0} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Month of the year" aria-valuetext={month === 0 ? "Start of year" : `Through month ${month} of 12`} style={{ accentColor: accent, width: "min(360px, 100%)" }} />
      </label>
      <Box component="ul" sx={{ m: 0, mt: 2, p: 0, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
        {items.map((it) => {
          const m = monthOf(it.date);
          const lit = m === null ? month === 12 : m <= month;
          return (
            <li key={it.id} style={{ listStyle: "none" }}>
              <Button
                fullWidth
                onClick={() => setOpen(it.id)}
                aria-pressed={open === it.id}
                sx={{
                  display: "block",
                  textAlign: "left",
                  p: 1.5,
                  minHeight: 80,
                  border: `2px solid ${lit ? accent : theme.palette.divider}`,
                  background: lit ? theme.palette.background.default : "transparent",
                  opacity: lit ? 1 : 0.55,
                  transition: reduced ? "none" : "opacity 0.3s, border-color 0.3s",
                }}
              >
                <strong>{it.title}</strong>
                <br />
                <small>{it.date ?? "date to be confirmed"}</small>
              </Button>
            </li>
          );
        })}
      </Box>
      <Box aria-live="polite" sx={{ mt: 2 }}>
        {chosen && (
          <Box sx={{ p: 1.5, border: "1px solid currentColor" }}>
            <Typography variant="h6">{chosen.title}</Typography>
            <Typography>{chosen.summary}</Typography>
          </Box>
        )}
      </Box>
    </InteractiveShell>
  );
}
