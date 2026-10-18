# Erascope

Pick a year (1920, 1960, 1999, 2010 or 2050) and step into an interactive snapshot of everyday
life in that era. Drag the timeline at the bottom of the screen and the whole interface changes with you:
a 1920 broadsheet, a 1960 television-age magazine, a 1999 desktop OS, a 2010 social-network page and a
speculative 2050 operating system.

Each era shows a morning routine, places (front page, bedroom, street), prices, technology, what
people of the time imagined about the future, and one small 3D scene.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks (tsc -b) and builds to dist/
npm run preview  # serves the production build
```

Stack: React 18, Vite, TypeScript, MUI v5, Framer Motion, three.js via @react-three/fiber and drei.
There is no backend: all content is static JSON.

Deep links: the current country and era live in the URL hash. `/#/1999` opens the original (World)
1999, `/#/in/1999` opens India 1999, and `/#/` shows the landing screen (country, then year). An unknown
country falls back to World; an unknown year snaps to the nearest era. The last country chosen is
remembered in `localStorage` and only preselects the landing screen; a URL always wins.

## Editing content (JSON only)

Content is split by *how an era looks* and *what it says*:

```
src/data/eraBase/<year>.json                    # theme, chrome, transition, scene component, speculative (shared by all countries)
src/data/countries/<country>/country.json       # country metadata
src/data/countries/<country>/eras/<year>.json   # the facts: title, persona, morning routine, places, prices, ...
```

`world` (the original, US-centred dataset) is the only country so far. A country never redefines
the theme; `getEra(country, year)` merges the base with the country's content at runtime.

To add or fix a fact, edit the JSON. No component changes are needed. The shape is defined in
[`src/data/types.ts`](src/data/types.ts). When the app loads, it checks every file and throws an
error naming the file and field if something is invalid, for example a misspelled `category`.

### Sections and fields

| Section | Array | Notes |
| --- | --- | --- |
| Morning routine | `morningRoutine` | `time`, `activity`, `detail`, optional `icon` |
| Places | `places` | Exactly three, with `kind` set to `newspaper`, `bedroom` or `street`. `imageAlt` is required. |
| Prices | `prices` | `price` is a string so approximations like `"about $0.12"` are allowed. Optional `adjusted2026`. |
| Technology | `technology` | `category` is one of `communication`, `entertainment`, `home`, `transport`, `work` |
| Imagined futures | `futureVisions` | `cameTrue` is one of `yes`, `partly`, `no`, `unknown` |

### Sources and unverified facts

- Any fact-like item can carry `"source": { "label": "...", "url": "..." }`. It is shown as a
  citation under the item. Only add a source if it really contains the figure, and never invent one.
- Mark anything you're unsure of with `"todo": true`. The UI labels it "Approximate, not yet
  verified", and you can find everything that still needs research with:

  ```bash
  grep -rn '"todo": true' src/data/countries/*/eras/
  ```

- `adjusted2026` values use the BLS CPI-U with August 2026 as the base month (see `docs/RESEARCH.md`),
  rounded and phrased as "about".

### The speculative era

`2050.json` has `"speculative": true`. That flag:

- shows a persistent **SPECULATIVE** badge in the 2050 top bar and on every card;
- requires every `futureVisions[].cameTrue` to be `"unknown"` (the loader enforces this);
- switches the price table to "Imagined price".

In 2050, `futureVisions` describes what people *living in 2050* might imagine about 2100.

### Icons

`morningRoutine[].icon` takes an MUI icon name such as `"Coffee"` or `"Tram"`. To keep the bundle
small, only icons listed in [`src/components/common/iconMap.ts`](src/components/common/iconMap.ts)
are available. Unknown names fall back to a clock icon. Adding a new icon is the one case that needs
a code change: add its name to the import and the map in that file.

### Images

Places and technology items accept an optional `image` path such as `/images/eras/1920/street.jpg`.
Put the file in [`public/images/eras/`](public/images/eras/) and set `image` and `imageAlt`. Without
an image, places show a generated stand-in: a mock front page built from `highlights`, or a simple
illustrated scene. Only use images you have the rights to, and add them to `CREDITS.md`.

### Theme and sound

`theme.palette` and `theme.fonts` in each JSON drive that era's MUI theme, so recolouring an era is a
JSON edit. Fonts must also be loaded in the Google Fonts link in `index.html`. `theme.chrome` picks
the era's layout (`newspaper`, `midcentury`, `win98`, `flatweb`, `futureos`).

`theme.sound` names a synthesised sound (`typewriter`, `tv-click`, `modem`, `pop`, `whoosh`), or a
filename in `public/sounds/` (any value containing a dot is played as a file). Sound is muted by default.

## How it's built

