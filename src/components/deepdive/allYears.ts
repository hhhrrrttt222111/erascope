import { useEffect, useState } from "react";
import { getDeepDive, ERA_YEARS } from "../../data";
import type { CountryId, DeepDive, DeepDiveItem, DeepDiveSectionId, EraId } from "../../data/types";

export interface FlatItem {
  item: DeepDiveItem;
  year: EraId;
  section: DeepDiveSectionId;
  speculative: boolean;
}

/** Loads every year's deep dive once (13 small chunks, only when a cross-year panel is opened). */
export function useAllDeepDives(country: CountryId) {
  const [items, setItems] = useState<FlatItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    Promise.all(ERA_YEARS.map((y) => getDeepDive(country, y)))
      .then((list) => {
        if (cancelled) return;
        const flat: FlatItem[] = [];
        for (const dd of list.filter(Boolean) as DeepDive[]) {
          for (const [sid, sec] of Object.entries(dd.sections)) {
            for (const item of sec!.items) flat.push({ item, year: dd.year, section: sid as DeepDiveSectionId, speculative: dd.speculative });
          }
        }
        setItems(flat);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [country]);
  return { items, failed };
}

/** Jump to a section page of another year, then bring the item into view once it renders. */
export function goToItem(country: CountryId, f: FlatItem) {
  window.location.hash = `/${country}/${f.year}/deep-dive/${f.section}`;
  let tries = 0;
  const t = window.setInterval(() => {
    const el = document.getElementById(`item-${f.item.id}`);
    tries += 1;
    if (el) {
      el.scrollIntoView({ block: "center" });
      window.clearInterval(t);
    } else if (tries > 20) window.clearInterval(t);
  }, 150);
}
