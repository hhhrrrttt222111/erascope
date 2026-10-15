import { Box, Container, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";
import "../../styles/era-css/terminal.css";

const programName = (title: string) => title.toUpperCase().replace(/\s+/g, "_");

export function TerminalChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const green = theme.palette.primary.main;

  // Keyboard-first menu: press 1–6 to RUN a program (ignored while typing or with modifier keys).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const target = e.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true'], [role='slider'], [role='tab']")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= sections.length) {
        e.preventDefault();
        scrollToSection(sections[n - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sections]);

  return (
    <Box className="tm-terminal" sx={{ minHeight: "100vh", pb: SLIDER_CLEARANCE, background: "#000", color: "text.primary", position: "relative" }}>
      <Container maxWidth="md" component="main" id="main" tabIndex={-1} sx={{ outline: "none", pt: { xs: 3, md: 5 } }}>
        <Box component="header" sx={{ fontFamily: theme.typography.h1.fontFamily, fontSize: { xs: "1.15rem", md: "1.35rem" }, lineHeight: 1.35, mb: 3 }}>
          <div>**** ERASCOPE BASIC V{era.year} ****</div>
          <div>64K RAM SYSTEM · DISK DRIVE READY</div>
          <Box sx={{ mt: 1.5 }}>READY.</Box>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.2rem", md: "3.4rem" }, fontWeight: 400, color: green, mt: 1.5, lineHeight: 1.05 }}>
            LOAD &quot;{era.title.toUpperCase()}&quot;
          </Typography>
          <Typography component="p" sx={{ fontFamily: "inherit", fontSize: "inherit", mt: 1 }}>
            {era.tagline}
          </Typography>
        </Box>

        <Box sx={{ border: `1px solid ${green}`, p: 1, mb: 4 }}>
          <Box sx={{ fontFamily: theme.typography.h1.fontFamily, fontSize: "1.1rem", borderBottom: `1px dashed ${green}`, pb: 0.5, mb: 1 }}>
            ┌─ DRIVE A: ─ {era.scene.caption.toUpperCase()}
          </Box>
          <Box className="fx-phosphor">
            <EraScene showCaption={false} height={260} />
          </Box>
        </Box>

        <Box component="nav" aria-label="Programs" sx={{ mb: 5 }}>
          <Typography component="p" sx={{ fontFamily: theme.typography.h1.fontFamily, fontSize: "1.25rem", mb: 1 }}>
            MAIN MENU: PRESS A NUMBER, OR SELECT
          </Typography>
          <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 0.5 }}>
            {sections.map((s, i) => (
              <li key={s.id}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  aria-keyshortcuts={String(i + 1)}
                  sx={{
                    all: "unset",
                    cursor: "pointer",
                    fontFamily: theme.typography.h1.fontFamily,
                    fontSize: "1.3rem",
                    px: 1,
                    color: green,
                    "&:hover, &:focus-visible": { background: green, color: "#000" },
                  }}
                >
                  [{i + 1}] RUN {programName(s.title)}
                </Box>
              </li>
            ))}
          </Box>
        </Box>

        {sections.map((s) => (
          <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} sx={{ mb: { xs: 5, md: 7 } }}>
            <Typography variant="h2" id={headingDomId(s.id)} className="tm-cursor" sx={{ fontWeight: 400, fontSize: { xs: "1.6rem", md: "2rem" }, color: green, mb: 2, outline: "none" }}>
              &gt; RUN {programName(s.title)}
            </Typography>
            {s.node}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