```
src/
  data/            era JSON, types and the loader/validator
  context/         EraContext: committed year, live slider position (a MotionValue), URL hash sync
  theme/           one MUI theme per era (built from the JSON), colour interpolation for the drag morph
  components/
    layout/        EraShell picks the era "chrome"; the five *Chrome components lay out the shared sections
    sections/      MorningRoutine, PlacesGallery, PriceBoard, TechShelf, FutureVisions (written once, themed per era)
    timeline/      TimelineSlider and its ticks
    three/         EraScene (lazy loader) and the five primitive-built scenes
    transitions/   era transitions and the drag-time morph overlay
  styles/era-css/  plain CSS effects: halftone, scanlines, bevels, glass
```

- **Slider**: the handle position is a Framer Motion value. While dragging, the background colours,
  corner radius and era textures blend between the two nearest eras every frame without React
  re-renders. On release it springs to the nearest era and the full theme swaps in with an
  era-specific transition: a page flip for 1920, a CRT power-on for 1999 and a glitch-in for 2050.
- **3D scenes** are lazy-loaded per era, so three.js is not in the initial bundle. A scene only
  mounts when it is near the viewport and renders on demand while off screen.
- **Accessibility**: the slider is a keyboard-operable `role="slider"` (arrows, Home/End,
  PageUp/PageDown), era changes are announced in a live region, and there is a skip link.
  `prefers-reduced-motion` replaces all transitions with fades and stops 3D motion.
- **Mobile**: on touch screens the 3D scenes don't capture drag, so the page still scrolls. The 1999
  desktop stacks its windows instead of floating them.

### Why there are two app tsconfigs

`@react-three/fiber` adds every three.js element to the global JSX types, which makes MUI's
polymorphic components too complex for TypeScript to check. The scene files are therefore
type-checked in their own project, `tsconfig.three.json`, and `EraScene` loads them through
`import.meta.glob` so the main project never imports them. `npm run build` still checks both.

## Fact-checking

Every era item has a stable `id` (`<year>.<section>.<slug>`) and at least one row in `docs/fact-check.json`
(`verified`, `corrected`, `unverifiable` or `removed`, with sources and old/new values).

- `npm run validate` fails if an item has no id, a duplicate id, no report row, a `verified` row without a source URL or
  archive reference, or an `unverifiable` row without `"todo": true` (2050 is exempt: it is speculative by design).
- `npm run factcheck:report` regenerates `docs/FACT-CHECK.md` from the JSON. Do not edit that file by hand.
- To add or change a fact: edit the era JSON, add or update its row in `docs/fact-check.json`, set `checked` to the date you
  opened the source, then run `npm run validate`. Inflation figures use the single base documented in `docs/RESEARCH.md`.

## Adding a country

1. Create `src/data/countries/<id>/country.json` (id, name, selectorLabel, enabled, defaultLocale) and
   `eras/<year>.json` for **every** one of the 13 years. Content files hold only what an era *says*; never
   `theme`, `scene` or `speculative` (those live in `src/data/eraBase/`). Prefix every item id with the
   country (`in.1945.prices.rice-1-seer`) and add a row for it to `docs/fact-check.json`.
2. Add the id to `CountryId` in `src/data/types.ts` and one entry to `src/data/countries/registry.ts`
   (a lazy `import.meta.glob` for its eras; `loadOverlay` if it has a theme layer).
3. Optional theme layer: `src/data/countries/<id>/theme/overlay.ts` (accent colours, accent font, pattern,
   ornament, banner text) and the pattern classes in `src/styles/country-css/<id>/`. The validator checks
   allowed keys, unique fonts and patterns, no reuse of base-era fonts and 3:1 ornament contrast.
4. Run `npm run validate`, then `npm run build`. No component changes are needed.

## India Deep Dive

With India selected, a **Deep Dive** button in the bottom bar opens a hub for the current year with 11 sections
(technology, government, independence and history, personalities, achievements, sports, literature, books, cinema,
music and arts, economy). Links: `#/in/1984/deep-dive` (hub) and `#/in/1984/deep-dive/sports` (a section). With World
selected the same links fall back to the era page, and no deep-dive code is downloaded.

- Data: `src/data/countries/in/deepdive/<year>.json` (one lazy chunk per year) and `threads.json`.
- Shared facts about the sections (ids, assigned interactive, minimum items): `src/data/deepdive.ts`.
- To add an item: append it to the right section of the year's file with id `in.<year>.dd.<section>.<slug>`, give it
  at least one source (two for dates, scores, statistics and quotes) or `"todo": true`, add a row to
  `docs/fact-check.json`, then run `npm run validate`.
- Hub: on wide screens with WebGL and without `prefers-reduced-motion` a 3D ring of 11 era-framed portals (own chunk,
  `src/components/three/deepdive/HubRing.tsx`) sits above a plain section grid that does the same thing; otherwise the
  grid alone is shown. The canvas is `aria-hidden`; everything is reachable by keyboard (arrow keys turn the ring).
