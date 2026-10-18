# Research log

How the facts in `src/data/countries/world/eras/*.json` were checked, the decisions made, and what is still open.
The source and todo lists below were compiled from the JSON at the end of the research pass. `npm run validate` prints live per-era counts of sourced and todo items; update this log when you resolve a todo.

Research pass: 12 October 2026, with web access. A second, claim-by-claim fact-check pass followed the same day; see the last section and `docs/FACT-CHECK.md`. Where the per-era notes below disagree with `docs/fact-check.json`, the report is current.

## Methods

- **Prices (1913 onward):** `adjusted2026` = price × (CPI-U for August 2026 ÷ CPI-U annual average for the era year). CPI-U monthly data: BLS series CUUR0000SA0, downloaded via FRED (CPIAUCNS). August 2026 = 334.980. October 2025 has no value (not published).
  Multipliers: 1920 16.71 · 1930 20.06 · 1945 18.62 · 1960 11.33 · 1970 8.63 · 1984 3.225 · 1995 2.198 · 1999 2.011 · 2005 1.715 · 2010 1.536 · 2020 1.294. This is the same method as the BLS CPI Inflation Calculator, using annual averages; results are rounded and shown as "about".
- **Prices (1900):** no CPI exists before 1913. The Minneapolis Fed's historical table (pre-1913 values from Albert Rees's cost-of-living index, compiled by BLS) is chained to CPI-U at 1913. Multiplier ≈ 40.3.
- **Retail prices:** BLS average-price series via FRED where they exist (bread since 1980, gasoline since 1976, eggs since 1980, milk since mid-1995); NBER Macrohistory New York City bread prices for 1920 and 1930. Stamp rates: USPS Historian. Minimum wage: U.S. Department of Labor.
- **Headlines:** all are faithful paraphrases (`verbatim: false`) of real front-page events, dated and sourced to a reference for the event. Library of Congress *Chronicling America* sits behind a bot-protection check that blocks automated access, so no headline has been transcribed from a scan yet. **Open task for a human researcher:** replace paraphrases with verbatim headlines from Chronicling America (pre-1964) or publishers' archives and set `verbatim: true` with the scan URL.
- **Source quality** is recorded per source: `primary` (official statistics, archives, company press releases), `reference` (encyclopedia articles, mostly Wikipedia, checked on the accessed date) and `secondary` (news articles and blogs). Wikipedia was used heavily for launch dates and event dates; a good next step is upgrading those to the primary sources they cite.
- **Unverified items** carry `"todo": true` and show an "Unverified" marker in the UI. Items can have both a source and a todo when the source confirms only part of the text.

## 1900: The Turn of the Century

Persona: a farm family in the rural Midwest. Region: United States (USD).

**Decisions**

- Persona is a rural Midwestern farm family: most Americans lived in rural areas in 1900.
- 2026 prices chain the Minneapolis Fed's pre-1913 estimates (Rees cost-of-living index, 1967=100: 1900 = 25, 1913 = 29.7) to the BLS CPI-U (1913 average 9.883 → August 2026 334.980). Multiplier ≈ 40.3. Treat as rough.
- Future visions come from John Elfreth Watkins Jr.'s "What May Happen in the Next Hundred Years" (Ladies' Home Journal, December 1900); wording checked against the Wikipedia section that quotes it.

**Sources consulted**

