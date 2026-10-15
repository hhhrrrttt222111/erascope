import type { DeepDiveItem, DeepDiveSection, DeepDiveSectionId, EraId } from "../../../data/types";

/** Props every deep-dive interactive receives. `section.interactive.data` is the component-specific config. */
export interface InteractiveProps {
  year: EraId;
  sectionId: DeepDiveSectionId;
  section: DeepDiveSection;
}

export const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
export const dataOf = (p: InteractiveProps) => (p.section.interactive.data ?? {}) as Record<string, unknown>;
export const itemsOfKind = <K extends DeepDiveItem["kind"]>(p: InteractiveProps, kind: K) =>
  p.section.items.filter((i): i is Extract<DeepDiveItem, { kind: K }> => i.kind === kind);
export const monthOf = (date?: string) => (date && /^\d{4}-\d{2}/.test(date) ? Number(date.slice(5, 7)) : null);
