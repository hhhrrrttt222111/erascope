import { Card, CardContent, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";
import { useShellEra } from "../../context/EraContext";
import { SpeculativeBadge } from "./SpeculativeBadge";

interface Props {
  children: ReactNode;
  sx?: SxProps<Theme>;
  component?: "article" | "div";
}

/** The shared card used by every section. In a speculative era, every card carries the badge. */
export function EraCard({ children, sx, component = "article" }: Props) {
  const era = useShellEra();
  return (
    <Card component={component} sx={[{ height: "100%", position: "relative" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        {era.speculative && (
          <div style={{ marginBottom: 8 }}>
            <SpeculativeBadge />
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
