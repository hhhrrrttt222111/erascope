import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { useShellEra } from "../../context/EraContext";
import { EraCard } from "../common/EraCard";
import { SourceNote } from "../common/SourceNote";

export function PriceBoard() {
  const era = useShellEra();
  const theme = useTheme();
  const showAdjusted = era.prices.some((p) => p.adjusted2026);
  const win = theme.era.chrome === "win98";

  const methods = [...new Set(era.prices.map((p) => p.adjustedMethod).filter((m): m is string => Boolean(m)))];
  return (
    <EraCard sx={win ? { background: "#fff", boxShadow: "inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080" } : undefined}>
      {/* In a narrow column the "2026 money" column folds under the price (container query). */}
      <Box
        sx={{
          containerType: "inline-size",
          "@container (max-width: 420px)": {
            "& .tm-adj-col": { display: "none" },
            "& .tm-adj-inline": { display: "block" },
          },
        }}
      >
      <Table size="small" aria-label={`Prices in ${era.year}`}>
        <TableHead>
          <TableRow>
            <TableCell scope="col" sx={{ fontWeight: 700 }}>Item</TableCell>
            <TableCell scope="col" align="right" sx={{ fontWeight: 700 }}>
              {era.speculative ? "Imagined price" : `In ${era.year}`}
            </TableCell>
            {showAdjusted && (
              <TableCell scope="col" align="right" className="tm-adj-col" sx={{ fontWeight: 700 }}>
                In 2026 money
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {era.prices.map((p) => (
            <TableRow key={p.id}>
              <TableCell component="th" scope="row">
                {p.item}
                <SourceNote source={p.source} todo={p.todo} />
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: { sm: "nowrap" } }}>
                {p.price}
                {(p.originalUnits || p.decimalINR) && (
                  <Box component="span" sx={{ display: "block", fontWeight: 400, color: "text.secondary", fontSize: "0.8em" }}>
                    {[p.originalUnits, p.decimalINR].filter(Boolean).join(" · ")}
                  </Box>
                )}
                {p.adjusted2026 && (
                  <Box component="span" className="tm-adj-inline" sx={{ display: "none", fontWeight: 400, color: "text.secondary", fontSize: "0.8em" }}>
                    ≈ {p.adjusted2026} today
                  </Box>
                )}
              </TableCell>
              {showAdjusted && (
                <TableCell align="right" className="tm-adj-col" sx={{ fontVariantNumeric: "tabular-nums", color: "text.secondary", whiteSpace: { sm: "nowrap" } }}>
                  {p.adjusted2026 ?? "—"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Box>
      <Typography variant="caption" component="p" sx={{ mt: 1.5, color: "text.secondary" }}>
        {era.speculative
          ? "Guesses extrapolated from current trends, in today's money. Not forecasts."
          : era.country !== "world"
            ? `Prices for ${era.locale.region}, as stated in each source. ${methods.length > 0 ? `2026 values: ${methods.join("; ")}.` : "2026 values are shown only where an official price index supports them."}`
          : era.year < 1913
            ? "U.S. prices. 2026 values use pre-1913 cost-of-living estimates (Rees index, via the Minneapolis Fed) chained to the BLS CPI-U for August 2026, rounded. Treat as rough."
            : `U.S. prices. 2026 values scale the ${era.year} annual average of the BLS Consumer Price Index (CPI-U) to August 2026, rounded.`}
      </Typography>
    </EraCard>
  );
}
