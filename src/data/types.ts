export type CountryId = "world" | "in";

export type EraId = 1900 | 1920 | 1930 | 1945 | 1960 | 1970 | 1984 | 1995 | 1999 | 2005 | 2010 | 2020 | 2050;

export type ChromeId =
  | "newspaper"
  | "midcentury"
  | "win98"
  | "flatweb"
  | "futureos"
  | "artnouveau"
  | "artdeco"
  | "homefront"
  | "groovy"
  | "terminal"
  | "earlyweb"
  | "web2gloss"
  | "videocall";

export type TransitionId =
  | "pageflip"
  | "tvclick"
  | "crtpoweron"
  | "flatslide"
  | "glitch"
  | "iris"
  | "curtain"
  | "stamp"
  | "lavablob"
  | "typeout"
  | "interlace"
  | "glossswipe"
  | "reconnect";

export type SceneId =
  | "Radio1920"
  | "Television1960"
  | "CrtPc1999"
  | "Smartphone2010"
  | "Hologram2050"
  | "Gramophone1900"
  | "Projector1930"
  | "RationBook1945"
  | "Turntable1970"
  | "FloppyDrive1984"
  | "Modem1995"
  | "MusicPlayer2005"
  | "Laptop2020";

export type PlaceId = "newspaper" | "bedroom" | "street";

export type TechCategory = "communication" | "entertainment" | "home" | "transport" | "work";

export type CameTrue = "yes" | "partly" | "no" | "unknown";

export interface Source {
  label: string; // "BLS CPI Inflation Calculator"
  url?: string; // a real, reachable URL that was actually consulted
  accessed?: string; // "2026-10-12"
  quality?: "primary" | "reference" | "secondary"; // archive/official, museum/encyclopedia, article/blog
}

/** Fields every content item carries. */
export interface Claim {
  id: string; // stable claim id, "<year>.<section>.<slug>", e.g. "1945.prices.sugar-5lb"; rows in docs/fact-check.json use it
  source?: Source;
  todo?: boolean; // true = not yet verified; the UI shows an "Unverified" marker
  checked?: string; // ISO date the item was verified or corrected against its source
}

export interface MorningStep extends Claim {
  time: string; // "6:30 AM"
  activity: string;
  detail: string;
  icon?: string; // MUI icon name, see components/common/iconMap.ts
}

export interface Place extends Claim {
  kind: PlaceId;
  title: string;
  description: string;
  image?: string; // /images/eras/1920/street.jpg
  imageAlt: string;
  highlights: string[];
}

export interface Price extends Claim {
  item: string; // "Loaf of bread"
  price: string; // "$0.12" (string so approximations like "about $0.05" are allowed)
  adjusted2026?: string; // inflation-adjusted, if known
  originalUnits?: string; // "2 annas 6 pies": the period price in pre-decimal units
  decimalINR?: string; // "₹0.16": decimal equivalent (1 rupee = 16 annas = 192 pies until 1957)
  adjustedMethod?: string; // which index and base month produced adjusted2026
}

