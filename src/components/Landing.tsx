import { Box, Container, Typography } from "@mui/material";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Component, lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { eras, type Era } from "../data";
import type { ChromeId } from "../data/types";
import { useEraContext } from "../context/EraContext";
import { selectableCountries } from "../data/countries/registry";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { eraThemes, BEVEL_OUT } from "../theme/eraThemes";
import { loadPreviewFonts } from "../theme/fontLoader";
import { Cursor } from "./landing/Cursor";
import { SpeculativeBadge } from "./common/SpeculativeBadge";

const TimeScene = lazy(() => import("./landing/TimeScene"));

/** Swallows WebGL/context failures so the page still works without the 3D backdrop. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const TITLE = "Choose your year";

/** Hover polish for era tiles: a mouse-following spotlight and a light sweep. */
const TILE_CSS = `
.era-tile .spot,.era-tile .sweep{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .25s}
.era-tile .spot{background:radial-gradient(circle 120px at var(--mx,50%) var(--my,50%),rgba(255,255,255,.35),transparent 70%);mix-blend-mode:overlay}
.era-tile .sweep{background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.35) 50%,transparent 65%);transform:translateX(-120%)}
.era-tile:hover .spot,.era-tile:focus-visible .spot{opacity:1}
.era-tile:hover .sweep{opacity:1;transform:translateX(120%);transition:transform .7s ease,opacity .2s}
.era-tile{transition:box-shadow .3s,filter .3s}
.era-tile:hover,.era-tile:focus-visible{filter:saturate(1.2) brightness(1.06);box-shadow:0 18px 40px rgba(0,0,0,.55),0 0 0 2px #c9b48a}
`;

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

  // Route transition: an iris in the era's colour opens from the clicked tile, then we switch year.
  const [leaving, setLeaving] = useState<{ x: number; y: number; bg: string; fg: string; year: number } | null>(null);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const enter = (era: Era, e: React.MouseEvent) => {
    if (reduced) return setYear(era.year);
    if (leaving) return;
    const { background, primary } = era.theme.palette;
    setLeaving({ x: e.clientX, y: e.clientY, bg: background, fg: primary, year: era.year });
    timer.current = window.setTimeout(() => setYear(era.year), 750);
  };

  const { scrollY } = useScroll();
  const sceneY = useSpring(useTransform(scrollY, [0, 1200], [0, -180]), { stiffness: 80, damping: 20 });
  const ribbon = [...eras, ...eras];

  return (
    <Box component={motion.main} initial={reduced ? false : { opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.6 }} id="main" tabIndex={-1} sx={{ position: "relative", minHeight: "100vh", background: "radial-gradient(ellipse at 70% 10%, #241f33 0%, #100f14 60%)", color: "#f5f2ea", outline: "none", overflow: "hidden", pt: { xs: 5, md: 8 } }}>
      {!reduced && <Cursor />}
      {leaving && (
        <motion.div
          aria-hidden
          initial={{ clipPath: `circle(0px at ${leaving.x}px ${leaving.y}px)` }}
          animate={{ clipPath: `circle(150vmax at ${leaving.x}px ${leaving.y}px)` }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: leaving.bg, display: "grid", placeItems: "center", pointerEvents: "all" }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.6, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, scale: 1, letterSpacing: "0.08em" }}
            transition={{ delay: 0.25, duration: 0.45 }}
            style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(64px, 18vw, 200px)", color: leaving.fg }}
          >
            {leaving.year}
          </motion.span>
        </motion.div>
      )}
      <style>{TILE_CSS}</style>
      {!reduced && (
        <motion.div aria-hidden style={{ position: "absolute", inset: 0, y: sceneY, pointerEvents: "none", height: "130%" }}>
          <SceneBoundary>
            <Suspense fallback={null}>
              <TimeScene />
            </Suspense>
          </SceneBoundary>
        </motion.div>
      )}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="overline" component="p" sx={{ color: "#c9b48a", letterSpacing: "0.3em", fontFamily: "Georgia, serif" }}>
          Erascope
        </Typography>
        <Typography component="h1" aria-label={TITLE} sx={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: { xs: "2.8rem", md: "5rem" }, lineHeight: 1.05, mb: 2 }}>
          {TITLE.split(" ").map((word, w) => (
            <Box key={w} component="span" aria-hidden sx={{ display: "inline-block", mr: "0.3em", whiteSpace: "nowrap" }}>
              {[...word].map((ch, c) => (
                <motion.span
                  key={c}
                  style={{ display: "inline-block" }}
                  initial={reduced ? false : { opacity: 0, y: 40, rotateX: -90 }}
                  animate={reduced ? undefined : { opacity: 1, y: [0, -6, 0], rotateX: 0 }}
                  transition={{
                    opacity: { delay: 0.05 * (w * 6 + c), duration: 0.5 },
                    rotateX: { delay: 0.05 * (w * 6 + c), duration: 0.6 },
                    y: { delay: 0.05 * (w * 6 + c), duration: 3 + (c % 3) * 0.6, repeat: Infinity, ease: "easeInOut" },
                  }}
                  whileHover={reduced ? undefined : { y: -14, color: "#c9b48a", scale: 1.15 }}
                >
                  {ch}
                </motion.span>
              ))}
            </Box>
          ))}
        </Typography>
        <Typography sx={{ maxWidth: 680, fontSize: { xs: "1rem", md: "1.15rem" }, color: "#d8d3c6", mb: { xs: 4, md: 5 }, fontFamily: "Georgia, serif" }}>
          Thirteen stops from 1900 to 2050. Step into a morning in another era: what woke you up, the news, what things cost,
          the gadgets on the shelf and what people thought the future would bring. Once inside, drag the timeline to watch the
          whole interface travel through time.
        </Typography>

        {!reduced && (
          <div aria-hidden style={{ overflow: "hidden", marginBottom: 40, borderTop: "1px solid #3a3526", borderBottom: "1px solid #3a3526", padding: "8px 0", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
            <motion.div
              style={{ display: "flex", gap: 40, width: "max-content", fontFamily: "Georgia, serif", fontSize: 22, letterSpacing: "0.2em", color: "#c9b48a" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {ribbon.map((e, i) => (
                <span key={i}>{e.year} ✦</span>
              ))}
            </motion.div>
          </div>
        )}

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
                      transition: "transform .2s, box-shadow .2s, border-color .2s, background .2s",
                      "&:hover": { transform: "translateY(-4px)", borderColor: "#c9b48a", boxShadow: "0 10px 24px rgba(0,0,0,.45), 0 0 0 1px #c9b48a55", background: "#211e16" },
                      "&:active": { transform: "scale(0.97)", boxShadow: "inset 0 0 18px rgba(201,180,138,.35)" },
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
            perspective: 1200,
            pb: 4,
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" },
          }}
        >
          {eras.map((era, i) => {
            const theme = eraThemes[era.year];
            return (
              <motion.li
                key={era.year}
                initial={reduced ? false : { opacity: 0, y: 60, rotateX: -35, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.05 * (i % 5), duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: (i % 3) * 14, zIndex: 0 }}
              >
                <motion.button
                  type="button"
                  className="era-tile"
                  onClick={(e) => enter(era, e)}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                  animate={reduced ? undefined : { y: [0, i % 2 ? -8 : 8, 0], rotate: [0, i % 2 ? 0.8 : -0.8, 0] }}
                  transition={reduced ? undefined : { duration: 4 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                  whileHover={reduced ? undefined : { scale: 1.08, rotateY: i % 2 ? 8 : -8, rotate: 0, zIndex: 5 }}
                  whileTap={reduced ? undefined : { scale: 0.97 }}
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
                  <span className="spot" aria-hidden />
                  <span className="sweep" aria-hidden />
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

      <Box component="footer" sx={{ position: "relative", zIndex: 1, mt: { xs: 6, md: 8 }, py: 3, textAlign: "center", borderTop: "1px solid #3a3526", background: "rgba(16,15,20,0.7)", fontFamily: "Georgia, serif", color: "#d8d3c6" }}>
        Made with{" "}
        <motion.span
          role="img"
          aria-label="love"
          style={{ display: "inline-block", color: "#e0556b" }}
          animate={reduced ? undefined : { scale: [1, 1.3, 1, 1.25, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ♥
        </motion.span>{" "}
        by HRT
      </Box>
    </Box>
  );
}
