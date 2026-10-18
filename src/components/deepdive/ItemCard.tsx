import { Box, Button, Typography } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import { useState } from "react";
import type { DeepDiveItem } from "../../data/types";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SourceNote } from "../common/SourceNote";
import { TimeTag } from "../common/TimeTag";
import { useDeepDiveStyle } from "./useDeepDiveStyle";

const NOTE_DEFAULT = "This item describes loss of life or suffering.";

/** One card. Content-note items announce the note first and keep the body collapsed until opened. */
export function ItemCard({ item, index }: { item: DeepDiveItem; index: number }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const { theme, accent, frame } = useDeepDiveStyle();
  const noted = item.sensitivity?.level === "content-note";
  const bodyId = `${item.id}-body`;
  const lang = item.languages?.[0];
  return (
    <motion.li
      id={`item-${item.id}`}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04 }}
      style={{ listStyle: "none" }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <Box
        component="article"
        lang={lang}
        sx={{
          height: "100%",
          p: 2,
          color: theme.palette.text.primary,
          background: theme.palette.background.paper,
          borderTop: `4px solid ${accent}`,
          borderRadius: `${Math.min(theme.shape.borderRadius as number, 16)}px`,
          outline: `1px solid ${theme.palette.divider}`,
          ...(frame.css as object),
          borderColor: theme.palette.divider,
        }}
      >
        <Typography component="h3" variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
          {item.title}
        </Typography>
        {(item.date || item.place) && (
          <Typography variant="caption" component="p" sx={{ color: "text.secondary", mt: 0.5 }}>
            {[item.date, item.place].filter(Boolean).join(" · ")}
          </Typography>
        )}
        {noted && (
          <Typography role="note" variant="body2" sx={{ mt: 1, fontWeight: 700 }}>
            Content note: {item.sensitivity?.note ?? NOTE_DEFAULT}
          </Typography>
        )}
        <Typography sx={{ mt: 1 }}>{item.summary}</Typography>
        {item.body && item.body.length > 0 && (
          <>
            <Button
              size="small"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={bodyId}
              endIcon={<ExpandMore sx={{ transform: open ? "rotate(180deg)" : "none" }} />}
              sx={{ mt: 1, px: 0 }}
            >
              {open ? "Show less" : noted ? "Read, with content note" : "Read more"}
            </Button>
            <Box id={bodyId} hidden={!open}>
              {item.body.map((p, i) => (
                <Typography key={i} sx={{ mt: 1 }}>
                  {p}
                </Typography>
              ))}
            </Box>
          </>
        )}
        <TimeTag item={item} />
        <SourceNote todo={item.todo} />
        {item.sources.map((s, i) => (
          <SourceNote key={i} source={s} />
        ))}
      </Box>
    </motion.li>
  );
}
