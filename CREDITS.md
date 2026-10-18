# Credits

## Sounds

All 14 era transition sounds are synthesised in the browser with the Web Audio API in
`src/hooks/useEraSound.ts`: gramophone crackle (1900), typewriter (1920), projector rattle (1930),
rubber stamp (1945), TV click (1960), needle drop (1970), floppy drive seek (1984), dial-up handshake
(1995), startup chime (1999), click wheel (2005), notification pop (2010), call-join chime (2020) and
synth whoosh (2050) and a soft haptic thock (2026). No third-party audio files are included.

If you add recorded sounds to `public/sounds/`, use only royalty-free or appropriately licensed
files and list each one here with its author, source URL and licence.

## Fonts

Bundled in `public/fonts/` for text inside 3D scenes (SIL Open Font License 1.1, licence files alongside):

- **VT323** by Peter Hull (1984 floppy disk label)
- **Silkscreen** by Jason Kottke and the Silkscreen Project Authors (1999 CRT screen)

Loaded from Google Fonts at runtime, one era at a time (SIL Open Font License 1.1 unless noted):
Cinzel Decorative, Cormorant Garamond, Playfair Display, Old Standard TT, UnifrakturMaguntia,
Limelight, Libre Baskerville, Stardos Stencil, Special Elite, Jost, Shrikhand, Nunito, VT323,
IBM Plex Mono, Comic Neue, Silkscreen, Varela Round, Open Sans (Apache 2.0 / OFL), DM Sans,
Plus Jakarta Sans, Orbitron, Inter, Fraunces, Geist and Geist Mono (2026). The India layer's Anek Devanagari (2026) is also loaded from Google Fonts, subset to the characters it shows. Times New Roman, Tahoma and Trebuchet MS are system fonts.

## Icons

Material Icons via `@mui/icons-material` (Apache License 2.0).

## 3D models and illustrations

All 3D objects are built from three.js primitives in code, and all place illustrations are drawn
in SVG and CSS. No external models, photographs or scans are included.

## Images

None yet. If you add images to `public/images/eras/`, use only public-domain or properly licensed
files (in the U.S., works published in 1930 or earlier are public domain as of 2026; for later years
use Wikimedia Commons files with a compatible licence) and list each one here with its source and licence.

## Data

Facts and their sources are listed per era in `docs/RESEARCH.md`. Price data comes from the
U.S. Bureau of Labor Statistics and NBER via FRED (Federal Reserve Bank of St. Louis), the USPS
Historian, the U.S. Department of Labor, the Federal Highway Administration and the Federal
Reserve Bank of Minneapolis.

## India theme layer (accent fonts)

Loaded at runtime from Google Fonts, only when India is selected; all are SIL Open Font License 1.1:
Tiro Devanagari Hindi, Martel, Rozha One, Khand, Yatra One, Amita, Teko, Hind, Mukta, Baloo 2, Poppins, Gotu and Rajdhani.
Patterns and ornaments are drawn in CSS; no images, flags or logos are used.
