import { Box, Chip, Typography } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Contrast from "@mui/icons-material/Contrast";
import type { CameTrue } from "../../data/types";
import { useShellEra } from "../../context/EraContext";
import { EraCard } from "../common/EraCard";
import { SourceNote } from "../common/SourceNote";

const VERDICT: Record<CameTrue, { label: string; color: "success" | "warning" | "error" | "default"; Icon: typeof CheckCircle }> = {
  yes: { label: "Came true", color: "success", Icon: CheckCircle },
  partly: { label: "Partly true", color: "warning", Icon: Contrast },
  no: { label: "Didn't happen", color: "error", Icon: Cancel },
  unknown: { label: "Too soon to tell", color: "default", Icon: HelpOutline },
};

export function FutureVisions() {
  const era = useShellEra();

  return (
    <Box>
      {era.speculative && (
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          What people living in {era.year} might imagine about the year 2100.
        </Typography>
      )}
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))" }}>
        {era.futureVisions.map((f) => {
          const v = VERDICT[f.cameTrue];
          return (
            <Box component="li" key={f.id ?? f.prediction}>
              <EraCard>
                <Chip size="small" variant="outlined" color={v.color} icon={<v.Icon />} label={v.label} sx={{ mb: 1.25, color: "text.primary", fontWeight: 600 }} />
                <Typography component="blockquote" variant="h3" sx={{ m: 0, mb: 1, fontStyle: "italic", fontWeight: 600 }}>
                  “{f.prediction}”
                </Typography>
                {f.whoSaidIt && (
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    — {f.whoSaidIt}
                  </Typography>
                )}
                {f.note && <Typography variant="body2">{f.note}</Typography>}
                <SourceNote source={f.source} todo={f.todo} />
              </EraCard>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
