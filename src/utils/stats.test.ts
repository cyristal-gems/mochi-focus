import { describe, it, expect } from "vitest";
import { dateKey, summarize, duration } from "./stats";
describe("study history", () => {
  it("totals focus and counts completed sessions independently", () => {
    expect(
      summarize(
        {
          "2026-09-24": { seconds: 120, sessions: 0 },
          "2026-09-23": { seconds: 1500, sessions: 1 },
        },
        new Date(2026, 8, 24),
      ),
    ).toEqual({ total: 1620, today: 120, sessions: 1, streak: 2, longest: 2 });
  });
  it("keeps yesterday’s streak until today is over", () => {
    expect(
      summarize(
        { "2026-09-23": { seconds: 60, sessions: 1 } },
        new Date(2026, 8, 24),
      ).streak,
    ).toBe(1);
  });
  it("resets current streak after a missing day but retains longest", () => {
    expect(
      summarize(
        {
          "2026-09-21": { seconds: 60, sessions: 1 },
          "2026-09-22": { seconds: 60, sessions: 1 },
        },
        new Date(2026, 8, 24),
      ),
    ).toMatchObject({ streak: 0, longest: 2 });
  });
  it("uses local calendar days and readable duration", () => {
    expect(dateKey(new Date(2026, 0, 2))).toBe("2026-01-02");
    expect(duration(3660)).toBe("1h 1m");
  });
});
