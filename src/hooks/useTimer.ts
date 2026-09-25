import { useEffect, useRef, useState } from "react";
import { useStored } from "../utils/storage";
export const modes = [
  { id: "pomodoro", name: "Pomodoro", minutes: 25, break: 5 },
  { id: "deep", name: "Deep focus", minutes: 45, break: 10 },
  { id: "long", name: "Long study", minutes: 60, break: 10 },
  { id: "stopwatch", name: "Stopwatch", minutes: 0, break: 0 },
  { id: "custom", name: "Custom", minutes: 30, break: 5 },
];
export function useTimer(
  record: (seconds: number, completed: boolean) => void,
) {
  const [mode, setMode] = useStored("mochi-timer-mode", "pomodoro"),
    [custom, setCustom] = useStored("mochi-custom-minutes", 30),
    [phase, setPhase] = useState<"focus" | "break">("focus"),
    [running, setRunning] = useState(false),
    [elapsed, setElapsed] = useState(0),
    [celebrate, setCelebrate] = useState(false);
  const last = useRef(0),
    fraction = useRef(0),
    elapsedRef = useRef(0),
    completedRef = useRef(false),
    recordRef = useRef(record);
  recordRef.current = record;
  const preset = modes.find((m) => m.id === mode) || modes[0];
  const limit =
    (phase === "break"
      ? preset.break
      : mode === "custom"
        ? custom
        : preset.minutes) * 60;
  function tick() {
    if (completedRef.current) return;
    const now = Date.now();
    fraction.current += (now - last.current) / 1000;
    last.current = now;
    const delta = Math.floor(fraction.current);
    fraction.current -= delta;
    if (delta <= 0) return;
    const actual = limit ? Math.min(delta, limit - elapsedRef.current) : delta;
    elapsedRef.current += actual;
    const done = limit > 0 && elapsedRef.current >= limit;
    if (phase === "focus") recordRef.current(actual, done);
    setElapsed(elapsedRef.current);
    if (done) {
      completedRef.current = true;
      setRunning(false);
      setCelebrate(true);
    }
  }
  useEffect(() => {
    if (!running) return;
    last.current = Date.now();
    const id = setInterval(tick, 250);
    const flush = () => tick();
    window.addEventListener("pagehide", flush);
    return () => {
      clearInterval(id);
      window.removeEventListener("pagehide", flush);
    };
  }, [running, limit, phase]);
  function reset() {
    if (running) tick();
    setRunning(false);
    setElapsed(0);
    elapsedRef.current = 0;
    fraction.current = 0;
    completedRef.current = false;
    setCelebrate(false);
  }
  function select(id: string) {
    reset();
    setPhase("focus");
    setMode(id);
  }
  function toggle() {
    if (celebrate) {
      reset();
      setPhase(phase === "focus" && preset.break ? "break" : "focus");
      setRunning(true);
    } else {
      if (running) tick();
      setRunning(!running);
    }
  }
  function finish() {
    if (running) tick();
    if (mode === "stopwatch" && elapsedRef.current > 0)
      recordRef.current(0, true);
    reset();
  }
  return {
    mode,
    select,
    custom,
    setCustom: (n: number) => {
      reset();
      setCustom(n);
    },
    phase,
    running,
    elapsed,
    seconds: limit ? Math.max(0, limit - elapsed) : elapsed,
    progress: limit ? elapsed / limit : 0,
    celebrate,
    toggle,
    reset,
    finish,
  };
}
