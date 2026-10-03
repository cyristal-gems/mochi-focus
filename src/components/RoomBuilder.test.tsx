// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import RoomBuilder, { puzzles, shuffleTiles } from "./RoomBuilder";
beforeEach(() => localStorage.clear());
afterEach(cleanup);
it("offers exactly eight puzzles and starts a shuffled board", () => {
  render(<RoomBuilder total={36000} />);
  expect(puzzles).toHaveLength(8);
  for (const puzzle of puzzles)
    expect(
      screen.getByRole("button", { name: new RegExp(puzzle.title) }),
    ).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Start this puzzle" }));
  expect(screen.getAllByRole("button", { name: /^Tile/ })).toHaveLength(9);
  const tiles = shuffleTiles();
  expect([...tiles].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  expect(tiles.some((tile, i) => tile !== i)).toBe(true);
});
it("swaps tiles, saves completion, restores it and restarts", () => {
  localStorage.setItem(
    "mochi-room-puzzles-v2",
    JSON.stringify({
      [puzzles[0].name]: { tiles: [1, 0, 2, 3, 4, 5, 6, 7, 8], moves: 0 },
    }),
  );
  const view = render(<RoomBuilder total={36000} />);
  fireEvent.click(screen.getByRole("button", { name: "Tile 2, position 1" }));
  fireEvent.click(screen.getByRole("button", { name: "Tile 1, position 2" }));
  expect(screen.getByText("1 of 8 puzzles completed")).toBeTruthy();
  expect(screen.getByLabelText("Hillside Teahouse puzzle").className).toContain(
    "puzzle-solved",
  );
  expect(screen.getByRole("status").textContent).toContain("1 swaps");
  view.unmount();
  render(<RoomBuilder total={36000} />);
  expect(screen.getByText("1 of 8 puzzles completed")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Restart puzzle" }));
  expect(screen.getByText("0 of 8 puzzles completed")).toBeTruthy();
  expect(screen.getByLabelText("Hillside Teahouse puzzle").className).toContain(
    "puzzle-scattered",
  );
  expect(
    (screen.getAllByRole("button", { name: /^Tile/ })[0] as HTMLButtonElement)
      .style.transform,
  ).toContain("rotate");
});
it("previews the picture and keeps puzzle progress separate", () => {
  render(<RoomBuilder total={36000} />);
  fireEvent.click(screen.getByRole("button", { name: /Rainy Artist Attic/ }));
  fireEvent.click(screen.getByRole("button", { name: "Preview picture" }));
  expect(screen.queryByRole("button", { name: /^Tile/ })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Back to puzzle" }));
  expect(screen.getAllByRole("button", { name: /^Tile/ })).toHaveLength(9);
  fireEvent.click(screen.getByRole("button", { name: /Moonlit Observatory/ }));
  const saved = JSON.parse(localStorage.getItem("mochi-room-puzzles-v2")!);
  expect(Object.keys(saved)).toHaveLength(2);
});

it("enforces study-hour unlocks at the exact threshold and hides printed numbers", () => {
  const view = render(<RoomBuilder total={899} />);
  expect(
    (
      screen.getByRole("button", {
        name: /Hillside Teahouse/,
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  expect(
    screen.queryByRole("button", { name: "Start this puzzle" }),
  ).toBeNull();
  view.rerender(<RoomBuilder total={900} />);
  expect(
    (
      screen.getByRole("button", {
        name: /Hillside Teahouse/,
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(false);
  expect(
    (
      screen.getByRole("button", {
        name: /Rainy Artist Attic/,
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Start this puzzle" }));
  for (const tile of screen.getAllByRole("button", { name: /^Tile/ }))
    expect(tile.textContent).toBe("");
  view.rerender(<RoomBuilder total={1800} />);
  expect(
    (
      screen.getByRole("button", {
        name: /Rainy Artist Attic/,
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(false);
});
it("unlocks each of the eight pictures only at its study milestone", () => {
  const view = render(<RoomBuilder total={0} />);
  for (const puzzle of puzzles) {
    view.rerender(<RoomBuilder total={puzzle.hours * 3600 - 1} />);
    expect(
      (
        screen.getByRole("button", {
          name: new RegExp(puzzle.title),
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    view.rerender(<RoomBuilder total={puzzle.hours * 3600} />);
    expect(
      (
        screen.getByRole("button", {
          name: new RegExp(puzzle.title),
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
  }
});
