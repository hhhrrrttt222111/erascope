import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useEraContext } from "../../context/EraContext";
import { DEEP_DIVE_SECTIONS } from "../../data/deepdive";
import threadsFile from "../../data/countries/in/deepdive/threads.json";
import type { DeepDiveThread } from "../../data/types";
import { SourceNote } from "../common/SourceNote";
import { goToItem, type FlatItem } from "./allYears";
import { useDeepDiveStyle } from "./useDeepDiveStyle";

const CURATED = threadsFile.threads as DeepDiveThread[];

/** Follow a thread: one theme, every year it appears in, on a single horizontal track (or a vertical list). */
export function ThreadTrack({ items }: { items: FlatItem[] }) {
  const { country } = useEraContext();
  const { theme, accent } = useDeepDiveStyle();
  const [choice, setChoice] = useState(CURATED[0] ? `thread:${CURATED[0].id}` : `section:${DEEP_DIVE_SECTIONS[0].id}`);
  const [layout, setLayout] = useState<"track" | "list">("track");
  const byId = useMemo(() => new Map(items.map((f) => [f.item.id, f])), [items]);

  const stops = useMemo(() => {
    const [kind, id] = choice.split(":");
    const list = kind === "thread" ? (CURATED.find((t) => t.id === id)?.itemIds ?? []).map((i) => byId.get(i)).filter(Boolean) as FlatItem[] : items.filter((f) => f.section === id && !f.item.context);
    return [...list].sort((a, b) => a.year - b.year || (a.item.date ?? "").localeCompare(b.item.date ?? ""));
  }, [choice, items, byId]);
  const thread = choice.startsWith("thread:") ? CURATED.find((t) => t.id === choice.slice(7)) : undefined;
  const years = new Set(stops.map((s) => s.year)).size;

  return (
    <Box component="section" aria-labelledby="thread-h" sx={{ mb: 4 }}>
      <Typography component="h2" id="thread-h" variant="h5" sx={{ mb: 0.5 }}>
        Follow a thread
      </Typography>
      <Typography variant="body2" sx={{ mb: 1.5, maxWidth: 680 }}>
        Pick a theme and see it across the years. Choosing a stop opens that year's section.
      </Typography>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center", mb: 1.5 }}>
        <label>
          <span className="tm-visually-hidden">Thread</span>
          <select value={choice} onChange={(e) => setChoice(e.target.value)} style={{ font: "inherit", padding: "8px 10px", maxWidth: "100%" }}>
            {CURATED.length > 0 && (
              <optgroup label="Curated threads">
                {CURATED.map((t) => (
                  <option key={t.id} value={`thread:${t.id}`}>
                    {t.title}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Whole sections, all years">
              {DEEP_DIVE_SECTIONS.map((s) => (
                <option key={s.id} value={`section:${s.id}`}>
                  {s.label}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <Button variant="outlined" size="small" onClick={() => setLayout((l) => (l === "track" ? "list" : "track"))} aria-pressed={layout === "list"}>
          {layout === "track" ? "Show as a list" : "Show as a track"}
        </Button>
        <Typography variant="body2" role="status">
          {stops.length} stops across {years} {years === 1 ? "year" : "years"}
        </Typography>
      </Box>
      {thread && <Typography sx={{ mb: 1.5, maxWidth: 720 }}>{thread.description}</Typography>}
      <Box
        component="ol"
        tabIndex={layout === "track" ? 0 : undefined}
        aria-label="Thread stops in year order"
        sx={{
          m: 0,
          p: 0,
          pb: 1,
          listStyle: "none",
          display: layout === "track" ? "flex" : "grid",
          gap: 2,
          overflowX: layout === "track" ? "auto" : "visible",
          scrollSnapType: layout === "track" ? "x proximity" : undefined,
          gridTemplateColumns: layout === "list" ? { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } : undefined,
        }}
      >
        {stops.map((s) => (
          <Box
            component="li"
            key={s.item.id}
            sx={{
              flex: layout === "track" ? "0 0 min(300px, 82%)" : undefined,
              scrollSnapAlign: "start",
              p: 2,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderTop: `4px solid ${accent}`,
            }}
          >
            <Typography variant="overline" component="p" sx={{ fontWeight: 700 }}>
              {s.year}
              {s.speculative ? " · imagined" : ""}
            </Typography>
            <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {s.item.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.75 }}>
              {s.item.summary}
            </Typography>
            <SourceNote todo={s.item.todo} source={s.item.sources[0]} />
            <Button size="small" sx={{ mt: 1, px: 0 }} onClick={() => goToItem(country, s)} aria-label={`Open ${s.year}: ${s.item.title}`}>
              Open in {s.year}
            </Button>
          </Box>
        ))}
        {stops.length === 0 && <Typography component="li">No stops in this thread yet.</Typography>}
      </Box>
    </Box>
  );
}
