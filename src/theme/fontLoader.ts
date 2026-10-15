import type { Era } from "../data";

/**
 * Google Fonts specs for every family named in era JSON. Families not listed here
 * (Times New Roman, Tahoma, Trebuchet MS) are system fonts and need no download.
 * Adding a new era font = one line here, plus the name in that era's JSON.
 */
const GOOGLE_FONTS: Record<string, string> = {
  "Cinzel Decorative": "Cinzel+Decorative:wght@400;700;900",
  "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400",
  "Playfair Display": "Playfair+Display:wght@700;900",
  "Old Standard TT": "Old+Standard+TT:ital,wght@0,400;0,700;1,400",
  UnifrakturMaguntia: "UnifrakturMaguntia",
  Limelight: "Limelight",
  "Libre Baskerville": "Libre+Baskerville:ital,wght@0,400;0,700;1,400",
  "Stardos Stencil": "Stardos+Stencil:wght@400;700",
  "Special Elite": "Special+Elite",
  Jost: "Jost:wght@400;500;600;700;800",
  Shrikhand: "Shrikhand",
  Nunito: "Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400",
  VT323: "VT323",
  "IBM Plex Mono": "IBM+Plex+Mono:ital,wght@0,400;0,600;0,700;1,400",
  "Comic Neue": "Comic+Neue:wght@400;700",
  Silkscreen: "Silkscreen:wght@400;700",
  "Varela Round": "Varela+Round",
  "Open Sans": "Open+Sans:ital,wght@0,400;0,600;0,700;1,400",
  "DM Sans": "DM+Sans:ital,wght@0,400;0,500;0,700;1,400",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;1,400",
  Orbitron: "Orbitron:wght@500;700;900",
  Inter: "Inter:ital,wght@0,400;0,500;0,600;1,400",
};

const requested = new Set<string>();

function addStylesheet(href: string) {
  if (requested.has(href)) return;
  requested.add(href);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

const familiesOf = (era: Era) =>
  [era.theme.fonts.heading, era.theme.fonts.body, era.theme.fonts.mono].filter((f): f is string => !!f && f in GOOGLE_FONTS);

/** Loads an era's fonts the first time it is shown (or about to be). Safe to call repeatedly. */
export function loadEraFonts(era: Era) {
  const families = familiesOf(era).filter((f) => !requested.has(f));
  if (families.length === 0) return;
  families.forEach((f) => requested.add(f));
  addStylesheet(`https://fonts.googleapis.com/css2?${families.map((f) => `family=${GOOGLE_FONTS[f]}`).join("&")}&display=swap`);
}

/**
 * For the landing grid: every era's heading font, subset by Google Fonts to just the
 * characters on the cards (`text=`), so 13 previews cost a few kilobytes, not 13 full fonts.
 */
export function loadPreviewFonts(eras: Era[], extraText = "") {
  const families = [...new Set(eras.map((e) => e.theme.fonts.heading).filter((f) => f in GOOGLE_FONTS))];
  const chars = new Set((eras.map((e) => `${e.year}${e.title}`).join("") + extraText).split(""));
  const text = encodeURIComponent([...chars].sort().join(""));
  addStylesheet(`https://fonts.googleapis.com/css2?${families.map((f) => `family=${GOOGLE_FONTS[f]}`).join("&")}&text=${text}&display=swap`);
}

/** Loads a country overlay's accent font (subset to the characters its band uses). */
export function loadAccentFont(spec: string, text: string) {
  addStylesheet(`https://fonts.googleapis.com/css2?family=${spec}&text=${encodeURIComponent(text)}&display=swap`);
}
