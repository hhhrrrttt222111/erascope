import { Box, Container, Typography } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { Component, lazy, type ComponentType, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { eras, type Era } from "../data";
import type { ChromeId } from "../data/types";
import { useEraContext } from "../context/EraContext";
import { selectableCountries } from "../data/countries/registry";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { eraThemes, BEVEL_OUT } from "../theme/eraThemes";
import { loadPreviewFonts } from "../theme/fontLoader";
import { Cursor } from "./landing/Cursor";
import { Navbar } from "./landing/Navbar";
import { Parallax } from "./landing/Parallax";
import { SpeculativeBadge } from "./common/SpeculativeBadge";

/**
 * import.meta.glob keeps TypeScript from following the import: the scene is type-checked in
 * tsconfig.three.json because R3F's global JSX types make MUI's components too complex (TS2590).
 */
const sceneModules = import.meta.glob<{ default: ComponentType }>("./landing/TimeScene.tsx");
const TimeScene = lazy(sceneModules["./landing/TimeScene.tsx"]);

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


const GOLD = "#c9b48a";

/** Hover polish for era tiles: a mouse-following spotlight and a light sweep. */
const TILE_CSS = `
.landing-section{margin-bottom:32px}@media(min-width:900px){.landing-section{margin-bottom:40px}}
.era-tile .spot,.landing-nav-link{background:none;border:0;padding:6px 0;cursor:pointer;color:#cfc9ba;font:inherit;font-family:Georgia,serif;font-size:14px;letter-spacing:.12em;text-transform:uppercase;position:relative;transition:color .25s}
.landing-nav-link::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:#c9b48a;transform:scaleX(0);transform-origin:left;transition:transform .3s}
.landing-nav-link:hover,.landing-nav-link:focus-visible{color:#fff}
.landing-nav-link:hover::after,.landing-nav-link:focus-visible::after{transform:scaleX(1)}
@media(max-width:640px){.landing-nav-links{display:none!important}}
html{scroll-padding-top:72px}
.era-tile .spot{background:radial-gradient(circle 140px at var(--mx,50%) var(--my,50%),rgba(255,255,255,.22),transparent 70%);mix-blend-mode:overlay}
.era-tile:hover .spot,.era-tile:focus-visible .spot{opacity:1}
.era-tile{transition:box-shadow .3s,filter .3s}
.era-tile:hover,.era-tile:focus-visible{box-shadow:0 14px 32px rgba(0,0,0,.5)}
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
  const sceneY = useTransform(scrollY, [0, 800], [0, -120]);
  const sceneOpacity = useTransform(scrollY, [0, 700], [1, 0]);
  const heroY = useTransform(scrollY, [0, 600], [0, 90]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const numeralA = useTransform(scrollY, [0, 2500], [0, -500]);
  const numeralB = useTransform(scrollY, [0, 2500], [0, -160]);

  const reveal = reduced
    ? {}
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <Box component={motion.main} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} id="main" tabIndex={-1} sx={{ position: "relative", minHeight: "100vh", background: "radial-gradient(ellipse at 75% 0%, #1f1b2b 0%, #100f14 55%)", color: "#f5f2ea", outline: "none", overflow: "hidden", pt: { xs: 5, md: 8 } }}>
      <Navbar />
      {!reduced && <Cursor />}
      {!reduced && (
        <>
          <motion.div aria-hidden style={{ position: "absolute", top: 520, right: "-2%", y: numeralA, fontFamily: "Georgia, serif", fontSize: "clamp(180px, 28vw, 420px)", lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(201,180,138,0.14)", pointerEvents: "none", userSelect: "none" }}>
            1900
          </motion.div>
          <motion.div aria-hidden style={{ position: "absolute", top: 1500, left: "-3%", y: numeralB, fontFamily: "Georgia, serif", fontSize: "clamp(160px, 24vw, 360px)", lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(201,180,138,0.1)", pointerEvents: "none", userSelect: "none" }}>
            2050
          </motion.div>
        </>
      )}
      {leaving && (
        <motion.div
          aria-hidden
          initial={{ clipPath: `circle(0px at ${leaving.x}px ${leaving.y}px)` }}
          animate={{ clipPath: `circle(150vmax at ${leaving.x}px ${leaving.y}px)` }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: leaving.bg, display: "grid", placeItems: "center", pointerEvents: "all" }}
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={{ opacity: 1, letterSpacing: "0.08em" }}
            transition={{ delay: 0.25, duration: 0.45 }}
            style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(64px, 18vw, 200px)", color: leaving.fg }}
          >
            {leaving.year}
          </motion.span>
        </motion.div>
      )}
      <style>{TILE_CSS}</style>
      {!reduced && (
        <motion.div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100vh", y: sceneY, opacity: sceneOpacity, pointerEvents: "none" }}>
          <SceneBoundary>
            <Suspense fallback={null}>
              <TimeScene />
            </Suspense>
          </SceneBoundary>
        </motion.div>
      )}

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <Box component={motion.div} initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} style={reduced ? undefined : { translateY: heroY, opacity: heroOpacity }} sx={{ pt: { xs: 9, md: 12 }, pb: { xs: 6, md: 9 } }}>
          <Typography variant="overline" component="p" sx={{ color: GOLD, letterSpacing: "0.38em", fontFamily: "Georgia, serif", fontSize: "0.8rem" }}>
            Erascope &nbsp;·&nbsp; 1900 – 2050
          </Typography>
          <Box sx={{ width: 56, height: "1px", background: GOLD, my: 2.5 }} />
          <Typography component="h1" sx={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: { xs: "2.8rem", md: "5rem" }, lineHeight: 1.05, letterSpacing: "-0.01em", mb: 3 }}>
            Choose your <Box component="span" sx={{ fontStyle: "italic", color: GOLD }}>year</Box>
          </Typography>
          <Typography sx={{ maxWidth: 620, fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.7, color: "#cfc9ba", fontFamily: "Georgia, serif" }}>
            Step into an ordinary morning in another era, and watch the whole interface travel through time with you.
          </Typography>
        </Box>

        {choices.length > 1 && (
          <div className="landing-section">
            <Typography id="country-step" component="h2" sx={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: { xs: "1.25rem", md: "1.5rem" }, mb: 1.5 }}>
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
                      border: `1px solid ${selected ? GOLD : "#4a4536"}`,
                      borderRadius: 1,
                      transition: "border-color .25s, background .25s, transform .2s",
                      "&:hover": { borderColor: GOLD, background: "#1d1a14" },
                      "&:active": { transform: "scale(0.985)" },
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
                    <Box component="span" sx={{ display: "block", fontSize: "0.9rem", color: "#cfc9ba", mt: 0.5 }}>
                      {c.id === "world" ? "The original tour: everyday life as lived in the United States." : "Everyday life in India across the same thirteen years. Content is still being researched."}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </div>
        )}

        <Box id="years" /><Typography id="year-step" component="h2" sx={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: { xs: "1.25rem", md: "1.5rem" }, mb: 2 }}>
          Choose your year
        </Typography>
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
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: 0.04 * (i % 5), duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                  whileHover={reduced ? undefined : { y: -4 }}
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
                  <span className="spot" aria-hidden />
                  <Detail era={era} />
                  <span style={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 700, fontSize: "clamp(30px, 6vw, 40px)", lineHeight: 1 }}>{era.year}</span>
                  <span style={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{eraFor(era.year).title}</span>
                  {era.speculative && <SpeculativeBadge />}
                </motion.button>
              </motion.li>
            );
          })}
        </Box>

        {/* About */}
        <Box component={motion.section} {...reveal} id="about" aria-labelledby="about-h" sx={{ mt: { xs: 10, md: 16 }, display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, alignItems: "start" }}>
          <Parallax distance={30}>
            <Label>About</Label>
            <Typography id="about-h" component="h2" sx={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: { xs: "2rem", md: "2.8rem" }, lineHeight: 1.15 }}>
              An ordinary morning, <Box component="span" sx={{ fontStyle: "italic", color: GOLD }}>a century apart.</Box>
            </Typography>
          </Parallax>
          <Parallax distance={-20}>
            <Typography sx={{ fontFamily: "Georgia, serif", fontSize: "1.08rem", lineHeight: 1.8, color: "#cfc9ba", mb: 4 }}>
              Erascope is an interactive tour of everyday life from 1900 to 2050. Instead of dates and treaties, it shows what a
              normal day looked like: what woke you up, what was in the news, what things cost, which gadgets sat on the shelf, and
              what people thought the future would bring. The interface itself changes with the era, so you feel the time as well
              as read about it.
            </Typography>
            <Box sx={{ display: "flex", gap: { xs: 4, md: 6 }, borderTop: "1px solid #3a3526", pt: 3 }}>
              {[["13", "eras"], ["150", "years"], [String(choices.length), choices.length === 1 ? "country" : "countries"]].map(([n, l]) => (
                <Box key={l}>
                  <Typography sx={{ fontFamily: "Georgia, serif", fontSize: "2.4rem", lineHeight: 1, color: GOLD }}>{n}</Typography>
                  <Typography sx={{ fontFamily: "Georgia, serif", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8a294", mt: 1 }}>{l}</Typography>
                </Box>
              ))}
            </Box>
          </Parallax>
        </Box>

        {/* How to use */}
        <Box component={motion.section} {...reveal} id="how" aria-labelledby="how-h" sx={{ mt: { xs: 10, md: 16 } }}>
          <Label>How to use it</Label>
          <Typography id="how-h" component="h2" sx={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: { xs: "2rem", md: "2.8rem" }, lineHeight: 1.15, mb: { xs: 4, md: 6 } }}>
            Three steps.
          </Typography>
          <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: 4, md: 0 }, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
            {STEPS.map((st, i) => (
              <Box component="li" key={st.title} sx={{ pr: { md: 5 }, pl: { md: i ? 5 : 0 }, borderLeft: { md: i ? "1px solid #3a3526" : "none" } }}>
                <Parallax distance={[16, 0, -16][i]}>
                <Typography sx={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.1rem", color: GOLD, mb: 1 }}>0{i + 1}</Typography>
                <Typography component="h3" sx={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", fontWeight: 400, mb: 1 }}>{st.title}</Typography>
                <Typography sx={{ fontFamily: "Georgia, serif", lineHeight: 1.75, color: "#cfc9ba" }}>{st.body}</Typography>
                </Parallax>
              </Box>
            ))}
          </Box>
        </Box>

        {/* What you'll find */}
        <Box component={motion.section} {...reveal} id="inside" aria-labelledby="find-h" sx={{ mt: { xs: 10, md: 16 } }}>
          <Label>Inside every year</Label>
          <Typography id="find-h" component="h2" sx={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: { xs: "2rem", md: "2.8rem" }, lineHeight: 1.15, mb: { xs: 4, md: 6 } }}>
            What you will find.
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: "1px", background: "#3a3526", border: "1px solid #3a3526", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" } }}>
            {FIND.map((f) => (
              <Box component="li" key={f.title} className="find-cell" sx={{ background: "#100f14", p: { xs: 3, md: 4 }, transition: "background .3s", "&:hover": { background: "#1a1722" } }}>
                <Typography component="h3" sx={{ fontFamily: "Georgia, serif", fontSize: "1.2rem", fontWeight: 400, color: GOLD, mb: 1 }}>{f.title}</Typography>
                <Typography sx={{ fontFamily: "Georgia, serif", fontSize: "0.98rem", lineHeight: 1.7, color: "#cfc9ba" }}>{f.body}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Typography variant="caption" component="p" sx={{ color: "#a8a294", mt: { xs: 8, md: 10 }, maxWidth: 720, fontFamily: "Georgia, serif", lineHeight: 1.7 }}>
          {country === "world"
            ? "Historical eras describe everyday life in the United States. "
            : "Everyday life in India, year by year. Much of this content is still being researched. "}
          Facts carry their sources; anything still being checked is marked “Unverified”. Everything in 2050 is speculative.
        </Typography>
      </Container>

      <Box component="footer" sx={{ position: "relative", zIndex: 1, mt: { xs: 6, md: 8 }, py: 4, textAlign: "center", borderTop: "1px solid #3a3526", fontFamily: "Georgia, serif", letterSpacing: "0.08em", color: "#a8a294", fontSize: "0.9rem" }}>
        Made with <span role="img" aria-label="love" style={{ color: "#c0566a" }}>♥</span> by HRT
      </Box>
    </Box>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <Typography variant="overline" component="p" sx={{ color: "#c9b48a", letterSpacing: "0.32em", fontFamily: "Georgia, serif", fontSize: "0.75rem", mb: 1.5 }}>
      {children}
    </Typography>
  );
}

const STEPS = [
  { title: "Pick a country", body: "Choose whose everyday life you want to see. The tour begins in the United States; India follows the same thirteen years." },
  { title: "Choose a year", body: "Select any of the thirteen stops from 1900 to 2050. The page reshapes itself in that era's typography, colour and chrome." },
  { title: "Explore and travel", body: "Read the morning, then drag the timeline to move through the decades and watch the interface change. Open a deep dive to go further." },
];

const FIND = [
  { title: "The morning routine", body: "What woke you up and how the day began, step by step." },
  { title: "The news", body: "The headlines people were reading over breakfast." },
  { title: "What things cost", body: "Everyday prices, so wages and rent mean something." },
  { title: "Gadgets on the shelf", body: "The technology of the day, from the icebox to the smartphone." },
  { title: "Visions of the future", body: "What each generation expected the world to look like next." },
  { title: "Sources you can check", body: "Facts carry their sources, and anything unconfirmed is marked." },
];
