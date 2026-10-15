import { Box, Button, Chip, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useDeepDiveStyle } from "../../deepdive/useDeepDiveStyle";
import { Empty, InteractiveShell } from "./Shell";
import { itemsOfKind, type InteractiveProps } from "./types";

/** A turnable gallery of people. Cards flip to show what they did this year. */
export default function PortraitGallery(props: InteractiveProps) {
  const people = itemsOfKind(props, "person");
  const reduced = useReducedMotion();
  const { theme, accent } = useDeepDiveStyle();
  const [filter, setFilter] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const fields = useMemo(() => [...new Set(people.map((p) => p.field))], [people]);
  const shown = filter ? people.filter((p) => p.field === filter) : people;
  const idx = Math.min(active, Math.max(shown.length - 1, 0));
  const move = (d: number) => setActive((a) => (a + d + shown.length) % shown.length);

  if (people.length === 0) return <InteractiveShell title="Portrait gallery"><Empty>No people listed for this year yet.</Empty></InteractiveShell>;

  return (
    <InteractiveShell title="Portrait gallery" hint="Use the arrow keys or buttons to walk along the gallery. Flip a card to see what they did this year.">
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }} role="group" aria-label="Filter by field">
        <Chip label="All" color={filter === null ? "primary" : "default"} onClick={() => setFilter(null)} clickable />
        {fields.map((f) => (
          <Chip key={f} label={f} color={filter === f ? "primary" : "default"} onClick={() => { setFilter(f); setActive(0); }} clickable />
        ))}
      </Box>
      <Box
        role="group"
        aria-roledescription="carousel"
        aria-label="People"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
        }}
        sx={{ perspective: "1100px", height: { xs: 300, md: 320 }, position: "relative", outlineOffset: 4 }}
      >
        {shown.map((p, i) => {
          const offset = i - idx;
          const visible = Math.abs(offset) <= 2;
          const isFlipped = flipped[p.id];
          const initials = p.title.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <Box
              key={p.id}
              aria-hidden={offset !== 0}
              sx={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: { xs: 220, md: 250 },
                height: "100%",
                display: visible ? "block" : "none",
                transform: reduced ? `translateX(calc(-50% + ${offset * 60}px))` : `translateX(calc(-50% + ${offset * 150}px)) translateZ(${-Math.abs(offset) * 120}px) rotateY(${-offset * 28}deg)`,
                opacity: reduced && offset !== 0 ? 0 : 1 - Math.abs(offset) * 0.25,
                transition: reduced ? "none" : "transform 0.45s ease, opacity 0.45s ease",
                zIndex: 10 - Math.abs(offset),
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  p: 2,
                  background: theme.palette.background.default,
                  border: `3px solid ${accent}`,
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto",
                }}
              >
                {!isFlipped ? (
                  <>
                    <Box sx={{ width: 72, height: 72, borderRadius: "50%", background: accent, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 24, mb: 1 }} aria-hidden>
                      {initials}
                    </Box>
                    <Typography variant="h6" component="h3">{p.title}</Typography>
                    <Typography variant="body2">{p.field}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{p.summary}</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="overline">In {props.year}</Typography>
                    <Typography variant="body2">{p.whyThisYear}</Typography>
                    {p.quote && (
                      <Typography component="blockquote" lang={p.quote.lang} sx={{ m: 0, mt: 1, fontStyle: "italic" }}>
                        “{p.quote.text}”
                      </Typography>
                    )}
                  </>
                )}
                <Button size="small" sx={{ mt: "auto" }} onClick={() => setFlipped((f) => ({ ...f, [p.id]: !f[p.id] }))} aria-pressed={!!isFlipped} disabled={offset !== 0}>
                  {isFlipped ? "Show profile" : "Why this year?"}
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
        <Button onClick={() => move(-1)}>Previous</Button>
        <Typography aria-live="polite" sx={{ alignSelf: "center" }}>
          {shown[idx]?.title} ({idx + 1} of {shown.length})
        </Typography>
        <Button onClick={() => move(1)}>Next</Button>
      </Box>
    </InteractiveShell>
  );
}
