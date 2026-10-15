import { Box, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import type SvgIcon from "@mui/material/SvgIcon";
type SvgIconComponent = typeof SvgIcon;
import ComputerIcon from "@mui/icons-material/Computer";
import HistoryIcon from "@mui/icons-material/History";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useEraContext, useShellEra } from "../../context/EraContext";
import { EraScene } from "../three/EraScene";
import { eraDate, headingDomId, SLIDER_CLEARANCE, type ChromeProps, type SectionId } from "./shared";

type WinId = "welcome" | SectionId;

interface Win {
  id: WinId;
  title: string;
  Icon: SvgIconComponent;
  node: ReactNode;
}

interface WinState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
}

const TASKBAR_H = 34;
const WIN_FONT = "Tahoma, 'MS Sans Serif', Geneva, Verdana, sans-serif";

function Welcome({ small }: { small: boolean }) {
  const era = useShellEra();
  return (
    <Box>
      <Typography component="p" sx={{ fontFamily: WIN_FONT, fontWeight: 700, fontSize: { xs: 22, md: 28 }, lineHeight: 1.1 }}>
        {era.title}
      </Typography>
      <Typography component="p" sx={{ fontFamily: WIN_FONT, mt: 0.5, mb: 1.5 }}>
        {era.tagline}
      </Typography>
      <Box className="fx-bevel-in" sx={{ p: "3px", background: "#000 !important", color: "#c0c0c0" }}>
        <EraScene height={250} showCaption={false} />
      </Box>
      <Typography variant="caption" component="p" sx={{ mt: 1 }}>
        {era.scene.caption} {small ? "Open windows from the desktop icons above." : "Drag windows by their title bars, or open them from the desktop icons."}
      </Typography>
    </Box>
  );
}

function StartLogo() {
  return (
    <Box aria-hidden sx={{ display: "grid", gridTemplateColumns: "repeat(2, 7px)", gap: "1px", transform: "skewX(-8deg)" }}>
      {["#ff3b30", "#34c759", "#007aff", "#ffcc00"].map((c) => (
        <Box key={c} sx={{ width: 7, height: 7, background: c }} />
      ))}
    </Box>
  );
}

interface WindowProps {
  win: Win;
  index: number;
  z: number;
  active: boolean;
  small: boolean;
  state: WinState;
  constraints: RefObject<HTMLDivElement>;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
}

