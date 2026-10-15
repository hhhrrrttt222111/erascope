import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { eras, type Era } from "../../data";
import { useEraContext } from "../../context/EraContext";
import { eraThemes } from "../../theme/eraThemes";
import { loadEraFonts } from "../../theme/fontLoader";
import { applyMorphVars, eraWeight, locate, scrubYear } from "../../theme/interpolate";

function TextureLayer({ era, position }: { era: Era; position: MotionValue<number> }) {
  const opacity = useTransform(position, (p) => eraWeight(era, p));
  return <motion.div className={`fx-morph-layer fx-morph-${era.year}`} style={{ opacity }} />;
}

/**
 * Shown only while the slider is being dragged: the background colour, corner
 * radius and era textures blend continuously between the two nearest eras.
 * On release it fades out and the full era theme takes over.
 */
export function MorphOverlay() {
  const { isDragging, position } = useEraContext();
  const [nearest, setNearest] = useState<Era>(() => locate(position.get()).nearest);
  const yearRef = useRef<HTMLParagraphElement>(null);

  useMotionValueEvent(position, "change", (p) => {
    applyMorphVars(p);
    if (yearRef.current) yearRef.current.textContent = String(scrubYear(p));
    const n = locate(p).nearest;
    setNearest((prev) => (prev === n ? prev : n));
  });

  // Fetch the era under the handle's fonts while dragging, so they're ready on release.
  useEffect(() => {
    if (isDragging) loadEraFonts(nearest);
  }, [isDragging, nearest]);

  const font = eraThemes[nearest.year].typography.h1.fontFamily;

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed",
            inset: 0,
            bottom: "var(--tm-slider-h)",
            zIndex: 1100,
            background: "var(--tm-morph-background)",
            color: "var(--tm-morph-text)",
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {eras.map((e) => (
            <TextureLayer key={e.year} era={e} position={position} />
          ))}
          <Box
            sx={{
              position: "relative",
              textAlign: "center",
              px: { xs: 3, sm: 6 },
              py: { xs: 3, sm: 4 },
              mx: 2,
              maxWidth: 680,
              background: "var(--tm-morph-paper)",
              border: "2px solid var(--tm-morph-primary)",
              borderRadius: "var(--tm-morph-radius)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <p
              ref={yearRef}
              style={{
                margin: 0,
                fontFamily: font,
                fontWeight: 900,
                fontSize: "clamp(4rem, 16vw, 9rem)",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                color: "var(--tm-morph-primary)",
              }}
            >
              {scrubYear(position.get())}
            </p>
            <Typography sx={{ fontFamily: font, fontSize: { xs: "1.3rem", sm: "1.8rem" }, fontWeight: 700, mt: 1, color: "inherit" }}>
              {nearest.title}
            </Typography>
            <Typography sx={{ mt: 0.5, opacity: 0.8, color: "inherit" }}>Release to arrive in {nearest.year}</Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
