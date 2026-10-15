import { Box, Link, Typography } from "@mui/material";
import type { Source } from "../../data/types";

interface Props {
  source?: Source;
  todo?: boolean;
}

const QUALITY: Record<NonNullable<Source["quality"]>, string> = {
  primary: "primary source",
  reference: "reference work",
  secondary: "secondary source",
};

/**
 * Citation line under a fact. Items marked `todo` carry a visible "Unverified" marker so
 * visitors can tell checked facts from placeholders still awaiting research.
 */
export function SourceNote({ source, todo }: Props) {
  if (!source && !todo) return null;
  const details = source && [source.quality && QUALITY[source.quality], source.accessed && `accessed ${source.accessed}`].filter(Boolean).join(", ");
  return (
    <Typography component="p" variant="caption" sx={{ mt: 0.75, color: "text.secondary", lineHeight: 1.45 }}>
      {todo && (
        <Box
          component="span"
          title="Not yet checked against a source. Treat as approximate."
          sx={{ display: "inline-block", mr: 0.75, px: 0.6, border: "1px dashed currentColor", borderRadius: "4px", fontStyle: "normal", fontWeight: 700, fontSize: "0.92em", letterSpacing: "0.04em" }}
        >
          Unverified
        </Box>
      )}
      {source && (
        <>
          Source:{" "}
          {source.url ? (
            <Link href={source.url} target="_blank" rel="noopener noreferrer" color="inherit" underline="always" title={details || undefined}>
              {source.label}
            </Link>
          ) : (
            <span title={details || undefined}>{source.label}</span>
          )}
        </>
      )}
    </Typography>
  );
}
