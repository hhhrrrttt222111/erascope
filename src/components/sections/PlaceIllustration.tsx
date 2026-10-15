import { Box, useTheme } from "@mui/material";
import { useId, type ReactNode } from "react";
import type { ChromeId, EraId, Place } from "../../data/types";
import { useShellEra } from "../../context/EraContext";

/** Era image treatments (classes live in styles/era-css, loaded with each chrome). */
const FX_CLASS: Partial<Record<ChromeId, string>> = {
  artnouveau: "fx-cabinet",
  newspaper: "fx-halftone",
  homefront: "fx-faded",
  midcentury: "fx-scanlines",
  terminal: "fx-phosphor",
};

/**
 * Picture for a place. Uses `image` from the JSON when present, otherwise draws
 * a stand-in: a mock front page built from the highlights, or a simple SVG scene.
 */
export function PlaceIllustration({ place }: { place: Place }) {
  const theme = useTheme();
  const era = useShellEra();
  const fx = FX_CLASS[theme.era.chrome] ?? "";

  const content: ReactNode = place.image ? (
    <Box component="img" src={place.image} alt={place.imageAlt} loading="lazy" sx={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
  ) : (
    <Box role="img" aria-label={place.imageAlt} sx={{ width: "100%", height: "100%" }}>
      {place.kind === "newspaper" ? <FrontPageMock place={place} /> : <SceneSvg kind={place.kind} year={era.year} />}
    </Box>
  );

  return (
    <Box
      className={fx}
      sx={{
        aspectRatio: "16 / 10",
        overflow: "hidden",
        borderRadius: `${theme.shape.borderRadius}px`,
        border: theme.era.chrome === "win98" ? 0 : `1px solid ${theme.palette.divider}`,
        boxShadow: theme.era.chrome === "win98" ? "inset -1px -1px #fff, inset 1px 1px #0a0a0a" : "none",
        background: theme.palette.background.paper,
      }}
    >
      {content}
    </Box>
  );
}

/** Grey bars standing in for body copy. */
function TextLines({ count, color }: { count: number; color: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Box key={i} sx={{ height: 3, my: "3px", background: color, opacity: 0.35, width: i === count - 1 ? "60%" : "100%" }} />
      ))}
    </>
  );
}

