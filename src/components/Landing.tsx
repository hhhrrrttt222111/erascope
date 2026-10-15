import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { eras, type Era } from "../data";
import type { ChromeId } from "../data/types";
import { useEraContext } from "../context/EraContext";
import { selectableCountries } from "../data/countries/registry";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { eraThemes, BEVEL_OUT } from "../theme/eraThemes";
import { loadPreviewFonts } from "../theme/fontLoader";
import { SpeculativeBadge } from "./common/SpeculativeBadge";

/** Each card previews its era's chrome: surface, border and one signature detail. */
function tileStyle(chrome: ChromeId, era: Era): CSSProperties {
  const { primary, secondary, background, paper, text } = era.theme.palette;
  const styles: Record<ChromeId, CSSProperties> = {
    artnouveau: { background: paper, color: text, border: `3px double ${secondary}`, borderRadius: 18, boxShadow: `inset 0 0 0 6px ${paper}, inset 0 0 0 7px ${primary}55` },
    newspaper: { background: paper, color: text, border: `3px double ${text}`, borderRadius: 0 },
    artdeco: { background: `repeating-conic-gradient(from 0deg at 50% 110%, ${background} 0 6deg, #1c170d 6deg 12deg)`, color: text, border: `1px solid ${primary}`, borderRadius: 0, boxShadow: `inset 0 0 0 4px ${background}, inset 0 0 0 5px ${primary}88` },
    homefront: { background: paper, color: text, border: `2px dashed ${text}88`, borderRadius: 2 },
    midcentury: { background: paper, color: text, border: `2px solid ${text}`, borderRadius: 22, boxShadow: `6px 6px 0 ${secondary}` },
    groovy: { background: `linear-gradient(180deg, ${primary} 0 12%, ${secondary} 12% 22%, ${background} 22%)`, color: text, border: `2px solid ${text}`, borderRadius: 32 },
    terminal: { background, color: primary, border: `1px solid ${primary}`, borderRadius: 0, boxShadow: `0 0 18px ${primary}44, inset 0 0 24px ${primary}22` },
    earlyweb: { background: "#c0c0c0", color: "#000", border: "3px ridge #ffffff", borderRadius: 0 },
    win98: { background, color: "#fff", borderRadius: 0, boxShadow: BEVEL_OUT },
    web2gloss: { background: `linear-gradient(180deg, #ffffff 0%, ${background} 100%)`, color: text, border: "1px solid #b8d9ee", borderRadius: 14, boxShadow: "0 3px 10px rgba(30,80,120,0.18)" },
    flatweb: { background: paper, color: text, borderRadius: 6, borderTop: `14px solid ${primary}` },
    videocall: { background: paper, color: text, border: `2px solid ${primary}`, borderRadius: 14 },
    futureos: { background: `linear-gradient(160deg, ${paper}, ${background})`, color: text, borderRadius: 24, border: `1px solid ${primary}`, boxShadow: `0 0 28px ${primary}55, inset 0 0 30px ${secondary}22` },
  };
  return styles[chrome];
}

