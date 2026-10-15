import { Box, Button, Typography } from "@mui/material";
import { useMemo } from "react";
import { useEraContext } from "../../context/EraContext";
import { SourceNote } from "../common/SourceNote";
import { goToItem, type FlatItem } from "./allYears";
import { useDeepDiveStyle } from "./useDeepDiveStyle";

const FULL = /^\d{4}-(\d{2})-(\d{2})$/;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const label = (m: number, d: number) => `${d} ${MONTHS[m - 1]}`;

/** Items whose full date (month and day) matches today, in any year. Only day-level dates qualify. */
export function OnThisDay({ items }: { items: FlatItem[] }) {
  const { country } = useEraContext();
  const { theme, accent } = useDeepDiveStyle();
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  const { today, next } = useMemo(() => {
    const dated = items
      .filter((f) => !f.speculative && f.item.sensitivity?.level !== "content-note" && FULL.test(f.item.date ?? ""))
      .map((f) => {
        const [, mm, dd] = f.item.date!.match(FULL)!;
        return { f, m: Number(mm), d: Number(dd) };
      });
    const today = dated.filter((x) => x.m === m && x.d === d).map((x) => x.f).sort((a, b) => a.year - b.year);
    const dayOfYear = (mm: number, dd: number) => mm * 40 + dd;
    const after = dated.filter((x) => dayOfYear(x.m, x.d) > dayOfYear(m, d)).sort((a, b) => dayOfYear(a.m, a.d) - dayOfYear(b.m, b.d));
    const nxt = after[0] ?? [...dated].sort((a, b) => dayOfYear(a.m, a.d) - dayOfYear(b.m, b.d))[0];
    return { today, next: nxt };
  }, [items, m, d]);

  return (
    <Box component="section" aria-labelledby="otd-h" sx={{ mb: 4 }}>
      <Typography component="h2" id="otd-h" variant="h5" sx={{ mb: 1 }}>
        On this day, {label(m, d)}
      </Typography>
      {today.length > 0 ? (
        <Box component="ul" sx={{ m: 0, p: 0, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
          {today.map((f) => (
            <Box component="li" key={f.item.id} sx={{ listStyle: "none", p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderTop: `4px solid ${accent}` }}>
              <Typography variant="overline" component="p" sx={{ fontWeight: 700 }}>
                {f.item.date}
              </Typography>
              <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
                {f.item.title}
              </Typography>
              <Typography variant="body2">{f.item.summary}</Typography>
              <SourceNote todo={f.item.todo} source={f.item.sources[0]} />
              <Button size="small" sx={{ px: 0, mt: 0.5 }} onClick={() => goToItem(country, f)}>
                Open in {f.year}
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>
          No item in the deep dive is dated {label(m, d)}.
          {next && (
            <>
              {" "}
              The next dated item is {label(next.m, next.d)} {next.f.year}: {next.f.item.title}.{" "}
              <Button size="small" onClick={() => goToItem(country, next.f)}>
                Open it
              </Button>
            </>
          )}
        </Typography>
      )}
    </Box>
  );
}
