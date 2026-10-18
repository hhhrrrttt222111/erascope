import { Box, Typography } from "@mui/material";
import { Suspense, useEffect } from "react";
import { INTERACTIVES } from "../interactives/deepdive/registry";
import { DEEP_DIVE_SECTIONS } from "../../data/deepdive";
import type { DeepDive, DeepDiveSection, DeepDiveSectionId } from "../../data/types";
import { ItemList } from "./ItemList";
import { Motif } from "./motifs";
import { useDeepDiveStyle } from "./useDeepDiveStyle";

/** One section: a hero band with the section motif, the interactive, then the item cards. */
export function SectionPage({ dd, id, section, headingRef }: { dd: DeepDive; id: DeepDiveSectionId; section: DeepDiveSection; headingRef: React.RefObject<HTMLHeadingElement> }) {
  const { theme, dd: style, accent, accent2, accentFamily } = useDeepDiveStyle();
  const label = DEEP_DIVE_SECTIONS.find((s) => s.id === id)!.label;
  const Interactive = INTERACTIVES[section.interactive.component];
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [headingRef]);
  return (
    <>
      <Box
        className={style.heroPattern ? `in-layer ${style.heroPattern}` : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: { xs: 2, md: 3 },
          mb: 3,
          background: theme.palette.background.paper,
          borderBottom: `5px solid ${accent}`,
          ...({ "--in-accent": accent, "--in-accent2": accent2 } as object),
        }}
      >
        <Motif id={id} style={style.motifStyle} size={72} accent={accent} accent2={accent2} css={{ color: accent, flex: "none", position: "relative", zIndex: 2 }} />
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography variant="overline" component="p">
            {label} · {dd.year}
          </Typography>
          <Typography component="h1" id="dd-heading" tabIndex={-1} ref={headingRef} variant="h3" sx={{ outline: "none", fontFamily: accentFamily }}>
            {section.title}
          </Typography>
          <Typography sx={{ maxWidth: 720, mt: 0.5 }}>{section.standfirst}</Typography>
        </Box>
      </Box>
      {section.scarcityNote && (
        <Typography role="note" variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
          {section.scarcityNote}
        </Typography>
      )}
      {Interactive && (
        <Suspense fallback={<Typography aria-busy>Loading interactive…</Typography>}>
          <Interactive year={dd.year} sectionId={id} section={section} />
        </Suspense>
      )}
      <Typography component="h2" variant="h5" sx={{ mb: 1.5 }}>
        Items
      </Typography>
      <ItemList items={section.items} />
    </>
  );
}
