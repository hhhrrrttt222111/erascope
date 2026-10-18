import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";

const BAND_COLORS = ["#0f6e6e", "#d9822b", "#e3b23c", "#0f6e6e", "#d9822b"];

export function MidCenturyChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const ink = theme.palette.text.primary;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: SLIDER_CLEARANCE,
        color: ink,
        backgroundColor: theme.palette.background.default,
        // Scattered atomic-age dots.
        backgroundImage: `radial-gradient(${theme.palette.primary.main}22 2px, transparent 2.5px), radial-gradient(${theme.palette.secondary.main}22 2px, transparent 2.5px)`,
        backgroundSize: "56px 56px, 56px 56px",
        backgroundPosition: "0 0, 28px 28px",
      }}
    >
      <Box component="header" sx={{ borderBottom: `3px solid ${ink}`, background: theme.palette.primary.main, color: "#fffaf0" }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <Box className="fx-starburst" sx={{ color: "#e3b23c", fontSize: 28 }} aria-hidden />
            Erascope Television
          </Box>
          <Box component="nav" aria-label="Sections" sx={{ display: "flex", flexWrap: "wrap", justifyContent: { xs: "flex-start", md: "center" }, gap: 0.5, flexBasis: "100%" }}>
            {sections.map((s) => (
              <Button key={s.id} size="small" onClick={() => scrollToSection(s.id)} sx={{ color: "#fffaf0", fontWeight: 600, whiteSpace: "nowrap", lineHeight: 1.4, px: 1.25 }}>
                {s.title}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" component="main" id="main" tabIndex={-1} sx={{ outline: "none" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 3, md: 6 }, alignItems: "center", py: { xs: 4, md: 7 } }}>
          <Box>
            <Typography variant="overline" component="p" sx={{ color: theme.palette.secondary.dark }}>
              Now showing · Channel {era.year}
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4rem" }, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", my: 1 }}>
              {era.title}
            </Typography>
            <Typography sx={{ fontSize: "1.2rem", mb: 3 }}>{era.tagline}</Typography>
            <Button variant="contained" size="large" onClick={() => scrollToSection("morning")}>
              Tune in
            </Button>
          </Box>

          {/* The 3D scene sits inside a wooden TV cabinet frame. */}
          <Box sx={{ background: "#6a4126", borderRadius: "28px", p: { xs: 1.5, md: 2 }, border: `3px solid ${ink}`, boxShadow: `10px 10px 0 ${theme.palette.secondary.main}` }}>
            <Box className="fx-scanlines fx-tube" sx={{ background: "radial-gradient(circle at 50% 40%, #fffaf0, #e8dcc0)" }}>
              <EraScene showCaption={false} />
            </Box>
            <Typography variant="caption" component="p" sx={{ color: "#f3e9d2", mt: 1, textAlign: "center" }}>
              {era.scene.caption}
            </Typography>
          </Box>
        </Box>

        {sections.map((s, i) => (
          <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} sx={{ mb: { xs: 5, md: 7 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                aria-hidden
                sx={{ width: 52, height: 52, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0, background: BAND_COLORS[i % BAND_COLORS.length], color: i % 3 === 0 ? "#fffaf0" : ink, border: `2px solid ${ink}` }}
              >
                <s.Icon />
              </Box>
              <Typography variant="h2" id={headingDomId(s.id)} sx={{ textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 800, outline: "none" }}>
                {s.title}
              </Typography>
              <Box aria-hidden sx={{ flex: 1, height: 6, borderRadius: 3, background: BAND_COLORS[i % BAND_COLORS.length], display: { xs: "none", sm: "block" } }} />
            </Box>
            {s.node}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
