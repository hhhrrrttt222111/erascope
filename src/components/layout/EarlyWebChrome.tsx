import { Box, Typography, useTheme } from "@mui/material";
import { ERA_YEARS, eraIndex, eraByYear } from "../../data";
import { useEraContext, useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";
import "../../styles/era-css/earlyweb.css";

export function EarlyWebChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const { setYear } = useEraContext();
  const theme = useTheme();
  const accent = theme.era.accentFont;
  const i = eraIndex(era.year);
  const prev = ERA_YEARS[i - 1];
  const next = ERA_YEARS[i + 1];
  const headlines = era.places.find((p) => p.id === "newspaper")?.highlights ?? [];

  return (
    <Box className="ew-tiled" sx={{ minHeight: "100vh", pt: { xs: 1, md: 3 }, pb: SLIDER_CLEARANCE, color: "#000" }}>
      <Box
        component="main"
        id="main"
        tabIndex={-1}
        sx={{ outline: "none", maxWidth: 820, mx: "auto", background: theme.palette.background.paper, border: "3px ridge #ffffff", p: { xs: 1.5, md: 3 } }}
      >
        <Box className="ew-construction" sx={{ mb: 2 }}>
          <span style={{ fontFamily: accent }}>🚧 This page is UNDER CONSTRUCTION! Check back soon! 🚧</span>
        </Box>

        <Typography component="p" sx={{ textAlign: "center", fontSize: "1.1rem" }}>
          Welcome to my
        </Typography>
        <Typography variant="h1" sx={{ textAlign: "center", fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, color: "#800000", my: 1 }}>
          {era.title}
        </Typography>
        <Typography component="p" sx={{ textAlign: "center", fontStyle: "italic", mb: 2 }}>
          {era.tagline}
        </Typography>

        <Box className="ew-marquee" role="marquee" aria-label="News ticker" sx={{ py: 0.5, mb: 2, fontFamily: accent, fontWeight: 700 }}>
          <span>{headlines.length ? `*** ${headlines.join(" *** ")} ***` : era.tagline}</span>
        </Box>

        <Box component="nav" aria-label="Sections" sx={{ textAlign: "center", mb: 2, lineHeight: 2 }}>
          [{" "}
          {sections.map((s, idx) => (
            <span key={s.id}>
              <button type="button" className="ew-link" onClick={() => scrollToSection(s.id)}>
                {s.title}
              </button>
              {idx < sections.length - 1 ? " | " : ""}
            </span>
          ))}{" "}
          ]
        </Box>

        <Box component="table" sx={{ width: "100%", borderCollapse: "separate", borderSpacing: 4, border: "2px outset #ffffff", mb: 1 }}>
          <tbody>
            <tr>
              <Box component="td" sx={{ border: "2px inset #ffffff", p: 1, verticalAlign: "top", width: { md: "60%" }, display: { xs: "block", md: "table-cell" } }}>
                <EraScene showCaption={false} height={240} />
              </Box>
              <Box component="td" sx={{ border: "2px inset #ffffff", p: 1.5, verticalAlign: "top", display: { xs: "block", md: "table-cell" } }}>
                <Typography sx={{ fontWeight: 700 }}>
                  <Box component="span" sx={{ fontFamily: accent, color: "#ff0000", mr: 0.5 }}>NEW!</Box>
                  {era.scene.caption}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Click and drag to spin it around. (Requires a fast computer!)
                </Typography>
                <Typography variant="body2" sx={{ mt: 1.5 }}>
                  Best viewed at 640×480 with images turned on.
                </Typography>
              </Box>
            </tr>
          </tbody>
        </Box>

        {sections.map((s) => (
          <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)}>
            <hr className="ew-hr" />
            <Typography variant="h2" id={headingDomId(s.id)} sx={{ fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 700, color: "#000080", mb: 2, outline: "none" }}>
              {s.title}
            </Typography>
            {s.node}
          </Box>
        ))}

        <hr className="ew-hr" />
        <Box component="footer" sx={{ textAlign: "center", display: "grid", gap: 1.5 }}>
          <Typography variant="body2">
            You are visitor number{" "}
            <span className="ew-counter" aria-label="a decorative visitor counter">
              {"0001995".split("").map((d, k) => (
                <span key={k}>{d}</span>
              ))}
            </span>
          </Typography>
          <Typography variant="body2">
            <span style={{ fontFamily: accent }}>Sign my guestbook!</span> (Guestbook is closed for maintenance.)
          </Typography>
          <Box component="nav" aria-label="Time Travel Webring" sx={{ border: "2px outset #ffffff", p: 1, background: "#d4d0c8" }}>
            {prev ? (
              <button type="button" className="ew-link" onClick={() => setYear(prev)}>
                « Prev: {prev} {eraByYear[prev].title}
              </button>
            ) : (
              <span>« Prev</span>
            )}
            {" | "}
            <b>Time Travel Webring</b>
            {" | "}
            {next ? (
              <button type="button" className="ew-link" onClick={() => setYear(next)}>
                Next: {next} {eraByYear[next].title} »
              </button>
            ) : (
              <span>Next »</span>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
