/** Year-page order: five groups of sections. Edit here only; components read this list. */
import type { EverydaySectionId } from "./types.ts";

export type PageSectionId = EverydaySectionId | "morning" | "places" | "prices" | "headlines" | "tech" | "futures";

export const PAGE_GROUPS: readonly { title: string; sections: readonly PageSectionId[] }[] = [
  { title: "A day in the life", sections: ["morning", "places", "foodAndKitchen", "clothingAndStyle"] },
  { title: "Money and work", sections: ["prices", "workAndWages", "byTheNumbers"] },
  { title: "Growing up and staying well", sections: ["schoolAndChildhood", "healthAndMedicine"] },
  { title: "Out and about", sections: ["gettingAround", "keepingInTouch", "leisureAndFun"] },
  { title: "The year itself", sections: ["spotlight", "headlines", "tech", "futures"] },
];

/** Default title and minimum item count for each everyday section. */
export const EVERYDAY_SECTIONS: Record<EverydaySectionId, { title: string; min: number }> = {
  byTheNumbers: { title: "The year in numbers", min: 6 },
  foodAndKitchen: { title: "Food and the kitchen", min: 5 },
  clothingAndStyle: { title: "What people wore", min: 5 },
  workAndWages: { title: "Work and wages", min: 5 },
  schoolAndChildhood: { title: "Growing up", min: 5 },
  gettingAround: { title: "Getting around", min: 5 },
  keepingInTouch: { title: "Keeping in touch", min: 5 },
  healthAndMedicine: { title: "Health and medicine", min: 5 },
  leisureAndFun: { title: "Evenings, weekends and festivals", min: 5 },
  spotlight: { title: "Spotlight", min: 5 },
};

/** "foodAndKitchen" -> "food-and-kitchen", used in deep links like #/in/1945/food-and-kitchen. */
export const sectionSlug = (id: string) => id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
export const sectionFromSlug = (slug: string): PageSectionId | undefined =>
  PAGE_GROUPS.flatMap((g) => g.sections).find((id) => sectionSlug(id) === slug);
