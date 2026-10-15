import { Box, Typography } from "@mui/material";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { Empty, InteractiveShell } from "./Shell";
import { asArray, dataOf, itemsOfKind, monthOf, type InteractiveProps } from "./types";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
interface Excerpt { text: string; lang: string; reference: string }

/** The year's events month by month, with a progress rail and a primary-source panel. */
export default function ChronicleScroll(props: InteractiveProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // The deep dive scrolls inside its own panel, not the window: track the nearest scrollable ancestor.
  const scroller = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    let el = ref.current?.parentElement ?? null;
    while (el && !/(auto|scroll)/.test(getComputedStyle(el).overflowY)) el = el.parentElement;
    scroller.current = el;
  }, []);
  const { scrollYProgress } = useScroll({ container: scroller, target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const events = itemsOfKind(props, "event");
  const excerpts = asArray<Excerpt>(dataOf(props).excerpts);
  const byMonth = new Map<number, typeof events>();
  for (const e of events) {
    const m = monthOf(e.date) ?? 0;
    byMonth.set(m, [...(byMonth.get(m) ?? []), e]);
  }
  const months = [...byMonth.keys()].sort((a, b) => a - b);

  return (
    <InteractiveShell title="The year as it unfolded" hint="Scroll through the year's events, month by month.">
      {events.length === 0 ? (
        <Empty>No events listed for this year yet.</Empty>
      ) : (
        <Box ref={ref} sx={{ position: "relative", pl: 3 }}>
          <Box aria-hidden sx={{ position: "absolute", left: 6, top: 0, bottom: 0, width: 4, background: "rgba(128,128,128,0.3)" }}>
            {!reduced && <motion.div style={{ scaleY: progress, transformOrigin: "top", height: "100%", background: "currentColor" }} />}
          </Box>
          <Box component="ol" sx={{ m: 0, p: 0 }}>
            {months.map((m) => (
              <Box component="li" key={m} sx={{ listStyle: "none", mb: 3 }}>
                <Typography component="h3" variant="h6" sx={{ position: reduced ? "static" : "sticky", top: 0, py: 0.5, background: "inherit" }}>
                  {m === 0 ? "Date to be confirmed" : MONTHS[m - 1]}
                </Typography>
                {byMonth.get(m)!.map((e) => (
                  <Box key={e.id} sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700 }}>{e.title}</Typography>
                    <Typography variant="body2">{e.summary}</Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <Typography component="h3" variant="h6" sx={{ mt: 2 }}>
        From the record
      </Typography>
      {excerpts.length === 0 ? (
        <Empty>Primary-source excerpts for this year are still being researched.</Empty>
      ) : (
        excerpts.map((x, i) => (
          <Box key={i} component="figure" sx={{ m: 0, mb: 1.5, p: 1.5, border: "1px solid currentColor" }}>
            <Typography component="blockquote" lang={x.lang} sx={{ m: 0 }}>
              {x.text}
            </Typography>
            <Typography component="figcaption" variant="caption">
              {x.reference}
            </Typography>
          </Box>
        ))
      )}
    </InteractiveShell>
  );
}
