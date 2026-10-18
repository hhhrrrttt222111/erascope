import { Alert, Box, Button, Typography } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { lazy, Suspense, useEffect, useState, type ComponentType, type LazyExoticComponent } from "react";
import { useShellEra } from "../../context/EraContext";
import { getEveryday } from "../../data";
import type { CountryId, EraId, Everyday, EverydayItem, EverydaySection as Section, EverydaySectionId } from "../../data/types";
import { EraCard } from "../common/EraCard";
import { SourceNote } from "../common/SourceNote";

const cache = new Map<string, Promise<Everyday>>();
/** One fetch per country-year; every section of the page shares it. */
export function useEveryday(country: CountryId, year: EraId) {
  const key = `${country}.${year}`;
  const [data, setData] = useState<Everyday | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    if (!cache.has(key)) cache.set(key, getEveryday(country, year));
    cache.get(key)!.then((d) => live && setData(d)).catch(() => {
      cache.delete(key);
      if (live) setFailed(true);
    });
    return () => {
      live = false;
    };
  }, [key, country, year]);
  return { data, failed };
}

// Optional interactive under a section; each is its own lazy chunk and renders nothing without matching items.
const EXTRA: Partial<Record<EverydaySectionId, LazyExoticComponent<ComponentType<{ items: EverydayItem[] }>>>> = {
  foodAndKitchen: lazy(() => import("../interactives/everyday/PlateBuilder")),
  gettingAround: lazy(() => import("../interactives/everyday/JourneyPlanner")),
  keepingInTouch: lazy(() => import("../interactives/everyday/MessageRace")),
};

const LAYOUT: Partial<Record<EverydaySectionId, NonNullable<Section["layout"]>>> = { byTheNumbers: "stats", gettingAround: "journeys" };
const SHOW_FIRST = 6;

function detail(it: EverydayItem): string | undefined {
  switch (it.kind) {
    case "stat": return `${it.value} ${it.unit} (as of ${it.asOf})`;
    case "price": return [it.price, it.originalUnits, it.decimalINR].filter(Boolean).join(" · ") + (it.adjusted2026 ? ` ≈ ${it.adjusted2026} today` : "");
    case "wage": return `${it.amount} per ${it.per}${it.hours ? `, ${it.hours}` : ""}`;
    case "journey": return `${it.from} → ${it.to} · ${it.mode} · ${it.duration}${it.cost ? ` · ${it.cost}` : ""}`;
    case "message": return `${it.medium} · ${it.deliveryTime}${it.cost ? ` · ${it.cost}` : ""}`;
    case "meal": return `${it.mealTime}: ${it.dishes.join(", ")}`;
    default: return undefined;
  }
}

function Item({ it, tile }: { it: EverydayItem; tile?: boolean }) {
  const [open, setOpen] = useState(false);
  const noted = it.sensitivity?.level === "content-note";
  const bodyId = `${it.id}-body`;
  const d = detail(it);
  const meta = [it.date, it.place, it.regionTag].filter(Boolean).join(" · ");
  return (
    <EraCard>
      {tile && it.kind === "stat" ? (
        <>
          <Typography sx={{ fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
            {it.value} <Typography component="span" sx={{ fontSize: "0.9rem" }}>{it.unit}</Typography>
          </Typography>
          <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>{it.metric}</Typography>
          <Typography variant="caption" component="p" sx={{ color: "text.secondary" }}>as of {it.asOf}{it.comparison2026 ? ` · 2026: ${it.comparison2026}` : ""}</Typography>
        </>
      ) : (
        <>
          <Typography component="h3" variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25 }}>{it.title}</Typography>
          {meta && <Typography variant="caption" component="p" sx={{ color: "text.secondary" }}>{meta}</Typography>}
          {d && <Typography sx={{ fontWeight: 700, mt: 0.5, fontVariantNumeric: "tabular-nums" }}>{d}</Typography>}
        </>
      )}
      {noted && <Typography role="note" variant="body2" sx={{ mt: 1, fontWeight: 700 }}>Content note: {it.sensitivity?.note ?? "This item describes hardship or loss."}</Typography>}
      <Typography sx={{ mt: 1 }}>{it.summary}</Typography>
      {it.body && it.body.length > 0 && (
        <>
          <Button size="small" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={bodyId} endIcon={<ExpandMore sx={{ transform: open ? "rotate(180deg)" : "none" }} />} sx={{ mt: 0.5, px: 0 }}>
            {open ? "Show less" : noted ? "Read, with content note" : "Read more"}
          </Button>
          <Box id={bodyId} hidden={!open}>
            {it.body.map((p, i) => <Typography key={i} sx={{ mt: 1 }}>{p}</Typography>)}
          </Box>
        </>
      )}
      <SourceNote todo={it.todo} />
      {it.sources.map((s, i) => <SourceNote key={i} source={s} />)}
    </EraCard>
  );
}

