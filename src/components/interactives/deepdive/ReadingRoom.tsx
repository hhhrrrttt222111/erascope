import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { Empty, InteractiveShell } from "./Shell";
import { asArray, dataOf, type InteractiveProps } from "./types";

interface Stock { id: string; label: string; price: number; circulation?: string; fact?: string }

/** Spend a sourced budget at a newsstand or library table; learn price, circulation and literacy facts. */
export default function ReadingRoom(props: InteractiveProps) {
  const data = dataOf(props);
  const budget = data.budget as { amount: number; unit: string } | undefined;
  const stock = asArray<Stock>(data.stock);
  const [basket, setBasket] = useState<string[]>([]);
  const spent = basket.reduce((n, id) => n + (stock.find((s) => s.id === id)?.price ?? 0), 0);
  const left = (budget?.amount ?? 0) - spent;

  return (
    <InteractiveShell title="Reading room" hint="Choose what to read within this year's budget.">
      {!budget || stock.length === 0 ? (
        <Empty>
          Prices and circulation for this year's reading are still being researched. Books and periodicals listed below are what
          people could find.
        </Empty>
      ) : (
        <>
          <Typography aria-live="polite" sx={{ fontWeight: 700, mb: 1 }}>
            Budget left: {left} {budget.unit} of {budget.amount}
          </Typography>
          <Box
            component="ul"
            aria-label="Things to read"
            onKeyDown={(e) => {
              const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!d) return;
              const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
              const at = btns.indexOf(document.activeElement as HTMLButtonElement);
              const next = btns[at + d];
              if (next) { e.preventDefault(); next.focus(); next.closest("li")?.scrollIntoView({ inline: "center", block: "nearest" }); }
            }}
            sx={{ m: 0, p: 0, display: "flex", gap: 1, overflowX: "auto", scrollSnapType: "x mandatory", pb: 1 }}
          >
            {stock.map((s) => {
              const has = basket.includes(s.id);
              return (
                <li key={s.id} style={{ listStyle: "none", flex: "0 0 min(280px, 85%)", scrollSnapAlign: "start" }}>
                  <Box sx={{ p: 1.5, border: "1px solid currentColor", height: "100%" }}>
                    <Typography sx={{ fontWeight: 700 }}>{s.label}</Typography>
                    <Typography variant="body2">
                      {s.price} {budget.unit}
                      {s.circulation ? ` · circulation ${s.circulation}` : ""}
                    </Typography>
                    <Button
                      size="small"
                      disabled={!has && s.price > left}
                      onClick={() => setBasket((b) => (has ? b.filter((x) => x !== s.id) : [...b, s.id]))}
                      aria-pressed={has}
                    >
                      {has ? "Put back" : "Take"}
                    </Button>
                    {has && s.fact && <Typography variant="body2">{s.fact}</Typography>}
                  </Box>
                </li>
              );
            })}
          </Box>
        </>
      )}
      <Typography component="h3" variant="h6" sx={{ mt: 2 }}>
        On the shelves
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 3 }}>
        {props.section.items.map((it) => (
          <li key={it.id}>{it.title}</li>
        ))}
      </Box>
    </InteractiveShell>
  );
}
