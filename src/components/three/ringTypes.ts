import type { ReactNode } from "react";

/** Props shared between the app project and the 3D project for the deep-dive hub ring. */
export interface RingPortal {
  id: string;
  label: ReactNode; // DOM drawn on the portal (motif + number), supplied by the app side
}

export interface RingColors {
  frame: string;
  inner: string;
  accent: string;
}

export interface HubRingProps {
  portals: RingPortal[];
  index: number;
  frame: { shape: "rect" | "arch" | "round"; border: number; glow: boolean };
  colors: RingColors;
  reduced: boolean;
  /** Portal id the camera is flying through, or null. */
  flying: string | null;
  onSelect: (id: string, index: number) => void;
  onArrive: (id: string) => void;
}

export interface DeviceModelProps {
  kind: "box" | "tower" | "handset" | "slab";
  color: string;
  accent: string;
  animate: boolean;
}