function FrontPageMock({ place }: { place: Place }) {
  const theme = useTheme();
  const era = useShellEra();
  const ink = theme.palette.text.primary;
  const chrome = theme.era.chrome;
  const [lead, ...rest] = place.highlights;

  if (chrome === "terminal") {
    return (
      <Box sx={{ height: "100%", p: 1.5, background: "#000", color: theme.palette.primary.main, fontFamily: theme.era.accentFont, fontSize: 13, lineHeight: 1.5 }}>
        <Box sx={{ background: theme.palette.primary.main, color: "#000", px: 0.5, mb: 1 }}>NEWS SERVICE P101 {era.year}</Box>
        {place.highlights.map((h, i) => (
          <Box key={h}>
            {String(i + 1).padStart(2, "0")} {h.toUpperCase()}
          </Box>
        ))}
        <Box sx={{ mt: 1 }}>&gt; SELECT STORY _</Box>
      </Box>
    );
  }

  if (chrome === "earlyweb" || chrome === "win98") {
    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", background: "#c0c0c0", fontFamily: "Tahoma, sans-serif" }}>
        <Box className="fx-titlebar" sx={{ fontSize: 11 }}>Web Browser</Box>
        <Box sx={{ px: 1, py: 0.5, fontSize: 11, display: "flex", gap: 1, alignItems: "center" }}>
          Location:
          <Box className="fx-bevel-in" sx={{ flex: 1, px: 0.5, py: 0.25 }}>http://www.dailynews.example/</Box>
        </Box>
        <Box className="fx-bevel-in" sx={{ flex: 1, m: 0.5, p: 1, overflow: "hidden", fontFamily: "'Times New Roman', serif", background: chrome === "earlyweb" ? "#bfbfbf !important" : undefined }}>
          <Box sx={{ fontWeight: 700, fontSize: 18, color: "#c00" }}>NEWS ONLINE</Box>
          <Box sx={{ fontSize: 15, fontWeight: 700, my: 0.5 }}>{lead}</Box>
          {rest.map((h) => (
            <Box key={h} sx={{ fontSize: 12, color: "#0000ee", textDecoration: "underline", my: 0.25 }}>
              {h}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (chrome === "web2gloss" || chrome === "flatweb") {
    const gloss = chrome === "web2gloss";
    return (
      <Box sx={{ height: "100%", background: "#fff" }}>
        <Box
          sx={{
            background: gloss ? `linear-gradient(#ffffff55, transparent 50%), ${theme.palette.secondary.main}` : theme.palette.primary.main,
            color: gloss ? "#0b2a3d" : "#fff",
            px: 1.5,
            py: 0.75,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {gloss ? "news 2.0 (beta)" : "news"}
        </Box>
        <Box sx={{ p: 1.5, display: "grid", gap: 1 }}>
          {place.highlights.map((h, i) => (
            <Box key={h} sx={{ display: "flex", gap: 1, alignItems: "center", borderBottom: "1px solid #e9ebee", pb: 0.75 }}>
              <Box sx={{ width: i === 0 ? 56 : 36, height: i === 0 ? 40 : 26, background: "#dddfe2", borderRadius: gloss ? "6px" : "2px", flexShrink: 0 }} />
              <Box>
                <Box sx={{ fontSize: i === 0 ? 14 : 12, fontWeight: 600, color: "#1d2129" }}>{h}</Box>
                <Box sx={{ fontSize: 10, color: gloss ? "#2a6f97" : theme.palette.primary.main }}>{gloss ? "Digg it · Bookmark · RSS" : "Like · Comment · Share"}</Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (chrome === "videocall") {
    return (
      <Box sx={{ height: "100%", p: 1.5, background: "#18181b", display: "grid", gap: 1, alignContent: "start" }}>
        <Box sx={{ fontSize: 11, fontWeight: 700, color: theme.palette.primary.main, letterSpacing: "0.08em" }}>LIVE UPDATES</Box>
        {place.highlights.map((h, i) => (
          <Box key={h} sx={{ background: "#26262c", borderRadius: "8px", px: 1.25, py: 0.75, borderLeft: i === 0 ? `3px solid ${theme.palette.primary.main}` : "3px solid transparent" }}>
            <Box sx={{ fontSize: i === 0 ? 14 : 12, fontWeight: 600, color: "#ececf1" }}>{h}</Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (chrome === "futureos") {
    return (
      <Box sx={{ height: "100%", p: 1.5, display: "grid", gap: 1, alignContent: "start", background: "radial-gradient(circle at 30% 20%, rgba(34,228,255,0.12), transparent 60%)" }}>
        {place.highlights.map((h, i) => (
          <Box key={h} className="fx-glass" sx={{ borderRadius: "10px", px: 1.25, py: 0.75, opacity: 1 - i * 0.12 }}>
            <Box sx={{ fontSize: 9, letterSpacing: "0.2em", color: theme.palette.primary.main }}>✓ VERIFIED SOURCE · AI SUMMARY</Box>
            <Box sx={{ fontSize: i === 0 ? 14 : 12, color: theme.palette.text.primary }}>{h}</Box>
          </Box>
        ))}
      </Box>
    );
  }

  // Broadsheet front page for the print eras (1900–1970).
  const sans = chrome === "midcentury" || chrome === "groovy";
  return (
    <Box sx={{ height: "100%", p: 1.5, background: theme.palette.background.paper, color: ink, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          textAlign: "center",
          fontFamily: chrome === "newspaper" ? theme.era.accentFont : theme.typography.h1.fontFamily,
          fontWeight: sans ? 800 : 400,
          fontSize: { xs: 18, sm: 24 },
          lineHeight: 1,
          textTransform: sans ? "uppercase" : "none",
        }}
      >
        The Daily Chronicle
      </Box>
      <Box sx={{ borderTop: `2px solid ${ink}`, borderBottom: `1px solid ${ink}`, my: 0.5, py: "1px", fontSize: 8, display: "flex", justifyContent: "space-between", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        <span>Late edition</span>
        <span>{era.year}</span>
        <span>Morning</span>
      </Box>
      <Box sx={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 900, fontSize: { xs: 14, sm: 18 }, lineHeight: 1.1, textAlign: "center", textTransform: "uppercase", my: 0.5 }}>{lead}</Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, flex: 1, overflow: "hidden" }}>
        {rest.map((h) => (
          <Box key={h} sx={{ borderTop: `1px solid ${ink}`, pt: 0.5 }}>
            <Box sx={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 700, fontSize: 10, lineHeight: 1.15, mb: 0.5 }}>{h}</Box>
            <TextLines count={24} color={ink} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

interface Colors {
  ink: string;
  main: string;
  accent: string;
  dark: boolean;
}

function Wheel({ cx, cy, r = 9, c }: { cx: number; cy: number; r?: number; c: string }) {
  return <circle cx={cx} cy={cy} r={r} fill={c} />;
}

function Person({ x, c, children }: { x: number; c: string; children?: ReactNode }) {
  return (
    <g stroke={c} strokeWidth="2" fill="none">
      <circle cx={x} cy={116} r={5} fill={c} />
      <path d={`M${x} 121 v18 M${x} 139 l-6 12 M${x} 139 l6 12 M${x} 126 l-6 8`} />
      {children}
    </g>
  );
}

/** Era-specific things on the street. */
function StreetProps({ year, c }: { year: EraId; c: Colors }) {
  const { ink, main, accent, dark } = c;
  switch (year) {
    case 1900:
      return (
        <g>
          {/* horse and buggy, hitching rail */}
          <path d="M150 150 q4 -22 26 -22 h20 q10 0 14 -10 l8 -8 l4 4 l-4 10 q0 10 -10 14 v12" fill={ink} opacity="0.85" />
          {[156, 172, 196, 210].map((x) => <line key={x} x1={x} y1="146" x2={x} y2="168" stroke={ink} strokeWidth="3" />)}
          <path d="M60 146 h70 v-26 q-35 -14 -70 0 z" fill={ink} opacity="0.8" />
          <line x1="130" y1="140" x2="160" y2="140" stroke={ink} strokeWidth="2" />
          <circle cx="80" cy="166" r="12" fill="none" stroke={ink} strokeWidth="2.5" />
          <circle cx="118" cy="166" r="12" fill="none" stroke={ink} strokeWidth="2.5" />
          <rect x="268" y="128" width="4" height="22" fill={ink} />
          <rect x="258" y="128" width="24" height="3" fill={ink} />
        </g>
      );
    case 1920:
      return (
        <g>
          <line x1="0" y1="96" x2="320" y2="96" stroke={ink} />
          <line x1="230" y1="96" x2="250" y2="132" stroke={ink} strokeWidth="1.5" />
          <rect x="200" y="132" width="100" height="36" rx="4" fill={accent} />
          {[210, 232, 254, 276].map((x) => <rect key={x} x={x} y="138" width="14" height="12" fill="#f3ebd6" />)}
          <rect x="40" y="152" width="70" height="16" fill={ink} />
          <rect x="62" y="134" width="34" height="18" fill={ink} />
          <circle cx="54" cy="172" r="9" fill="none" stroke={ink} strokeWidth="3" />
          <circle cx="98" cy="172" r="9" fill="none" stroke={ink} strokeWidth="3" />
          <line x1="160" y1="150" x2="160" y2="104" stroke={ink} strokeWidth="3" />
          <circle cx="160" cy="100" r="5" fill="#f2d16b" stroke={ink} />
        </g>
      );
    case 1930:
      return (
        <g>
          {/* stepped skyscraper with a spire */}
          <path d="M226 150 V60 h10 V40 h10 V24 h8 V40 h10 V60 h10 V150 z" fill={main} opacity="0.9" />
          <line x1="250" y1="24" x2="250" y2="6" stroke={main} strokeWidth="2" />
          <path d="M50 172 v-16 q2 -14 18 -14 h10 l8 -12 h34 l8 12 h10 q8 0 8 14 v16 z" fill={ink} />
          <Wheel cx={68} cy={174} c="#111" />
          <Wheel cx={132} cy={174} c="#111" />
        </g>
      );
    case 1945:
      return (
        <g>
          {/* rounded 1940s car and a victory-garden plot */}
          <path d="M40 172 q0 -18 22 -20 q12 -18 40 -18 q26 0 36 18 q20 2 22 20 z" fill={main} />
          <Wheel cx={70} cy={174} c="#222" />
          <Wheel cx={134} cy={174} c="#222" />
          <rect x="196" y="132" width="110" height="18" fill="#6b4f2a" />
          {[204, 222, 240, 258, 276, 294].map((x) => <path key={x} d={`M${x} 132 q-4 -10 0 -16 q4 6 0 16`} fill="#4f7a2e" />)}
          <rect x="250" y="100" width="44" height="22" fill={accent} />
          <text x="272" y="115" fontSize="8" fontWeight="700" textAnchor="middle" fill="#fff" fontFamily="sans-serif">GARDEN</text>
        </g>
      );
    case 1960:
      return (
        <g>
          <path d="M60 172 h150 l10 -10 l-12 -4 l-26 -16 h-62 l-26 16 h-30 z" fill={main} stroke={ink} strokeWidth="1.5" />
          <path d="M200 158 l20 -14 v14 z" fill={main} stroke={ink} />
          <rect x="60" y="164" width="160" height="4" fill="#d8d8d8" />
          <Wheel cx={92} cy={174} c={ink} />
          <Wheel cx={182} cy={174} c={ink} />
        </g>
      );
    case 1970:
      return (
        <g>
          {/* wood-panelled station wagon and a jumbo jet overhead */}
          <path d="M40 172 v-14 q0 -6 8 -8 l20 -16 h96 l10 16 h18 q8 0 8 8 v14 z" fill={main} />
          <rect x="44" y="154" width="150" height="10" fill="#7a4a1e" />
          <Wheel cx={72} cy={174} c={ink} />
          <Wheel cx={170} cy={174} c={ink} />
          <g transform="translate(206 26)" fill={dark ? "#9aa0b5" : "#5c5c5c"}>
            <path d="M0 10 h72 q10 0 14 4 q-4 4 -14 4 h-72 z" />
            <path d="M14 10 q4 -6 14 -6 h6 l4 6 z" />
            <path d="M34 14 l-14 14 h8 l20 -14 z" />
            <path d="M4 10 l-6 -10 h6 l8 10 z" />
          </g>
        </g>
      );
    case 1984:
      return (
        <g>
          <path d="M60 172 v-18 l20 -20 h70 l20 20 h20 v18 z" fill={main} />
          <Wheel cx={88} cy={174} c="#111" />
          <Wheel cx={168} cy={174} c="#111" />
          <rect x="216" y="92" width="86" height="22" fill="#111" stroke={accent} strokeWidth="2" />
          <text x="259" y="108" fontSize="12" fontWeight="700" textAnchor="middle" fill={accent} fontFamily="monospace">ARCADE</text>
        </g>
      );
    case 1995:
      return (
        <g>
          {/* minivan and a payphone */}
          <path d="M60 172 v-24 q0 -16 16 -18 h86 q20 2 26 20 h8 q6 0 6 8 v14 z" fill={main} />
          <rect x="140" y="138" width="34" height="14" rx="3" fill="#cfe6f2" />
          <Wheel cx={90} cy={174} c="#111" />
          <Wheel cx={176} cy={174} c="#111" />
          <rect x="250" y="108" width="22" height="42" fill="#9aa0a8" stroke={ink} />
          <rect x="254" y="114" width="14" height="14" fill="#333" />
        </g>
      );
    case 1999:
      return (
        <g>
          <rect x="226" y="96" width="70" height="18" fill="#1d3fa8" />
          <text x="261" y="109" fill="#ffd400" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="Arial, sans-serif">VIDEO</text>
          <rect x="20" y="112" width="14" height="38" fill="#9aa0a8" stroke={ink} />
          <rect x="22" y="116" width="10" height="12" fill="#333" />
          <path d="M80 174 q4 -16 26 -18 l20 -12 h46 q20 2 30 14 l12 4 v12 z" fill="#7a1f2b" stroke={ink} />
          <Wheel cx={112} cy={176} c={ink} />
          <Wheel cx={186} cy={176} c={ink} />
        </g>
      );
    case 2005:
      return (
        <g>
          {/* SUV and a pedestrian with white earbuds */}
          <path d="M70 172 v-22 q0 -6 6 -8 l18 -16 h78 l14 18 h12 q6 0 6 8 v20 z" fill={main} />
          <Wheel cx={100} cy={174} r={11} c="#111" />
          <Wheel cx={176} cy={174} r={11} c="#111" />
          <Person x={262} c={ink}>
            <path d="M262 118 q6 10 2 24" stroke="#ffffff" strokeWidth="1.5" />
          </Person>
          <rect x="262" y="140" width="6" height="9" rx="1.5" fill="#ffffff" stroke={ink} strokeWidth="0.8" />
        </g>
      );
    case 2010:
      return (
        <g>
          <path d="M90 174 q2 -14 22 -16 l24 -14 h40 q22 4 30 18 v12 z" fill="#c8ced6" stroke={ink} />
          <Wheel cx={118} cy={176} c={ink} />
          <Wheel cx={186} cy={176} c={ink} />
          <rect x="236" y="138" width="6" height="14" fill={main} />
          {[252, 276].map((x) => (
            <g key={x} fill="none" stroke={main} strokeWidth="2">
              <circle cx={x} cy="146" r="6" />
              <circle cx={x + 16} cy="146" r="6" />
              <path d={`M${x} 146 l8 -8 l8 8 M${x + 8} 138 h6`} />
            </g>
          ))}
          <Person x={40} c={ink} />
          <rect x="47" y="127" width="5" height="8" fill={main} />
        </g>
      );
    case 2020:
      return (
        <g>
          {/* a masked pedestrian and a delivery cyclist */}
          <Person x={70} c={ink} />
          <rect x="65" y="116" width="10" height="5" rx="2" fill="#7fb3d5" />
          <g fill="none" stroke={ink} strokeWidth="2">
            <circle cx="190" cy="166" r="11" />
            <circle cx="238" cy="166" r="11" />
            <path d="M190 166 l14 -18 h20 l14 18 M204 148 l-4 -8" />
          </g>
          <rect x="198" y="120" width="26" height="22" rx="3" fill={main} />
          <circle cx="212" cy="112" r="6" fill={ink} />
        </g>
      );
    case 2050:
      return (
        <g>
          {[30, 120, 210, 290].map((x) => (
            <g key={x}>
              <rect x={x - 2} y="128" width="4" height="22" fill="#3b2a1a" />
              <circle cx={x} cy="122" r="14" fill="#1f8f6a" opacity="0.9" />
            </g>
          ))}
          <ellipse cx="160" cy="186" rx="60" ry="4" fill={main} opacity="0.35" />
          <rect x="104" y="146" width="112" height="30" rx="15" fill="#e8ecff" opacity="0.92" />
          <rect x="118" y="152" width="84" height="12" rx="6" fill={main} opacity="0.7" />
          <rect x="246" y="160" width="20" height="14" rx="3" fill={accent} />
        </g>
      );
  }
}

/** Era-specific things in the bedroom (on and around the nightstand). */
function BedroomProps({ year, c }: { year: EraId; c: Colors }) {
  const { ink, main, accent } = c;
  switch (year) {
    case 1900:
      return (
        <g>
          {/* kerosene lamp and a washstand with pitcher */}
          <path d="M186 118 h10 l-2 -8 q4 -6 0 -14 h-6 q-4 8 0 14 z" fill="#f5deb0" stroke={ink} />
          <rect x="187" y="92" width="8" height="4" fill={ink} />
          <rect x="244" y="112" width="44" height="36" fill={ink} opacity="0.7" />
          <path d="M258 112 q-4 -14 8 -16 q10 2 6 16 z" fill="#f3ebd6" stroke={ink} />
        </g>
      );
    case 1920:
      return (
        <g>
          <circle cx="191" cy="108" r="8" fill="#e8e0c8" stroke={ink} strokeWidth="1.5" />
          <circle cx="185" cy="99" r="3" fill={ink} />
          <circle cx="197" cy="99" r="3" fill={ink} />
          <line x1="120" y1="0" x2="120" y2="30" stroke={ink} />
          <circle cx="120" cy="34" r="5" fill="#fff6c8" stroke={ink} />
        </g>
      );
    case 1930:
      return (
        <g>
          {/* cathedral radio and a round mirror */}
          <path d="M178 118 v-14 q0 -14 13 -14 q13 0 13 14 v14 z" fill="#6b3f1f" />
          <path d="M184 112 v-8 q0 -7 7 -7 q7 0 7 7 v8 z" fill="#d9c7a0" />
          <circle cx="250" cy="70" r="20" fill="#d9e4ea" stroke={main} strokeWidth="3" />
        </g>
      );
    case 1945:
      return (
        <g>
          {/* table radio and a service flag in the window */}
          <rect x="178" y="102" width="28" height="16" rx="3" fill="#7a5230" />
          <circle cx="186" cy="110" r="4" fill="#d9c7a0" />
          <rect x="212" y="34" width="16" height="22" fill="#ffffff" stroke={accent} strokeWidth="3" />
          <path d="M220 40 l1.8 4 h4 l-3.2 2.6 l1.2 4 l-3.8 -2.4 l-3.8 2.4 l1.2 -4 l-3.2 -2.6 h4 z" fill="#1f3a5f" />
        </g>
      );
    case 1960:
      return (
        <g>
          <rect x="180" y="104" width="22" height="14" rx="3" fill={main} />
          <circle cx="186" cy="111" r="3.5" fill="#f3e9d2" />
          <polygon points="240,40 300,52 240,64" fill={accent} />
        </g>
      );
    case 1970:
      return (
        <g>
          {/* record player and a lava lamp */}
          <rect x="174" y="108" width="34" height="10" fill="#7a4a1e" />
          <ellipse cx="190" cy="108" rx="12" ry="3" fill="#111" />
          <path d="M256 118 l4 -34 h8 l4 34 z" fill={main} opacity="0.85" />
          <circle cx="264" cy="96" r="4" fill={accent} />
          <circle cx="263" cy="108" r="3" fill={accent} />
          <rect x="252" y="118" width="24" height="6" fill="#555" />
        </g>
      );
    case 1984:
      return (
        <g>
          {/* TV with a home computer and joystick */}
          <rect x="226" y="80" width="56" height="44" rx="4" fill="#5b4a3a" />
          <rect x="232" y="86" width="44" height="32" fill={main} opacity="0.85" />
          <rect x="224" y="128" width="60" height="10" fill="#8b8270" />
          <rect x="190" y="104" width="10" height="14" fill="#222" />
          <line x1="195" y1="104" x2="195" y2="94" stroke="#222" strokeWidth="2" />
        </g>
      );
    case 1995:
      return (
        <g>
          {/* CRT TV with a games console and a stack of CDs */}
          <rect x="228" y="82" width="54" height="42" rx="4" fill="#2b2b2b" />
          <rect x="234" y="88" width="42" height="30" fill={main} opacity="0.75" />
          <rect x="236" y="128" width="40" height="8" fill="#9a9a9a" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x="180" y={112 - i * 4} width="20" height="3" fill={i % 2 ? accent : "#ccc"} />)}
        </g>
      );
    case 1999:
      return (
        <g>
          <rect x="226" y="122" width="80" height="6" fill={ink} opacity="0.7" />
          <rect x="240" y="88" width="44" height="34" fill="#d8d0b8" stroke={ink} />
          <rect x="245" y="92" width="34" height="24" fill="#008080" />
          <rect x="290" y="96" width="14" height="26" fill="#d8d0b8" stroke={ink} />
        </g>
      );
    case 2005:
      return (
        <g>
          {/* laptop on the bed, flip phone and MP3 player */}
          <rect x="92" y="98" width="34" height="20" fill="#e6e6e6" stroke="#888" />
          <rect x="88" y="117" width="42" height="4" fill="#cfcfcf" />
          <rect x="182" y="104" width="8" height="14" rx="2" fill="#9aa4ad" />
          <rect x="194" y="106" width="8" height="12" rx="2" fill="#fff" stroke={ink} strokeWidth="0.8" />
          <circle cx="198" cy="114" r="2" fill="none" stroke={ink} strokeWidth="0.8" />
        </g>
      );
    case 2010:
      return (
        <g>
          <rect x="60" y="22" width="96" height="56" rx="3" fill="#111" />
          <rect x="64" y="26" width="88" height="48" fill={main} opacity="0.6" />
          <rect x="184" y="112" width="8" height="14" rx="1.5" fill="#111" />
        </g>
      );
    case 2020:
      return (
        <g>
          {/* desk with laptop, ring light and a face mask on a hook */}
          <rect x="226" y="122" width="80" height="6" fill={ink} opacity="0.7" />
          <rect x="246" y="102" width="34" height="20" fill="#2b2b33" />
          <circle cx="294" cy="84" r="12" fill="none" stroke="#fff6dc" strokeWidth="4" />
          <line x1="294" y1="96" x2="294" y2="122" stroke="#666" strokeWidth="2" />
          <rect x="74" y="40" width="18" height="10" rx="3" fill="#7fb3d5" />
          <path d="M74 45 h-4 M92 45 h4" stroke="#7fb3d5" strokeWidth="1.5" />
        </g>
      );
    case 2050:
      return (
        <g>
          <g fill="none" stroke={main} strokeWidth="2">
            <circle cx="184" cy="112" r="5" />
            <circle cx="198" cy="112" r="5" />
            <line x1="189" y1="112" x2="193" y2="112" />
          </g>
          <ellipse cx="100" cy="60" rx="40" ry="18" fill={accent} opacity="0.15" />
        </g>
      );
  }
}

/** Primitive SVG scene for a bedroom or street, with props that change by era. */
function SceneSvg({ kind, year }: { kind: "bedroom" | "street"; year: EraId }) {
  const theme = useTheme();
  const p = theme.palette;
  const dark = p.mode === "dark";
  const c: Colors = { ink: p.text.primary, main: p.primary.main, accent: p.secondary.main, dark };
  const glowId = useId();

  if (kind === "bedroom") {
    const wall = dark ? "#14141c" : p.background.paper;
    const floor = dark ? "#1d1d28" : p.background.default;
    return (
      <svg viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
        <defs>
          <linearGradient id={glowId} x1="0" x2="1">
            <stop offset="0" stopColor={c.main} stopOpacity="0.25" />
            <stop offset="1" stopColor={c.accent} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill={wall} />
        {year === 2050 && <rect width="320" height="140" fill={`url(#${glowId})`} />}
        <rect y="140" width="320" height="60" fill={floor} />
        {year === 1970 && <rect y="150" width="320" height="50" fill="#b8860b" opacity="0.35" />}
        <line x1="0" y1="140" x2="320" y2="140" stroke={c.ink} strokeOpacity="0.4" />
        <rect x="200" y="28" width="70" height="62" fill={dark ? "#1b2250" : "#cfe3f0"} stroke={c.ink} strokeWidth="2" />
        <line x1="235" y1="28" x2="235" y2="90" stroke={c.ink} strokeWidth="2" />
        <line x1="200" y1="59" x2="270" y2="59" stroke={c.ink} strokeWidth="2" />
        {year <= 1920 ? (
          <g stroke={c.ink} strokeWidth={2} fill="none">
            <path d="M30 150 V95 M30 95 H70 V150" />
            {[40, 50, 60].map((x) => <line key={x} x1={x} y1="98" x2={x} y2="130" />)}
            <rect x="30" y="128" width="130" height="16" fill={year === 1900 ? c.accent : p.background.default} />
            <line x1="160" y1="115" x2="160" y2="160" />
          </g>
        ) : (
          <g>
            <rect x="28" y="116" width="140" height="24" rx={year >= 2005 ? 6 : 2} fill={year === 2050 ? "#1c2350" : c.accent} opacity={0.85} />
            <rect x="28" y="94" width="12" height="50" rx="2" fill={c.ink} opacity="0.8" />
            <rect x="44" y="108" width="34" height="12" rx="5" fill={dark ? "#2b3470" : "#fff"} stroke={c.ink} strokeOpacity="0.4" />
          </g>
        )}
        <rect x="174" y="118" width="34" height="30" fill={c.ink} opacity="0.75" />
        <BedroomProps year={year} c={c} />
      </svg>
    );
  }

  const sky = dark ? "#0b0c18" : year <= 1920 ? "#e9e0c8" : "#cfe6f2";
  const suburban = year === 1960 || year === 1970;
  const road = year === 1900 ? "#a08a64" : dark ? "#101220" : year === 1920 ? "#8a8170" : "#4a4a4a";
  return (
    <svg viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
      <rect width="320" height="200" fill={sky} />
      {suburban ? (
        <g>
          <polygon points="20,110 90,82 160,110" fill={c.accent} opacity="0.9" />
          <rect x="30" y="110" width="120" height="40" fill={p.background.paper} stroke={c.ink} />
          <rect x="44" y="120" width="22" height="16" fill="#cfe6f2" stroke={c.ink} />
          <polygon points="180,112 240,90 300,112" fill={c.main} opacity="0.85" />
          <rect x="188" y="112" width="104" height="38" fill={p.background.paper} stroke={c.ink} />
        </g>
      ) : year === 1900 ? (
        <g>
          {[
            [14, 90, 80],
            [104, 80, 90],
            [204, 96, 100],
          ].map(([x, y, w]) => (
            <g key={x}>
              <rect x={x} y={y} width={w} height={150 - y} fill={c.ink} opacity="0.25" />
              <rect x={x + 10} y={y + 20} width={w - 20} height="16" fill={p.background.paper} opacity="0.7" />
            </g>
          ))}
        </g>
      ) : (
        <g>
          {[
            [10, 40, 70],
            [84, 64, 90],
            [160, 30, 66],
            [232, 54, 80],
          ].map(([x, y, w]) => (
            <g key={x}>
              <rect x={x} y={y} width={w} height={150 - y} fill={dark ? "#1a1c30" : c.ink} opacity={dark ? 1 : 0.18 + (x % 3) * 0.05} />
              {Array.from({ length: 3 }, (_, r) =>
                Array.from({ length: 3 }, (_, col) => (
                  <rect key={`${r}-${col}`} x={x + 8 + col * (w / 3.4)} y={y + 10 + r * 22} width="9" height="11" fill={dark ? ((r + col) % 2 ? c.main : c.accent) : "#fff"} opacity={dark ? 0.5 : 0.7} />
                )),
              )}
            </g>
          ))}
        </g>
      )}
      <rect y="150" width="320" height="10" fill={dark ? "#1a1f3d" : "#b9b2a0"} />
      <rect y="160" width="320" height="40" fill={road} />
      {year > 1920 && <line x1="0" y1="181" x2="320" y2="181" stroke={dark ? c.main : "#f2d16b"} strokeDasharray="14 10" strokeWidth="2" opacity={dark ? 0.6 : 1} />}
      <StreetProps year={year} c={c} />
    </svg>
  );
}
