import type { CSSProperties } from "react";
import type { DeepDiveSectionId, OverlayEra } from "../../data/types";

type MotifStyle = NonNullable<OverlayEra["deepDive"]>["motifStyle"];

/** Generic line drawings (48×48): no emblems, flags, deities or logos. */
const PATHS: Record<DeepDiveSectionId, string[]> = {
  "technology-science": ["M24 16a8 8 0 1 0 0 16a8 8 0 1 0 0-16z", "M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M10 38l4-4M34 14l4-4"],
  "government-politics": ["M6 40h36M8 16h32L24 6z", "M12 18v20M20 18v20M28 18v20M36 18v20"],
  "freedom-history": ["M18 18a10 10 0 1 0 0 20a10 10 0 1 0 0-20z", "M8 28h20M18 18v20M28 28h14M42 24v8"],
  personalities: ["M10 6h28v36H10z", "M24 16a5 5 0 1 0 0 10a5 5 0 1 0 0-10z", "M15 38c0-7 18-7 18 0"],
  achievements: ["M18 6l6 12 6-12", "M24 20a9 9 0 1 0 0 18a9 9 0 1 0 0-18z", "M24 25l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z"],
  sports: ["M10 38L30 10l4 3L14 41z", "M38 34a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z"],
  literature: ["M24 12c-4-4-12-4-18-2v28c6-2 14-2 18 2 4-4 12-4 18-2V10c-6-2-14-2-18 2z", "M24 12v28"],
  "books-reading": ["M8 10h26v28H8z", "M34 16h6v22a3 3 0 0 1-6 0", "M12 16h18M12 22h18M12 28h12"],
  cinema: ["M24 8a16 16 0 1 0 0 32a16 16 0 1 0 0-32z", "M24 20a4 4 0 1 0 0 8a4 4 0 1 0 0-8z", "M24 12v4M24 32v4M12 24h4M32 24h4"],
  "music-arts": ["M6 36c0-6 8-8 12-8s12 2 12 8v4H6z", "M6 28a12 4 0 1 0 24 0", "M32 40v-8c0-5 4-7 8-7s6 2 6 7v8z"],
  "economy-business": ["M24 8a16 16 0 1 0 0 32a16 16 0 1 0 0-32z", "M24 14v20", "M18 20c0-3 12-3 12 0s-12 3-12 6 12 3 12 0"],
};

interface MotifProps {
  id: DeepDiveSectionId;
  style: MotifStyle;
  size?: number;
  accent?: string;
  accent2?: string;
  className?: string;
  css?: CSSProperties;
}

/** One motif, restyled per era: woodcut, Deco linework, stamp, poster, signboard, pixel, gif, bevel, gloss, flat, tile, holo. */
export function Motif({ id, style, size = 48, accent, accent2, className, css }: MotifProps) {
  const d = PATHS[id];
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const draw = (extra: Record<string, unknown>, key = "m") => d.map((p, i) => <path key={`${key}${i}`} d={p} {...common} {...extra} />);
  let body;
  switch (style) {
    case "woodcut":
      body = draw({ strokeWidth: 3, fill: "currentColor", fillOpacity: 0.12 });
      break;
    case "deco":
      body = (
        <>
          <circle cx="24" cy="24" r="22" {...common} strokeWidth="1" />
          {draw({ strokeWidth: 1.6, strokeLinecap: "square", strokeLinejoin: "miter" })}
        </>
      );
      break;
    case "stamp":
      body = (
        <>
          <rect x="2" y="2" width="44" height="44" rx="3" {...common} strokeWidth="2" strokeDasharray="3 2.5" />
          {draw({ strokeWidth: 2.4 })}
        </>
      );
      break;
    case "poster":
      body = draw({ strokeWidth: 3.5, fill: "currentColor", fillOpacity: 0.9, strokeLinejoin: "miter" });
      break;
    case "signboard":
      body = (
        <>
          <g transform="translate(1.5 1.5)" style={{ color: accent2 ?? accent ?? "currentColor" }}>
            {draw({ strokeWidth: 3.2 }, "s")}
          </g>
          {draw({ strokeWidth: 3.2, fill: "currentColor", fillOpacity: 0.2 })}
        </>
      );
      break;
    case "pixel":
      body = <g shapeRendering="crispEdges">{draw({ strokeWidth: 4, strokeLinecap: "butt", strokeLinejoin: "miter" })}</g>;
      break;
    case "gif":
      body = (
        <>
          <g transform="translate(1.2 1.2)" style={{ color: accent2 ?? accent ?? "currentColor" }}>
            {draw({ strokeWidth: 2.4 }, "g")}
          </g>
          {draw({ strokeWidth: 2.4 })}
        </>
      );
      break;
    case "bevel":
      body = (
        <>
          <g transform="translate(-1 -1)" style={{ color: "#fff" }}>{draw({ strokeWidth: 2.4 }, "h")}</g>
          <g transform="translate(1 1)" style={{ color: "#555" }}>{draw({ strokeWidth: 2.4 }, "d")}</g>
          {draw({ strokeWidth: 2.2 })}
        </>
      );
      break;
    case "gloss":
      body = (
        <>
          <defs>
            <linearGradient id={`gl-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="0.5" stopColor="currentColor" stopOpacity="0.25" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {draw({ strokeWidth: 2.4, fill: `url(#gl-${id})` })}
        </>
      );
      break;
    case "flat":
      body = draw({ strokeWidth: 0, fill: "currentColor" });
      break;
    case "tile":
      body = (
        <>
          <rect x="2" y="2" width="44" height="44" rx="8" fill="currentColor" fillOpacity="0.12" />
          {draw({ strokeWidth: 2.2 })}
        </>
      );
      break;
    case "stitch":
      body = (
        <>
          <rect x="3" y="3" width="42" height="42" rx="14" {...common} strokeWidth="1.6" strokeDasharray="4 3" />
          {draw({ strokeWidth: 2.2, strokeDasharray: "4 3" })}
        </>
      );
      break;
    case "holo":
      body = <g style={{ filter: "drop-shadow(0 0 3px currentColor)" }}>{draw({ strokeWidth: 1.5 })}</g>;
      break;
  }
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden focusable="false" className={className} style={css}>
      {body}
    </svg>
  );
}
