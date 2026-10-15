import { Box, Button, Card, Container, Typography, useTheme } from "@mui/material";
import ThumbUpOutlined from "@mui/icons-material/ThumbUpOutlined";
import ThumbUp from "@mui/icons-material/ThumbUp";
import Share from "@mui/icons-material/Share";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import { useState } from "react";
import { useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { headingDomId, scrollToSection, sectionDomId, SLIDER_CLEARANCE, type ChromeProps } from "./shared";

function StatusPost() {
  const era = useShellEra();
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMsg("Link copied!");
    } catch {
      setShareMsg(window.location.href);
    }
  };

  return (
    <Card component="article" aria-labelledby="flat-hero-title">
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", p: 2, pb: 1 }}>
        <Box aria-hidden sx={{ width: 40, height: 40, borderRadius: 1, background: theme.palette.primary.main, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>
          TM
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, color: theme.palette.primary.main, fontSize: 14 }}>Erascope</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Just now · {era.year}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 2 }}>
        <Typography variant="h1" id="flat-hero-title" sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 700, mb: 0.5 }}>
          {era.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }}>{era.tagline}</Typography>
      </Box>
      <Box sx={{ borderTop: "1px solid #dddfe2", borderBottom: "1px solid #dddfe2", background: "linear-gradient(#f6f7f9, #e9ebee)" }}>
        <EraScene showCaption={false} />
      </Box>
      <Typography variant="caption" component="p" sx={{ px: 2, pt: 1, color: "text.secondary" }}>
        {era.scene.caption}
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5, px: 1, py: 0.5, flexWrap: "wrap", alignItems: "center" }}>
        <Button size="small" aria-pressed={liked} startIcon={liked ? <ThumbUp /> : <ThumbUpOutlined />} onClick={() => setLiked((l) => !l)}>
          {liked ? "Liked" : "Like"}
        </Button>
        <Button size="small" startIcon={<ChatBubbleOutline />} onClick={() => scrollToSection("futures")}>
          Comment
        </Button>
        <Button size="small" startIcon={<Share />} onClick={share}>
          Share
        </Button>
        <Typography variant="caption" role="status" sx={{ color: "text.secondary", ml: 1, wordBreak: "break-all" }}>
          {shareMsg}
        </Typography>
      </Box>
      <Box sx={{ px: 2, py: 1, background: "#f6f7f9", borderTop: "1px solid #dddfe2", fontSize: 12, color: "text.secondary" }}>
        {liked ? "You and 1,999 others like this." : "1,999 people like this."}
      </Box>
    </Card>
  );
}

export function FlatWebChrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const theme = useTheme();
  const trending = era.places.find((p) => p.id === "newspaper")?.highlights ?? [];

  return (
    <Box sx={{ minHeight: "100vh", background: theme.palette.background.default, pb: SLIDER_CLEARANCE }}>
      <Box component="header" sx={{ background: theme.palette.primary.main, color: "#fff", borderBottom: "1px solid #29487d", position: "sticky", top: 0, zIndex: 10 }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", gap: 2, height: 48 }}>
          <Typography component="p" sx={{ fontWeight: 700, fontSize: 22, letterSpacing: "-0.03em" }}>
            erascope
            <Box component="span" sx={{ fontSize: 10, fontWeight: 700, ml: 0.5, px: 0.5, py: "1px", borderRadius: 0.5, background: theme.palette.secondary.main, color: "#0f2a08", verticalAlign: "super" }}>
              BETA
            </Box>
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "180px minmax(0, 1fr)", lg: "180px minmax(0, 1fr) 260px" }, gap: 2.5, pt: 2.5 }}>
        <Box component="nav" aria-label="Sections" sx={{ display: { xs: "none", md: "block" } }}>
          <Box sx={{ position: "sticky", top: 64, display: "grid", gap: 0.25 }}>
            {sections.map((s) => (
              <Button key={s.id} onClick={() => scrollToSection(s.id)} startIcon={<s.Icon />} sx={{ justifyContent: "flex-start", color: "text.primary", fontWeight: 600 }}>
                {s.title}
              </Button>
            ))}
          </Box>
        </Box>

        <Box component="main" id="main" tabIndex={-1} sx={{ outline: "none", display: "grid", gap: 2.5, minWidth: 0 }}>
          <StatusPost />
          {sections.map((s) => (
            <Box component="section" key={s.id} id={sectionDomId(s.id)} aria-labelledby={headingDomId(s.id)}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, pb: 1, borderBottom: "1px solid #dddfe2" }}>
                <s.Icon sx={{ color: theme.palette.primary.main }} aria-hidden />
                <Typography variant="h2" id={headingDomId(s.id)} sx={{ fontSize: "1.25rem", fontWeight: 700, outline: "none" }}>
                  {s.title}
                </Typography>
              </Box>
              {s.node}
            </Box>
          ))}
        </Box>

        <Box component="aside" aria-label={`Trending in ${era.year}`} sx={{ display: { xs: "none", lg: "block" } }}>
          <Card sx={{ position: "sticky", top: 64, p: 2 }}>
            <Typography variant="h3" component="h2" sx={{ fontSize: "0.85rem", textTransform: "uppercase", color: "text.secondary", mb: 1.5 }}>
              Trending in {era.year}
            </Typography>
            <Box component="ol" sx={{ m: 0, pl: 2.5, display: "grid", gap: 1.25 }}>
              {trending.map((t) => (
                <Typography component="li" key={t} variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {t}
                </Typography>
              ))}
            </Box>
          </Card>
        </Box>
      </Container>

      <Container maxWidth="lg">
        <Typography variant="caption" component="p" sx={{ color: "text.secondary", borderTop: "1px solid #dddfe2", mt: 4, pt: 2 }}>
          erascope © {era.year} · About · Privacy · Terms · Help
        </Typography>
      </Container>
    </Box>
  );
}
