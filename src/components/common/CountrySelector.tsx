import { Box, useTheme } from "@mui/material";
import GlobeIcon from "@mui/icons-material/Public";
import type { CSSProperties } from "react";
import { useEraContext } from "../../context/EraContext";
import { selectableCountries } from "../../data/countries/registry";
import type { ChromeId } from "../../data/types";
import { BEVEL_OUT, CHROME_RADIUS } from "../../theme/eraThemes";

/** Per-chrome look for the one shared control: only surface, border and type change, never the markup. */
const VARIANT: Partial<Record<ChromeId, CSSProperties>> = {
  newspaper: { border: "1px solid currentColor", textTransform: "uppercase", letterSpacing: "0.08em", fontStyle: "italic" },
  artnouveau: { border: "1px solid currentColor", fontStyle: "italic" },
  artdeco: { border: "1px solid currentColor", textTransform: "uppercase", letterSpacing: "0.14em" },
  homefront: { border: "2px dashed currentColor", textTransform: "uppercase", letterSpacing: "0.08em" },
  midcentury: { border: "2px solid currentColor" },
  groovy: { border: "2px solid currentColor" },
  terminal: { border: "1px solid currentColor", textTransform: "uppercase", letterSpacing: "0.1em", background: "transparent" },
  earlyweb: { border: "2px inset #fff", background: "#c0c0c0", color: "#000" },
  win98: { background: "#c0c0c0", color: "#000", boxShadow: BEVEL_OUT, border: 0 },
  web2gloss: { border: "1px solid rgba(0,0,0,0.35)", background: "linear-gradient(#fff, #dbe9f5)", color: "#10324a" },
  flatweb: { border: "1px solid currentColor" },
  videocall: { border: "1px solid currentColor" },
  futureos: { border: "1px solid currentColor", background: "transparent", boxShadow: "0 0 12px currentColor" },
};

/**
 * Country switch. A native <select> keeps keyboard and screen-reader behaviour correct at any
 * width; the era chrome only restyles it. Lists only enabled countries from the registry.
 */
export function CountrySelector() {
  const { country, setCountry, countryLoading } = useEraContext();
  const theme = useTheme();
  const chrome = theme.era.chrome;
  const options = selectableCountries();
  if (options.length < 2) return null;

  // 2026: a segmented pill instead of a dropdown.
  if (chrome === "bento") {
    return (
      <Box role="radiogroup" aria-label="Country" aria-busy={countryLoading} sx={{ display: "inline-flex", flex: "none", p: "3px", gap: "2px", borderRadius: 999, border: "1px solid currentColor" }}>
        {options.map((c) => (
          <Box
            key={c.id}
            component="button"
            type="button"
            role="radio"
            aria-checked={country === c.id}
            onClick={() => setCountry(c.id)}
            sx={{ font: "inherit", fontSize: 13, fontWeight: 700, minHeight: 32, minWidth: 44, px: 1.25, border: 0, borderRadius: 999, cursor: "pointer", background: country === c.id ? theme.palette.primary.main : "transparent", color: country === c.id ? theme.palette.primary.contrastText : "inherit", "&:focus-visible": { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 } }}
          >
            {c.name}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, flex: "none", color: "inherit" }}>
      <GlobeIcon aria-hidden fontSize="small" />
      <select
        aria-label="Country"
        aria-busy={countryLoading}
        value={country}
        onChange={(e) => setCountry(e.target.value as typeof country)}
        style={{
          font: "inherit",
          fontSize: 14,
          fontWeight: 700,
          minHeight: 36,
          maxWidth: 108,
          padding: "0 6px",
          color: "inherit",
          background: "transparent",
          borderRadius: CHROME_RADIUS[chrome] ? Math.min(CHROME_RADIUS[chrome], 12) : 4,
          cursor: "pointer",
          ...VARIANT[chrome],
        }}
      >
        {options.map((c) => (
          <option key={c.id} value={c.id} style={{ color: "#111", background: "#fff", textTransform: "none", fontStyle: "normal" }}>
            {c.name}
          </option>
        ))}
      </select>
    </Box>
  );
}
