import { Box, Container, Typography, useTheme } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { eraDate, headingDomId, sectionDomId, SLIDER_CLEARANCE, type ChromeProps, type SectionId } from "./shared";

const HEADLINES: Record<SectionId, string | undefined> = {
  morning: "How the City Wakes",
  headlines: "Late Telegraph Dispatches",
  places: "Scenes of Daily Life",
  prices: "Market Report: What Things Cost",
  tech: "Modern Marvels of the Age",
  futures: "Prophecies for Tomorrow",
};

/** Where each section sits on the 12-column front page. */
// Everything is full width except the tech/futures pair, which sit side by side in the page order.
const SPANS: Record<SectionId, string | undefined> = { tech: "span 7", futures: "span 5" };

export function NewspaperChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const ink = theme.palette.text.primary;
  const rule = `1px solid ${ink}`;

  return (
    <Box className="fx-paper" sx={{ minHeight: "100vh", color: ink, pb: SLIDER_CLEARANCE, "--tm-paper": theme.palette.background.paper }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 } }}>
        <Box component="header">
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontStyle: "italic", gap: 2 }}>
            <span>“All the News of Everyday Life”</span>
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Weather: Fair and warmer</Box>
          </Box>
          <Typography
            component="p"
            sx={{ fontFamily: theme.era.accentFont, fontSize: { xs: "2.6rem", sm: "4rem", md: "5.5rem" }, lineHeight: 1.05, textAlign: "center", my: 1 }}
          >
            The Erascope Gazette
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
              borderTop: `3px double ${ink}`,
              borderBottom: `3px double ${ink}`,
              py: 0.5,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            <span>A fictional paper</span>
            <span>{eraDate(era.year)}</span>
            <span>Morning edition</span>
          </Box>
        </Box>

        <Box component="main" id="main" tabIndex={-1} sx={{ outline: "none" }}>
          <Box sx={{ textAlign: "center", py: { xs: 2, md: 3 }, borderBottom: rule }}>
            <Typography variant="h1" sx={{ textTransform: "uppercase", fontSize: { xs: "2.4rem", md: "4.4rem" }, letterSpacing: "-0.01em" }}>
              {era.title}
            </Typography>
            <Typography sx={{ fontStyle: "italic", fontSize: { xs: "1.05rem", md: "1.3rem" }, mt: 1, maxWidth: 720, mx: "auto" }}>
              {era.tagline}
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" }, columnGap: 3 }}>
            <Box sx={{ gridColumn: { md: "span 12" }, py: 2, borderBottom: rule, display: "grid", gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" }, gap: 3, alignItems: "center" }}>
              <Box sx={{ border: rule, p: 1 }}>
                <EraScene className="fx-halftone" showCaption={false} />
              </Box>
              <Box>
                <Typography variant="overline" component="p">Our illustration</Typography>
                <Typography sx={{ fontFamily: theme.typography.h1.fontFamily, fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
                  {era.scene.caption}
                </Typography>
                <Typography sx={{ columnCount: { sm: 2 }, columnGap: 3, columnRule: rule, textAlign: "justify" }}>
                  Readers may turn the apparatus pictured here by hand to examine it from every side. Slide the
                  timeline at the foot of the page to travel onward to other years, where, we are reliably informed,
                  the newspaper itself may be replaced by stranger devices still.
                </Typography>
              </Box>
            </Box>

            {sections.map((s) => {
              const id = s.id;
              return (
                <Box
                  component="section"
                  key={id}
                  id={sectionDomId(id)}
                  aria-labelledby={headingDomId(id)}
                  sx={{
                    gridColumn: { md: SPANS[id] ?? "span 12" },
                    py: 2.5,
                    borderBottom: rule,
                    minWidth: 0,
                    // Column rule between side-by-side stories on wide screens.
                    ...(id === "futures" && {
                      borderLeft: { md: rule },
                      pl: { md: 3 },
                      ml: { md: -1.5 },
                    }),
                  }}
                >
                  <Typography
                    variant="h2"
                    id={headingDomId(id)}
                    sx={{ textTransform: "uppercase", fontSize: { xs: "1.4rem", md: "1.7rem" }, borderBottom: rule, pb: 1, mb: 2, outline: "none" }}
                  >
                    {HEADLINES[id] ?? s.title}
                  </Typography>
                  <Box sx={id === "morning" ? { columnCount: { sm: 2 }, columnGap: 4, columnRule: rule } : undefined}>{s.node}</Box>
                </Box>
              );
            })}
          </Box>

          <Typography variant="caption" component="p" sx={{ textAlign: "center", mt: 2, fontStyle: "italic" }}>
            Printed and published by The Erascope Gazette. Facts marked “approximate” await verification by our correspondents.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
