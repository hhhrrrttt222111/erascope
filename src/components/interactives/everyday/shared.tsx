import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { EraCard } from "../../common/EraCard";
import type { EverydayItem } from "../../../data/types";

export type Kind<K extends EverydayItem["kind"]> = Extract<EverydayItem, { kind: K }>;
export const ofKind = <K extends EverydayItem["kind"]>(items: EverydayItem[], kind: K) => items.filter((i): i is Kind<K> => i.kind === kind);

/** Frame shared by the three everyday interactives. Every number inside comes from a sourced item. */
export function Panel({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <Box component="section" aria-label={title} sx={{ mt: 3 }}>
      <EraCard component="div">
        <Typography component="h3" variant="h6">{title}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>{hint}</Typography>
        {children}
      </EraCard>
    </Box>
  );
}