function Win98Window({ win, index, z, active, small, state, constraints, onFocus, onClose, onMinimize, onToggleMax }: WindowProps) {
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const draggable = !small && !state.maximized;

  useEffect(() => {
    if (state.maximized) {
      x.set(0);
      y.set(0);
    }
  }, [state.maximized, x, y]);

  const layout = small
    ? { position: "relative" as const }
    : state.maximized
      ? { position: "absolute" as const, left: 0, top: 0, width: "100%", height: "100%" }
      : {
          position: "absolute" as const,
          left: 110 + index * 36,
          top: 14 + index * 30,
          width: "min(640px, calc(100% - 130px))",
          height: 440,
        };

  return (
    <motion.section
      aria-labelledby={headingDomId(win.id as SectionId)}
      className="fx-bevel-out"
      drag={draggable}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraints}
      onPointerDown={onFocus}
      onFocusCapture={onFocus}
      style={{ x, y, zIndex: z, ...layout, display: state.minimized ? "none" : "flex", flexDirection: "column", padding: 3 }}
    >
      <div
        className={`fx-titlebar${active ? "" : " is-inactive"}`}
        onPointerDown={(e) => draggable && controls.start(e)}
        onDoubleClick={() => !small && onToggleMax()}
        style={{ cursor: draggable ? "move" : "default", touchAction: draggable ? "none" : "auto" }}
      >
        <win.Icon sx={{ fontSize: 16 }} aria-hidden />
        <Typography
          component="h2"
          id={headingDomId(win.id as SectionId)}
          sx={{ flex: 1, font: `700 13px ${WIN_FONT}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", outline: "none" }}
        >
          {win.title}
        </Typography>
        <button type="button" className="fx-titlebar-button" aria-label={`Minimize ${win.title}`} onClick={onMinimize}>
          _
        </button>
        {!small && (
          <button type="button" className="fx-titlebar-button" aria-label={`${state.maximized ? "Restore" : "Maximize"} ${win.title}`} onClick={onToggleMax}>
            {state.maximized ? "❐" : "□"}
          </button>
        )}
        <button type="button" className="fx-titlebar-button" aria-label={`Close ${win.title}`} onClick={onClose} style={{ marginLeft: 2 }}>
          ×
        </button>
      </div>
      <Box className="fx-win-scroll" sx={{ flex: 1, overflow: small ? "visible" : "auto", p: 1.5, background: "#c0c0c0" }}>
        {win.node}
      </Box>
    </motion.section>
  );
}

export function Win98Chrome({ sections }: ChromeProps) {
  const era = useShellEra();
  const { openLanding } = useEraContext();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
  const desktopRef = useRef<HTMLDivElement>(null);
  const [startAnchor, setStartAnchor] = useState<HTMLElement | null>(null);
  const startOpen = startAnchor !== null;
  const closeStart = () => setStartAnchor(null);
  const [clock, setClock] = useState(() => new Date());

  const windows: Win[] = [
    { id: "welcome", title: `Welcome to ${era.year}`, Icon: ComputerIcon, node: <Welcome small={small} /> },
    ...sections.map((s) => ({ id: s.id, title: s.title, Icon: s.Icon, node: s.node })),
  ];

  const [state, setState] = useState<Record<WinId, WinState>>(
    () => Object.fromEntries(windows.map((w) => [w.id, { open: true, minimized: false, maximized: false }])) as Record<WinId, WinState>,
  );
  // Last entry is on top. Start with Welcome in front of the cascade.
  const [zOrder, setZOrder] = useState<WinId[]>(() => [...windows.map((w) => w.id).slice(1).reverse(), "welcome"]);

  useEffect(() => {
    const t = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const visible = (id: WinId) => state[id].open && !state[id].minimized;
  const activeId = [...zOrder].reverse().find(visible);
  const patch = (id: WinId, p: Partial<WinState>) => setState((s) => ({ ...s, [id]: { ...s[id], ...p } }));

  const focus = (id: WinId) => {
    if (zOrder[zOrder.length - 1] !== id) setZOrder((z) => [...z.filter((w) => w !== id), id]);
    if (!visible(id)) patch(id, { open: true, minimized: false });
  };

  const onTaskbarClick = (id: WinId) => {
    if (id === activeId) patch(id, { minimized: true });
    else focus(id);
  };

  const openFromMenu = (id: WinId) => {
    closeStart();
    focus(id);
    window.setTimeout(() => document.getElementById(headingDomId(id as SectionId))?.closest("section")?.querySelector("button")?.focus(), 0);
  };

  const desktopH = `max(calc(100vh - var(--tm-slider-h) - ${TASKBAR_H}px), 640px)`;

  return (
    <Box sx={{ background: theme.palette.background.default, color: "#000", fontFamily: WIN_FONT, minHeight: "100vh", pb: small ? SLIDER_CLEARANCE : 0 }}>
      <Box component="main" id="main" tabIndex={-1} sx={{ outline: "none" }}>
        <h1 className="tm-visually-hidden">
          {era.year}: {era.title}
        </h1>
        <Box
          ref={desktopRef}
          sx={{
            position: "relative",
            height: small ? "auto" : desktopH,
            overflow: small ? "visible" : "hidden",
            p: small ? 1 : 0,
            display: small ? "flex" : "block",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* desktop icons */}
          <Box
            component="nav"
            aria-label="Desktop"
            sx={{
              position: small ? "static" : "absolute",
              left: 8,
              top: 8,
              display: "grid",
              gridTemplateColumns: small ? "repeat(auto-fill, minmax(76px, 1fr))" : "76px",
              gap: 1,
              zIndex: 0,
            }}
          >
            {windows.map((w) => (
              <Box
                key={w.id}
                component="button"
                type="button"
                onClick={() => focus(w.id)}
                aria-label={`Open ${w.title}`}
                sx={{
                  background: "none",
                  border: 0,
                  color: "#fff",
                  cursor: "pointer",
                  display: "grid",
                  justifyItems: "center",
                  gap: 0.5,
                  p: 0.5,
                  font: `12px ${WIN_FONT}`,
                  "&:focus-visible": { outline: "1px dotted #fff" },
                  "&:focus-visible span, &:active span": { background: "#000080" },
                }}
              >
                <w.Icon sx={{ fontSize: 34, filter: "drop-shadow(1px 1px 0 #000)" }} aria-hidden />
                <Box component="span" sx={{ px: 0.5, textShadow: "1px 1px 0 #000", lineHeight: 1.2, background: "rgba(0, 40, 40, 0.55)" }}>
                  {w.id === "welcome" ? `${era.year}.exe` : w.title}
                </Box>
              </Box>
            ))}
          </Box>

          {windows.map((w, i) =>
            state[w.id].open ? (
              <Win98Window
                key={w.id}
                win={w}
                // Cascade in stacking order so each title bar peeks out above the next window.
                index={i === 0 ? windows.length - 1 : windows.length - 1 - i}
                z={zOrder.indexOf(w.id) + 1}
                active={w.id === activeId}
                small={small}
                state={state[w.id]}
                constraints={desktopRef}
                onFocus={() => focus(w.id)}
                onClose={() => patch(w.id, { open: false, maximized: false })}
                onMinimize={() => patch(w.id, { minimized: true })}
                onToggleMax={() => patch(w.id, { maximized: !state[w.id].maximized })}
              />
            ) : null,
          )}
        </Box>
      </Box>

      {/* taskbar */}
      <Box
        className="fx-bevel-out"
        sx={{
          position: "sticky",
          bottom: "var(--tm-slider-h)",
          zIndex: 50,
          height: TASKBAR_H,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 0.5,
          boxShadow: "inset 0 1px #dfdfdf, inset 0 2px #fff",
        }}
      >
        <Box
          component="button"
          type="button"
          aria-haspopup="menu"
          aria-expanded={startOpen}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => setStartAnchor(startOpen ? null : e.currentTarget)}
          className={startOpen ? "fx-bevel-in" : "fx-bevel-out"}
          sx={{ display: "flex", alignItems: "center", gap: 0.75, height: 26, px: 1, border: 0, font: `700 13px ${WIN_FONT}`, cursor: "pointer", background: "#c0c0c0 !important", "&:focus-visible": { outline: "1px dotted #000", outlineOffset: -4 } }}
        >
          <StartLogo />
          Start
        </Box>
        <Box sx={{ display: "flex", gap: 0.5, flex: 1, overflowX: "auto", minWidth: 0 }}>
          {windows
            .filter((w) => state[w.id].open)
            .map((w) => (
              <Box
                key={w.id}
                component="button"
                type="button"
                aria-pressed={w.id === activeId}
                onClick={() => onTaskbarClick(w.id)}
                className={w.id === activeId ? "fx-bevel-in" : "fx-bevel-out"}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 0.5,
                  height: 26,
                  px: 0.75,
                  minWidth: 0,
                  maxWidth: 160,
                  border: 0,
                  font: `${w.id === activeId ? 700 : 400} 12px ${WIN_FONT}`,
                  cursor: "pointer",
                  background: w.id === activeId ? "repeating-conic-gradient(#c0c0c0 0 25%, #fff 0 50%) 0 0 / 2px 2px !important" : "#c0c0c0 !important",
                  "&:focus-visible": { outline: "1px dotted #000", outlineOffset: -4 },
                }}
              >
                <w.Icon sx={{ fontSize: 14 }} aria-hidden />
                <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {w.title}
                </Box>
              </Box>
            ))}
        </Box>
        <Box className="fx-bevel-in" title={eraDate(era.year)} sx={{ height: 24, px: 1, display: "flex", alignItems: "center", font: `12px ${WIN_FONT}`, background: "#c0c0c0 !important", whiteSpace: "nowrap" }}>
          {clock.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </Box>
      </Box>

      <Menu
        anchorEl={startAnchor}
        open={startOpen}
        onClose={closeStart}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{ paper: { className: "fx-bevel-out", sx: { borderRadius: 0, display: "flex", p: "3px" } } }}
        MenuListProps={{ dense: true, sx: { py: 0, minWidth: 200 } }}
      >
        <Box
          aria-hidden
          sx={{ position: "absolute", left: 3, top: 3, bottom: 3, width: 24, background: "linear-gradient(0deg, #000080, #1084d0)", color: "#c0c0c0", writingMode: "vertical-rl", transform: "rotate(180deg)", font: `700 15px ${WIN_FONT}`, pt: 1 }}
        >
          TimeOS <span style={{ color: "#fff" }}>98</span>
        </Box>
        {windows.map((w) => (
          <MenuItem key={w.id} onClick={() => openFromMenu(w.id)} sx={{ pl: 5, gap: 1, font: `13px ${WIN_FONT}`, "&:hover, &.Mui-focusVisible": { background: "#000080", color: "#fff" } }}>
            <w.Icon sx={{ fontSize: 18 }} aria-hidden />
            {w.title}
          </MenuItem>
        ))}
        <Box component="li" role="separator" sx={{ ml: 4.5, my: 0.5, borderTop: "1px solid #808080", borderBottom: "1px solid #fff" }} />
        <MenuItem onClick={openLanding} sx={{ pl: 5, gap: 1, font: `13px ${WIN_FONT}`, "&:hover, &.Mui-focusVisible": { background: "#000080", color: "#fff" } }}>
          <HistoryIcon sx={{ fontSize: 18 }} aria-hidden />
          Choose another year…
        </MenuItem>
      </Menu>
    </Box>
  );
}
