import { Box, Chip, Typography } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { categoryIcon } from "../common/iconMap";
import { EraCard } from "../common/EraCard";
import { SourceNote } from "../common/SourceNote";

export function TechShelf() {
  const era = useShellEra();

  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))" }}>
      {era.technology.map((t) => {
        const Icon = categoryIcon[t.category];
        return (
          <Box component="li" key={t.id}>
            <EraCard>
              {t.image && (
                <Box component="img" src={t.image} alt={t.imageAlt ?? ""} loading="lazy" sx={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", mb: 1.5 }} />
              )}
              <Chip size="small" icon={<Icon />} label={t.category} sx={{ mb: 1, textTransform: "capitalize" }} />
              <Typography variant="h3" component="h3" sx={{ mb: 0.75 }}>
                {t.name}
              </Typography>
              <Typography variant="body2">{t.description}</Typography>
              <SourceNote source={t.source} todo={t.todo} />
            </EraCard>
          </Box>
        );
      })}
    </Box>
  );
}
