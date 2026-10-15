/**
 * Fixed facts about the deep dive that the app and the Node validator share:
 * the 11 sections, the interactive each one uses, and how many items it needs.
 */
import type { DeepDiveSectionId } from "./types.ts";

export interface SectionSpec {
  id: DeepDiveSectionId;
  label: string;
  /** The shared interactive component every year uses for this section. */
  component: string;
  /** Item kind this section holds. */
  kind: string;
  /** Minimum items in a non-speculative year (unless a scarcityNote explains the gap). */
  min: number;
}

export const DEEP_DIVE_SECTIONS: readonly SectionSpec[] = [
  { id: "technology-science", label: "Technology & science", component: "TechThenNow", kind: "tech", min: 4 },
  { id: "government-politics", label: "Government & politics", component: "WhoGoverned", kind: "governance", min: 4 },
  { id: "freedom-history", label: "Independence & history", component: "ChronicleScroll", kind: "event", min: 4 },
  { id: "personalities", label: "Famous personalities", component: "PortraitGallery", kind: "person", min: 6 },
  { id: "achievements", label: "Achievements", component: "MilestoneWall", kind: "achievement", min: 3 },
  { id: "sports", label: "Sports", component: "ScorecardReplay", kind: "sport", min: 4 },
  { id: "literature", label: "Literature", component: "Bookshelf3D", kind: "work", min: 4 },
  { id: "books-reading", label: "Books & reading", component: "ReadingRoom", kind: "work", min: 4 },
  { id: "cinema", label: "Cinema", component: "ProjectorReel", kind: "film", min: 4 },
  { id: "music-arts", label: "Music & arts", component: "RiyaazRoom", kind: "art", min: 4 },
  { id: "economy-business", label: "Economy & business", component: "RupeeDashboard", kind: "indicator", min: 3 },
] as const;

export const SECTION_IDS = DEEP_DIVE_SECTIONS.map((s) => s.id);

export const isSectionId = (v: unknown): v is DeepDiveSectionId => SECTION_IDS.includes(v as DeepDiveSectionId);

export const sectionSpec = (id: DeepDiveSectionId) => DEEP_DIVE_SECTIONS.find((s) => s.id === id)!;
