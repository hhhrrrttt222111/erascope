import { Box, Typography, useTheme } from "@mui/material";
import type { ReactNode } from "react";

/** Common frame: a titled region with a plain-language hint. Styled by the era theme and overlay. */
export function InteractiveShell({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  const theme = useTheme();
  const accent = theme.era.country?.accent.color ?? theme.palette.primary.main;
  return (
    <Box
      component="section"
      aria-label={title}
      sx={{
        mb: 3,
        p: { xs: 1.5, md: 2.5 },
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: `6px solid ${accent}`,
        borderRadius: `${Math.min(theme.shape.borderRadius as number, 14)}px`,
      }}
    >
      <Typography component="h2" variant="h5" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {hint && (
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          {hint}
        </Typography>
      )}
      {children}
    </Box>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body2" sx={{ p: 1.5, border: "1px dashed currentColor", borderRadius: 1 }}>
      {children}
    </Typography>
  );
}
