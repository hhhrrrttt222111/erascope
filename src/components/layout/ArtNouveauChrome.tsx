import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";
import "../../styles/era-css/artnouveau.css";

function roman(n: number) {
  const map: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, s] of map) while (n >= v) (out += s), (n -= v);
  return out;
}

/** A whiplash-curve divider, the signature line of Art Nouveau. */
function Whiplash({ color }: { color: string }) {
  return (
    <Box component="svg" viewBox="0 0 400 40" aria-hidden sx={{ display: "block", width: "min(420px, 90%)", height: 34, mx: "auto", my: 1.5 }}>
      <path d="M10 20 C 70 -6, 110 46, 170 20 S 230 -6, 200 20" fill="none" stroke={color} strokeWidth="2" />
      <path d="M390 20 C 330 -6, 290 46, 230 20 S 170 -6, 200 20" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="200" cy="20" r="5" fill={color} />
      <path d="M200 8 q6 6 0 12 q-6 -6 0 -12z M200 32 q6 -6 0 -12 q-6 6 0 12z" fill={color} />
    </Box>
  );
}

/** A curling corner ornament, rotated into each corner of a frame. */
function Corner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const rotate = { tl: 0, tr: 90, br: 180, bl: 270 }[position];
  const place = { tl: { top: -6, left: -6 }, tr: { top: -6, right: -6 }, br: { bottom: -6, right: -6 }, bl: { bottom: -6, left: -6 } }[position];
  return (
    <Box component="svg" viewBox="0 0 46 46" className="an-corner" aria-hidden sx={{ ...place, transform: `rotate(${rotate}deg)` }}>
      <path d="M4 42 V18 C4 8 10 4 20 4 H42 M10 36 C10 20 18 12 34 10 M14 24 c4 -2 6 -6 4 -10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="10" r="2.5" fill="currentColor" />
    </Box>
  );
}

export function ArtNouveauChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const { primary, secondary, text } = theme.palette;
  const gold = "#a8862f";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: SLIDER_CLEARANCE,
        color: text.primary,
        backgroundColor: theme.palette.background.default,
        backgroundImage: `radial-gradient(${alpha(secondary.main, 0.12)} 1.5px, transparent 1.5px)`,
        backgroundSize: "22px 22px",
        "--an-sage": secondary.main,
        "--an-plum-soft": alpha(primary.main, 0.35),
        "--an-gold": gold,
        "--an-paper": theme.palette.background.paper,
      }}
    >
      <Container maxWidth="md" component="header" sx={{ pt: { xs: 3, md: 5 }, textAlign: "center" }}>
        <Typography variant="overline" component="p" sx={{ color: primary.main, letterSpacing: "0.4em" }}>
          Anno Domini {roman(era.year)}
        </Typography>
        <Typography component="p" sx={{ fontFamily: theme.typography.h1.fontFamily, fontSize: { xs: "1.1rem", md: "1.4rem" }, color: secondary.dark, letterSpacing: "0.12em" }}>
          The Illustrated Century
        </Typography>
        <Whiplash color={gold} />
        <Box component="nav" aria-label="Sections" sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0.5 }}>
          {sections.map((s) => (
            <Button key={s.id} size="small" onClick={() => scrollToSection(s.id)} sx={{ color: primary.main }}>
              {s.title}
            </Button>
          ))}
        </Box>
      </Container>

      <Container maxWidth="md" component="main" id="main" tabIndex={-1} sx={{ outline: "none" }}>
        <Box sx={{ textAlign: "center", py: { xs: 3, md: 4 } }}>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.3rem", md: "3.8rem" }, color: primary.main, fontWeight: 700 }}>
            {era.title}
          </Typography>
          <Typography sx={{ fontStyle: "italic", fontSize: { xs: "1.15rem", md: "1.35rem" }, mt: 1.5, maxWidth: 620, mx: "auto" }}>{era.tagline}</Typography>
        </Box>

        {/* The 3D scene presented as an oval cabinet card. */}
        <Box component="figure" sx={{ m: 0, mb: { xs: 5, md: 7 } }}>
          <Box sx={{ mx: "auto", maxWidth: 560, p: "10px", borderRadius: "50%", border: `3px double ${gold}`, background: theme.palette.background.paper }}>
            <Box className="fx-cabinet" sx={{ borderRadius: "50%", overflow: "hidden", background: alpha(secondary.main, 0.15) }}>
              <EraScene showCaption={false} />
            </Box>
          </Box>
          <Typography component="figcaption" sx={{ textAlign: "center", fontStyle: "italic", mt: 1.5, color: "text.secondary" }}>
            {era.scene.caption}
          </Typography>
        </Box>

        {sections.map((s) => (
          <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} className="an-frame" sx={{ mb: { xs: 4, md: 6 } }}>
            {(["tl", "tr", "bl", "br"] as const).map((pos) => <Corner key={pos} position={pos} />)}
            <Typography variant="h2" id={headingDomId(s.id)} sx={{ textAlign: "center", color: primary.main, fontSize: { xs: "1.5rem", md: "2rem" }, outline: "none" }}>
              <Box component="span" aria-hidden sx={{ color: gold, mr: 1 }}>❦</Box>
              {s.title}
              <Box component="span" aria-hidden sx={{ color: gold, ml: 1, display: "inline-block", transform: "scaleX(-1)" }}>❦</Box>
            </Typography>
            <Whiplash color={alpha(gold, 0.7)} />
            {s.node}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
