import { alpha, createTheme, responsiveFontSizes, type Theme, type ThemeOptions } from "@mui/material/styles";
import { eras, type Era, type EraId } from "../data";
import type { ChromeId } from "../data/types";

declare module "@mui/material/styles" {
  interface Theme {
    era: { year: EraId; chrome: ChromeId; accentFont: string; speculative: boolean; country?: import("../data/types").OverlayEra };
  }
  interface ThemeOptions {
    era?: { year: EraId; chrome: ChromeId; accentFont: string; speculative: boolean };
  }
}

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Arial, sans-serif";
const MONO = "'Courier New', monospace";

/** Fallback stacks appended to the JSON font names, per chrome. */
const FALLBACKS: Record<ChromeId, { heading: string; body: string; accent: string }> = {
  artnouveau: { heading: SERIF, body: SERIF, accent: SERIF },
  newspaper: { heading: SERIF, body: SERIF, accent: "serif" },
  artdeco: { heading: "'Didot', 'Bodoni MT', serif", body: SERIF, accent: SERIF },
  homefront: { heading: "'Courier New', monospace", body: "'Courier New', 'American Typewriter', monospace", accent: MONO },
  midcentury: { heading: "Futura, 'Century Gothic', sans-serif", body: "Futura, 'Century Gothic', sans-serif", accent: "sans-serif" },
  groovy: { heading: "'Cooper Black', Georgia, serif", body: "'Trebuchet MS', sans-serif", accent: "sans-serif" },
  terminal: { heading: "'Courier New', monospace", body: "'Courier New', monospace", accent: MONO },
  earlyweb: { heading: "'Times New Roman', Times, serif", body: "'Times New Roman', Times, serif", accent: "'Comic Sans MS', cursive" },
  win98: { heading: "'MS Sans Serif', Geneva, Verdana, sans-serif", body: "'MS Sans Serif', Geneva, Verdana, sans-serif", accent: MONO },
  web2gloss: { heading: "'Trebuchet MS', 'Lucida Grande', sans-serif", body: "'Lucida Grande', Verdana, sans-serif", accent: "sans-serif" },
  flatweb: { heading: SANS, body: SANS, accent: "monospace" },
  videocall: { heading: "system-ui, -apple-system, 'Segoe UI', sans-serif", body: "system-ui, -apple-system, 'Segoe UI', sans-serif", accent: MONO },
  futureos: { heading: "'Segoe UI', system-ui, sans-serif", body: "system-ui, -apple-system, 'Segoe UI', sans-serif", accent: "monospace" },
};

const stack = (name: string | undefined, fallback: string) => (name ? `"${name}", ${fallback}` : fallback);

export const BEVEL_OUT = "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf";
export const BEVEL_IN = "inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080";

/** Relative luminance, used to decide light or dark mode from the JSON background colour. */
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Radius per chrome, also used by the drag-time morph (theme/interpolate.ts). */
export const CHROME_RADIUS: Record<ChromeId, number> = {
  artnouveau: 14,
  newspaper: 0,
  artdeco: 0,
  homefront: 2,
  midcentury: 12,
  groovy: 28,
  terminal: 0,
  earlyweb: 0,
  win98: 0,
  web2gloss: 10,
  flatweb: 4,
  videocall: 12,
  futureos: 20,
};