/** One everyday section, rendered through its layout. Same component for every section, country and year. */
export function EverydaySection({ id }: { id: EverydaySectionId }) {
  const era = useShellEra();
  const { data, failed } = useEveryday(era.country ?? "world", era.year);
  const [all, setAll] = useState(false);
  const section = data?.sections[id];
  if (failed) return <Alert severity="warning">This section could not be loaded. Check your connection and reload.</Alert>;
  if (!section) return <Box sx={{ minHeight: 240 }} aria-busy />;

  const layout = section.layout ?? LAYOUT[id] ?? "cards";
  const items = layout === "timeline" ? [...section.items].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")) : section.items;
  const shown = all ? items : items.slice(0, SHOW_FIRST);
  const grid = layout === "stats" ? "repeat(auto-fill, minmax(190px, 1fr))" : layout === "journeys" || layout === "timeline" ? "1fr" : "repeat(auto-fill, minmax(min(100%, 280px), 1fr))";
  return (
    <Box>
      {(section.title || section.standfirst) && (
        <Box sx={{ mb: 1.5 }}>
          {section.title && <Typography component="p" variant="subtitle1" sx={{ fontWeight: 700 }}>{section.title}</Typography>}
          {section.standfirst && <Typography>{section.standfirst}</Typography>}
        </Box>
      )}
      {items.length === 0 ? (
        <Typography role="note" sx={{ fontStyle: "italic", color: "text.secondary" }}>Research for this section is still in progress.</Typography>
      ) : (
        <Box component={layout === "timeline" ? "ol" : "ul"} sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: grid }}>
          {shown.map((it) => (
            <li key={it.id} style={{ minWidth: 0 }}>
              <Item it={it} tile={layout === "stats"} />
            </li>
          ))}
        </Box>
      )}
      {items.length > SHOW_FIRST && (
        <Button onClick={() => setAll((a) => !a)} aria-expanded={all} sx={{ mt: 1.5 }}>
          {all ? "Show fewer" : `Show all ${items.length}`}
        </Button>
      )}
      {(() => {
        const Extra = EXTRA[id];
        return Extra && items.length > 0 ? <Suspense fallback={null}><Extra items={items} /></Suspense> : null;
      })()}
      {section.scarcityNote && <Typography role="note" variant="body2" sx={{ mt: 1.5, fontStyle: "italic", color: "text.secondary" }}>{section.scarcityNote}</Typography>}
    </Box>
  );
}

/** One line near the hero: "This year: <spotlight title>", linking down to the spotlight. */
export function SpotlightTeaser({ onJump }: { onJump: () => void }) {
  const era = useShellEra();
  const { data } = useEveryday(era.country ?? "world", era.year);
  const s = data?.sections.spotlight;
  if (!s || s.items.length === 0 || !s.title) return null;
  return (
    <Typography component="p" sx={{ textAlign: "center", py: 1, px: 2, fontSize: "0.95rem" }}>
      This year:{" "}
      <Box component="button" type="button" onClick={onJump} sx={{ all: "unset", cursor: "pointer", textDecoration: "underline", fontWeight: 700, "&:focus-visible": { outline: "2px solid currentColor" } }}>
        {s.title}
      </Box>
    </Typography>
  );
}
