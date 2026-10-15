import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";
import "../../styles/era-css/groovy.css";

const BROWN = "#5a3418";

export function GroovyChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const orange = theme.palette.primary.main;
  const avocado = theme.palette.secondary.main;
  const gold = theme.palette.background.default;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: SLIDER_CLEARANCE,
        color: "text.primary",
        background: gold,
        position: "relative",
        overflow: "hidden",
        "--gv-orange": orange,
        "--gv-gold": "#f2c75c",
        "--gv-avocado": avocado,
        "--gv-brown": BROWN,
      }}
    >
      {/* Lava-lamp blobs drifting behind everything. */}
      <Box aria-hidden className="gv-blob" sx={{ width: 320, height: 320, left: "-6vw", top: "30vh", background: orange }} />
      <Box aria-hidden className="gv-blob" sx={{ width: 260, height: 260, right: "-4vw", top: "65vh", background: avocado, animationDelay: "-6s" }} />

      <Box component="header" className="gv-stripes" sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Typography variant="overline" component="p" sx={{ color: BROWN, fontSize: "0.85rem" }}>
            Far out · {era.year}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4.8rem" }, fontWeight: 400, color: BROWN, textShadow: `4px 4px 0 ${orange}`, maxWidth: { md: "65%" }, my: 1 }}>
            {era.title}
          </Typography>
          <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, fontWeight: 700, maxWidth: { md: "55%" } }}>{era.tagline}</Typography>
          <Box component="nav" aria-label="Sections" sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3, maxWidth: { md: "70%" } }}>
            {sections.map((s) => (
              <Button key={s.id} variant="contained" size="small" onClick={() => scrollToSection(s.id)}>
                {s.title}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" component="main" id="main" tabIndex={-1} sx={{ outline: "none", position: "relative" }}>
        <Box sx={{ borderRadius: "40px", p: { xs: 1.5, md: 2.5 }, mb: { xs: 5, md: 7 }, background: theme.palette.background.paper, border: `3px solid ${BROWN}`, boxShadow: `0 10px 0 ${avocado}` }}>
          <EraScene />
        </Box>

        {sections.map((s) => (
          <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} sx={{ mb: { xs: 5, md: 7 } }}>
            <Box className="gv-wood" sx={{ display: "inline-flex", alignItems: "center", gap: 1.5, px: 3, py: 1, mb: 2.5 }}>
              <s.Icon aria-hidden />
              <Typography variant="h2" id={headingDomId(s.id)} sx={{ fontSize: { xs: "1.4rem", md: "1.9rem" }, fontWeight: 400, color: "inherit", outline: "none" }}>
                {s.title}
              </Typography>
            </Box>
            {s.node}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