- [FHWA Highway Statistics, Table MV-200: State Motor Vehicle Registrations, 1900–1995](https://www.fhwa.dot.gov/ohim/summary95/mv200.pdf) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1900 in the United States](https://en.wikipedia.org/wiki/1900_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: Brownie (camera)](https://en.wikipedia.org/wiki/Brownie_(camera)) (reference, accessed 2026-10-12)
- [Wikipedia: J. Elfreth Watkins (section on the 1900 Ladies' Home Journal article)](https://en.wikipedia.org/wiki/J._Elfreth_Watkins) (reference, accessed 2026-10-12)

## 1920: The Roaring Twenties

Persona: a middle-class family in a northern industrial city. Region: United States (USD).

**Decisions**

- Model T price corrected from the MVP: the runabout was $550 in March 1920 and $395 by September (Wikipedia, Ford Model T price table). The MVP's touring-car range was unverified.
- KDKA wording softened: its 1920 broadcast is often called the first commercial broadcast, but the claim is disputed (Wikipedia, KDKA).
- Keynes's 1930 essay moved to the 1930 era; 1920 now uses Karel Čapek's R.U.R. (1920).
- Bread price is New York City retail (NBER Macrohistory series via FRED), the nearest dataset found; a national average is a todo.

**Sources consulted**

- [FHWA Highway Statistics, Table MV-200: State Motor Vehicle Registrations, 1900–1995](https://www.fhwa.dot.gov/ohim/summary95/mv200.pdf) (primary, accessed 2026-10-12)
- [NBER Macrohistory: retail price of bread, New York City, 1920 average (cents per lb), via FRED](https://fred.stlouisfed.org/series/M04022US35620M267NNBR) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1920 in the United States](https://en.wikipedia.org/wiki/1920_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: Ford Model T](https://en.wikipedia.org/wiki/Ford_Model_T) (reference, accessed 2026-10-12)
- [Wikipedia: KDKA (AM)](https://en.wikipedia.org/wiki/KDKA_(AM)) (reference, accessed 2026-10-12)
- [Wikipedia: R.U.R.](https://en.wikipedia.org/wiki/R.U.R.) (reference, accessed 2026-10-12)

## 1930: Deco and Depression

Persona: an office clerk's family in New York City. Region: United States (USD).

**Decisions**

- Bread price is New York City retail (NBER via FRED), 8.6¢/lb 1930 average.
- Churchill's "Fifty Years Hence" ran in The Strand in December 1931 (near-year). The chicken-breast passage is widely quoted but was not checked against the essay text, so it is marked todo.

**Sources consulted**

- [FHWA Highway Statistics, Table MV-200: State Motor Vehicle Registrations, 1900–1995](https://www.fhwa.dot.gov/ohim/summary95/mv200.pdf) (primary, accessed 2026-10-12)
- J. M. Keynes, "Economic Possibilities for our Grandchildren" (1930) (primary, accessed 2026-10-12)
- [NBER Macrohistory: retail price of bread, New York City, 1930 average (cents per lb), via FRED](https://fred.stlouisfed.org/series/M04022US35620M267NNBR) (primary, accessed 2026-10-12)
- [Richard Langworth: How Olaf Stapledon Inspired Churchill's Vision (publication details of "Fifty Years Hence")](https://richardlangworth.com/how-olaf-stapledon-inspired-churchills-vision) (secondary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1930 in the United States](https://en.wikipedia.org/wiki/1930_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: Ford Model A (1927–1931)](https://en.wikipedia.org/wiki/Ford_Model_A_(1927%E2%80%931931)) (reference, accessed 2026-10-12)
- [Wikipedia: Golden Age of Radio](https://en.wikipedia.org/wiki/Golden_Age_of_Radio) (reference, accessed 2026-10-12)
- [Wikipedia: Pluto](https://en.wikipedia.org/wiki/Pluto) (reference, accessed 2026-10-12)
- [Wikipedia: Scotch Tape](https://en.wikipedia.org/wiki/Scotch_Tape) (reference, accessed 2026-10-12)
- [Wikipedia: Wonder Bread](https://en.wikipedia.org/wiki/Wonder_Bread) (reference, accessed 2026-10-12)

## 1945: The Home Front

Persona: a war-plant worker's family in Detroit. Region: United States (USD).

**Decisions**

- Tone: factual and respectful. No casualty figures are given; no insignia or propaganda imagery is used (home-front imagery only: ration book, service flag, victory garden).
- ENIAC is listed with its completion date (29 November 1945) only.

**Sources consulted**

- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1945 in the United States](https://en.wikipedia.org/wiki/1945_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: As We May Think](https://en.wikipedia.org/wiki/As_We_May_Think) (reference, accessed 2026-10-12)
- [Wikipedia: Golden Age of Radio](https://en.wikipedia.org/wiki/Golden_Age_of_Radio) (reference, accessed 2026-10-12)
- [Wikipedia: Penicillin](https://en.wikipedia.org/wiki/Penicillin) (reference, accessed 2026-10-12)
- [Wikipedia: Rationing in the United States](https://en.wikipedia.org/wiki/Rationing_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: War bond](https://en.wikipedia.org/wiki/War_bond) (reference, accessed 2026-10-12)

## 1960: The Space-Age Sixties

Persona: a suburban family outside Chicago. Region: United States (USD).

**Decisions**

- JFK's Moon speech (May 1961) is near-year; its wording was not re-checked this pass, so it is marked todo.

**Sources consulted**

- [FHWA Highway Statistics, Table MV-200: State Motor Vehicle Registrations, 1900–1995](https://www.fhwa.dot.gov/ohim/summary95/mv200.pdf) (primary, accessed 2026-10-12)
- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1960 in the United States](https://en.wikipedia.org/wiki/1960_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: Kennedy–Nixon debates](https://en.wikipedia.org/wiki/Kennedy%E2%80%93Nixon_debates) (reference, accessed 2026-10-12)
- [Wikipedia: Picturephone](https://en.wikipedia.org/wiki/Picturephone) (reference, accessed 2026-10-12)
- [Wikipedia: The Jetsons](https://en.wikipedia.org/wiki/The_Jetsons) (reference, accessed 2026-10-12)
- [Wikipedia: Transistor radio](https://en.wikipedia.org/wiki/Transistor_radio) (reference, accessed 2026-10-12)

## 1970: The Groovy Seventies

Persona: a young family in a California suburb. Region: United States (USD).

**Decisions**

- Colour-TV statement uses the 1972 crossover (first year more than half of TV households had colour) rather than a 1970 figure, which was not found.

**Sources consulted**

- [FHWA Highway Statistics, Table MV-200: State Motor Vehicle Registrations, 1900–1995](https://www.fhwa.dot.gov/ohim/summary95/mv200.pdf) (primary, accessed 2026-10-12)
- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1970 in the United States](https://en.wikipedia.org/wiki/1970_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: Boeing 747](https://en.wikipedia.org/wiki/Boeing_747) (reference, accessed 2026-10-12)
- [Wikipedia: Color television](https://en.wikipedia.org/wiki/Color_television) (reference, accessed 2026-10-12)
- [Wikipedia: Future Shock](https://en.wikipedia.org/wiki/Future_Shock) (reference, accessed 2026-10-12)
- [Wikipedia: Microwave oven](https://en.wikipedia.org/wiki/Microwave_oven) (reference, accessed 2026-10-12)
- [Wikipedia: The Population Bomb](https://en.wikipedia.org/wiki/The_Population_Bomb) (reference, accessed 2026-10-12)

## 1984: The Home Computer Arrives

Persona: a teenager in a suburban family with a new home computer. Region: United States (USD).

**Decisions**

- Retail prices are BLS annual averages (bread, gasoline, eggs) via FRED.
- Asimov's Toronto Star essay is dated December 31, 1983 by some sources and 1984 by others; marked todo until the original is checked.

**Sources consulted**

- [BLS average price data, grade A large eggs per dozen, 1984 annual average, via FRED (APU0000708111)](https://fred.stlouisfed.org/series/APU0000708111) (primary, accessed 2026-10-12)
- [BLS average price data, unleaded regular gasoline per gallon, 1984 annual average, via FRED (APU000074714)](https://fred.stlouisfed.org/series/APU000074714) (primary, accessed 2026-10-12)
- [BLS average price data, white bread per lb, 1984 annual average, via FRED (APU0000702111)](https://fred.stlouisfed.org/series/APU0000702111) (primary, accessed 2026-10-12)
- [FHWA Highway Statistics, Table MV-200: State Motor Vehicle Registrations, 1900–1995](https://www.fhwa.dot.gov/ohim/summary95/mv200.pdf) (primary, accessed 2026-10-12)
- [NeuroLogica blog: Asimov's Predictions for 2019](https://theness.com/neurologicablog/asimovs-predictions-for-2019/) (secondary, accessed 2026-10-12)
- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1984 in the United States](https://en.wikipedia.org/wiki/1984_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: Commodore 64](https://en.wikipedia.org/wiki/Commodore_64) (reference, accessed 2026-10-12)
- [Wikipedia: Macintosh 128K](https://en.wikipedia.org/wiki/Macintosh_128K) (reference, accessed 2026-10-12)
- [Wikipedia: Motorola DynaTAC](https://en.wikipedia.org/wiki/Motorola_DynaTAC) (reference, accessed 2026-10-12)
- [Wikipedia: Neuromancer](https://en.wikipedia.org/wiki/Neuromancer) (reference, accessed 2026-10-12)
- [Wikipedia: Walkman](https://en.wikipedia.org/wiki/Walkman) (reference, accessed 2026-10-12)

## 1995: The Web Goes Public

Persona: a college student going online from the family PC. Region: United States (USD).

**Decisions**

- Milk is the BLS average for July–December 1995 (the series starts in July 1995).
- The Oklahoma City bombing headline gives the official death toll from the source and no further detail.

**Sources consulted**

- [BLS average price data, unleaded regular gasoline per gallon, 1995 annual average, via FRED (APU000074714)](https://fred.stlouisfed.org/series/APU000074714) (primary, accessed 2026-10-12)
- [BLS average price data, white bread per lb, 1995 annual average, via FRED (APU0000702111)](https://fred.stlouisfed.org/series/APU0000702111) (primary, accessed 2026-10-12)
- [BLS average price data, whole milk per gallon, 1995 annual average, via FRED (APU0000709112)](https://fred.stlouisfed.org/series/APU0000709112) (primary, accessed 2026-10-12)
- [FHWA Highway Statistics, Table MV-200: State Motor Vehicle Registrations, 1900–1995](https://www.fhwa.dot.gov/ohim/summary95/mv200.pdf) (primary, accessed 2026-10-12)
- [Poynter: on Clifford Stoll's 1995 Newsweek column](https://www.poynter.org/?p=323705) (secondary, accessed 2026-10-12)
- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1995 in the United States](https://en.wikipedia.org/wiki/1995_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: AOL](https://en.wikipedia.org/wiki/AOL) (reference, accessed 2026-10-12)
- [Wikipedia: Amazon (company)](https://en.wikipedia.org/wiki/Amazon_(company)) (reference, accessed 2026-10-12)
- [Wikipedia: EBay](https://en.wikipedia.org/wiki/EBay) (reference, accessed 2026-10-12)
- [Wikipedia: PlayStation (console)](https://en.wikipedia.org/wiki/PlayStation_(console)) (reference, accessed 2026-10-12)
- [Wikipedia: The Road Ahead (Gates book)](https://en.wikipedia.org/wiki/The_Road_Ahead_(Gates_book)) (reference, accessed 2026-10-12)
- [Wikipedia: Windows 95](https://en.wikipedia.org/wiki/Windows_95) (reference, accessed 2026-10-12)

## 1999: The Dot-Com Dawn

Persona: a suburban family with a new desktop PC. Region: United States (USD).

**Decisions**

- Fonts changed: 1999's pixel accent moved from VT323 to Silkscreen (VT323 now belongs to 1984). Sound changed from a modem to a startup chime (1995 owns the dial-up sound).
- Desktop teal lightened from #008080 to #008a8a so black text meets WCAG AA.

**Sources consulted**

- [BLS average price data, unleaded regular gasoline per gallon, 1999 annual average, via FRED (APU000074714)](https://fred.stlouisfed.org/series/APU000074714) (primary, accessed 2026-10-12)
- [BLS average price data, white bread per lb, 1999 annual average, via FRED (APU0000702111)](https://fred.stlouisfed.org/series/APU0000702111) (primary, accessed 2026-10-12)
- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 1999 FIFA Women's World Cup final](https://en.wikipedia.org/wiki/1999_FIFA_Women%27s_World_Cup_final) (reference, accessed 2026-10-12)
- [Wikipedia: 1999 in the United States](https://en.wikipedia.org/wiki/1999_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: DVD](https://en.wikipedia.org/wiki/DVD) (reference, accessed 2026-10-12)
- [Wikipedia: Euro](https://en.wikipedia.org/wiki/Euro) (reference, accessed 2026-10-12)
- [Wikipedia: Nokia 3210](https://en.wikipedia.org/wiki/Nokia_3210) (reference, accessed 2026-10-12)
- [Wikipedia: PalmPilot](https://en.wikipedia.org/wiki/PalmPilot) (reference, accessed 2026-10-12)
- [Wikipedia: Year 2000 problem](https://en.wikipedia.org/wiki/Year_2000_problem) (reference, accessed 2026-10-12)

## 2005: Web 2.0

Persona: a young professional in Chicago. Region: United States (USD).

**Decisions**

- Brand names appear in sourced facts (iPod nano, Razr, Xbox 360) but the UI and 3D model say "click-wheel MP3 player".

**Sources consulted**

- [BLS average price data, unleaded regular gasoline per gallon, 2005 annual average, via FRED (APU000074714)](https://fred.stlouisfed.org/series/APU000074714) (primary, accessed 2026-10-12)
- [BLS average price data, white bread per lb, 2005 annual average, via FRED (APU0000702111)](https://fred.stlouisfed.org/series/APU0000702111) (primary, accessed 2026-10-12)
- [BLS average price data, whole milk per gallon, 2005 annual average, via FRED (APU0000709112)](https://fred.stlouisfed.org/series/APU0000709112) (primary, accessed 2026-10-12)
- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 2005 in the United States](https://en.wikipedia.org/wiki/2005_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: Google Maps](https://en.wikipedia.org/wiki/Google_Maps) (reference, accessed 2026-10-12)
- [Wikipedia: IPod Nano](https://en.wikipedia.org/wiki/IPod_Nano) (reference, accessed 2026-10-12)
- [Wikipedia: Motorola Razr V3](https://en.wikipedia.org/wiki/Motorola_Razr_V3) (reference, accessed 2026-10-12)
- [Wikipedia: The Singularity Is Near](https://en.wikipedia.org/wiki/The_Singularity_Is_Near) (reference, accessed 2026-10-12)
- [Wikipedia: The World Is Flat](https://en.wikipedia.org/wiki/The_World_Is_Flat) (reference, accessed 2026-10-12)
- [Wikipedia: Web 2.0](https://en.wikipedia.org/wiki/Web_2.0) (reference, accessed 2026-10-12)
- [Wikipedia: Xbox 360](https://en.wikipedia.org/wiki/Xbox_360) (reference, accessed 2026-10-12)
- [Wikipedia: YouTube](https://en.wikipedia.org/wiki/YouTube) (reference, accessed 2026-10-12)

## 2010: The Social Network Era

Persona: a young professional in a U.S. city. Region: United States (USD).

**Decisions**

- iPhone 4 price confirmed from Apple's own press release.
- Netflix's $7.99 streaming-only plan: the reference ties $7.99 to July 2011, not November 2010, so it stays todo.

**Sources consulted**

- [Apple Newsroom: "Apple Presents iPhone 4", June 7, 2010](https://www.apple.com/newsroom/2010/06/07Apple-Presents-iPhone-4/) (primary, accessed 2026-10-12)
- [BLS average price data, unleaded regular gasoline per gallon, 2010 annual average, via FRED (APU000074714)](https://fred.stlouisfed.org/series/APU000074714) (primary, accessed 2026-10-12)
- [BLS average price data, white bread per lb, 2010 annual average, via FRED (APU0000702111)](https://fred.stlouisfed.org/series/APU0000702111) (primary, accessed 2026-10-12)
- [BLS average price data, whole milk per gallon, 2010 annual average, via FRED (APU0000709112)](https://fred.stlouisfed.org/series/APU0000709112) (primary, accessed 2026-10-12)
- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 2010 Copiapó mining accident](https://en.wikipedia.org/wiki/2010_Copiap%C3%B3_mining_accident) (reference, accessed 2026-10-12)
- [Wikipedia: 2010 in the United States](https://en.wikipedia.org/wiki/2010_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: Instagram](https://en.wikipedia.org/wiki/Instagram) (reference, accessed 2026-10-12)
- [Wikipedia: Kinect](https://en.wikipedia.org/wiki/Kinect) (reference, accessed 2026-10-12)
- [Wikipedia: Waymo](https://en.wikipedia.org/wiki/Waymo) (reference, accessed 2026-10-12)
- [Wikipedia: iPad (1st generation)](https://en.wikipedia.org/wiki/IPad_(1st_generation)) (reference, accessed 2026-10-12)

## 2020: The Year at Home

Persona: a family working and schooling from home in an apartment. Region: United States (USD).

**Decisions**

- Tone: factual and respectful; no case or death counts are given.
- Federal minimum wage: the DOL chart ends with the July 24, 2009 rate of $7.25, which was still in effect in 2020; marked todo pending a DOL page that states 2020 explicitly.

**Sources consulted**

- [BLS average price data, unleaded regular gasoline per gallon, 2020 annual average, via FRED (APU000074714)](https://fred.stlouisfed.org/series/APU000074714) (primary, accessed 2026-10-12)
- [BLS average price data, white bread per lb, 2020 annual average, via FRED (APU0000702111)](https://fred.stlouisfed.org/series/APU0000702111) (primary, accessed 2026-10-12)
- [BLS average price data, whole milk per gallon, 2020 annual average, via FRED (APU0000709112)](https://fred.stlouisfed.org/series/APU0000709112) (primary, accessed 2026-10-12)
- [KTVU: Coronavirus prompts Twitter to allow employees to work from home 'forever' (May 12, 2020)](https://www.ktvu.com/news/coronavirus-prompts-twitter-to-allow-employees-to-work-from-home-forever) (secondary, accessed 2026-10-12)
- [U.S. Department of Labor: History of Federal Minimum Wage Rates, 1938–2009](https://www.dol.gov/agencies/whd/minimum-wage/history/chart) (primary, accessed 2026-10-12)
- [USPS Historian: Rates for Domestic Letters Since 1863](https://about.usps.com/who-we-are/postal-history/domestic-letter-rates-since-1863.pdf) (primary, accessed 2026-10-12)
- [Wikipedia: 2020 United States presidential election](https://en.wikipedia.org/wiki/2020_United_States_presidential_election) (reference, accessed 2026-10-12)
- [Wikipedia: COVID-19 pandemic in the United States](https://en.wikipedia.org/wiki/COVID-19_pandemic_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: COVID-19 vaccination in the United States](https://en.wikipedia.org/wiki/COVID-19_vaccination_in_the_United_States) (reference, accessed 2026-10-12)
- [Wikipedia: PlayStation 5](https://en.wikipedia.org/wiki/PlayStation_5) (reference, accessed 2026-10-12)
- [Wikipedia: Waymo](https://en.wikipedia.org/wiki/Waymo) (reference, accessed 2026-10-12)
- [Wikipedia: Xbox Series X and Series S](https://en.wikipedia.org/wiki/Xbox_Series_X_and_Series_S) (reference, accessed 2026-10-12)
- [Wikipedia: Zoom Video Communications](https://en.wikipedia.org/wiki/Zoom_Video_Communications) (reference, accessed 2026-10-12)

## 2050: Tomorrow, Maybe

Persona: an imagined household in a mid-sized U.S. city. Region: United States (USD).

**Decisions**

- Entirely speculative and labelled as such everywhere, including headlines ("Imagined news feed"). No sources by design.

## Fact-check pass (claim by claim)

**Inflation base month: August 2026.** CPI-U (BLS series CUUR0000SA0 via FRED `CPIAUCNS`) = 334.980; this is the latest month published on 12 October 2026 (October 2025 is missing from the series). Every `adjusted2026` on the site uses it: price × (334.980 ÷ annual average CPI-U of the era year), shown to two significant figures above $10. 1900 chains the MeasuringWorth annual CPI (8.14 in 1900, 9.60 in 1913) to the BLS 1913 average (9.883): multiplier ≈ 40.

Annual-average multipliers: 1920 16.714 · 1930 20.059 · 1945 18.619 · 1960 11.327 · 1970 8.628 · 1984 3.225 · 1995 2.198 · 1999 2.011 · 2005 1.715 · 2010 1.536 · 2020 1.294.

**What changed in this pass**

- Every item has a stable `id` (`<year>.<section>.<slug>`); places moved their `bedroom/street/newspaper` label to `kind`.
- National city-average food prices for 1900–1970 now come from the Census Bureau's *Historical Statistics of the United States* (series E 187–202, read from the scanned page); 1984–2020 from BLS average-price series. Bread and milk units follow the source (half gallon for milk in the old series).
- Telephone, radio, electricity, unemployment and earnings figures come from the same Census volume (series R 1–12, R 93–105, S 108–119, D 85–86, D 802–810); EIA table 5.24 for gasoline; USPS and DOL for postage and minimum wage.
- Predictions were traced to a publication and date. Items that failed the year test or had no traceable source (e.g. Churchill's 1931 essay in 1930, the 1964 Picturephone, The Jetsons in 1960, The Population Bomb in 1970) were removed and replaced with dated 1930/1960/1970 predictions.
- `cameTrue` verdicts carry a note; several were rewritten with a source (heights, GDP per head, newspaper circulation, robots, Waymo).
- 2050 is speculative by design: all 53 of its rows are `unverifiable` and exempt from the `todo` marker.

**Limits of this pass**

- Wikipedia (`reference` quality) is still the source for many event dates; upgrading these to primary scans is open. All headlines remain paraphrases (`verbatim: false`).
- Several sites blocked automated access (Library of Congress, BLS downloads, DOL via curl, the Toronto Star, CNBC, FBI); those claims were checked via other sources or left `unverifiable`.
- Two-source agreement for numbers was achieved where noted (e.g. gasoline: BLS and EIA); many Census-only figures have a single primary source.

## Open todo items (generated)

### 1900 (7)

- [ ] `1900.morning.up-before-dawn`
- [ ] `1900.morning.pump-water-stoke-stove`
- [ ] `1900.morning.big-farm-breakfast`
- [ ] `1900.places.bedroom`
- [ ] `1900.places.street`
- [ ] `1900.prices.daily-newspaper`
- [ ] `1900.visions.strawberries-as-large-as`

### 1920 (6)

- [ ] `1920.morning.fire-up-kitchen-stove`
- [ ] `1920.morning.breakfast-morning-paper`
- [ ] `1920.places.bedroom`
- [ ] `1920.places.street`
- [ ] `1920.prices.daily-newspaper`
- [ ] `1920.prices.movie-ticket`

### 1930 (4)

- [ ] `1930.places.bedroom`
- [ ] `1930.places.street`
- [ ] `1930.prices.movie-ticket`
- [ ] `1930.prices.gallon-gasoline`

### 1945 (3)

- [ ] `1945.places.bedroom`
- [ ] `1945.places.street`
- [ ] `1945.prices.gallon-gasoline-plus-ration`

### 1960 (10)

- [ ] `1960.morning.clock-radio-clicks`
- [ ] `1960.morning.coffee-percolates`
- [ ] `1960.morning.kids-walk-school`
- [ ] `1960.places.bedroom`
- [ ] `1960.places.street`
- [ ] `1960.prices.movie-ticket`
- [ ] `1960.prices.black-white-television-set`
- [ ] `1960.technology.transistor-radio`
- [ ] `1960.technology.black-white-television`
- [ ] `1960.technology.electric-kitchen`

### 1970 (8)

- [ ] `1970.morning.clock-radio-hit-single`
- [ ] `1970.morning.instant-breakfast`
- [ ] `1970.places.bedroom`
- [ ] `1970.places.street`
- [ ] `1970.prices.movie-ticket`
- [ ] `1970.prices.lp-record-album`
- [ ] `1970.technology.8-track-tape`
- [ ] `1970.visions.people-will-rent-nearly`

### 1984 (9)

- [ ] `1984.morning.clock-radio`
- [ ] `1984.morning.cereal-tv`
- [ ] `1984.morning.plan-after-school-arcade`
- [ ] `1984.places.bedroom`
- [ ] `1984.places.street`
- [ ] `1984.prices.motorola-dynatac-8000x-mobile`
- [ ] `1984.technology.home-video-recorder`
- [ ] `1984.visions.people-will-spend-part`
- [ ] `1984.visions.information-wants-free`

### 1995 (8)

- [ ] `1995.morning.alarm-clock`
- [ ] `1995.morning.check-email`
- [ ] `1995.morning.surf-world-wide-web`
- [ ] `1995.morning.print-it-out`
- [ ] `1995.places.bedroom`
- [ ] `1995.places.street`
- [ ] `1995.visions.todays-internet-only-beginning`
- [ ] `1995.visions.digital-bits-will-replace`

### 1999 (12)

- [ ] `1999.morning.hit-snooze-clock-radio`
- [ ] `1999.morning.dial-up-check-email`
- [ ] `1999.morning.breakfast-cable-news`
- [ ] `1999.morning.commute-portable-cd-player`
- [ ] `1999.places.bedroom`
- [ ] `1999.places.street`
- [ ] `1999.prices.movie-ticket`
- [ ] `1999.prices.unlimited-dial-up-internet`
- [ ] `1999.prices.music-cd-album`
- [ ] `1999.technology.dvd-player`
- [ ] `1999.technology.beige-desktop-pc`
- [ ] `1999.visions.human-level-machines-two-decades`

### 2005 (4)

- [ ] `2005.morning.read-blogs-rss-feeds`
- [ ] `2005.places.bedroom`
- [ ] `2005.places.street`
- [ ] `2005.visions.globalization-has-made-world`

### 2010 (9)

- [ ] `2010.morning.smartphone-alarm`
- [ ] `2010.morning.breakfast-laptop`
- [ ] `2010.morning.navigate-gps`
- [ ] `2010.places.bedroom`
- [ ] `2010.places.street`
- [ ] `2010.prices.netflix-streaming-only-plan`
- [ ] `2010.technology.laptop-wi-fi`
- [ ] `2010.technology.gps-navigation`
- [ ] `2010.technology.e-reader`

### 2020 (6)

- [ ] `2020.morning.help-kids-log-class`
- [ ] `2020.morning.order-groceries-delivery`
- [ ] `2020.places.bedroom`
- [ ] `2020.places.street`
- [ ] `2020.technology.ring-light-webcam`
- [ ] `2020.visions.employees-who-can-work`


## India Deep Dive

Status: plumbing and placeholders only. Every deep-dive item (11 sections per year, 13 years) is a placeholder marked `todo`
and has a fact-check row with status `unverifiable`; nothing in them is a claim yet.

**Rules fixed for the content phase**

- Two sources for any date of record, score, result, statistic or quote; the primary source wins on conflict.
- Neutral wording for contested topics; where historians disagree, summarise the main views each with a source.
- Items about conflict, disaster, famine, communal violence or assassination carry `sensitivity.level: "content-note"`.
- Public-domain excerpts (max four lines) are allowed only after a copyright note naming the item id is added below
  (Indian copyright: author's life plus 60 years). None so far.
- No maps of India's borders, flags, national emblem, religious or party symbols, logos or generated likenesses.
- Licensed images must be listed in `CREDITS.md` by their `src` path. None so far.

**Copyright decisions for excerpts:** none yet.

**Scarcity notes:** none yet.


## India Deep Dive: content batch 1 (1900, 1920, 1930, 1945), researched 13 October 2026

**Method.** Each item was written from pages opened during the pass: Wikipedia articles (quality `reference`), Olympedia and the Nobel Foundation (`primary`), and the *Imperial Gazetteer of India* (1907-09, vols. III and IV, via the Internet Archive; `primary`) for 1900. Dates, scores, statistics and quotes carry two sources or `"todo": true`. Where a claim could not be tied to a source, the item says so (`unverifiable`, `todo`) or the section carries a `scarcityNote`.

**Known weak spots.**
- Most items rest on Wikipedia alone or on two Wikipedia articles that cite the same book. Upgrading these to the books they cite is the main open task.
- The Gazetteer text was read as OCR. For the 1900 railway total the printed total (25,363) disagrees with the gauge columns (25,463), so the item says "about 25,400 miles".
- Wikipedia's "1930 in India" page is unreliable: it dates Raman's Nobel Prize to 28 February (that is the discovery date) and has Gandhi leaving for Britain in December 1930. It was not used for those facts; the Nobel Foundation page and the Salt March article were.
- Wikipedia's articles disagree on whether the first elections under the 1919 Act fell in 1920 or 1921; the 1920 item says so.
- Tagore's *Katha* and *Kahini* are marked todo because the works list classes them as "Songs" and "Drama".
- Economy sections for 1920, 1930 and 1945 hold only single-source figures (national income, census totals, famine mortality) and are marked unverified. The wage and price data the RupeeDashboard needs were found only for 1900 (rice, in seers per rupee) and not entered as a wage.
- Cinema, books and music for 1900 are thin: no Indian film dated 1900 itself was found.

**Interactive data.** Entered only where sourced: TechThenNow (1900, 1930), WhoGoverned (1900, 1920, 1930, 1945), MilestoneWall (all four), ScorecardReplay (1900, 1920, 1945), ProjectorReel (1920). The rest show their "still being researched" state.


## India Deep Dive: content batches 2 to 4 (1960 to 2050), researched 13 October 2026

**Coverage.** 1960, 1970, 1984, 1995, 1999, 2005, 2010 and 2020 follow the method of batch 1: specific Wikipedia articles, Olympedia results (Olympic items), the Nobel Foundation, and the Jnanpith Award list. 2050 holds 44 imagined items; each names the real plan or projection it extends (Viksit Bharat @2047, the Bharatiya Antariksh Station schedule, the 2070 net-zero pledge, population projections) and claims nothing as fact.

**Totals.** 550 items across 13 years, 94 of them marked `todo`. Every year has at least one section with a `scarcityNote` rather than padding, except 2050.

**Known weak spots (in addition to batch 1).**
- Years 1995 to 2020 lean on Wikipedia's "YYYY in India" pages for single events and national-income figures; those pages are uneven, so such items are `unverifiable`.
- The national-income figures printed in those pages carry no stated method, base year or units and should not be compared across years.
- Sports items need two sources; where only one article was opened the item is `unverifiable` rather than dated.
- Cinema box-office figures are from Wikipedia list articles that cite trade sites; they are not audited.
- Where Wikipedia pages disagree, the item names the discrepancy: Rakesh Sharma's launch (2 vs 3 April 1984), the VSNL Internet launch (14 vs 15 August 1995), the Delhi bombing toll (61 vs 62), the anti-Sikh riots toll (2,700 to 10,000 vs 3,350 to 17,000).
- The Jnanpith Award year is the award year; the announcement was sometimes years later (for example 2005, announced in 2008).
- No Indian-team Olympic results for years without Games; the 1900, 1920, 1960 and 1984 Olympic items come from Olympedia and Wikipedia.

**Not done.** The India era pages (morning routine, prices and so on) are still placeholders; wage and price series for the RupeeDashboard exist only for 1900 (rice, seers per rupee, not entered as a wage); threads, quiz and On this day are unbuilt.

## India era pages and Phase 5 (October 2026)

**Era pages.** All 13 India era files now hold real items: headlines, technology and places reuse the already-sourced deep-dive items;
prices come from primary statistical tables where they could be read.

- 1900: Imperial Gazetteer vol. III (grain prices per rupee 1896-1900, price index).
- 1920 and 1930: *Statistical Abstract relating to British India* (1923-24 to 1932-33), tables 298 and 300, read from the page scans
  (wholesale wheat, rice, tea and jute; retail rice at Bombay and Delhi). The 1920 row was cross-read in the 1916-17 to 1926-27 volume.
- 1945: no retail table exists in the abstracts (1942-45 are missing); only the Calcutta wholesale index (OCR text, unchecked) and the
  rupee's sterling value are given, both `todo`.
- 1960: *Statistical Abstract of the Indian Union* 1961, table 86 (wholesale rice, wheat, sugar, mutton), gold from the 1985 abstract.
- 1970: *Statistical Abstract India* 1974, table 161 (wholesale rice, wheat, milk, sugar, petrol), read from the scan.
- 1984, 1995, 1999: gold and silver at Bombay from the 1985, 1997 and 1999 abstracts; the abstracts of those years print price
  indices only, so no food prices are given. 1984 also has the Maruti 800 launch price, `todo` because sources disagree (Rs 47,500 or 48,000).
- 2005 and 2010: petrol and diesel at Delhi on 1 April, from the PPAC table of Indian Oil prices.
- 2020: Delhi fuel and LPG averages for 2020-21 from a parliamentary annexure; the PDF could not be opened, so they are `todo`.
- 1960 onward: exchange rate, inflation and GDP per capita from World Bank series. Adjusted figures use World Bank
  FP.CPI.TOTL (2010 = 100) with 2025 as the base year, because 2026 is not published; before 1960 there is no usable index.

**Gaps.** No forecast dated to its own year could be sourced for 1900, 1920, 1930, 1960, 1970, 1984, 1995 or 2010, so those pages
carry a note instead of a section. Retail food prices for 1984 to 2020 were not found. Several authoritative sites (Britannica,
ESPNcricinfo, CricketArchive, ISRO, UN) refused automated access, which is why many single-source deep-dive items stayed `todo`.

**Corrections found.** The Wikipedia infobox value for the 1961 census (438,936,918) matches neither official print (439,234,771 in
the 1985 abstract; 439,072,582 in 1974); the 1991 figure used (838,583,988) excludes Jammu and Kashmir, where no census was held.
The national-income items for 1970 to 2020 now cite the World Bank series, which the Wikipedia article reproduced (2020 has since been revised).

**Interactive data.** The RupeeDashboard now has data for 1900 (an agricultural labourer's monthly wage from the Gazetteer appendix)
and for 1960 to 2010 (output per person per day, GDP per capita divided by 365, labelled as not a wage). 1920, 1930, 1945, 2020 and
2050 have none. ReadingRoom and ProjectorReel still have no price data except the 1920 ticket.

## Removal of unverified India data (October 2026)

Policy from the project owner: no unverified data in the India dataset, and no price entry where no price was found.
Every India item marked `todo` was removed (76 deep-dive items, 22 era items) together with its fact-check row, its
highlight, `relatedIds` and thread references. Sections that fell below their usual minimum carry a `scarcityNote` (deep dive)
or `notes.<section>` (era page) saying so. The bedroom and street scenes were rewritten to state only what one cited item says.
Era captions that made unsourced claims were reduced to the scene name. No `todo` flag remains in `countries/in/`.

What remains are items with at least the sources the validator requires; some are still single-source (mostly Wikipedia articles),
which the rules allow for non-numeric facts. 2050 is speculative by design and is exempt. The World dataset was not touched and
still carries its own `todo` items.

## World dataset: verification pass (October 2026)

Rule from the project owner: anything unverifiable is removed. All 86 `todo` items in `countries/world/` were checked or removed.

- **Verified with two sources and kept (6 imagined futures):** Watkins 1900 strawberries (two transcription pages), Gates 1995 (Seattle Times review and
  Wikipedia; the text now says the Internet and Web are a subset of the "information highway", which is what the review says),
  Brand 1984 (Campus Technology and Wikipedia; wording follows the quoted version), Gibson 1984 (Computing History and Wikipedia; the text is
  now Gibson's own definition of cyberspace), Friedman 2005 (Kirkus and Wikipedia), Twitter 2020 (InsideHook and KTVU).
- **Verified from a primary series:** the 1970 movie ticket, $1.55, Historical Statistics series Dh391.
- **Rewritten:** every bedroom and street scene now states one sourced figure (telephones, electrified dwellings, television households,
  FHWA motor-vehicle registrations) or the description of one verified technology item from the same year.
- **Removed:** Toffler 1970, Negroponte 1995 and Kurzweil 1999 (no source confirmed the wording), and every general-description morning step,
  price and technology with no source (clock radios, percolators, e-readers, 1999 CD price, 1984 DynaTAC price, ticket prices for
  1920, 1930, 1960, 1999, gasoline 1930 and 1945, and so on). Sections now shorter than usual carry `notes`.


## Everyday sections (year page)

Status (18 October 2026): sourced content exists for 1900, 1920, 1930, 1945, 1960, 1970, 1984, 1995, 1999, 2005, 2010 and 2020, for World and India. It is thin: most sections are below their minimum and carry a `scarcityNote`; `docs/COVERAGE.md` has the counts. 2050 has no everyday content yet.

### How it was researched
- Pages were opened with a fetch tool wherever possible, and the claim was written from what the page said, not from memory. Where a search summary was the only evidence, the item is `todo: true` (shown as Unverified) and the fact-check row says so.
- Numbers (`stat`, `price`, `wage`) need two sources or `todo`. Wikipedia counts as a reference source; the second source is a statistical office, a government page or a second Wikipedia article on a different subject. Where sources disagree, both figures are in the item's fact-check note.
- Population, life expectancy, urban share, infant mortality, fertility, electricity, mobile and internet figures for 1960-2020 come from the World Bank's World Development Indicators API, cross-checked against Our World in Data where it would give the series (population, life expectancy, internet). The two draw on the same UN estimates, so agreement is not independent confirmation; single-source World Bank items are `todo`.
- US wages, hours, vehicles and school terms come from Historical Statistics of the United States (tables Ba4280, Ba4361, Ba4589, Df339, Bc94) and NCES Digest table 36, FHWA MV-200 and the Census Bureau's decennial facts pages. HSUS ends in 1995, so later US wages and hours were not found.
- Several facts differ between Wikipedia pages (for example the founding date of the Delhi Metro Rail Corporation, the first US COVID case, the Silent Valley date); the items say which was used, or the claim was left out.
- Corrections made while checking: Hum Log ran for 65 episodes, not 156; the Pimpri-Chinchwad corporation dates from 1982 (the council from 1970); a US census population of 203,302,031 for 1970 (one Wikipedia list misprints 203,392,031).

### Spotlights
All 24 use the default topic from the brief except where noted. World: gaslight to electric light (1900); Prohibition and the vote for women (1920); making do in the Depression (1930); rationing and the home front (1945); suburbs, TV dinners and the family car (1960); the first Earth Day (1970); computers come home (1984); getting online (1995); Y2K (1999); sharing online (2005, video only, no camera-phone figures found); smartphones and apps (2010); lockdown life (2020). India: swadeshi, khadi and the cloth boycott (1920); salt and khadi (1930); ration cards (1945); steel and project towns (1960); the Green Revolution (1970); television arrives (1984); cable TV and the PCO booth (1995); cyber cafés and IT jobs (1999); the mobile phone and SMS (2005); recharge culture (2010, no items); lockdown life and paying by phone (2020). The 1900 India spotlight (rail, post and telegraph) has only a telegraph item.

### Not done
2050 everyday and deep-dive items beyond the existing ones; most `byTheNumbers` stats for years before 1960 beyond the census and a few indicators; wages and prices for India after 1920; school figures for India; anything on food, kitchens and dress for India after 1900.

<!-- scarcity:start -->
### Scarcity (generated from the data files by the research build; edit the data, not this list)

Deep dive (year, section, count, reason):

- 1900 technology-science: 5 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice.
- 1900 freedom-history: 4 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice.
- 1900 achievements: 4 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice.
- 1900 sports: 5 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice.
- 1900 literature: 4 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice.
- 1900 books-reading: 4 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice.
- 1900 cinema: 4 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice.
- 1900 music-arts: 4 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice.
- 1900 economy-business: 3 items. For 1900 only items that could be checked against two sources were kept; documentation for this year is thin and the section is short by the sources, not by choice. Only one indicator is not already on the year page or in the Prices board.
- 1920 technology-science: 5 items. For 1920 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1920 achievements: 4 items. For 1920 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1920 sports: 5 items. For 1920 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1920 literature: 4 items. For 1920 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1920 books-reading: 4 items. For 1920 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1920 cinema: 4 items. For 1920 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1920 music-arts: 4 items. For 1920 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1920 economy-business: 1 items. For 1920 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 technology-science: 4 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 government-politics: 5 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 achievements: 3 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 sports: 3 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 literature: 4 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 books-reading: 4 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 cinema: 4 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 music-arts: 3 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1930 economy-business: 1 items. For 1930 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 technology-science: 3 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 government-politics: 5 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 freedom-history: 3 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 achievements: 3 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 sports: 4 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 literature: 3 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 books-reading: 3 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 cinema: 4 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 music-arts: 2 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1945 economy-business: 1 items. For 1945 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 technology-science: 4 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 freedom-history: 4 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 achievements: 3 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 sports: 4 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 literature: 1 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 books-reading: 3 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 cinema: 4 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 music-arts: 3 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1960 economy-business: 2 items. For 1960 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 technology-science: 3 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 government-politics: 4 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 freedom-history: 4 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 achievements: 3 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 sports: 2 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 literature: 3 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 books-reading: 4 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 cinema: 4 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 music-arts: 2 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1970 economy-business: 2 items. For 1970 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 technology-science: 3 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 government-politics: 4 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 achievements: 4 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 sports: 4 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 literature: 3 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 books-reading: 2 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 cinema: 5 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 music-arts: 2 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1984 economy-business: 1 items. For 1984 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 technology-science: 4 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 government-politics: 3 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 freedom-history: 3 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 achievements: 3 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 sports: 2 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 literature: 3 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 books-reading: 1 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 cinema: 4 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 music-arts: 1 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1995 economy-business: 1 items. For 1995 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 technology-science: 2 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 government-politics: 3 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 freedom-history: 4 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 achievements: 3 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 sports: 2 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 literature: 3 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 books-reading: 2 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 cinema: 4 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 music-arts: 1 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1999 economy-business: 1 items. For 1999 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 technology-science: 3 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 government-politics: 4 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 freedom-history: 4 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 achievements: 4 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 sports: 1 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 literature: 3 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 books-reading: 2 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 cinema: 3 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 music-arts: 1 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2005 economy-business: 1 items. For 2005 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 technology-science: 3 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 government-politics: 4 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 freedom-history: 2 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 achievements: 2 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 sports: 4 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 literature: 1 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 books-reading: 1 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 cinema: 3 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 music-arts: 1 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2010 economy-business: 1 items. For 2010 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 technology-science: 2 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 government-politics: 3 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 achievements: 2 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 sports: 1 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 literature: 1 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 books-reading: 1 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 cinema: 4 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 music-arts: 0 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 2020 economy-business: 2 items. For 2020 only items that could be checked against two sources were kept; the section is short by the sources, not by choice.
- 1900 personalities: Only one woman (Pandita Ramabai) could be documented for 1900 against two sources; Sister Nivedita and Cornelia Sorabji were considered but their 1900 activity could not be confirmed. Three regions are covered (east, west, overseas).

Everyday sections (country, year, section, count, reason):

- world 1900 schoolAndChildhood: 3 items. We could not verify national figures for the share of children enrolled in 1900, or for school fees and the school day. This section holds what was checked.
- world 1900 gettingAround: 5 items. We found no sourced 1900 door-to-door journey times or fares, so there are no journey cards for this year.
- world 1900 keepingInTouch: 4 items. We found no sourced delivery times for letters or telegrams in 1900, so there are no message cards that can race.
- world 1900 leisureAndFun: 4 items. We could not verify baseball attendance or Fourth of July customs for 1900, so those are left out.
- world 1920 byTheNumbers: 5 items. Life expectancy, literacy and household size could not be confirmed for 1920 from a source we opened, so they are left out.
- world 1920 foodAndKitchen: 5 items. Most 1920s food sources describe the whole decade, not 1920. We could not find sourced 1920 grocery prices or kitchen appliance counts, so no price cards are shown.
- world 1920 workAndWages: 2 items. We could not find sourced 1920 figures for women's work, child labour or typical household chores, so none are shown.
- world 1920 schoolAndChildhood: 1 items. We could not find sourced figures for enrolment, school costs or toys for 1920.
- world 1920 gettingAround: 1 items. We could not find sourced 1920 fares or journey times for streetcars, trains or intercity trips, so there are no journey cards.
- world 1920 keepingInTouch: 2 items. We could not find sourced 1920 delivery times or telegram and long-distance telephone rates.
- world 1920 healthAndMedicine: 1 items. We could not find sourced doctor fees, hospital costs or vaccination figures for 1920.
- world 1920 leisureAndFun: 1 items. We could not find sourced material for sport, holidays or music in 1920.
- world 1930 byTheNumbers: 4 items. Life expectancy, literacy, urban share and household size could not be confirmed for 1930 from a source we opened.
- world 1930 foodAndKitchen: 2 items. We could not find sourced 1930 grocery prices, relief meals or kitchen appliances, so only the one food change we could confirm is shown.
- world 1930 clothingAndStyle: 5 items. We could not find sourced descriptions of 1930 fashion or ready-made prices.
- world 1930 workAndWages: 2 items. We could not find a sourced 1930 wage figure: the Historical Statistics earnings table we opened ends in 1929.
- world 1930 schoolAndChildhood: 1 items. We could not find sourced figures on enrolment, school costs or toys for 1930.
- world 1930 gettingAround: 1 items. We could not find sourced 1930 fares or journey times; the vehicle count is under The year in numbers.
- world 1930 keepingInTouch: 3 items. We could not find sourced 1930 postage, telephone or telegraph details.
- world 1930 healthAndMedicine: 0 items. We could not find sourced material on health, doctors or hospitals for 1930.
- world 1930 leisureAndFun: 0 items. We could not find sourced material on films, sport or holidays for 1930; radio is under Keeping in touch.
- world 1930 spotlight: 4 items. Soup kitchens, bread lines and relief figures could not be sourced from pages we opened.
- world 1945 byTheNumbers: 5 items. Population, life expectancy and household figures for 1945 could not be confirmed from a source we opened.
- world 1945 schoolAndChildhood: 2 items. We could not find sourced school figures for 1945: the NCES table we opened has no entry between 1939-40 and 1949-50.
- world 1945 keepingInTouch: 0 items. We could not find sourced 1945 postal rates, telephone figures or radio audiences.
- world 1945 leisureAndFun: 0 items. We could not find sourced material on films, radio, sport or holidays for 1945.
- world 1960 foodAndKitchen: 2 items. We could not find sourced 1960 grocery prices, appliance counts or typical meals.
- world 1960 workAndWages: 1 items. We could not find sourced figures for 1960 working hours, women's work or the minimum wage.
- world 1960 schoolAndChildhood: 2 items. We could not find sourced figures on 1960 enrolment, school costs or toys.
- world 1960 gettingAround: 1 items. We could not find sourced 1960 fares, journey times or air travel figures; the vehicle count is under The year in numbers.
- world 1960 keepingInTouch: 0 items. We could not find sourced 1960 postage, telephone or television figures.
- world 1960 healthAndMedicine: 1 items. We could not find sourced 1960 doctor fees, hospital costs or vaccination figures.
- world 1970 foodAndKitchen: 0 items. We could not find sourced 1970 prices, appliance counts or meals: the pages we opened on fast food and groceries had no figures for 1970.
- world 1970 workAndWages: 2 items. We could not find sourced figures for 1970 hours, women's work or the minimum wage.
- world 1970 schoolAndChildhood: 1 items. We could not find sourced enrolment figures, costs or toy sales for 1970.
- world 1970 keepingInTouch: 1 items. We could not find sourced 1970 postage rates, telephone counts or television households.
- world 1970 healthAndMedicine: 1 items. We could not find sourced 1970 doctor fees, hospital costs or disease figures.
- world 1984 byTheNumbers: 6 items. Literacy and household size were not found for 1984. There was no census; population figures are mid-year estimates.
- world 1984 foodAndKitchen: 1 items. We could not find sourced 1984 food prices, appliance counts or meals; the pages we opened on fast food had no 1984 figures.
- world 1984 workAndWages: 1 items. We could not find sourced figures for 1984 hours, women's work or the minimum wage.
- world 1984 schoolAndChildhood: 0 items. We could not find sourced school-year, enrolment or toy figures for 1984: the NCES table we opened has an estimate only to 1979-80.
- world 1984 gettingAround: 1 items. We could not find sourced 1984 fares or journey times; the vehicle count is under The year in numbers.
- world 1984 keepingInTouch: 1 items. We could not find sourced 1984 postage rates or telephone and modem counts.
- world 1984 healthAndMedicine: 2 items. We could not find sourced 1984 doctor fees, hospital costs or vaccination figures.
- world 1995 byTheNumbers: 6 items. Literacy and household size were not found for 1995. There was no census; population figures are mid-year estimates.
- world 1995 foodAndKitchen: 0 items. We could not find sourced 1995 food prices, appliance counts or meals.
- world 1995 workAndWages: 1 items. We could not find sourced figures for 1995 hours, women's work or the minimum wage.
- world 1995 schoolAndChildhood: 0 items. We could not find sourced school-year, enrolment or toy figures for 1995: the NCES term table we opened ends before 1989-90. School internet access is in the spotlight.
- world 1995 gettingAround: 0 items. We could not find sourced 1995 fares or journey times; the vehicle count is under The year in numbers.
- world 1995 keepingInTouch: 0 items. We could not find sourced 1995 postage, long-distance rates or answering-machine figures; mobile phones are under The year in numbers and the internet in the spotlight.
- world 1995 healthAndMedicine: 0 items. We could not find sourced 1995 doctor fees, hospital costs or vaccination figures.
- world 1995 leisureAndFun: 0 items. We could not find sourced 1995 film, television or sport material from pages we opened in full.
- world 1999 byTheNumbers: 6 items. Literacy, household size and vehicle counts were not found for 1999 from a source we opened. There was no census; population figures are mid-year estimates.
- world 1999 foodAndKitchen: 0 items. We could not find sourced 1999 food prices, appliance counts or meals.
- world 1999 clothingAndStyle: 3 items. The fashion pages we opened date most late-1990s trends only to the mid-to-late decade.
- world 1999 workAndWages: 0 items. We could not find sourced 1999 wage, hours or minimum-wage figures: the earnings table we opened ends in 1995.
- world 1999 schoolAndChildhood: 1 items. We could not find sourced 1999 school-year or enrolment figures.
- world 1999 gettingAround: 1 items. We could not find sourced 1999 fares, journey times or vehicle counts.
- world 1999 keepingInTouch: 2 items. We could not find sourced 1999 postage, long-distance or answering-machine figures.
- world 1999 healthAndMedicine: 0 items. We could not find sourced 1999 doctor fees, hospital costs or vaccination figures.
- world 2005 byTheNumbers: 6 items. Literacy, household size, vehicle counts and wages were not found for 2005 from a source we opened. There was no census; population figures are mid-year estimates.
- world 2005 foodAndKitchen: 0 items. We could not find sourced 2005 food prices, appliance counts or meals.
- world 2005 workAndWages: 0 items. We could not find sourced 2005 wage, hours or minimum-wage figures.
- world 2005 schoolAndChildhood: 0 items. We could not find sourced 2005 school-year or enrolment figures.
- world 2005 gettingAround: 1 items. We could not find sourced 2005 fares, journey times or vehicle counts.
- world 2005 keepingInTouch: 0 items. We could not find sourced 2005 postage, text-message or call-rate figures; the sharing sites are in the spotlight.
- world 2005 healthAndMedicine: 0 items. We could not find sourced 2005 health figures.
- world 2005 spotlight: 5 items. We could not find sourced figures for camera-phone ownership or photo sharing in 2005, so the section is about video.
- world 2010 byTheNumbers: 6 items. Literacy, household size, vehicle counts and wages were not found for 2010 from a source we opened.
- world 2010 foodAndKitchen: 1 items. We could not find sourced 2010 food prices or meals beyond a tomato shortage.
- world 2010 workAndWages: 0 items. We could not find sourced 2010 wage, hours or minimum-wage figures; the jobs count is under The year in numbers.
- world 2010 schoolAndChildhood: 0 items. We could not find sourced 2010 school-year or enrolment figures.
- world 2010 gettingAround: 2 items. We could not find sourced 2010 fares, journey times or vehicle counts.
- world 2010 keepingInTouch: 0 items. We could not find sourced 2010 postage, text-message or call-rate figures; the new devices and apps are in the spotlight.
- world 2010 healthAndMedicine: 2 items. We could not find sourced 2010 doctor fees, hospital costs or vaccination figures.
- world 2020 byTheNumbers: 6 items. Literacy, household size and vehicle counts were not found for 2020 from a source we opened.
- world 2020 foodAndKitchen: 0 items. We could not find sourced 2020 food prices or home-baking figures from a page we opened.
- world 2020 workAndWages: 4 items. We could not find sourced 2020 wages, hours or the share working from home.
- world 2020 schoolAndChildhood: 2 items. We could not find a sourced count of students affected or of school-year length for 2020.
- world 2020 gettingAround: 1 items. We could not find sourced 2020 traffic, fare or vehicle figures.
- world 2020 keepingInTouch: 3 items. We could not find sourced 2020 postage, call or text figures.
- world 2020 healthAndMedicine: 3 items. We could not find sourced 2020 doctor fees, telehealth counts or hospital capacity figures.
- in 1900 byTheNumbers: 5 items. Household electricity, telephones and household size are not available for 1900. The figures below are those we could trace to a source.
- in 1900 foodAndKitchen: 3 items. We could not find sourced 1900 meal patterns, kitchen tools or food storage practice, so this section is short.
- in 1900 clothingAndStyle: 2 items. We could not find sourced descriptions of everyday garments, fabrics bought or fashions of 1900.
- in 1900 workAndWages: 3 items. Wage rates are hard to trace for 1900. The one sourced figure is the agricultural labourer's average; we did not estimate others.
- in 1900 schoolAndChildhood: 3 items. We could not find all-India school counts or school fees for 1900; the figures here are for the Bombay Presidency.
- in 1900 gettingAround: 2 items. We could not find sourced 1900 fares or journey times for named routes, so there are no journey cards.
- in 1900 keepingInTouch: 2 items. We could not find 1900 letter rates, post-office counts or telegram rates, and no delivery times; there are no message cards.
- in 1900 healthAndMedicine: 2 items. We could not find sourced 1900 doctor fees, hospital costs or common remedies for India; the famine itself is in the history section.
- in 1900 leisureAndFun: 1 items. We could not find sourced material on cinema shows, wrestling, cricket outings or other festivals as people practised them in 1900.
- in 1900 spotlight: 1 items. Rail and post are covered under Getting around and Keeping in touch; we could not find a sourced 1900 count of post offices, letters carried or telegraph mileage.
- in 1920 byTheNumbers: 2 items. Literacy, life expectancy and household electricity could not be traced to a source we opened for 1920-21. The two figures below are for the 1921 census.
- in 1920 foodAndKitchen: 0 items. We could not find sourced material on meals, kitchens or food storage for 1920. The era page's Prices board has sourced grain prices.
- in 1920 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday garments in 1920 beyond the khadi campaign, which is in the spotlight.
- in 1920 workAndWages: 4 items. We could not find sourced wage rates outside the Bombay mills, nor figures for women's or child labour.
- in 1920 schoolAndChildhood: 0 items. We could not find sourced figures on school attendance, fees or children's play for 1920.
- in 1920 gettingAround: 2 items. We could not find sourced 1920 railway fares or journey times.
- in 1920 keepingInTouch: 0 items. We could not find sourced 1920 postal rates, telegram charges or delivery times.
- in 1920 healthAndMedicine: 3 items. We could not find sourced doctor fees, hospital provision or vaccination figures for 1920.
- in 1920 leisureAndFun: 0 items. We could not find sourced material on leisure, festivals or sport as ordinary people took part in 1920.
- in 1920 spotlight: 5 items. We could not find sourced figures for khadi output or prices in 1920, so the section describes the campaign, not its economics.
- in 1930 byTheNumbers: 3 items. Urban share, life expectancy and household figures are not in the sources we could open for 1930-31.
- in 1930 foodAndKitchen: 0 items. We could not find sourced 1930 meals, kitchens or food prices. The era page's Prices board has sourced grain prices.
- in 1930 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 1930 beyond the cloth boycott.
- in 1930 workAndWages: 0 items. We could not find sourced 1930 wages, hours or prices: the Bombay cost-of-living and wage series we searched did not return 1930 figures.
- in 1930 schoolAndChildhood: 1 items. We could not find sourced 1930 school enrolment or fees.
- in 1930 gettingAround: 0 items. We could not find sourced 1930 fares or journey times; the Deccan Queen is on the era page.
- in 1930 keepingInTouch: 0 items. We could not find sourced 1930 postal or telegram rates; state broadcasting is on the era page.
- in 1930 healthAndMedicine: 0 items. We could not find sourced material on health or medicine for 1930.
- in 1930 leisureAndFun: 2 items. We could not find sourced material on festivals or sport as ordinary people took part in 1930.
- in 1945 byTheNumbers: 0 items. The census of 1941 is the nearest count; we could not source 1945 population, literacy or price figures from pages we opened.
- in 1945 foodAndKitchen: 1 items. We could not find sourced 1945 meals, kitchens or prices; wartime controls are in the spotlight.
- in 1945 clothingAndStyle: 0 items. We could not find sourced descriptions of dress in 1945 beyond the cloth shortage, which is in the spotlight.
- in 1945 workAndWages: 0 items. We could not find sourced 1945 wages or hours.
- in 1945 schoolAndChildhood: 0 items. We could not find sourced 1945 school figures.
- in 1945 gettingAround: 0 items. We could not find sourced 1945 fares or journey times; railways were requisitioned for the war effort.
- in 1945 keepingInTouch: 0 items. We could not find sourced 1945 postal or telegram figures.
- in 1945 healthAndMedicine: 0 items. We could not find sourced health figures for 1945; the famine of 1943 is in the history section.
- in 1945 leisureAndFun: 0 items. We could not find sourced material on leisure in 1945.
- in 1945 spotlight: 5 items. We could not find sourced allowances for sugar, cloth or kerosene, or prices, so the section describes the system rather than the quantities.
- in 1960 foodAndKitchen: 0 items. We could not find sourced 1960 meals, kitchens or retail prices. The era page's Prices board has wholesale grain and sugar prices.
- in 1960 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 1960.
- in 1960 workAndWages: 0 items. We could not find sourced 1960 wage rates or working hours.
- in 1960 schoolAndChildhood: 0 items. We could not find sourced school enrolment or fees for 1960; literacy is under The year in numbers.
- in 1960 gettingAround: 1 items. We could not find sourced 1960 railway or bus fares, or journey times.
- in 1960 keepingInTouch: 2 items. We could not find sourced 1960 postal, telegram or telephone figures.
- in 1960 healthAndMedicine: 2 items. We could not find sourced figures on doctors, hospitals or other diseases for 1960.
- in 1960 leisureAndFun: 0 items. We could not find sourced material on leisure or festivals in 1960; the film and radio of the year are on the era page.
- in 1960 spotlight: 5 items. We could not find sourced wages, housing allotments or population for the steel towns in 1960.
- in 1970 foodAndKitchen: 0 items. We could not find sourced 1970 meals, kitchens or retail prices. Milk and grain prices are on the era page's Prices board, and Operation Flood is in the history section.
- in 1970 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 1970.
- in 1970 workAndWages: 0 items. We could not find sourced wage rates or working hours for 1970.
- in 1970 schoolAndChildhood: 0 items. We could not find sourced school enrolment or fees for 1970; literacy is under The year in numbers.
- in 1970 gettingAround: 2 items. We could not find sourced 1970 railway or bus fares or journey times.
- in 1970 keepingInTouch: 0 items. We could not find sourced 1970 postal, telephone or television figures.
- in 1970 healthAndMedicine: 0 items. We could not find sourced 1970 health figures beyond infant mortality.
- in 1970 leisureAndFun: 0 items. We could not find sourced material on cinema outings, festivals or sport for 1970; ticket prices were not found.
- in 1970 spotlight: 6 items. We could not find sourced fertiliser use, seed prices or the area under new varieties in 1970.
- in 1984 foodAndKitchen: 0 items. We could not find sourced 1984 meals, kitchens or retail prices. Grain and milk prices are on the era page's Prices board.
- in 1984 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 1984.
- in 1984 workAndWages: 0 items. We could not find sourced wage rates or working hours for 1984.
- in 1984 schoolAndChildhood: 0 items. We could not find sourced school enrolment or fees for 1984; literacy is under The year in numbers.
- in 1984 gettingAround: 1 items. We could not find sourced 1984 railway or bus fares, or journey times.
- in 1984 keepingInTouch: 1 items. We could not find a sourced national count of telephones, trunk-call charges or postal rates for 1984.
- in 1984 healthAndMedicine: 0 items. We could not find sourced 1984 health figures beyond infant mortality; the Bhopal gas leak is in the history section.
- in 1984 leisureAndFun: 0 items. We could not find sourced material on cinema outings or festivals for 1984, beyond what is in the spotlight.
- in 1984 spotlight: 5 items. We could not find a sourced count of television sets in India in 1984, or set prices.
- in 1995 foodAndKitchen: 0 items. We could not find sourced 1995 meals, kitchens or retail prices. The era page's Prices board has sourced prices.
- in 1995 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 1995.
- in 1995 workAndWages: 0 items. We could not find sourced wage rates or working hours for 1995.
- in 1995 schoolAndChildhood: 0 items. We could not find sourced school enrolment or fees for 1995; literacy is under The year in numbers.
- in 1995 gettingAround: 0 items. We could not find sourced 1995 fares or journey times.
- in 1995 keepingInTouch: 4 items. We could not find sourced 1995 letter rates, call charges or waiting lists beyond what is shown.
- in 1995 healthAndMedicine: 2 items. We could not find sourced 1995 doctor fees, hospital costs or other health figures.
- in 1995 leisureAndFun: 1 items. We could not find sourced 1995 ticket prices, festival or sport material beyond the cinema item.
- in 1995 spotlight: 4 items. We could not find a sourced count of cable homes, monthly cable fees or STD booths for 1995, so the section describes the system rather than the numbers.
- in 1999 byTheNumbers: 6 items. Literacy, urban share and household size are not given for 1999: the censuses fell in 1991 and 2001.
- in 1999 foodAndKitchen: 0 items. We could not find sourced 1999 meals, kitchens or retail prices.
- in 1999 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 1999.
- in 1999 workAndWages: 0 items. We could not find sourced wages or hours for 1999, including software salaries.
- in 1999 schoolAndChildhood: 0 items. We could not find sourced school enrolment or fees for 1999.
- in 1999 gettingAround: 0 items. We could not find sourced 1999 fares or journey times; the Delhi-Lahore bus is in the history section.
- in 1999 keepingInTouch: 0 items. We could not find sourced 1999 postal, call or mobile tariff figures; internet access is in the spotlight.
- in 1999 healthAndMedicine: 0 items. We could not find sourced 1999 health figures beyond infant mortality.
- in 1999 leisureAndFun: 0 items. We could not find sourced 1999 ticket prices or festival material.
- in 1999 spotlight: 7 items. We could not find a sourced count of cyber cafés or software professionals across India for 1999.
- in 2005 byTheNumbers: 6 items. Literacy and household size are not given for 2005: the census fell in 2001 and 2011. Rupee prices are on the era page.
- in 2005 foodAndKitchen: 0 items. We could not find sourced 2005 meals, kitchens or retail prices.
- in 2005 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 2005.
- in 2005 workAndWages: 3 items. We could not find sourced 2005 wage rates; the Act's wage figures are from later years.
- in 2005 schoolAndChildhood: 1 items. We could not find sourced school enrolment or fees for 2005.
- in 2005 gettingAround: 1 items. We could not find sourced 2005 railway fares or journey times.
- in 2005 keepingInTouch: 3 items. We could not find sourced 2005 mobile tariffs, SMS volumes or subscriber counts beyond the World Bank figure.
- in 2005 healthAndMedicine: 1 items. We could not find sourced 2005 doctor fees, hospital costs or disease figures beyond infant mortality.
- in 2005 leisureAndFun: 2 items. We could not find sourced 2005 ticket prices, mall counts or festival material.
- in 2005 spotlight: 2 items. We could not find sourced 2005 subscriber counts, prepaid shares, SMS volumes or handset prices, so the section shows only what could be traced.
- in 2010 foodAndKitchen: 0 items. We could not find sourced 2010 meals or retail prices; the onion price rise of December is political, not household, in the sources we opened.
- in 2010 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 2010.
- in 2010 workAndWages: 0 items. We could not find sourced wage rates or working hours for 2010.
- in 2010 schoolAndChildhood: 0 items. We could not find sourced school enrolment or fees for 2010; the Act is in the government section.
- in 2010 gettingAround: 2 items. We could not find sourced 2010 fares or journey times.
- in 2010 keepingInTouch: 2 items. We could not find sourced 2010 recharge, SMS, data-pack or call tariffs, or smartphone ownership.
- in 2010 healthAndMedicine: 0 items. We could not find sourced 2010 health figures beyond life expectancy.
- in 2010 spotlight: 0 items. We could not find sourced prepaid shares, recharge denominations, smartphone sales or data prices for 2010, so only the broad figures are shown.
- in 2020 byTheNumbers: 6 items. Literacy and household size were not found for 2020: the census had been taken in 2011 and was due in 2021.
- in 2020 foodAndKitchen: 1 items. We could not find sourced 2020 meals, kitchen costs or retail prices.
- in 2020 clothingAndStyle: 0 items. We could not find sourced descriptions of everyday dress in 2020.
- in 2020 workAndWages: 2 items. We could not find sourced 2020 wage rates or the number of jobs lost.
- in 2020 schoolAndChildhood: 1 items. We could not find sourced 2020 counts of children affected or with phone access.
- in 2020 gettingAround: 0 items. We could not find sourced 2020 fares or traffic figures.
- in 2020 keepingInTouch: 0 items. We could not find sourced 2020 data-use, call or video-calling figures.
- in 2020 healthAndMedicine: 2 items. We could not find sourced 2020 doctor, hospital or testing figures.
- in 2020 leisureAndFun: 0 items. We could not find sourced 2020 material on cinema, festivals or sport as people took part in it during the lockdown.
- in 2020 spotlight: 5 items. We could not find sourced counts of small shops accepting UPI or smartphone ownership, so the payment growth is shown only in national totals.

Deep-dive curation (items removed to make room for women or a wider spread of regions; their facts stay in other sections):

- 1900 personalities.ranjitsinhji: Curated out to make room for a woman and a third region; his 1900 season stays in the sports section.
- 1920 personalities.meghnad-saha: Curated out to make room for two women; his ionisation equation stays in the technology and achievements sections.
- 1920 personalities.purma-bannerjee: Curated out to make room for a woman; his races stay in the sports section.
- 1930 personalities.duleepsinhji: Curated out to make room for two women; his 1930 season stays in the sports section.
- 1930 personalities.s-chandrasekhar: Curated out to make room for two women; his 1930 calculations stay in the technology section.
- 1960 personalities.rajendra-prasad: Curated out to make room for a second woman; the President's office stays in the government section.
- 1970 personalities.v-v-giri: Curated out to make room for two women; the presidency stays in the government section.
- 1970 personalities.sunil-gavaskar: Curated out to make room for two women; his first Test came in 1971.
- 1984 personalities.zail-singh: Curated out to add a third region; the presidency stays in the government section.
- 1995 personalities.pv-narasimha-rao: Curated out to make room for two women; the Prime Minister's office stays in the government section.
- 1995 personalities.shankar-dayal-sharma: Curated out to make room for two women; the presidency stays in the government section.
- 1999 personalities.kr-narayanan: Curated out to make room for a second woman; the presidency stays in the government section.
- 2020 personalities.ram-nath-kovind: Curated out to make room for two women; the presidency stays in the government section.
- 2020 personalities.rishi-kapoor: Curated out to make room for a second woman; the item on Irrfan Khan covers the same weekend.

People whose regionTag was 'national' in earlier batches were re-tagged by birthplace region (north, south, east, west, central, overseas) so the region filter and the three-region check work.

<!-- scarcity:end -->
