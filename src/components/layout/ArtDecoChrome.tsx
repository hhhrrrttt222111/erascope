import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";
import "../../styles/era-css/artdeco.css";

export function ArtDecoChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const gold = theme.palette.primary.main;
  const ivory = theme.palette.text.primary;

  return (
    <Box sx={{ minHeight: "100vh", pb: SLIDER_CLEARANCE, color: ivory, background: theme.palette.background.default }}>
      <Box component="header" className="deco-sunburst" sx={{ textAlign: "center", pt: { xs: 5, md: 8 }, pb: { xs: 4, md: 6 }, borderBottom: `1px solid ${gold}` }}>
        <Typography variant="overline" component="p" sx={{ color: gold, letterSpacing: "0.5em" }}>
          ✦ The Grand Picture Palace ✦
        </Typography>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontSize: { xs: "2.4rem", md: "4.4rem" }, color: gold, fontWeight: 400, letterSpacing: "0.04em", my: 1.5, textShadow: "0 0 18px rgba(212,175,55,0.35)" }}>
            {era.title}
          </Typography>
          <Typography sx={{ fontStyle: "italic", fontSize: { xs: "1.05rem", md: "1.25rem" } }}>{era.tagline}</Typography>
          <Box className="deco-rule" aria-hidden sx={{ my: 3 }} />
          <Box component="nav" aria-label="Sections" sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
            {sections.map((s) => (
              <Button key={s.id} size="small" onClick={() => scrollToSection(s.id)} sx={{ color: gold, border: `1px solid ${gold}`, borderRadius: 0, px: 1.5 }}>
                {s.title}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" component="main" id="main" tabIndex={-1} sx={{ outline: "none", pt: { xs: 4, md: 6 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: { xs: 3, md: 5 }, alignItems: "center", mb: { xs: 5, md: 8 } }}>
          <Box className="deco-marquee">
            <Box className="deco-marquee-inner">
              <EraScene showCaption={false} />
            </Box>
          </Box>
          <Box>
            <Typography variant="overline" component="p" sx={{ color: gold }}>Now showing</Typography>
            <Typography sx={{ fontFamily: theme.typography.h1.fontFamily, fontSize: { xs: "1.6rem", md: "2.1rem" }, color: ivory, lineHeight: 1.2, my: 1 }}>
              {era.scene.caption}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Drag the reels to inspect the machine, or take your seat with the timeline below to travel on.
            </Typography>
          </Box>
        </Box>

        {sections.map((s) => (
          <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} sx={{ mb: { xs: 6, md: 8 } }}>
            <Box className="deco-ziggurat" sx={{ background: gold, color: theme.palette.background.default, textAlign: "center", pt: 2.5, pb: 1.25, px: 3, mx: "auto", maxWidth: 640, mb: 3 }}>
              <Typography variant="h2" id={headingDomId(s.id)} sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, fontWeight: 400, letterSpacing: "0.08em", color: "inherit", outline: "none" }}>
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
