import { Box, Button, Typography } from "@mui/material";
import { lazy, Suspense, useState, type ComponentType } from "react";
import { comparisonYear } from "../../../data/present";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useDeepDiveStyle } from "../../deepdive/useDeepDiveStyle";
import type { DeviceModelProps } from "../../three/ringTypes";
import { Empty, InteractiveShell } from "./Shell";
import { asArray, dataOf, itemsOfKind, type InteractiveProps } from "./types";

const modelModules = import.meta.glob<{ default: ComponentType<DeviceModelProps> }>("../../three/deepdive/DeviceModel.tsx");
const DeviceModel = lazy(Object.values(modelModules)[0]);

interface Spec { label: string; then: string; now: string }
interface Comparison { itemId: string; nowTitle: string; specs: Spec[]; model?: DeviceModelProps["kind"] }

/** Drag a divider between the year's technology and its equivalent in the comparison year (2026, or 2020 when the year is the present); optional turnable 3D model. */
export default function TechThenNow(props: InteractiveProps) {
  const items = itemsOfKind(props, "tech");
  const comparisons = asArray<Comparison>(dataOf(props).comparisons);
  const [selected, setSelected] = useState(0);
  const [split, setSplit] = useState(50);
  const [show3d, setShow3d] = useState(false);
  const reduced = useReducedMotion();
  const { accent, theme } = useDeepDiveStyle();

  if (items.length === 0) return <InteractiveShell title="Then and now"><Empty>No technology items for this year yet.</Empty></InteractiveShell>;
  const item = items[Math.min(selected, items.length - 1)];
  const cmp = comparisons.find((c) => c.itemId === item.id);
  const specs: Spec[] = cmp?.specs ?? [];

  return (
    <InteractiveShell title="Then and now" hint={`Pick a technology, then drag the divider to compare it with its ${comparisonYear(props.year)} equivalent.`}>
      <Box role="tablist" aria-label="Technology" sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {items.map((it, i) => (
          <Button key={it.id} role="tab" aria-selected={i === selected} size="small" variant={i === selected ? "contained" : "outlined"} onClick={() => setSelected(i)}>
            {it.title}
          </Button>
        ))}
      </Box>

      <Box sx={{ position: "relative", border: `1px solid ${theme.palette.divider}`, minHeight: 160, overflow: "hidden" }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="overline">{comparisonYear(props.year)} equivalent</Typography>
          <Typography variant="h6">{cmp?.nowTitle ?? "To be researched"}</Typography>
          {specs.map((s) => (
            <Typography key={s.label} variant="body2">
              {s.label}: {s.now}
            </Typography>
          ))}
        </Box>
        <Box sx={{ position: "absolute", inset: 0, width: `${split}%`, overflow: "hidden", background: theme.palette.background.default, borderRight: `3px solid ${accent}` }}>
          <Box sx={{ p: 2, width: "min(100%, 100vw)", minWidth: 220 }}>
            <Typography variant="overline">{props.year}</Typography>
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body2">{item.summary}</Typography>
            <Typography variant="caption" component="p">
              Available to: {item.availability.replace(/-/g, " ")}
            </Typography>
            {specs.map((s) => (
              <Typography key={s.label} variant="body2">
                {s.label}: {s.then}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 1.5 }}>
        <label>
          <Typography component="span" variant="body2">
            Compare
          </Typography>{" "}
          <input
            type="range"
            min={5}
            max={95}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Divider between then and now"
            aria-valuetext={`${split} percent shows ${props.year}`}
            style={{ width: "min(420px, 100%)", accentColor: accent }}
          />
        </label>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button size="small" variant="outlined" aria-pressed={show3d} onClick={() => setShow3d((s) => !s)}>
          {show3d ? "Hide 3D model" : "Show 3D model"}
        </Button>
        {show3d && (
          <Box sx={{ height: 220, mt: 1, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" component="p" sx={{ p: 0.5 }}>
              Drag to turn the model. {reduced ? "Shown as a still view." : ""}
            </Typography>
            <Suspense fallback={null}>
              <DeviceModel kind={cmp?.model ?? "box"} color={theme.palette.text.primary} accent={accent} animate={!reduced} />
            </Suspense>
          </Box>
        )}
      </Box>
    </InteractiveShell>
  );
}
