import { useState } from "react";
export function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
export function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Private browsing and full storage must not break the timer. */
  }
}
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial));
  const update = (v: T) => {
    setValue(v);
    write(key, v);
  };
  return [value, update] as const;
}