function chromeOverrides(era: Era, heading: string, body: string): ThemeOptions {
  const { primary, secondary, paper, text, background } = era.theme.palette;

  switch (era.theme.chrome) {
    case "artnouveau":
      return {
        components: {
          MuiCard: {
            styleOverrides: {
              root: { background: paper, border: `3px double ${secondary}`, boxShadow: `0 0 0 6px ${paper}, 0 0 0 7px ${alpha(primary, 0.35)}`, margin: 7 },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: { fontFamily: heading, letterSpacing: "0.08em", borderRadius: 999 },
              contained: { background: primary, color: paper, boxShadow: "none", "&:hover": { background: secondary, color: text } },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { height: 2, background: primary } } },
          MuiTab: { styleOverrides: { root: { fontFamily: heading, fontWeight: 700, letterSpacing: "0.06em" } } },
          MuiChip: { styleOverrides: { root: { borderRadius: 999, border: `1px solid ${secondary}`, background: "transparent", fontStyle: "italic" } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: `1px solid ${alpha(secondary, 0.5)}`, fontFamily: body } } },
        },
      };

    case "newspaper":
      return {
        components: {
          MuiCard: { styleOverrides: { root: { background: "transparent", boxShadow: "none", border: `1px solid ${text}` } } },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 0, fontFamily: heading, letterSpacing: "0.08em", boxShadow: "none" },
              contained: { background: text, color: paper, "&:hover": { background: secondary, boxShadow: "none" } },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { height: 3, background: text } } },
          MuiTab: { styleOverrides: { root: { fontFamily: heading, fontWeight: 700, letterSpacing: "0.06em" } } },
          MuiChip: { styleOverrides: { root: { borderRadius: 0, border: `1px solid ${text}`, background: "transparent", fontStyle: "italic" } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: `1px dotted ${text}`, fontFamily: body } } },
          MuiDivider: { styleOverrides: { root: { borderColor: text } } },
        },
      };

    case "artdeco":
      return {
        components: {
          MuiCard: {
            styleOverrides: {
              root: { background: paper, border: `1px solid ${primary}`, boxShadow: `inset 0 0 0 4px ${paper}, inset 0 0 0 5px ${alpha(primary, 0.5)}`, borderRadius: 0 },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 0, fontFamily: heading, letterSpacing: "0.2em" },
              contained: { background: primary, color: background, boxShadow: "none", "&:hover": { background: secondary } },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { height: 2, background: primary } } },
          MuiTab: { styleOverrides: { root: { fontFamily: heading, letterSpacing: "0.16em", color: alpha(text, 0.75), "&.Mui-selected": { color: primary } } } },
          MuiChip: { styleOverrides: { root: { borderRadius: 0, border: `1px solid ${primary}`, background: "transparent", letterSpacing: "0.1em" } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: `1px solid ${alpha(primary, 0.35)}` } } },
        },
      };

    case "homefront":
      return {
        components: {
          MuiCard: {
            styleOverrides: {
              root: { background: paper, border: `2px dashed ${alpha(text, 0.45)}`, boxShadow: `3px 3px 0 ${alpha(text, 0.15)}`, borderRadius: 2 },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 2, fontFamily: heading, letterSpacing: "0.12em" },
              contained: { background: primary, color: paper, boxShadow: "none", "&:hover": { background: secondary } },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { height: 4, background: secondary } } },
          MuiTab: { styleOverrides: { root: { fontFamily: heading, letterSpacing: "0.1em" } } },
          MuiChip: {
            styleOverrides: {
              root: { borderRadius: 2, border: `2px solid ${secondary}`, background: "transparent", color: secondary, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.08em" },
            },
          },
          MuiTableCell: { styleOverrides: { root: { borderBottom: `1px solid ${alpha(text, 0.3)}` } } },
        },
      };

    case "midcentury":
      return {
        components: {
          MuiCard: {
            styleOverrides: { root: { borderRadius: 18, border: `2px solid ${text}`, boxShadow: `6px 6px 0 ${primary}`, background: paper } },
          },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 999, fontWeight: 700, letterSpacing: "0.05em" },
              contained: { background: secondary, color: text, boxShadow: `3px 3px 0 ${text}`, "&:hover": { background: "#e3b23c" } },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { height: 6, borderRadius: 3, background: secondary } } },
          MuiTab: { styleOverrides: { root: { fontWeight: 700, letterSpacing: "0.08em" } } },
          MuiChip: { styleOverrides: { root: { borderRadius: 999, background: "#e3b23c", color: text, fontWeight: 600 } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: `2px dashed ${alpha(text, 0.25)}` } } },
        },
      };

    case "groovy":
      return {
        components: {
          MuiCard: { styleOverrides: { root: { background: paper, borderRadius: 28, boxShadow: `0 6px 0 ${secondary}`, border: `2px solid ${text}` } } },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 999, fontWeight: 800, textTransform: "none" },
              contained: { background: text, color: paper, boxShadow: "none", "&:hover": { background: secondary } },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { height: 8, borderRadius: 4, background: primary } } },
          MuiTab: { styleOverrides: { root: { fontWeight: 800, textTransform: "none", fontSize: "1rem" } } },
          MuiChip: { styleOverrides: { root: { borderRadius: 999, background: background, color: text, fontWeight: 700, border: `2px solid ${text}` } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: `3px solid ${alpha(secondary, 0.35)}` } } },
        },
      };

    case "terminal":
      return {
        components: {
          MuiCard: { styleOverrides: { root: { background: "transparent", border: `1px dashed ${primary}`, borderRadius: 0, boxShadow: "none", color: text } } },
          MuiButton: {
            defaultProps: { disableRipple: true },
            styleOverrides: {
              root: {
                borderRadius: 0,
                fontFamily: heading,
                fontSize: "1.15rem",
                color: primary,
                border: `1px solid ${primary}`,
                "&:hover, &.Mui-focusVisible": { background: primary, color: background },
              },
              contained: { background: primary, color: background },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { display: "none" } } },
          MuiTab: {
            defaultProps: { disableRipple: true },
            styleOverrides: {
              root: {
                fontFamily: heading,
                fontSize: "1.1rem",
                color: primary,
                opacity: 1,
                "&.Mui-selected": { background: primary, color: background },
                "&.Mui-focusVisible": { outline: `1px solid ${primary}` },
              },
            },
          },
          MuiChip: { styleOverrides: { root: { borderRadius: 0, border: `1px solid ${primary}`, background: "transparent", color: primary, textTransform: "uppercase" } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: `1px dashed ${alpha(primary, 0.5)}`, color: text } } },
          MuiLink: { styleOverrides: { root: { color: primary } } },
        },
      };

    case "earlyweb":
      return {
        components: {
          MuiCard: { styleOverrides: { root: { background: paper, borderRadius: 0, boxShadow: "none", border: "2px ridge #9a9a9a" } } },
          MuiButton: {
            defaultProps: { disableRipple: true, disableElevation: true },
            styleOverrides: {
              root: { borderRadius: 0, textTransform: "none", fontFamily: body, color: "#000", background: "#d4d0c8", border: "2px outset #ffffff" },
              contained: { background: "#d4d0c8", color: "#000" },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { display: "none" } } },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontFamily: body,
                fontSize: "1rem",
                color: primary,
                textDecoration: "underline",
                minHeight: 32,
                "&.Mui-selected": { color: secondary, fontWeight: 700, textDecoration: "none" },
              },
            },
          },
          MuiChip: { styleOverrides: { root: { borderRadius: 0, background: "#ffff99", color: "#000", border: "1px solid #000", fontFamily: body } } },
          MuiTableCell: { styleOverrides: { root: { border: "1px solid #808080", padding: "4px 8px" } } },
        },
      };

    case "win98":
      return {
        typography: { fontSize: 13 },
        components: {
          MuiCard: { styleOverrides: { root: { background: "#c0c0c0", boxShadow: BEVEL_OUT, borderRadius: 0 } } },
          MuiButton: {
            defaultProps: { disableRipple: true },
            styleOverrides: {
              root: {
                borderRadius: 0,
                textTransform: "none",
                color: "#000",
                background: "#c0c0c0",
                boxShadow: BEVEL_OUT,
                minHeight: 23,
                "&:hover": { background: "#c0c0c0", boxShadow: BEVEL_OUT },
                "&:active": { boxShadow: BEVEL_IN },
                "&.Mui-focusVisible": { outline: "1px dotted #000", outlineOffset: -4 },
              },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { display: "none" }, root: { minHeight: 28 } } },
          MuiTab: {
            defaultProps: { disableRipple: true },
            styleOverrides: {
              root: {
                textTransform: "none",
                minHeight: 26,
                padding: "2px 12px",
                color: "#000",
                background: "#c0c0c0",
                boxShadow: "inset 1px 1px #fff, inset -1px 0 #0a0a0a, inset -2px 0 #808080",
                marginRight: 2,
                "&.Mui-selected": { color: "#000", fontWeight: 700, background: "#c0c0c0", marginTop: -2, minHeight: 28 },
                "&.Mui-focusVisible": { outline: "1px dotted #000", outlineOffset: -4 },
              },
            },
          },
          MuiChip: { styleOverrides: { root: { borderRadius: 0, background: "#fff", boxShadow: BEVEL_IN, height: 22 } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: "1px solid #dfdfdf", padding: "4px 8px" } } },
        },
      };

    case "web2gloss":
      return {
        components: {
          MuiCard: {
            styleOverrides: {
              root: { background: `linear-gradient(${paper}, #f3f9fd)`, border: "1px solid #c9dfee", boxShadow: "0 2px 8px rgba(30, 80, 120, 0.12)", borderRadius: 10 },
            },
          },
          MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
              root: { borderRadius: 999, textTransform: "none", fontWeight: 700 },
              contained: {
                color: text,
                background: `linear-gradient(180deg, ${alpha("#ffffff", 0.55)} 0%, ${alpha("#ffffff", 0.15)} 50%, transparent 51%), ${primary}`,
                border: `1px solid ${alpha("#000", 0.25)}`,
                textShadow: "0 1px 0 rgba(255,255,255,0.5)",
                "&:hover": { background: `linear-gradient(180deg, ${alpha("#ffffff", 0.6)} 0%, ${alpha("#ffffff", 0.2)} 50%, transparent 51%), ${primary}` },
              },
            },
          },
          MuiTabs: { styleOverrides: { indicator: { display: "none" } } },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                minHeight: 36,
                margin: "0 4px",
                "&.Mui-selected": { color: text, background: `linear-gradient(180deg, ${alpha("#ffffff", 0.5)}, transparent 55%), ${secondary}` },
              },
            },
          },
          MuiChip: { styleOverrides: { root: { borderRadius: 999, background: "#e3f2fb", color: text, fontWeight: 700, border: "1px solid #b8d9ee" } } },
        },
      };

    case "flatweb":
      return {
        components: {
          MuiCard: { styleOverrides: { root: { border: "1px solid #dddfe2", boxShadow: "none", borderRadius: 4 } } },
          MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { textTransform: "none", fontWeight: 600, borderRadius: 4 } },
          },
          MuiTabs: { styleOverrides: { indicator: { height: 3, background: primary } } },
          MuiTab: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
          MuiChip: { styleOverrides: { root: { borderRadius: 4, fontWeight: 600 } } },
        },
      };

    case "videocall":
      return {
        components: {
          MuiCard: { styleOverrides: { root: { background: paper, border: "1px solid #3a3a46", boxShadow: "none", borderRadius: 12, backgroundImage: "none" } } },
          MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { borderRadius: 999, textTransform: "none", fontWeight: 700 } },
          },
          MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3, background: primary } } },
          MuiTab: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
          MuiChip: { styleOverrides: { root: { borderRadius: 999, background: "#34343e", fontWeight: 600 } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: "1px solid #3a3a46" } } },
        },
      };

    case "futureos":
      return {
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 20,
                background: "rgba(255,255,255,0.045)",
                backdropFilter: "blur(14px)",
                border: `1px solid ${alpha(primary, 0.28)}`,
                boxShadow: `inset 0 0 24px ${alpha(primary, 0.06)}, 0 8px 32px rgba(0,0,0,0.35)`,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 999, fontFamily: heading, letterSpacing: "0.1em" },
              contained: {
                background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                color: "#05060f",
                boxShadow: `0 0 18px ${alpha(primary, 0.45)}`,
              },
            },
          },
          MuiTabs: {
            styleOverrides: { indicator: { height: 2, background: `linear-gradient(90deg, ${primary}, ${secondary})`, boxShadow: `0 0 10px ${primary}` } },
          },
          MuiTab: { styleOverrides: { root: { fontFamily: heading, letterSpacing: "0.12em", fontSize: "0.75rem" } } },
          MuiChip: {
            styleOverrides: { root: { borderRadius: 999, border: `1px solid ${alpha(primary, 0.5)}`, background: alpha(primary, 0.08) } },
          },
          MuiTableCell: { styleOverrides: { root: { borderBottom: "1px solid rgba(255,255,255,0.08)" } } },
        },
      };
  }
}

