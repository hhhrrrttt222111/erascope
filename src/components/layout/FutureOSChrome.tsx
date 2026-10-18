import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useShellEra } from "../../context/EraContext";
import { SpeculativeBadge } from "../common/SpeculativeBadge";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";

function HudClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);
  return <>{now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</>;
}

export function FutureOSChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const { primary, secondary } = theme.palette;

  return (
    <Box className="fx-aurora" sx={{ minHeight: "100vh", color: "text.primary", pb: SLIDER_CLEARANCE, position: "relative" }}>
      <Box className="fx-hud-grid" aria-hidden sx={{ position: "fixed", inset: 0, pointerEvents: "none", maskImage: "radial-gradient(circle at 50% 30%, #000, transparent 75%)" }} />

      {/* HUD bar. The SPECULATIVE badge stays visible for the whole era. */}
      <Box component="header" className="fx-glass" sx={{ position: "sticky", top: 0, zIndex: 20, borderWidth: "0 0 1px 0" }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", gap: 2, minHeight: 56, flexWrap: "wrap", py: 1 }}>
          <Typography component="p" sx={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 900, letterSpacing: "0.2em", fontSize: 14 }}>
            CHRONO<Box component="span" sx={{ color: primary.main }}>//</Box>OS
          </Typography>
          <SpeculativeBadge size="large" />
          <Box component="nav" aria-label="Sections" sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, order: 3, flexBasis: "100%" }}>
            {sections.map((s, i) => (
              <Button key={s.id} size="small" onClick={() => scrollToSection(s.id)} sx={{ color: "text.secondary", fontSize: "0.65rem", whiteSpace: "nowrap", lineHeight: 1.4 }}>
                {String(i + 1).padStart(2, "0")} {s.title}
              </Button>
            ))}
          </Box>
          <Typography component="p" sx={{ fontFamily: theme.typography.h1.fontFamily, fontSize: 12, color: primary.main, ml: { xs: "auto", md: 0 } }}>
            {era.year} · <HudClock />
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" component="main" id="main" tabIndex={-1} sx={{ outline: "none", position: "relative" }}>
        <Box
          className="fx-glass fx-glow-border"
          sx={{ mt: { xs: 3, md: 5 }, mb: { xs: 4, md: 6 }, borderRadius: "28px", p: { xs: 2.5, md: 4 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" }, gap: 3, alignItems: "center" }}
        >
          <Box>
            <Typography variant="overline" component="p" sx={{ color: secondary.main }}>
              Simulation · not a forecast
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.2rem", md: "3.6rem" },
                my: 1,
                background: `linear-gradient(90deg, ${primary.main}, ${secondary.main})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {era.year}: {era.title}
            </Typography>
            <Typography sx={{ fontSize: "1.1rem", mb: 2 }}>{era.tagline}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", borderLeft: `2px solid ${secondary.main}`, pl: 1.5 }}>
              Everything in this era is imagined. It extrapolates from trends visible today and is labelled speculative throughout.
            </Typography>
          </Box>
          <EraScene />
        </Box>

        {sections.map((s, i) => (
          <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} sx={{ mb: { xs: 5, md: 7 } }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 2.5, flexWrap: "wrap" }}>
              <Typography aria-hidden sx={{ fontFamily: theme.typography.h1.fontFamily, color: primary.main, fontSize: 14, letterSpacing: "0.2em", textShadow: `0 0 10px ${primary.main}` }}>
                {String(i + 1).padStart(2, "0")} //
              </Typography>
              <Typography variant="h2" id={headingDomId(s.id)} sx={{ textTransform: "uppercase", letterSpacing: "0.12em", fontSize: { xs: "1.3rem", md: "1.7rem" }, outline: "none" }}>
                {s.title}
              </Typography>
              <SpeculativeBadge />
            </Box>
            {s.node}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
