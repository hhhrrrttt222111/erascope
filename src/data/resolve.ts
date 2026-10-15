/**
 * Merges how an era looks (eraBase/<year>.json) with what a country says about it
 * (countries/<id>/eras/<year>.json). Plain TypeScript, no bundler APIs, so the Node
 * validator can use it too.
 */
import type { CountryEra, EraBase, ResolvedEra } from "./types.ts";

/** Keys a country era file must never contain: they belong to eraBase. */
export const BASE_ONLY_KEYS = ["theme", "scene", "speculative"] as const;

export function resolveEra(base: EraBase, content: CountryEra): ResolvedEra {
  const { sceneCaption, ...rest } = content;
  return {
    ...rest,
    year: base.year,
    speculative: base.speculative,
    theme: base.theme,
    scene: { component: base.scene.component, caption: sceneCaption },
  } as ResolvedEra;
}
