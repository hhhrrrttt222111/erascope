/**
 * The Indian layer for each era. It sits on top of the era's own chrome and theme: accents,
 * an accent font, a faint pattern and a banner strip. It never changes layout, chrome, body
 * font or text colour. Motifs are craft and design references (block print, khadi, kolam,
 * rangoli, jaali, paisley, hand-painted signage); no religious symbols, party colours or brand logos.
 * Plain data so the Node validator can import it.
 */
import type { CountryOverlay } from "../../../types.ts";

const font = (family: string, spec: string) => ({ family, scripts: ["latin", "devanagari"], spec });

export const overlay: CountryOverlay = {
  1900: { accent: { color: "#2b3a67", secondaryColor: "#a63a2e" }, accentFont: font("Tiro Devanagari Hindi", "Tiro+Devanagari+Hindi"), pattern: "in-block-print", ornament: "blockprint", deepDive: { portalFrame: "cartouche", heroPattern: "in-block-print", motifStyle: "woodcut" } },
  1920: { accent: { color: "#7a1f1f", secondaryColor: "#1f1f1f" }, accentFont: font("Martel", "Martel:wght@400;700"), pattern: "in-vernacular-rules", ornament: "ruled", deepDive: { portalFrame: "column", heroPattern: "in-vernacular-rules", motifStyle: "woodcut" } },
  1930: { accent: { color: "#e8890c", secondaryColor: "#2f8f5b" }, accentFont: font("Rozha One", "Rozha+One"), pattern: "in-khadi", ornament: "bars", deepDive: { portalFrame: "arch", heroPattern: "in-khadi", motifStyle: "deco" } },
  1945: { accent: { color: "#8c2f2f", secondaryColor: "#1f3a5f" }, accentFont: font("Khand", "Khand:wght@400;600;700"), pattern: "in-perforation", ornament: "perforated", deepDive: { portalFrame: "slip", heroPattern: "in-perforation", motifStyle: "stamp" } },
  1960: { accent: { color: "#b5532f", secondaryColor: "#1f7a8c" }, accentFont: font("Yatra One", "Yatra+One"), pattern: "in-film-poster", ornament: "bars", deepDive: { portalFrame: "poster", heroPattern: "in-film-poster", motifStyle: "poster" } },
  1970: { accent: { color: "#825b00", secondaryColor: "#7a3b0c" }, accentFont: font("Amita", "Amita:wght@400;700"), pattern: "in-signboard", ornament: "dots", deepDive: { portalFrame: "signboard", heroPattern: "in-signboard", motifStyle: "signboard" } },
  1984: { accent: { color: "#ff9f1c", secondaryColor: "#2ec4b6" }, accentFont: font("Teko", "Teko:wght@400;600"), pattern: "in-colour-bars", ornament: "bars", decor: { statusText: "INDIA MODE" }, deepDive: { portalFrame: "crt", heroPattern: "in-colour-bars", motifStyle: "pixel" } },
  1995: { accent: { color: "#786000", secondaryColor: "#c1272d" }, accentFont: font("Hind", "Hind:wght@400;600;700"), pattern: "in-rangoli-tiles", ornament: "dots", decor: { bannerText: "STD · ISD · PCO" }, deepDive: { portalFrame: "gif", heroPattern: "in-rangoli-tiles", motifStyle: "gif" } },
  1999: { accent: { color: "#101070", secondaryColor: "#053627" }, accentFont: font("Mukta", "Mukta:wght@400;600;700"), pattern: "in-cafe-wallpaper", ornament: "lattice", deepDive: { portalFrame: "bevel", heroPattern: "in-cafe-wallpaper", motifStyle: "bevel" } },
  2005: { accent: { color: "#d4349a", secondaryColor: "#d5700d" }, accentFont: font("Baloo 2", "Baloo+2:wght@400;600;700"), pattern: "in-paisley", ornament: "dots", deepDive: { portalFrame: "gloss", heroPattern: "in-paisley", motifStyle: "gloss" } },
  2010: { accent: { color: "#c27000", secondaryColor: "#00897b" }, accentFont: font("Poppins", "Poppins:wght@400;600;700"), pattern: "in-kolam-grid", ornament: "dots", deepDive: { portalFrame: "card", heroPattern: "in-kolam-grid", motifStyle: "flat" } },
  2020: { accent: { color: "#8b6f3a", secondaryColor: "#2a7f9e" }, accentFont: font("Gotu", "Gotu"), pattern: "in-jaali", ornament: "lattice", deepDive: { portalFrame: "tile", heroPattern: "in-jaali", motifStyle: "tile" } },
  2026: { accent: { color: "#8a5a00", secondaryColor: "#6a3d8f" }, accentFont: font("Anek Devanagari", "Anek+Devanagari:wght@400;600;700"), pattern: "in-chikankari-stitch", ornament: "dots", decor: { statusText: "18 अक्टूबर 2026 तक · As of 18 October 2026" }, deepDive: { portalFrame: "stitch-tile", heroPattern: "in-chikankari-stitch-hero", motifStyle: "stitch" } },
  2050: { accent: { color: "#2fd6c2", secondaryColor: "#ffb347" }, accentFont: font("Rajdhani", "Rajdhani:wght@500;600;700"), pattern: "in-kolam-glow", ornament: "lattice", deepDive: { portalFrame: "holo", heroPattern: "in-kolam-glow", motifStyle: "holo" } },
};
