import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useDeepDiveStyle } from "../../deepdive/useDeepDiveStyle";
import { Empty, InteractiveShell } from "./Shell";
import { asArray, dataOf, itemsOfKind, type InteractiveProps } from "./types";

interface Step { label: string; text: string; score?: string }

/** Era-styled scoreboards: a chalkboard, a flip board, an LED panel, or plain paper. */
const BOARDS: Record<string, { bg: string; fg: string; font: string; border: string }> = {
  newspaper: { bg: "#1f3a2a", fg: "#f4f1e6", font: "'Special Elite', 'Courier New', monospace", border: "8px solid #6b4a2b" },
  artdeco: { bg: "#1f3a2a", fg: "#f4f1e6", font: "'Special Elite', 'Courier New', monospace", border: "8px solid #6b4a2b" },
  midcentury: { bg: "#111", fg: "#f2f2f2", font: "'Arial Narrow', Arial, sans-serif", border: "6px solid #444" },
  groovy: { bg: "#111", fg: "#f2f2f2", font: "'Arial Narrow', Arial, sans-serif", border: "6px solid #444" },
  terminal: { bg: "#000", fg: "#33ff66", font: "'VT323', monospace", border: "2px solid #33ff66" },
  videocall: { bg: "#0b0b0b", fg: "#ffb000", font: "'Courier New', monospace", border: "4px solid #333" },
  futureos: { bg: "#050a16", fg: "#22e4ff", font: "monospace", border: "1px solid #22e4ff" },
  web2gloss: { bg: "#08121e", fg: "#ffb000", font: "'Courier New', monospace", border: "4px solid #333" },
  flatweb: { bg: "#08121e", fg: "#ffb000", font: "'Courier New', monospace", border: "4px solid #333" },
};

export default function ScorecardReplay(props: InteractiveProps) {
  const reduced = useReducedMotion();
  const { theme, chrome } = useDeepDiveStyle();
  const sports = itemsOfKind(props, "sport");
  const replay = dataOf(props).replay as { title?: string; steps?: unknown } | undefined;
  const steps = asArray<Step>(replay?.steps);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const board = BOARDS[chrome] ?? { bg: theme.palette.background.paper, fg: theme.palette.text.primary, font: "inherit", border: `2px solid ${theme.palette.divider}` };

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => setI((n) => (n < steps.length - 1 ? n + 1 : (setPlaying(false), n))), 1600);
    return () => window.clearInterval(timer.current);
  }, [playing, steps.length]);

  return (
    <InteractiveShell title="Scorecard replay" hint="Step through a match or event one moment at a time.">
      {steps.length === 0 ? (
        <Empty>A replay for this year is still being researched.</Empty>
      ) : (
        <>
          <Box aria-live="polite" sx={{ background: board.bg, color: board.fg, fontFamily: board.font, border: board.border, p: 2, minHeight: 110 }}>
            <Typography sx={{ fontFamily: "inherit", opacity: 0.8 }}>{replay?.title}</Typography>
            <Typography sx={{ fontFamily: "inherit", fontSize: "1.4rem", fontWeight: 700 }}>{steps[i].score ?? steps[i].label}</Typography>
            <Typography sx={{ fontFamily: "inherit" }}>
              {steps[i].label}: {steps[i].text}
            </Typography>
          </Box>
          <Box sx={{ mt: 1, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Button disabled={i === 0} onClick={() => setI((n) => n - 1)}>Previous</Button>
            <Button disabled={i === steps.length - 1} onClick={() => setI((n) => n + 1)}>Next</Button>
            {!reduced && (
              <Button onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
                {playing ? "Pause" : "Play"}
              </Button>
            )}
            <Typography variant="caption">
              Step {i + 1} of {steps.length}
            </Typography>
          </Box>
        </>
      )}

      <Typography component="h3" variant="h6" sx={{ mt: 3 }}>
        The year's results
      </Typography>
      {sports.length === 0 ? (
        <Empty>No results listed for this year yet.</Empty>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {["Sport", "Competition", "Result", "Score"].map((h) => (
                  <th key={h} scope="col" style={{ textAlign: "left", padding: 6, borderBottom: "1px solid currentColor" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sports.map((s) => (
                <tr key={s.id}>
                  <td style={{ padding: 6 }}>{s.sport}</td>
                  <td style={{ padding: 6 }}>{s.competition}</td>
                  <td style={{ padding: 6 }}>{s.result}</td>
                  <td style={{ padding: 6 }}>{s.scoreline ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </InteractiveShell>
  );
}
