import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { InteractiveProps } from "./types";

/** Every deep-dive interactive is its own chunk. The names match DEEP_DIVE_SECTIONS[].component. */
export const INTERACTIVES: Record<string, LazyExoticComponent<ComponentType<InteractiveProps>>> = {
  TechThenNow: lazy(() => import("./TechThenNow")),
  WhoGoverned: lazy(() => import("./WhoGoverned")),
  ChronicleScroll: lazy(() => import("./ChronicleScroll")),
  PortraitGallery: lazy(() => import("./PortraitGallery")),
  MilestoneWall: lazy(() => import("./MilestoneWall")),
  ScorecardReplay: lazy(() => import("./ScorecardReplay")),
  Bookshelf3D: lazy(() => import("./Bookshelf3D")),
  ReadingRoom: lazy(() => import("./ReadingRoom")),
  ProjectorReel: lazy(() => import("./ProjectorReel")),
  RiyaazRoom: lazy(() => import("./RiyaazRoom")),
  RupeeDashboard: lazy(() => import("./RupeeDashboard")),
};
