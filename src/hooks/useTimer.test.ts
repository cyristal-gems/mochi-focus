// @vitest-environment jsdom
import { act, renderHook, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { useTimer } from "./useTimer";
beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 24, 12));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe("focus timer", () => {
  it("pauses without crediting paused time and resumes accurately", () => {
    const record = vi.fn();
    const { result } = renderHook(() => useTimer(record));
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(10500));
    expect(result.current.seconds).toBe(1490);
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(30000));
    expect(result.current.seconds).toBe(1490);
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.seconds).toBe(1488);
    expect(record.mock.calls.reduce((n, [s]) => n + s, 0)).toBe(12);
  });
  it("completes once and does not credit breaks", () => {
    const record = vi.fn();
    const { result } = renderHook(() => useTimer(record));
    act(() => result.current.select("custom"));
    act(() => result.current.setCustom(1));
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(60000));
    expect(result.current.celebrate).toBe(true);
    expect(record.mock.calls.filter(([, done]) => done)).toHaveLength(1);
    expect(record.mock.calls.reduce((n, [s]) => n + s, 0)).toBe(60);
    act(() => result.current.toggle());
    expect(result.current.phase).toBe("break");
    act(() => vi.advanceTimersByTime(10000));
    expect(record.mock.calls.reduce((n, [s]) => n + s, 0)).toBe(60);
  });
  it("keeps earned time on reset without marking a completed session", () => {
    const record = vi.fn();
    const { result } = renderHook(() => useTimer(record));
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(5000));
    act(() => result.current.reset());
    expect(result.current.seconds).toBe(1500);
    expect(result.current.running).toBe(false);
    expect(record.mock.calls.reduce((n, [s]) => n + s, 0)).toBe(5);
    expect(record.mock.calls.some(([, done]) => done)).toBe(false);
  });
  it("counts up and explicitly finishes a stopwatch session", () => {
    const record = vi.fn();
    const { result } = renderHook(() => useTimer(record));
    act(() => result.current.select("stopwatch"));
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(65000));
    expect(result.current.seconds).toBe(65);
    act(() => result.current.finish());
    expect(record.mock.calls.filter(([, done]) => done)).toHaveLength(1);
    expect(result.current.seconds).toBe(0);
  });
  it("catches up after a background wall-clock jump", () => {
    const record = vi.fn();
    const { result } = renderHook(() => useTimer(record));
    act(() => result.current.toggle());
    act(() => {
      vi.setSystemTime(new Date(2026, 8, 24, 12, 10));
      vi.advanceTimersByTime(250);
    });
    expect(result.current.seconds).toBe(900);
    expect(record.mock.calls.reduce((n, [s]) => n + s, 0)).toBe(600);
  });
});

it("notifies once per completed focus, break, and stopwatch session", () => {
  const completed = vi.fn();
  const { result } = renderHook(() => useTimer(vi.fn(), completed));
  act(() => result.current.select("custom"));
  act(() => result.current.setCustom(1));
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(65000));
  expect(completed).toHaveBeenCalledTimes(1);
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(305000));
  expect(completed).toHaveBeenCalledTimes(2);
  act(() => result.current.select("stopwatch"));
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(2000));
  act(() => result.current.finish());
  expect(completed).toHaveBeenCalledTimes(3);
  act(() => result.current.reset());
  act(() => result.current.finish());
  expect(completed).toHaveBeenCalledTimes(3);
});