- Each era's look comes from `deepDive` in `src/data/countries/in/theme/overlay.ts` (`portalFrame`, `heroPattern`,
  `motifStyle`); the 11 motifs are in `src/components/deepdive/motifs.tsx`.
- Interactives live in `src/components/interactives/deepdive/` (one lazy chunk each). They run on the section's items and
  on `section.interactive.data`, whose shapes are:

  | Component | `data` |
  | --- | --- |
  | `TechThenNow` | `{ comparisons: [{ itemId, nowTitle, specs: [{label, then, now}], model? }] }` |
  | `WhoGoverned` | `{ tree: {id,label,holder?,role?,children?}, law: {title, steps: [{label, detail}]} }` |
  | `ChronicleScroll` | `{ excerpts: [{text, lang, reference}] }` |
  | `PortraitGallery` | none (uses `person` items) |
  | `MilestoneWall` | `{ counters: [{label, value, unit?}] }` |
  | `ScorecardReplay` | `{ replay: {title, steps: [{label, text, score?}]} }` |
  | `Bookshelf3D` | none (uses `work` items with `originalTitle`) |
  | `ReadingRoom` | `{ budget: {amount, unit}, stock: [{id, label, price, circulation?, fact?}] }` |
  | `ProjectorReel` | `{ ticket: {price, note?} }` |
  | `RiyaazRoom` | none (uses `art` items; audio is synthesised, muted by default) |
  | `RupeeDashboard` | `{ now: {metric: number}, wage: {amount, unit}, buys: [{label, cost, unit}] }` |

  Every number in `data` needs a source in `interactive.sources` (or `todo`) and a fact-check row.
- Cross-year features (Hub, below the sections; one lazy chunk, `src/components/deepdive/CrossYear.tsx`):
  **On this day** (items with a full `YYYY-MM-DD` date matching today, content-note items left out), **Follow a thread**
  (curated threads from `threads.json` or any section across all 13 years, as a track or a list; "Open in <year>" jumps
  to that year's section) and a **quiz** (8 questions drawn only from items that are not `todo`, with a source after each answer).
  To add a thread, append `{ id, title, description, section?, itemIds }` to `threads.json`; every id must exist.
- India era pages (`countries/in/eras/<year>.json`) are built from sourced items. Where a section is shorter than the usual
  minimum, the file carries `notes.<section>` explaining why, and the page shows it above that section.
  Rupee prices give `adjusted2026` only from 1960 on (World Bank CPI, 2025 rupees); earlier prices stay in original units.
- Content status: all 13 years have researched deep-dive items and era pages. `docs/RESEARCH.md` lists the weak spots;
  no India item is marked `todo`; unverified items were removed. 2050 is a clearly labelled set of scenarios built on named targets and projections.

## Everyday sections, page layout and deep-dive top-ups

The year page has nine everyday sections plus a spotlight, for every country and year, in `src/data/countries/<country>/everyday/<year>.json`.

- **Add an item:** append to the section's `items` (schema: `EverydayItem` in `src/data/types.ts`). The id is `<country>.<year>.everyday.<section-kebab>.<slug>`, and the item needs a row in `docs/fact-check.json`. Stats, prices, wages, journeys and messages need two sources, or `todo: true`.
- **Change the page grouping or order:** edit `PAGE_GROUPS` in `src/data/pageLayout.ts`. Nothing else needs to change; each era chrome builds its own navigation from the list.
- **Top up a deep-dive section:** add items to `countries/in/deepdive/<year>.json` until the section has 6 to 8, prefer missing regions, women and item kinds, and re-check the existing items first. `npm run validate:counts` lists what is short and writes `docs/COVERAGE.md`.
- **Deep links:** `#/in/1945/food-and-kitchen` scrolls to that section.
- **Checks:** `npm run validate` (schema, sources, fact-check rows) and `npm run validate:counts` (item counts, coverage table). `validate:counts` is not part of `npm run build` yet; add it once the content has caught up.

### Bundle size (initial JS, gzipped)

| | Before | After |
|---|---|---|
| `index-*.js` | 99.26 kB | 100.29 kB |

Everyday data, the three everyday interactives and the deep dive are separate lazy chunks. Lighthouse (mobile, year page): accessibility 100, best practices 100, SEO 100. Era first-paint timings and CLS were not measured.

Content status (18 October 2026): everyday sections are filled, thinly, for 1900, 1920, 1930, 1945, 1960, 1970, 1984, 1995, 1999, 2005, 2010 and 2020 in both countries; 2050 is empty. `docs/COVERAGE.md` shows what is missing, and `docs/RESEARCH.md` lists the scarcity notes, the sources and the corrections found while checking.
