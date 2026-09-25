import { useState } from "react";
import { read, write } from "../utils/storage";
import { dateKey, summarize, type History } from "../utils/stats";
export function useStudyStats() {
  const [history, setHistory] = useState<History>(() => {
    const h = read<History>("mochi-study-history", {});
    return h && typeof h === "object"
      ? Object.fromEntries(
          Object.entries(h).filter(
            ([, v]) =>
              v &&
              Number.isFinite(v.seconds) &&
              v.seconds >= 0 &&
              Number.isFinite(v.sessions),
          ),
        )
      : {};
  });
  function record(seconds: number, completed: boolean) {
    setHistory((old) => {
      const key = dateKey(),
        day = old[key] || { seconds: 0, sessions: 0 };
      const next = {
        ...old,
        [key]: {
          seconds: day.seconds + seconds,
          sessions: day.sessions + (completed ? 1 : 0),
        },
      };
      write("mochi-study-history", next);
      return next;
    });
  }
  return { ...summarize(history), history, record };
}
