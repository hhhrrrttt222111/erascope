import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useEraContext } from "../../../context/EraContext";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useDeepDiveStyle } from "../../deepdive/useDeepDiveStyle";
import { Empty, InteractiveShell } from "./Shell";
import { itemsOfKind, type InteractiveProps } from "./types";

/** Rhythm cycles (talas) by beat grouping. */
const CYCLES: Record<string, number[]> = { "Teental (16 beats: 4+4+4+4)": [4, 4, 4, 4], "Jhaptal (10 beats: 2+3+2+3)": [2, 3, 2, 3], "Keherwa (8 beats: 4+4)": [4, 4], "Dadra (6 beats: 3+3)": [3, 3] };
const TONICS: Record<string, number> = { "Lower (about C3)": 130.81, "Middle (about D3)": 146.83, "Higher (about E3)": 164.81 };

/** Explore art forms; for music, hear a synthesised drone or rhythm cycle (never a recording, muted by default). */
export default function RiyaazRoom(props: InteractiveProps) {
  const { muted } = useEraContext();
  const reduced = useReducedMotion();
  const { accent, theme } = useDeepDiveStyle();
  const arts = itemsOfKind(props, "art");
  const forms = useMemo(() => [...new Set(arts.map((a) => a.form))], [arts]);
  const [form, setForm] = useState("All");
  const [cycle, setCycle] = useState(Object.keys(CYCLES)[0]);
  const [tonic, setTonic] = useState(Object.keys(TONICS)[0]);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const ctx = useRef<AudioContext | null>(null);
  const nodes = useRef<{ stop: () => void } | null>(null);
  const total = CYCLES[cycle].reduce((a, b) => a + b, 0);
  const starts = CYCLES[cycle].reduce<number[]>((acc, _n, i) => (i === 0 ? [0] : [...acc, acc[i - 1] + CYCLES[cycle][i - 1]]), []);

  const stop = () => {
    nodes.current?.stop();
    nodes.current = null;
    setPlaying(false);
  };
  useEffect(() => stop, []);
  useEffect(() => {
    if (muted && playing) stop();
  }, [muted, playing]);

  const start = (mode: "drone" | "rhythm") => {
    if (muted) return;
    stop();
    const Ac = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx.current ??= new Ac();
    const ac = ctx.current;
    const master = ac.createGain();
    master.gain.value = 0.12;
    master.connect(ac.destination);
    if (mode === "drone") {
      const f = TONICS[tonic];
      const oscs = [f, f * 1.5, f * 2, f * 2].map((hz, i) => {
        const o = ac.createOscillator();
        o.type = i < 2 ? "triangle" : "sine";
        o.frequency.value = hz;
        o.detune.value = i === 3 ? 6 : 0;
        o.connect(master);
        o.start();
        return o;
      });
      nodes.current = { stop: () => oscs.forEach((o) => { o.stop(); o.disconnect(); }) };
    } else {
      let n = 0;
      const tick = () => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.frequency.value = n % total === 0 ? 880 : starts.includes(n % total) ? 660 : 440;
        g.gain.setValueAtTime(0.5, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
        o.connect(g).connect(master);
        o.start();
        o.stop(ac.currentTime + 0.13);
        setBeat(n % total);
        n += 1;
      };
      tick();
      const id = window.setInterval(tick, 480);
      nodes.current = { stop: () => { window.clearInterval(id); master.disconnect(); } };
    }
    setPlaying(true);
  };

  const shown = form === "All" ? arts : arts.filter((a) => a.form === form);
  return (
    <InteractiveShell title="Riyaaz room" hint="Browse the year's arts by form. For music, try a synthesised drone or rhythm cycle.">
      {arts.length === 0 ? (
        <Empty>No arts items listed for this year yet.</Empty>
      ) : (
        <>
          <Tabs value={form} onChange={(_, v) => setForm(v)} variant="scrollable" aria-label="Art forms">
            {["All", ...forms].map((f) => (
              <Tab key={f} value={f} label={f} />
            ))}
          </Tabs>
          <Box component="ul" sx={{ m: 0, mt: 2, p: 0, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
            {shown.map((a) => (
              <li key={a.id} style={{ listStyle: "none" }}>
                <Box sx={{ p: 1.5, border: `1px solid ${theme.palette.divider}`, borderTop: `4px solid ${accent}` }}>
                  <Typography sx={{ fontWeight: 700 }}>{a.title}</Typography>
                  <Typography variant="body2">{a.summary}</Typography>
                </Box>
              </li>
            ))}
          </Box>
        </>
      )}

      <Typography component="h3" variant="h6" sx={{ mt: 3 }}>
        Listen (synthesised in your browser)
      </Typography>
      {muted && (
        <Typography variant="body2" role="status">
          Sound is muted. Use the speaker button in the bottom bar to turn it on.
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center", mt: 1 }}>
        <label>
          Drone pitch{" "}
          <select value={tonic} onChange={(e) => setTonic(e.target.value)} aria-label="Drone pitch">
            {Object.keys(TONICS).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <Button disabled={muted} variant="outlined" onClick={() => start("drone")}>Play drone</Button>
        <label>
          Rhythm cycle{" "}
          <select value={cycle} onChange={(e) => { stop(); setCycle(e.target.value); }} aria-label="Rhythm cycle">
            {Object.keys(CYCLES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <Button disabled={muted} variant="outlined" onClick={() => start("rhythm")}>Play rhythm</Button>
        <Button onClick={stop} disabled={!playing}>Stop</Button>
      </Box>
      <Box aria-hidden sx={{ display: "flex", gap: 0.5, mt: 1.5, flexWrap: "wrap" }}>
        {Array.from({ length: total }, (_, n) => (
          <Box key={n} sx={{ width: 22, height: 22, borderRadius: starts.includes(n) ? 0 : "50%", background: playing && !reduced && beat === n ? accent : "transparent", border: `2px solid ${accent}` }} />
        ))}
      </Box>
    </InteractiveShell>
  );
}
