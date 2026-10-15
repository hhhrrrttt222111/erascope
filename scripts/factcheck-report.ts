/**
 * npm run factcheck:report
 *
 * Generates docs/FACT-CHECK.md from docs/fact-check.json: a summary table, then one
 * section per era with corrections first. Never edit the Markdown by hand.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { FactCheckRow, FactCheckStatus, Source } from "../src/data/types.ts";

const root = join(import.meta.dirname, "..");
const rows = JSON.parse(readFileSync(join(root, "docs", "fact-check.json"), "utf8")) as FactCheckRow[];
const STATUSES: FactCheckStatus[] = ["verified", "corrected", "unverifiable", "removed"];
const ORDER: Record<FactCheckStatus, number> = { corrected: 0, removed: 1, unverifiable: 2, verified: 3 };

const show = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v));
const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const src = (s: Source) => (s.url ? `[${esc(s.label)}](${s.url})` : esc(s.label)) + ` (${s.quality ?? "unrated"}, ${s.accessed ?? "undated"})`;

const groupOf = (r: FactCheckRow) => String(r.country ?? "site");
const groups = [...new Set(rows.map(groupOf))].sort((a, b) => (a === "site" ? 1 : b === "site" ? -1 : a.localeCompare(b)));
const NAMES: Record<string, string> = { world: "World (original, US-centred)", in: "India", site: "Site-wide (components, credits)" };

const out: string[] = [];
out.push("# Fact-check report", "");
out.push("Generated from `docs/fact-check.json` by `npm run factcheck:report`. Every claim has one status:", "");
out.push("- **verified**: a source was opened and the claim matches", "- **corrected**: the claim was wrong or imprecise and was fixed (old and new value shown)", "- **unverifiable**: no reliable source found; the item carries `todo: true` and shows an \"Unverified\" marker (2050 is speculative by design)", "- **removed**: false, anachronistic or untraceable; deleted from the site", "");

for (const g of groups) {
  const grows = rows.filter((r) => groupOf(r) === g);
  const eras = [...new Set(grows.map((r) => String(r.era)))].sort();
  out.push(`## ${NAMES[g] ?? g}`, "", "| Era | Claims | Verified | Corrected | Unverifiable | Removed |", "|---|---:|---:|---:|---:|---:|");
  const total: Record<string, number> = { all: 0 };
  for (const era of eras) {
    const rs = grows.filter((r) => String(r.era) === era);
    const c = Object.fromEntries(STATUSES.map((s) => [s, rs.filter((r) => r.status === s).length]));
    out.push(`| ${era} | ${rs.length} | ${c.verified} | ${c.corrected} | ${c.unverifiable} | ${c.removed} |`);
    total.all += rs.length;
    for (const s of STATUSES) total[s] = (total[s] ?? 0) + c[s];
  }
  out.push(`| **Total** | **${total.all}** | **${total.verified}** | **${total.corrected}** | **${total.unverifiable}** | **${total.removed}** |`, "");
  for (const era of eras) {
    const rs = grows.filter((r) => String(r.era) === era).sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.id.localeCompare(b.id) || a.field.localeCompare(b.field));
    out.push(`### ${g === "site" ? "Site" : `${g} · ${era}`}`, "");
    for (const r of rs) {
      out.push(`#### \`${r.id}\` · ${r.field} · ${r.status}`, "", `> ${esc(r.claim)}`, "");
      if (r.oldValue !== undefined) out.push(`- **Old:** ${esc(show(r.oldValue))}`);
      if (r.newValue !== undefined) out.push(`- **New:** ${esc(show(r.newValue))}`);
      out.push(`- **Note:** ${esc(r.note)}`);
      for (const s of r.sources) out.push(`- **Source:** ${src(s)}`);
      out.push("");
    }
  }
}
writeFileSync(join(root, "docs", "FACT-CHECK.md"), out.join("\n"));
console.log(`wrote docs/FACT-CHECK.md (${rows.length} rows)`);
