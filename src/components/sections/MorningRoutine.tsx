import { Box, Typography, useTheme } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { getIcon } from "../common/iconMap";
import { EraCard } from "../common/EraCard";
import { SourceNote } from "../common/SourceNote";

/** "A morning for: a farm family in the Midwest, 1900" — whose day the routine describes. */
function Persona() {
  const era = useShellEra();
  return (
    <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic", color: "text.secondary" }}>
      <Box component="span" sx={{ fontStyle: "normal", fontWeight: 700 }}>A morning for:</Box> {era.locale.persona}, {era.year}
    </Typography>
  );
}

export function MorningRoutine() {
  const era = useShellEra();
  const theme = useTheme();

  // The newspaper era reads as a column of prose with a drop cap, not a list of cards.
  if (theme.era.chrome === "newspaper") {
    return (
      <>
      <Persona />
      <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {era.morningRoutine.map((step, i) => (
          <Box component="li" key={step.id} sx={{ mb: 1.5, breakInside: "avoid-column" }}>
            <Typography component="h3" sx={{ fontWeight: 700, fontVariant: "small-caps", letterSpacing: "0.04em", fontSize: "1.05rem", lineHeight: 1.3 }}>
              {step.time.replace("AM", "A.M.").replace("PM", "P.M.")} · {step.activity}
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                hyphens: "auto",
                ...(i === 0 && {
                  "&::first-letter": {
                    float: "left",
                    fontFamily: theme.typography.h1.fontFamily,
                    fontWeight: 900,
                    fontSize: "3.3em",
                    lineHeight: 0.85,
                    pr: 0.75,
                    pt: 0.5,
                  },
                }),
              }}
            >
              {step.detail}
            </Typography>
            <SourceNote source={step.source} todo={step.todo} />
          </Box>
        ))}
      </Box>
      </>
    );
  }

  return (
    <>
    <Persona />
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, position: "relative", display: "grid", gap: 1.5 }}>
      <Box
        aria-hidden
        sx={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 2, background: theme.palette.divider }}
      />
      {era.morningRoutine.map((step) => {
        const Icon = getIcon(step.icon);
        return (
          <Box component="li" key={step.id} sx={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 1.5, alignItems: "start" }}>
            <Box
              aria-hidden
              sx={{
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                position: "relative",
                borderRadius: theme.era.chrome === "win98" ? 0 : "50%",
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: theme.era.chrome === "futureos" ? `0 0 16px ${theme.palette.primary.main}` : "none",
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <EraCard component="div">
              <Typography variant="overline" component="p" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                {step.time}
              </Typography>
              <Typography variant="h3" component="h3" sx={{ mb: 0.5 }}>
                {step.activity}
              </Typography>
              <Typography variant="body2">{step.detail}</Typography>
              <SourceNote source={step.source} todo={step.todo} />
            </EraCard>
          </Box>
        );
      })}
    </Box>
    </>
  );
}
