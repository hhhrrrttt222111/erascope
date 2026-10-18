import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { ERA_YEARS } from "../../data";
import type { EraId } from "../../data/types";
import { SourceNote } from "../common/SourceNote";
import type { FlatItem } from "./allYears";
import { useDeepDiveStyle } from "./useDeepDiveStyle";

interface Question {
  prompt: string;
  options: string[];
  answer: string;
  about: FlatItem;
}

const shuffle = <T,>(a: T[]) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

const YEARISH = new RegExp(`\\b(${ERA_YEARS.join("|")})\\b`);
const QUESTIONS = 8;

/** Only checked (not todo), non-speculative, non-sensitive items whose text does not give the year away. */
function eligible(items: FlatItem[]) {
  return items.filter(
    (f) => !f.speculative && !f.item.todo && !f.item.scheduled && !f.item.forecast && !f.item.context && f.item.sensitivity?.level !== "content-note" && f.item.sources.length > 0 && !YEARISH.test(`${f.item.title} ${f.item.summary}`) && f.item.summary.length < 260,
  );
}

function build(items: FlatItem[]): Question[] {
  const pool = eligible(items);
  const years = [...new Set(pool.map((f) => f.year))] as EraId[];
  const out: Question[] = [];
  for (const f of shuffle(pool)) {
    if (out.length >= QUESTIONS) break;
    if (out.some((q) => q.about.year === f.year)) continue; // spread across years
    if (out.length % 2 === 0) {
      // Which year is this item from?
      const wrong = shuffle(years.filter((y) => y !== f.year)).slice(0, 3).map(String);
      out.push({ prompt: `Which year does this belong to?\n“${f.item.title}”: ${f.item.summary}`, options: shuffle([String(f.year), ...wrong]), answer: String(f.year), about: f });
    } else {
      // Which of these happened in <year>?
      const others = shuffle(pool.filter((x) => x.year !== f.year && x.section === f.section && x.item.id !== f.item.id)).slice(0, 3);
      if (others.length < 3) continue;
      out.push({ prompt: `Which of these is from ${f.year}?`, options: shuffle([f.item.title, ...others.map((o) => o.item.title)]), answer: f.item.title, about: f });
    }
  }
  return out;
}

/** India Deep Dive quiz: only items that carry sources and are not flagged unverified. The source shows after every answer. */
export function DeepQuiz({ items }: { items: FlatItem[] }) {
  const { theme, accent } = useDeepDiveStyle();
  const [round, setRound] = useState(0);
  const questions = useMemo(() => build(items), [items, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const q = questions[i];
  const done = i >= questions.length;

  const restart = () => {
    setRound((r) => r + 1);
    setI(0);
    setPicked(null);
    setScore(0);
  };

  return (
    <Box component="section" aria-labelledby="quiz-h" sx={{ mb: 4 }}>
      <Typography component="h2" id="quiz-h" variant="h5" sx={{ mb: 0.5 }}>
        Deep dive quiz
      </Typography>
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        {questions.length} questions drawn only from items that have a source and are not marked unverified. The source appears after each answer.
      </Typography>
      <Box sx={{ p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderTop: `4px solid ${accent}`, maxWidth: 760 }}>
        {questions.length === 0 && <Typography>Not enough checked items to build a quiz yet.</Typography>}
        {q && !done && (
          <>
            <Typography variant="overline" component="p">
              Question {i + 1} of {questions.length} · score {score}
            </Typography>
            <Typography sx={{ fontWeight: 600, whiteSpace: "pre-line", mb: 1.5 }}>{q.prompt}</Typography>
            <Box component="ul" role="group" aria-label="Answers" sx={{ m: 0, p: 0, display: "grid", gap: 1 }}>
              {q.options.map((o) => {
                const isAnswer = o === q.answer;
                const chosen = picked === o;
                return (
                  <li key={o} style={{ listStyle: "none" }}>
                    <Button
                      fullWidth
                      variant={picked && (isAnswer || chosen) ? "contained" : "outlined"}
                      color={picked && isAnswer ? "success" : picked && chosen ? "error" : "primary"}
                      disabled={picked !== null && !isAnswer && !chosen}
                      aria-pressed={chosen}
                      sx={{ justifyContent: "flex-start", textAlign: "left", textTransform: "none" }}
                      onClick={() => {
                        if (picked) return;
                        setPicked(o);
                        if (isAnswer) setScore((s) => s + 1);
                      }}
                    >
                      {o}
                      {picked && isAnswer ? " (correct)" : picked && chosen ? " (not this one)" : ""}
                    </Button>
                  </li>
                );
              })}
            </Box>
            <div role="status" aria-live="polite">
              {picked && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography>
                    {picked === q.answer ? "Correct. " : `The answer is ${q.answer}. `}
                    {q.about.item.title} ({q.about.year}): {q.about.item.summary}
                  </Typography>
                  {q.about.item.sources.map((s, k) => (
                    <SourceNote key={k} source={s} />
                  ))}
                  <Button sx={{ mt: 1 }} variant="contained" onClick={() => { setI((n) => n + 1); setPicked(null); }}>
                    {i + 1 >= questions.length ? "See score" : "Next question"}
                  </Button>
                </Box>
              )}
            </div>
          </>
        )}
        {done && questions.length > 0 && (
          <>
            <Typography sx={{ fontWeight: 700 }}>
              You scored {score} out of {questions.length}.
            </Typography>
            <Button sx={{ mt: 1 }} variant="contained" onClick={restart}>
              Play again with new questions
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
