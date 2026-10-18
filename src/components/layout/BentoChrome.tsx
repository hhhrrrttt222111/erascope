import { Box, Chip, Container, InputBase, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Search from "@mui/icons-material/Search";
import { useMemo, useState, type FormEvent } from "react";
import { useEraContext, useShellEra } from "../../context/EraContext";
import { hasDeepDive } from "../../data";
import { AsOfBadge } from "../common/AsOfBadge";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";

/** Tile widths on the 12-column grid; anything not listed spans the full row. */
const SPANS: Record<string, string> = {
  morning: "span 5", places: "span 7", prices: "span 7", workAndWages: "span 5", foodAndKitchen: "span 6", clothingAndStyle: "span 6",
  schoolAndChildhood: "span 6", healthAndMedicine: "span 6", gettingAround: "span 6", keepingInTouch: "span 6", tech: "span 7", futures: "span 5",
};
const QUICK = [["prices", "Prices"], ["gettingAround", "Getting around"]] as const;

/** Reads each section's own text from the page. No network, no model: it only filters what is already on screen. */
const textOf = (id: string) => document.getElementById(sectionDomId(id))?.textContent?.toLowerCase() ?? "";

export function BentoChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const { displayCountry, openDeepDive } = useEraContext();
  const [query, setQuery] = useState("");
  const ink = theme.palette.text.primary;
  const tile = { background: theme.palette.background.paper, border: `1px solid ${alpha(ink, 0.14)}`, borderRadius: "24px", boxShadow: `0 1px 2px ${alpha(ink, 0.06)}, 0 10px 28px ${alpha(ink, 0.07)}`, p: { xs: 2, md: 3 }, minWidth: 0 } as const;

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => (q ? sections.filter((s) => s.title.toLowerCase().includes(q) || textOf(s.id).includes(q)) : []), [q, sections]);
  const jump = (e: FormEvent) => {
    e.preventDefault();
    if (matches[0]) scrollToSection(matches[0].id);
  };
  const chips = q ? matches.map((s) => [s.id, s.title] as const) : QUICK;

  return (
    <Box sx={{ minHeight: "100vh", background: theme.palette.background.default, color: ink, pb: `calc(${SLIDER_CLEARANCE} + 88px)` }}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box component="header" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", py: 1 }}>
          <Typography component="p" sx={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 800, fontSize: 22 }}>Erascope</Typography>
          {era.contentAsOf && <Box sx={{ color: theme.palette.primary.main }}><AsOfBadge date={era.contentAsOf} /></Box>}
        </Box>

        <Box component="main" id="main" tabIndex={-1} sx={{ outline: "none", display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(12, minmax(0, 1fr))" }, gap: 2, mt: 1 }}>
          <Box sx={{ ...tile, gridColumn: { md: "span 7" }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="overline" component="p" sx={{ color: theme.palette.primary.main }}>{era.year}</Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.2rem", md: "3.6rem" }, fontWeight: 800 }}>{era.title}</Typography>
            <Typography sx={{ mt: 1.5, fontSize: { xs: "1.05rem", md: "1.2rem" }, maxWidth: 560 }}>{era.tagline}</Typography>
          </Box>
          <Box sx={{ ...tile, gridColumn: { md: "span 5" }, p: 1 }}>
            <EraScene showCaption={false} />
            <Typography variant="caption" component="p" sx={{ px: 1.5, pb: 1, color: "text.secondary" }}>{era.scene.caption}</Typography>
          </Box>

          <Box component="nav" aria-label="Index" sx={{ ...tile, gridColumn: { md: "span 12" }, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
            <Typography variant="overline" component="p" sx={{ mr: 1 }}>Index</Typography>
            {sections.map((s) => (
              <Chip key={s.id} label={s.title} clickable component="button" onClick={() => scrollToSection(s.id)} size="small" />
            ))}
          </Box>

          {sections.map((s) => (
            <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)} sx={{ ...tile, gridColumn: { md: SPANS[s.id] ?? "span 12" } }}>
              <Typography variant="h2" id={headingDomId(s.id)} sx={{ fontSize: { xs: "1.5rem", md: "1.9rem" }, mb: 2, outline: "none" }}>{s.title}</Typography>
              {s.node}
            </Box>
          ))}
        </Box>
      </Container>

      {/* Command bar: searches this page's own sections; it never calls a network or a model. */}
      <Box
        component="form"
        role="search"
        aria-label={`Search ${era.year}`}
        onSubmit={jump}
        sx={{ position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: "calc(var(--tm-slider-h) + 12px)", width: "min(720px, calc(100vw - 32px))", zIndex: 1100, display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.75, background: theme.palette.background.paper, border: `1px solid ${alpha(ink, 0.2)}`, borderRadius: "999px", boxShadow: `0 12px 32px ${alpha(ink, 0.18)}` }}
      >
        <Search aria-hidden fontSize="small" />
        <InputBase value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${era.year}`} inputProps={{ "aria-label": `Search ${era.year}` }} sx={{ flex: "1 1 120px", minWidth: 80, fontSize: 15 }} />
        <Box sx={{ display: "flex", gap: 0.75, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" }, maxWidth: "62%" }}>
          {chips.map(([id, label]) => (
            <Chip key={id} label={label} size="small" clickable component="button" type="button" onClick={() => scrollToSection(id)} sx={{ flex: "none" }} />
          ))}
          {!q && hasDeepDive(displayCountry) && <Chip label="Deep dive" size="small" clickable component="button" type="button" onClick={() => openDeepDive()} sx={{ flex: "none" }} />}
          {q && matches.length === 0 && <Typography variant="caption" role="status" sx={{ alignSelf: "center", whiteSpace: "nowrap" }}>No matching section</Typography>}
        </Box>
      </Box>
    </Box>
  );
}
