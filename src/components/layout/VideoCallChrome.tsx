import { Box, Container, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import CallEnd from "@mui/icons-material/CallEnd";
import Mic from "@mui/icons-material/Mic";
import MicOff from "@mui/icons-material/MicOff";
import Videocam from "@mui/icons-material/Videocam";
import VideocamOff from "@mui/icons-material/VideocamOff";
import { useEffect, useState } from "react";
import { useEraContext, useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";
import "../../styles/era-css/videocall.css";

function useElapsed() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function VideoCallChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const { openLanding } = useEraContext();
  const theme = useTheme();
  const violet = theme.palette.primary.main;
  const elapsed = useElapsed();
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(false), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const toggleMute = () => {
    setMuted((m) => !m);
    if (!muted) setToast(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: SLIDER_CLEARANCE, background: theme.palette.background.default, color: "text.primary", "--vc-accent": violet }}>
      <Box component="header" sx={{ borderBottom: "1px solid #2f2f37", background: "#1c1c21" }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.25, flexWrap: "wrap" }}>
          <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: "50%", background: "#3ddc97" }} />
          <Typography component="p" sx={{ fontWeight: 700 }}>
            Morning check-in · {era.year}
          </Typography>
          <Typography component="p" variant="body2" sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums" }} aria-label={`Meeting time ${elapsed}`}>
            {elapsed}
          </Typography>
          <Typography component="p" variant="body2" sx={{ ml: "auto", color: "text.secondary" }}>
            {sections.length + 1} participants
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" component="main" id="main" tabIndex={-1} sx={{ outline: "none", pt: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gridAutoFlow: "dense", gap: 2 }}>
          {/* The host tile: the era's 3D scene is "your camera". */}
          <Box className="vc-tile" sx={{ gridColumn: { md: "1 / -1" }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, alignItems: "center" }}>
            <Box>
              <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {era.title}
              </Typography>
              <Typography sx={{ fontSize: "1.1rem", mt: 1, color: "text.secondary" }}>{era.tagline}</Typography>
            </Box>
            <Box sx={{ borderRadius: "12px", overflow: "hidden", background: "#2b2b33" }}>
              {cameraOn ? (
                <EraScene showCaption={false} height={260} />
              ) : (
                <Box sx={{ height: 260, display: "grid", placeItems: "center" }}>
                  <Box aria-label="Camera is off" role="img" sx={{ width: 96, height: 96, borderRadius: "50%", background: violet, color: theme.palette.primary.contrastText, display: "grid", placeItems: "center", fontSize: 36, fontWeight: 700 }}>
                    TM
                  </Box>
                </Box>
              )}
            </Box>
            <span className="vc-nametag">
              {muted ? <MicOff sx={{ fontSize: 16, color: "#ff6b6b" }} aria-label="muted" /> : <Mic sx={{ fontSize: 16 }} aria-hidden />}
              You (host) · {era.scene.caption}
            </span>
          </Box>

          {sections.map((s) => (
            <Box
              component="section"
              key={s.id}
              id={sectionDomId(s.id)}
              aria-labelledby={headingDomId(s.id)}
              className="vc-tile"
              sx={{ gridColumn: { md: s.id === "morning" || s.id === "prices" ? "auto" : "1 / -1" } }}
            >
              <Typography variant="h2" id={headingDomId(s.id)} sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" }, mb: 2, outline: "none" }}>
                {s.title}
              </Typography>
              {s.node}
              <span className="vc-nametag" aria-hidden>
                <s.Icon sx={{ fontSize: 16 }} />
                {s.title}
              </span>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Call toolbar, sticky above the timeline. */}
      <Box
        role="toolbar"
        aria-label="Call controls"
        sx={{ position: "sticky", bottom: "calc(var(--tm-slider-h) + 12px)", display: "flex", justifyContent: "center", gap: 1.5, mt: 3, zIndex: 40 }}
      >
        <Box sx={{ display: "flex", gap: 1.5, p: 1, borderRadius: 999, background: "rgba(28,28,33,0.92)", border: "1px solid #2f2f37", backdropFilter: "blur(8px)" }}>
          <Tooltip title={muted ? "Unmute" : "Mute"}>
            <IconButton onClick={toggleMute} aria-pressed={muted} aria-label="Mute microphone (pretend)" sx={{ background: muted ? "#3a2a2a" : "#2f2f37", color: muted ? "#ff8a8a" : "#ececf1" }}>
              {muted ? <MicOff /> : <Mic />}
            </IconButton>
          </Tooltip>
          <Tooltip title={cameraOn ? "Turn camera off" : "Turn camera on"}>
            <IconButton onClick={() => setCameraOn((c) => !c)} aria-pressed={!cameraOn} aria-label="Camera off (hides the 3D scene)" sx={{ background: "#2f2f37", color: "#ececf1" }}>
              {cameraOn ? <Videocam /> : <VideocamOff />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Leave and choose another year">
            <IconButton onClick={openLanding} aria-label="Leave call and choose another year" sx={{ background: "#c4314b", color: "#fff", "&:hover": { background: "#a92a40" } }}>
              <CallEnd />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {toast && (
        <div className="vc-toast" role="status">
          You&apos;re on mute
        </div>
      )}
    </Box>
  );
}
