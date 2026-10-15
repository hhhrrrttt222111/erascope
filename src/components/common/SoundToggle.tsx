import { IconButton, Tooltip } from "@mui/material";
import VolumeOff from "@mui/icons-material/VolumeOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { useEraContext } from "../../context/EraContext";

export function SoundToggle() {
  const { muted, toggleMuted } = useEraContext();
  const label = muted ? "Turn sound on" : "Turn sound off";
  return (
    <Tooltip title={label}>
      <IconButton onClick={toggleMuted} aria-label="Sound effects" aria-pressed={!muted} color="inherit">
        {muted ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
    </Tooltip>
  );
}