/** A tiny chrome detail in the card corner. */
function Detail({ era }: { era: Era }): ReactNode {
  const { primary, secondary } = era.theme.palette;
  const box = { position: "absolute", top: 12, right: 12, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" } as const;
  switch (era.theme.chrome) {
    case "terminal":
      return <span aria-hidden style={{ ...box, fontFamily: "monospace" }}>READY_</span>;
    case "earlyweb":
      return <span aria-hidden style={{ ...box, color: "#0000ee", textDecoration: "underline" }}>NEW!</span>;
    case "web2gloss":
      return <span aria-hidden style={{ ...box, background: "#ff8a00", color: "#fff", padding: "3px 6px", borderRadius: 999, transform: "rotate(12deg)" }}>BETA</span>;
    case "videocall":
      return <span aria-hidden style={{ ...box, display: "flex", gap: 4 }}>{[0, 1, 2, 3].map((i) => <span key={i} style={{ width: 9, height: 7, borderRadius: 2, background: i === 0 ? primary : "#4a4a55" }} />)}</span>;
    case "win98":
      return <span aria-hidden style={{ ...box, background: "linear-gradient(90deg,#000080,#1084d0)", width: 46, height: 10 }} />;
    case "artdeco":
      return <span aria-hidden style={{ ...box, color: primary }}>✦ ✦ ✦</span>;
    case "homefront":
      return <span aria-hidden style={{ ...box, color: secondary, border: `2px solid ${secondary}`, padding: "1px 5px", transform: "rotate(-6deg)" }}>ISSUED</span>;
    default:
      return null;
  }
}

export function Landing() {
  const { setYear, country, setCountry, eraFor, countryLoading } = useEraContext();
  const choices = selectableCountries();
  const reduced = useReducedMotion();

  useEffect(() => loadPreviewFonts(eras, "SPECULATIVE"), []);

  return (
    <Box component="main" id="main" tabIndex={-1} sx={{ minHeight: "100vh", background: "#100f14", color: "#f5f2ea", outline: "none", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography variant="overline" component="p" sx={{ color: "#c9b48a", letterSpacing: "0.3em", fontFamily: "Georgia, serif" }}>
          Erascope
        </Typography>
        <Typography component="h1" sx={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: { xs: "2.4rem", md: "4rem" }, lineHeight: 1.05, mb: 2 }}>
          Choose your year
        </Typography>
        <Typography sx={{ maxWidth: 680, fontSize: { xs: "1rem", md: "1.15rem" }, color: "#d8d3c6", mb: { xs: 4, md: 5 }, fontFamily: "Georgia, serif" }}>
          Thirteen stops from 1900 to 2050. Step into a morning in another era: what woke you up, the news, what things cost,
          the gadgets on the shelf and what people thought the future would bring. Once inside, drag the timeline to watch the
          whole interface travel through time.
        </Typography>

        {choices.length > 1 && (
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography id="country-step" component="h2" sx={{ fontFamily: "Georgia, serif", fontSize: { xs: "1.25rem", md: "1.5rem" }, mb: 1.5 }}>
              Choose your country
            </Typography>
            <Box role="radiogroup" aria-labelledby="country-step" aria-busy={countryLoading} sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, maxWidth: 720 }}>
              {choices.map((c) => {
                const selected = c.id === country;
                return (
                  <Box
                    key={c.id}
                    component="button"
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setCountry(c.id)}
                    sx={{
                      textAlign: "left",
                      p: 2,
                      cursor: "pointer",
                      font: "inherit",
                      fontFamily: "Georgia, serif",
                      color: "#f5f2ea",
                      background: selected ? "#2a2619" : "transparent",
                      border: `2px solid ${selected ? "#c9b48a" : "#5c5646"}`,
                      borderRadius: 2,
                      "&:focus-visible": { outline: "3px solid #fff", outlineOffset: 2 },
                    }}
                  >
                    <Box component="span" sx={{ display: "block", fontSize: "1.2rem", fontWeight: 700 }}>
                      {c.selectorLabel}
                      {c.nativeNames?.map((n) => (
                        <Box key={n.lang} component="span" lang={n.lang} sx={{ ml: 1, fontWeight: 400, opacity: 0.85 }}>
                          {n.text}
                        </Box>
                      ))}
                    </Box>
                    <Box component="span" sx={{ display: "block", fontSize: "0.9rem", color: "#d8d3c6", mt: 0.5 }}>
                      {c.id === "world" ? "The original tour: everyday life as lived in the United States." : "Everyday life in India across the same thirteen years. Content is still being researched."}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",
            gap: { xs: 1.5, md: 2 },
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" },
          }}
        >
          {eras.map((era, i) => {
            const theme = eraThemes[era.year];
            return (
              <motion.li
                key={era.year}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.button
                  type="button"
                  onClick={() => setYear(era.year)}
                  whileHover={reduced ? undefined : { y: -5 }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                  aria-label={`${era.year}: ${eraFor(era.year).title}${era.speculative ? " (speculative)" : ""}`}
                  style={{
                    ...tileStyle(era.theme.chrome, era),
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    minHeight: 168,
                    padding: "18px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    gap: 6,
                    textAlign: "left",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  <Detail era={era} />
                  <span style={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 700, fontSize: "clamp(30px, 6vw, 40px)", lineHeight: 1 }}>{era.year}</span>
                  <span style={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{eraFor(era.year).title}</span>
                  {era.speculative && <SpeculativeBadge />}
                </motion.button>
              </motion.li>
            );
          })}
        </Box>

        <Typography variant="caption" component="p" sx={{ color: "#a8a294", mt: { xs: 4, md: 5 }, maxWidth: 720, fontFamily: "Georgia, serif" }}>
          {country === "world"
            ? "Historical eras describe everyday life in the United States. "
            : "Everyday life in India, year by year. Much of this content is still being researched. "}
          Facts carry their sources; anything still being checked is marked “Unverified”. Everything in 2050 is speculative.
        </Typography>
      </Container>
    </Box>
  );
}