export interface Technology extends Claim {
  name: string;
  category: TechCategory;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface FutureVision extends Claim {
  prediction: string; // what people in this era imagined
  whoSaidIt?: string;
  cameTrue: CameTrue;
  note?: string;
}

export interface Headline extends Claim {
  date: string; // "1945-05-08"
  headline: string;
  publication: string; // "The New York Times"
  verbatim: boolean; // true only if copied exactly from a scan or archive that was consulted
}

export interface Era {
  year: EraId;
  country?: CountryId; // set on resolved eras; "world" is the original US-centred dataset
  title: string; // "The Roaring Twenties"
  tagline: string; // one line shown in the hero
  speculative: boolean; // true only for 2050
  locale: {
    region: string; // "United States"
    currency: string; // "USD"
    persona: string; // whose day this is, e.g. "an urban middle-class family in Chicago"
    politicalStatus?: string; // "British India" | "Dominion of India" | "Republic of India"
    placeNameNote?: string; // how period and modern place names are shown
  };
  theme: {
    chrome: ChromeId;
    transition: TransitionId;
    palette: { primary: string; secondary: string; background: string; paper: string; text: string };
    fonts: { heading: string; body: string; mono?: string }; // mono: an optional accent font
    sound?: string; // synth preset name, or a filename in /public/sounds
  };
  morningRoutine: MorningStep[];
  places: Place[];
  prices: Price[];
  technology: Technology[];
  futureVisions: FutureVision[];
  headlines: Headline[];
  scene: {
    component: SceneId;
    caption: string;
  };
  /** Where a section holds fewer items than the usual minimum, why (shown above that section). */
  notes?: Partial<Record<"morningRoutine" | "places" | "prices" | "technology" | "futureVisions" | "headlines", string>>;
}

/** One row of docs/fact-check.json: a single checkable part of one claim. */
export type FactCheckStatus = "verified" | "corrected" | "unverifiable" | "removed";

export interface FactCheckRow {
  id: string; // item id ("world.1945.prices.sugar-5lb"), "<country>.<year>.era.title" etc. for era fields, or "site.<slug>"
  country?: CountryId; // absent on site-wide rows
  era: EraId | "site";
  section: string;
  field: string; // which part of the item: "price", "highlights[2]", "cameTrue"…
  claim: string;
  status: FactCheckStatus;
  oldValue?: unknown;
  newValue?: unknown;
  sources: Source[];
  note: string;
}

/** How an era looks: shared by every country. A country can only add an overlay on top. */
export interface EraBase {
  year: EraId;
  speculative: boolean;
  theme: Era["theme"];
  scene: { component: Era["scene"]["component"] };
}

/** What an era says for one country: everything except the look. */
export interface CountryEra extends Omit<Era, "theme" | "scene" | "speculative"> {
  country: CountryId;
  sceneCaption: string;
}

/** EraBase + CountryEra, merged at runtime. */
export type ResolvedEra = Era & { country: CountryId };

/** What a country may add on top of an era's theme. Anything outside these keys is rejected by the validator. */
export interface OverlayEra {
  accent: { color: string; secondaryColor?: string }; // used for ornaments and borders, never for body text
  accentFont?: { family: string; scripts: string[]; spec: string }; // spec = Google Fonts css2 family spec
  pattern?: string; // class name in styles/country-css/<country>/patterns.css
  ornament?: "blockprint" | "ruled" | "perforated" | "bars" | "lattice" | "dots"; // band border style
  decor?: Partial<Record<"bannerText" | "statusText", string>>;
  /** India Deep Dive decor, merged under the same allowed-key rules. */
  deepDive?: {
    portalFrame: "cartouche" | "column" | "arch" | "slip" | "poster" | "signboard" | "crt" | "gif" | "bevel" | "gloss" | "card" | "tile" | "holo";
    heroPattern: string;
    motifStyle: "woodcut" | "deco" | "stamp" | "poster" | "signboard" | "pixel" | "gif" | "bevel" | "gloss" | "flat" | "tile" | "holo";
  };
}

export type CountryOverlay = Partial<Record<EraId, OverlayEra>>;

// ---------------------------------------------------------------- India Deep Dive

export type DeepDiveSectionId =
  | "technology-science"
  | "government-politics"
  | "freedom-history"
  | "personalities"
  | "achievements"
  | "sports"
  | "literature"
  | "books-reading"
  | "cinema"
  | "music-arts"
  | "economy-business";

export type SensitivityLevel = "standard" | "care" | "content-note";

export interface VerifiedQuote {
  text: string;
  lang: string;
  translation?: string;
  spokenOrWritten: string;
  date: string;
  source: Source;
}

export interface MediaRef {
  type: "illustration" | "licensed-image" | "monogram";
  component?: string;
  src?: string; // only for licensed images in /public/images/in/
  alt: string;
  credit?: string; // required for licensed-image, must match CREDITS.md
}

interface DeepDiveItemBase {
  id: string; // "in.1930.dd.freedom-history.salt-march"
  title: string;
  summary: string;
  body?: string[];
  date?: string; // "1930-03-12", "1930-03" or "1930"
  place?: string;
  languages?: string[];
  regionTag?: "north" | "south" | "east" | "west" | "central" | "north-east" | "national" | "overseas";
  sources: Source[];
  relatedIds?: string[];
  context?: boolean; // short background item dated outside this year
  sensitivity?: { level: SensitivityLevel; note?: string };
  media?: MediaRef;
  todo?: boolean;
  checked?: string;
}

export type DeepDiveItem =
  | (DeepDiveItemBase & { kind: "tech"; availability: "lab-or-official" | "elite-urban" | "urban" | "widespread"; firstInIndia?: string })
  | (DeepDiveItemBase & { kind: "governance"; office?: string; holder?: string; instrument?: string })
  | (DeepDiveItemBase & { kind: "event"; eventType: "movement" | "law" | "election" | "treaty" | "conflict" | "disaster" | "reform" | "founding" | "other" })
  | (DeepDiveItemBase & { kind: "person"; field: string; born?: string; died?: string; whyThisYear: string; quote?: VerifiedQuote })
  | (DeepDiveItemBase & { kind: "achievement"; domain: "science" | "space" | "sport" | "arts" | "engineering" | "public-health" | "social" | "economy"; firstOfKind?: boolean })
  | (DeepDiveItemBase & { kind: "sport"; sport: string; competition: string; result: string; scoreline?: string; athletes?: string[] })
  | (DeepDiveItemBase & {
      kind: "work";
      workType: "novel" | "short-story" | "poetry" | "play" | "essay" | "nonfiction" | "periodical" | "comic" | "textbook";
      creator: string;
      originalTitle?: { text: string; lang: string };
      transliteration?: string;
      translatedTitle?: string;
      publicDomainExcerpt?: { text: string; lang: string; translation?: string };
    })
  | (DeepDiveItemBase & { kind: "film"; language: string; releaseDate?: string; director?: string; cast?: string[]; notable: string; certification?: string })
  | (DeepDiveItemBase & { kind: "art"; form: "music" | "dance" | "theatre" | "painting" | "craft" | "architecture" | "photography" | "broadcast"; creator?: string })
  | (DeepDiveItemBase & { kind: "indicator"; metric: string; value: string; unit: string; asOf: string; comparison?: string });

export interface DeepDiveSection {
  title: string;
  standfirst: string;
  items: DeepDiveItem[];
  interactive: { component: string; data?: unknown; sources?: Source[]; todo?: boolean };
  scarcityNote?: string;
}

export interface DeepDive {
  country: "in";
  year: EraId;
  speculative: boolean;
  intro: { headline: string; summary: string; sources: Source[] };
  highlights: string[];
  sections: Partial<Record<DeepDiveSectionId, DeepDiveSection>>;
}

export interface DeepDiveThread {
  id: string;
  title: string;
  description: string;
  section?: DeepDiveSectionId;
  itemIds: string[];
}
