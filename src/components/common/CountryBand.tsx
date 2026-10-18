import { useEffect } from "react";
import { useTheme } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { selectableCountries } from "../../data/countries/registry";
import { loadAccentFont } from "../../theme/fontLoader";

/**
 * The overlay's banner slot: one strip above every chrome, filled from the country's data
 * (name, native name, political status of that year). Renders nothing for World.
 */
export function CountryBand() {
  const theme = useTheme();
  const era = useShellEra();
  const overlay = theme.era.country;
  const entry = selectableCountries().find((c) => c.id === era.country);
  const native = entry?.nativeNames?.[0];
  const family = overlay?.accentFont;

  useEffect(() => {
    if (family) loadAccentFont(family.spec, `${entry?.name ?? ""}${native?.text ?? ""}${overlay?.decor?.bannerText ?? ""}${overlay?.decor?.statusText ?? ""} ·0123456789()`);
  }, [family, entry, native, overlay]);

  if (!overlay || !entry) return null;
  const status = era.locale.politicalStatus;
  return (
    <div
      className={`in-band in-band--${overlay.ornament ?? "bars"}`}
      style={
        {
          "--in-accent": overlay.accent.color,
          "--in-accent2": overlay.accent.secondaryColor ?? overlay.accent.color,
          fontFamily: family ? `"${family.family}", ${theme.typography.h3.fontFamily ?? "serif"}` : undefined,
          color: theme.palette.text.primary,
          background: theme.palette.background.paper,
        } as React.CSSProperties
      }
    >
      <span>
        {entry.name}
        {native && (
          <>
            {" · "}
            <span lang={native.lang}>{native.text}</span>
          </>
        )}
        {" · "}
        {era.year}
      </span>
      {status && <span>{status}</span>}
      {overlay.decor?.bannerText && <span>{overlay.decor.bannerText}</span>}
      {overlay.decor?.statusText && (
        <span>
          {overlay.decor.statusText.split(" · ").map((part, i) => (
            <span key={part} lang={/[\u0900-\u097F]/.test(part) ? "hi" : undefined}>{i > 0 && " · "}{part}</span>
          ))}
        </span>
      )}
    </div>
  );
}
