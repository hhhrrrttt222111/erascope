import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";
import "../../styles/era-css/homefront.css";

const STAMPS = ["Issued", "Received", "Approved", "Filed", "Checked", "Noted"];

export function HomefrontChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const navy = theme.palette.primary.main;
  const red = theme.palette.secondary.main;
  const ink = theme.palette.text.primary;
  const olive = "#5b5a2f";

  return (
    <Box
      className="hf-paper"
      sx={{
        minHeight: "100vh",
        pb: SLIDER_CLEARANCE,
        color: ink,
        "--hf-bg": theme.palette.background.default,
        "--hf-paper": theme.palette.background.paper,
        "--hf-ink-soft": alpha(ink, 0.5),
        "--hf-navy": navy,
        "--hf-red": red,
      }}
    >
      {/* Poster-style header: plain colour bands, no flags or insignia. */}
      <Box component="header" sx={{ borderBottom: `6px solid ${olive}` }}>
        <Box aria-hidden sx={{ height: 10, background: `linear-gradient(${red} 0 50%, ${navy} 50%)` }} />
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr" }, gap: 3, alignItems: "center" }}>
          <Box>
            <Typography variant="overline" component="p" sx={{ color: red, letterSpacing: "0.3em" }}>
              Home front edition · {era.year}
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.4rem", md: "4.2rem" }, color: navy, textTransform: "uppercase", lineHeight: 1, my: 1 }}>
              {era.title}
            </Typography>
            <Typography sx={{ fontSize: { xs: "1.05rem", md: "1.2rem" }, maxWidth: 560 }}>{era.tagline}</Typography>
            <Box sx={{ mt: 2 }}>
              <span className="hf-stamp" style={{ fontFamily: theme.typography.h1.fontFamily as string }}>Ration book no. 4</span>
            </Box>
          </Box>
          <Box className="hf-coupon" sx={{ p: "10px !important" }}>
            <Box className="fx-faded">
              <EraScene showCaption={false} height={260} />
            </Box>
            <Typography variant="caption" component="p" sx={{ textAlign: "center", mt: 1 }}>
              {era.scene.caption}
            </Typography>
          </Box>
        </Container>
        <Container maxWidth="lg" component="nav" aria-label="Sections" sx={{ display: "flex", flexWrap: "wrap", gap: 1, pb: 2 }}>
          {sections.map((s, i) => (
            <Button key={s.id} size="small" variant="outlined" onClick={() => scrollToSection(s.id)} sx={{ color: navy, borderColor: navy, borderStyle: "dashed" }}>
              Coupon {i + 1}: {s.title}
            </Button>
          ))}
        </Container>
      </Box>

      <Container maxWidth="lg" component="main" id="main" tabIndex={-1} sx={{ outline: "none", pt: { xs: 4, md: 6 } }}>
        {sections.map((s, i) => {
          const telegram = i % 2 === 1;
          const heading = (
            <Typography variant="h2" id={headingDomId(s.id)} sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, color: telegram ? "inherit" : navy, textTransform: "uppercase", outline: "none" }}>
              {s.title}
            </Typography>
          );
          return (
            <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} sx={{ mb: { xs: 5, md: 7 } }}>
              {telegram ? (
                <Box className="hf-telegram">
                  <Box className="hf-telegram-head" sx={{ fontFamily: theme.typography.h1.fontFamily, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    {heading}
                    <span aria-hidden>TELEGRAM · {era.year}</span>
                  </Box>
                  <Box sx={{ p: { xs: 2, md: 3 } }}>{s.node}</Box>
                </Box>
              ) : (
                <Box className="hf-coupon">
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 2, flexWrap: "wrap" }}>
                    {heading}
                    <span aria-hidden className="hf-stamp" style={{ fontFamily: theme.typography.h1.fontFamily as string }}>
                      {STAMPS[i % STAMPS.length]}
                    </span>
                  </Box>
                  {s.node}
                </Box>
              )}
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}
