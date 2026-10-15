import { Button, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import { useEraContext } from "../../context/EraContext";
import { hasDeepDive } from "../../data";

/** Opens or closes the India Deep Dive. Appears only for countries that have one, so World is unchanged. */
export function DeepDiveButton() {
  const { displayCountry, deepDive, openDeepDive, closeDeepDive } = useEraContext();
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up("md"));
  if (!hasDeepDive(displayCountry)) return null;
  const open = deepDive !== null;
  const toggle = () => (open ? closeDeepDive() : openDeepDive(null));
  return wide ? (
    <Button onClick={toggle} aria-pressed={open} startIcon={<ExploreIcon />} color="inherit" variant={open ? "outlined" : "text"} sx={{ flex: "none", fontWeight: 700 }}>
      Deep Dive
    </Button>
  ) : (
    <Tooltip title="India Deep Dive">
      <IconButton onClick={toggle} aria-pressed={open} aria-label="India Deep Dive" color="inherit">
        <ExploreIcon />
      </IconButton>
    </Tooltip>
  );
}
