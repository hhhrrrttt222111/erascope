import { Box, Button, Card, Container, Typography, useTheme } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";
import "../../styles/era-css/web2gloss.css";

/** A tag cloud built from the era's own data: technology names and categories. */
function TagCloud() {
  const era = useShellEra();
  const theme = useTheme();
  const tags = [...era.technology.map((t) => t.name), ...new Set(era.technology.map((t) => t.category))];
  return (
    <Box component="ul" aria-label="Tags" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", gap: "4px 10px", lineHeight: 1.3 }}>
      {tags.map((t, i) => (
        <li key={`${t}-${i}`}>
          <Box component="span" sx={{ fontSize: [16, 12, 20, 13, 15, 22, 12, 14][i % 8], fontWeight: i % 3 === 0 ? 700 : 400, color: i % 2 ? theme.palette.text.primary : "#1f5f8b" }}>
            {t}
          </Box>
        </li>
      ))}
    </Box>
  );
}

export function Web2GlossChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const lime = theme.palette.primary.main;
  const sky = theme.palette.secondary.main;

  return (
    <Box className="w2-sky" sx={{ minHeight: "100vh", pb: SLIDER_CLEARANCE, color: "text.primary" }}>
      <Box component="header" className="w2-gloss" sx={{ "--w2-base": sky, borderBottom: "1px solid #7fb8dc", boxShadow: "0 2px 10px rgba(30,80,120,0.2)" }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5, flexWrap: "wrap" }}>
          <Typography component="p" sx={{ fontFamily: theme.typography.h1.fontFamily, fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: "#0b2a3d", letterSpacing: "-0.03em", textShadow: "0 1px 0 rgba(255,255,255,0.7)" }}>
            time<Box component="span" sx={{ color: "#2f6b0a" }}>machine</Box>
          </Typography>
          <Box component="span" className="w2-starburst" aria-label="beta">
            BETA
          </Box>
          <Box component="nav" aria-label="Sections" sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, ml: { md: "auto" } }}>
            {sections.map((s) => (
              <Button key={s.id} size="small" variant="contained" onClick={() => scrollToSection(s.id)}>
                {s.title}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 260px" }, gap: 3, pt: { xs: 3, md: 4 } }}>
        <Box component="main" id="main" tabIndex={-1} sx={{ outline: "none", minWidth: 0 }}>
          <Box sx={{ borderRadius: "18px", p: { xs: 2.5, md: 4 }, mb: { xs: 7, md: 9 }, background: "linear-gradient(180deg, #ffffff, #e3f2fb)", border: "1px solid #b8d9ee", boxShadow: "0 6px 20px rgba(30,80,120,0.15)" }}>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.1rem", md: "3.2rem" }, fontWeight: 700, color: "#0b2a3d", letterSpacing: "-0.02em" }}>
              {era.title}
            </Typography>
            <Typography sx={{ fontSize: "1.15rem", mt: 1, mb: 2 }}>{era.tagline}</Typography>
            <Box className="w2-reflect" sx={{ borderRadius: "14px", background: "radial-gradient(circle at 50% 30%, #ffffff, #d6ecfa)", border: "1px solid #c9dfee" }}>
              <EraScene showCaption={false} />
            </Box>
          </Box>
          <Typography variant="caption" component="p" sx={{ mt: -6, mb: 4, color: "text.secondary" }}>
            {era.scene.caption}
          </Typography>

          {sections.map((s) => (
            <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} sx={{ mb: { xs: 4, md: 5 } }}>
              <Box className="w2-gloss" sx={{ "--w2-base": lime, color: "#0b2a3d", borderRadius: "12px 12px 0 0", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <s.Icon aria-hidden />
                <Typography variant="h2" id={headingDomId(s.id)} sx={{ fontSize: "1.25rem", color: "inherit", textShadow: "0 1px 0 rgba(255,255,255,0.6)", outline: "none" }}>
                  {s.title}
                </Typography>
              </Box>
              <Box sx={{ background: "rgba(255,255,255,0.75)", border: "1px solid #c9dfee", borderTop: 0, borderRadius: "0 0 12px 12px", p: { xs: 1.5, md: 2.5 } }}>{s.node}</Box>
            </Box>
          ))}
        </Box>

        <Box component="aside" aria-label="Sidebar" sx={{ display: "grid", gap: 2, alignContent: "start" }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h3" component="h2" sx={{ fontSize: "1rem", mb: 1 }}>
              Tags
            </Typography>
            <TagCloud />
          </Card>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span className="w2-rss" aria-hidden /> Subscribe via RSS feed
            </Typography>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