export function createEraTheme(era: Era): Theme {
  const { palette, fonts, chrome } = era.theme;
  const fb = FALLBACKS[chrome];
  const heading = stack(fonts.heading, fb.heading);
  const body = stack(fonts.body, fb.body);
  const accentFont = stack(fonts.mono, fb.accent);
  const dark = luminance(palette.background) < 0.2;

  const base = createTheme({
    era: { year: era.year, chrome, accentFont, speculative: era.speculative },
    shape: { borderRadius: CHROME_RADIUS[chrome] },
    palette: {
      mode: dark ? "dark" : "light",
      // Pick button text colours that meet WCAG AA (4.5:1) instead of MUI's default 3:1.
      contrastThreshold: 4.5,
      primary: { main: palette.primary },
      secondary: { main: palette.secondary },
      background: { default: palette.background, paper: palette.paper },
      text: { primary: palette.text, secondary: alpha(palette.text, dark ? 0.78 : 0.78) },
      divider: alpha(palette.text, 0.2),
    },
    typography: {
      fontFamily: body,
      h1: { fontFamily: heading, fontWeight: 900, lineHeight: 1.05 },
      h2: { fontFamily: heading, fontWeight: 700, fontSize: "2rem", lineHeight: 1.15 },
      h3: { fontFamily: heading, fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.25 },
      h4: { fontFamily: heading, fontWeight: 700 },
      h5: { fontFamily: heading, fontWeight: 700 },
      h6: { fontFamily: heading, fontWeight: 700, fontSize: "1rem" },
      overline: { fontFamily: heading, fontWeight: 700, letterSpacing: "0.14em" },
      button: { fontFamily: heading },
    },
  });

  return responsiveFontSizes(createTheme(base, chromeOverrides(era, heading, body)));
}

export const eraThemes = Object.fromEntries(eras.map((e) => [e.year, createEraTheme(e)])) as Record<EraId, Theme>;
