import { Box } from "@mui/material";
import AutoAwesome from "@mui/icons-material/AutoAwesome";

interface Props {
  size?: "small" | "large";
}

/** Marks content as imagined rather than historical. Always rendered as visible text, never colour alone. */
export function SpeculativeBadge({ size = "small" }: Props) {
  const large = size === "large";
  return (
    <Box
      component="span"
      title="This content is speculative: an imagined future, not a historical record."
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: large ? 1.5 : 1,
        py: large ? 0.5 : 0.25,
        borderRadius: "999px",
        border: "1px solid #ff4fd8",
        background: "rgba(255, 79, 216, 0.14)",
        color: "#ffd1f5",
        fontFamily: "Orbitron, system-ui, sans-serif",
        fontSize: large ? "0.8rem" : "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.16em",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        textShadow: "0 0 8px rgba(255, 79, 216, 0.6)",
      }}
    >
      <AutoAwesome sx={{ fontSize: large ? 16 : 12 }} aria-hidden />
      SPECULATIVE
    </Box>
  );
}
