import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useDeepDiveStyle } from "../../deepdive/useDeepDiveStyle";
import { Empty, InteractiveShell } from "./Shell";
import { dataOf, itemsOfKind, type InteractiveProps } from "./types";

/** A film strip lit by a still projector beam (no flicker). Each frame is a title card we lay out ourselves. */
export default function ProjectorReel(props: InteractiveProps) {
  const films = itemsOfKind(props, "film");
  const ticket = dataOf(props).ticket as { price?: string; note?: string } | undefined;
  const { accent, accent2, theme, accentFamily } = useDeepDiveStyle();
  const [i, setI] = useState(0);
  if (films.length === 0) return <InteractiveShell title="Projector reel"><Empty>No films listed for this year yet.</Empty></InteractiveShell>;
  const f = films[Math.min(i, films.length - 1)];
  const move = (d: number) => setI((n) => (n + d + films.length) % films.length);

  return (
    <InteractiveShell title="Projector reel" hint="Use the arrow keys or buttons to move along the film strip.">
      <Box
        role="group"
        aria-roledescription="carousel"
        aria-label="Films"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
        }}
        sx={{ position: "relative", background: "#0c0c0c", p: 2, borderRadius: 1, overflow: "hidden", outlineOffset: 3 }}
      >
        <Box aria-hidden sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "radial-gradient(ellipse at 50% 0%, rgba(255,240,200,0.28), transparent 70%)", pointerEvents: "none" }} />
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", position: "relative", pb: 1 }}>
          {films.map((film, n) => (
            <Button
              key={film.id}
              onClick={() => setI(n)}
              aria-current={n === i}
              sx={{ flex: "0 0 auto", minWidth: 120, height: 84, background: n === i ? accent : "#222", color: "#fff", border: "4px dashed #777", fontFamily: accentFamily, "&:hover": { background: n === i ? accent : "#333" } }}
            >
              {film.title}
            </Button>
          ))}
        </Box>
      </Box>

      <Box aria-live="polite" sx={{ mt: 2, p: 2.5, textAlign: "center", border: `4px double ${accent2}`, background: theme.palette.background.default }}>
        <Typography component="h3" variant="h4" sx={{ fontFamily: accentFamily }}>
          {f.title}
        </Typography>
        <Typography>
          {f.language} · {f.releaseDate ?? "release date to be researched"}
          {f.director ? ` · directed by ${f.director}` : ""}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>{f.notable}</Typography>
      </Box>
      <Typography variant="body2" sx={{ mt: 1.5 }}>
        Ticket price: {ticket?.price ?? "to be researched"}
        {ticket?.note ? ` (${ticket.note})` : ""}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Button onClick={() => move(-1)}>Previous</Button>
        <Button onClick={() => move(1)}>Next</Button>
      </Box>
    </InteractiveShell>
  );
}
