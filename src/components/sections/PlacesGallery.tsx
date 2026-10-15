import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useId, useState } from "react";
import { useShellEra } from "../../context/EraContext";
import { EraCard } from "../common/EraCard";
import { SourceNote } from "../common/SourceNote";
import { PlaceIllustration } from "./PlaceIllustration";

export function PlacesGallery() {
  const era = useShellEra();
  const [tab, setTab] = useState(0);
  const uid = useId();
  const place = era.places[tab] ?? era.places[0];

  return (
    <Box sx={{ containerType: "inline-size" }}>
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        aria-label={`Places in ${era.year}`}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ mb: 2 }}
      >
        {era.places.map((p, i) => (
          <Tab key={p.id} label={p.title} id={`${uid}-tab-${i}`} aria-controls={`${uid}-panel-${i}`} />
        ))}
      </Tabs>

      <Box
        role="tabpanel"
        id={`${uid}-panel-${tab}`}
        aria-labelledby={`${uid}-tab-${tab}`}
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "1fr",
          // Responds to the space the chrome gives it (a 98 window, a newspaper column), not the viewport.
          "@container (min-width: 640px)": { gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)" },
        }}
      >
        <PlaceIllustration place={place} />
        <EraCard>
          <Typography variant="h3" component="h3" sx={{ mb: 1 }}>
            {place.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            {place.description}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, display: "grid", gap: 0.5 }}>
            {place.highlights.map((h) => (
              <Typography component="li" variant="body2" key={h}>
                {h}
              </Typography>
            ))}
          </Box>
          <SourceNote source={place.source} todo={place.todo} />
        </EraCard>
      </Box>
    </Box>
  );
}
