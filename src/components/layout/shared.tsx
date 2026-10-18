import type SvgIcon from "@mui/material/SvgIcon";
type SvgIconComponent = typeof SvgIcon;
import type { ReactNode } from "react";

/** Original six ids plus the everyday sections (see data/pageLayout.ts). */
export type SectionId = string;

/** The six sections every chrome was designed around; the rest are the everyday sections. */
export const CORE_SECTIONS = ["morning", "headlines", "places", "prices", "tech", "futures"];

export interface ShellSection {
  id: SectionId;
  title: string;
  Icon: SvgIconComponent;
  node: ReactNode;
}

export interface ChromeProps {
  sections: ShellSection[];
}

export const sectionDomId = (id: SectionId) => `section-${id}`;
export const headingDomId = (id: SectionId) => `heading-${id}`;

/**
 * In-page navigation. Anchor links can't be used because the URL hash holds the
 * current era (#/1999), so scroll and move focus to the section heading instead.
 */
export function scrollToSection(id: SectionId) {
  const heading = document.getElementById(headingDomId(id));
  if (!heading) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  heading.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

/** Today's month and day, transposed into the era's year ("Tuesday, October 12, 1920"). */
export function eraDate(year: number, options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }) {
  const now = new Date();
  const d = new Date(year, now.getMonth(), now.getDate());
  d.setFullYear(year); // years below 100 would otherwise be mapped to 19xx
  return d.toLocaleDateString("en-US", options);
}

/** Bottom padding every chrome needs so the fixed timeline never covers content. */
export const SLIDER_CLEARANCE = "calc(var(--tm-slider-h) + 24px)";
