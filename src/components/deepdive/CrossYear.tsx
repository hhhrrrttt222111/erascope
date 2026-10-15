import { Typography } from "@mui/material";
import { useEraContext } from "../../context/EraContext";
import { DeepQuiz } from "./DeepQuiz";
import { useAllDeepDives } from "./allYears";
import { OnThisDay } from "./OnThisDay";
import { ThreadTrack } from "./ThreadTrack";

/** The three features that look across all 13 years. Loaded as one lazy chunk from the hub. */
export default function CrossYear() {
  const { country } = useEraContext();
  const { items, failed } = useAllDeepDives(country);
  if (failed) return <Typography>The cross-year features could not be loaded.</Typography>;
  if (!items) return <Typography aria-busy>Loading the cross-year features…</Typography>;
  return (
    <>
      <OnThisDay items={items} />
      <ThreadTrack items={items} />
      <DeepQuiz items={items} />
    </>
  );
}
