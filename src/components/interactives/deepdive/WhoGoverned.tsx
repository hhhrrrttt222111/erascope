import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { Empty, InteractiveShell } from "./Shell";
import { asArray, dataOf, itemsOfKind, type InteractiveProps } from "./types";

interface TreeNode { id: string; label: string; holder?: string; role?: string; children?: TreeNode[] }
interface LawStep { label: string; detail: string }

function Node({ node, depth, selected, onSelect }: { node: TreeNode; depth: number; selected: string; onSelect: (n: TreeNode) => void }) {
  const [open, setOpen] = useState(depth < 1);
  const kids = node.children ?? [];
  return (
    <li style={{ listStyle: "none" }}>
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
        {kids.length > 0 && (
          <Button size="small" aria-expanded={open} aria-label={`${open ? "Collapse" : "Expand"} ${node.label}`} onClick={() => setOpen((o) => !o)} sx={{ minWidth: 32 }}>
            {open ? "−" : "+"}
          </Button>
        )}
        <Button size="small" variant={selected === node.id ? "contained" : "text"} onClick={() => onSelect(node)} sx={{ textAlign: "left", justifyContent: "flex-start" }}>
          {node.label}
        </Button>
      </Box>
      {open && kids.length > 0 && (
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {kids.map((k) => (
            <Node key={k.id} node={k} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </Box>
      )}
    </li>
  );
}

/** An expandable tree of who held power that year, and a stepper for how one law was made. */
export default function WhoGoverned(props: InteractiveProps) {
  const data = dataOf(props);
  const items = itemsOfKind(props, "governance");
  const tree: TreeNode = (data.tree as TreeNode | undefined) ?? {
    id: "root",
    label: `India, ${props.year}`,
    children: items.map((i) => ({ id: i.id, label: i.title, holder: i.holder, role: i.office ?? i.summary })),
  };
  const steps = asArray<LawStep>((data.law as { steps?: unknown } | undefined)?.steps);
  const lawTitle = (data.law as { title?: string } | undefined)?.title;
  const [sel, setSel] = useState<TreeNode>(tree);
  const [step, setStep] = useState(0);

  return (
    <InteractiveShell title="Who governed" hint="Open the tree to see who held which office. Select a node for details.">
      {!tree.children?.length ? (
        <Empty>No office-holders listed for this year yet.</Empty>
      ) : (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Box component="ul" role="tree" aria-label="Offices" sx={{ m: 0, p: 0 }}>
            <Node node={tree} depth={0} selected={sel.id} onSelect={setSel} />
          </Box>
          <Box aria-live="polite" sx={{ p: 1.5, border: "1px solid currentColor", borderRadius: 1 }}>
            <Typography variant="h6">{sel.label}</Typography>
            {sel.holder && <Typography>Holder: {sel.holder}</Typography>}
            {sel.role && <Typography variant="body2">{sel.role}</Typography>}
            {!sel.holder && !sel.role && <Typography variant="body2">Details to be researched.</Typography>}
          </Box>
        </Box>
      )}

      <Typography component="h3" variant="h6" sx={{ mt: 3 }}>
        How a law was made{lawTitle ? `: ${lawTitle}` : ""}
      </Typography>
      {steps.length === 0 ? (
        <Empty>The law walk-through for this year is still being researched.</Empty>
      ) : (
        <Box>
          <Typography aria-live="polite" sx={{ my: 1 }}>
            <strong>
              Step {step + 1} of {steps.length}: {steps[step].label}.
            </strong>{" "}
            {steps[step].detail}
          </Typography>
          <Button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Previous
          </Button>
          <Button disabled={step === steps.length - 1} onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
        </Box>
      )}
    </InteractiveShell>
  );
}
