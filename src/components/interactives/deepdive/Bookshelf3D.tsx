import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useDeepDiveStyle } from "../../deepdive/useDeepDiveStyle";
import { Empty, InteractiveShell } from "./Shell";
import { itemsOfKind, type InteractiveProps } from "./types";

/** Script → Noto family, loaded only when a title in that script is on screen. */
const SCRIPT_FONT: Record<string, string> = {
  hi: "Noto+Sans+Devanagari", mr: "Noto+Sans+Devanagari", sa: "Noto+Sans+Devanagari", ne: "Noto+Sans+Devanagari",
  bn: "Noto+Sans+Bengali", as: "Noto+Sans+Bengali", ta: "Noto+Sans+Tamil", te: "Noto+Sans+Telugu", kn: "Noto+Sans+Kannada",
  ml: "Noto+Sans+Malayalam", gu: "Noto+Sans+Gujarati", pa: "Noto+Sans+Gurmukhi", or: "Noto+Sans+Oriya", ur: "Noto+Nastaliq+Urdu",
};
const loaded = new Set<string>();
export function loadScriptFont(lang: string) {
  const spec = SCRIPT_FONT[lang];
  if (!spec || loaded.has(spec)) return;
  loaded.add(spec);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
  document.head.appendChild(link);
}
export const scriptFamily = (lang: string) => (SCRIPT_FONT[lang] ? `"${SCRIPT_FONT[lang].replace(/\+/g, " ")}", sans-serif` : undefined);

/** A shelf of spines; pull one out for the original title, transliteration and translation. */
export default function Bookshelf3D(props: InteractiveProps) {
  const reduced = useReducedMotion();
  const { accent, accent2, theme } = useDeepDiveStyle();
  const works = itemsOfKind(props, "work");
  const [open, setOpen] = useState<string | null>(null);
  const chosen = works.find((w) => w.id === open);

  useEffect(() => {
    works.forEach((w) => w.originalTitle && loadScriptFont(w.originalTitle.lang));
  }, [works]);

  if (works.length === 0) return <InteractiveShell title="Bookshelf"><Empty>No works listed for this year yet.</Empty></InteractiveShell>;
  return (
    <InteractiveShell title="Bookshelf" hint="Select a spine to pull the book out. Titles appear in their own script where verified.">
      <Box component="ul" sx={{ m: 0, p: 0, display: "flex", gap: 1, alignItems: "flex-end", flexWrap: "wrap", perspective: "800px", borderBottom: `8px solid ${accent2}`, pb: 0.5 }}>
        {works.map((w, i) => {
          const pulled = w.id === open;
          const lang = w.originalTitle?.lang;
          return (
            <li key={w.id} style={{ listStyle: "none" }}>
              <Button
                onClick={() => setOpen(pulled ? null : w.id)}
                aria-pressed={pulled}
                aria-label={`${w.originalTitle?.text ?? w.title} by ${w.creator}`}
                lang={lang}
                sx={{
                  writingMode: "vertical-rl",
                  height: 150 + (i % 3) * 14,
                  minWidth: 44,
                  p: 1,
                  background: i % 2 ? accent : accent2,
                  color: "#fff",
                  fontFamily: lang ? scriptFamily(lang) : undefined,
                  transform: reduced ? (pulled ? "translateY(-10px)" : "none") : pulled ? "translateZ(60px) translateY(-8px) rotateY(-12deg)" : "rotateY(-14deg)",
                  transition: reduced ? "none" : "transform 0.3s ease",
                  "&:hover": { background: i % 2 ? accent : accent2 },
                }}
              >
                {w.originalTitle?.text ?? w.title}
              </Button>
            </li>
          );
        })}
      </Box>
      <Box aria-live="polite" sx={{ mt: 2 }}>
        {chosen && (
          <Box sx={{ p: 1.5, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" lang={chosen.originalTitle?.lang} sx={{ fontFamily: chosen.originalTitle ? scriptFamily(chosen.originalTitle.lang) : undefined }}>
              {chosen.originalTitle?.text ?? chosen.title}
            </Typography>
            {chosen.transliteration && <Typography variant="body2">Transliteration: {chosen.transliteration}</Typography>}
            {chosen.translatedTitle && <Typography variant="body2">In English: {chosen.translatedTitle}</Typography>}
            <Typography variant="body2">By {chosen.creator} · {chosen.workType}</Typography>
            <Typography>{chosen.summary}</Typography>
            {chosen.publicDomainExcerpt && (
              <Typography component="blockquote" lang={chosen.publicDomainExcerpt.lang} sx={{ mt: 1 }}>
                {chosen.publicDomainExcerpt.text}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </InteractiveShell>
  );
}
