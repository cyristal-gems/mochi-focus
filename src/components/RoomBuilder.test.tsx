// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import RoomBuilder, { puzzles, shuffleTiles } from "./RoomBuilder";
beforeEach(() => localStorage.clear());
afterEach(cleanup);
it("offers exactly six puzzles and starts a shuffled board", () => {
  render(<RoomBuilder />);
  expect(puzzles).toHaveLength(6);
  for (const puzzle of puzzles) expect(screen.getByRole("button", { name: new RegExp(puzzle.name) })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Start this puzzle" }));
  expect(screen.getAllByRole("button", { name: /^Tile/ })).toHaveLength(9);
  const tiles = shuffleTiles();
  expect([...tiles].sort()).toEqual([0,1,2,3,4,5,6,7,8]);
  expect(tiles.some((tile, i) => tile !== i)).toBe(true);
});
it("swaps tiles, saves completion, restores it and restarts", () => {
  localStorage.setItem("mochi-room-puzzles-v1", JSON.stringify({ [puzzles[0].name]: { tiles: [1,0,2,3,4,5,6,7,8], moves: 0 } }));
  const view = render(<RoomBuilder />);
  fireEvent.click(screen.getByRole("button", { name: "Tile 2, position 1" }));
  fireEvent.click(screen.getByRole("button", { name: "Tile 1, position 2" }));
  expect(screen.getByText("1 of 6 puzzles completed")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toContain("1 swaps");
  view.unmount(); render(<RoomBuilder />);
  expect(screen.getByText("1 of 6 puzzles completed")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Restart puzzle" }));
  expect(screen.getByText("0 of 6 puzzles completed")).toBeTruthy();
});
it("previews the picture and keeps puzzle progress separate", () => {
  render(<RoomBuilder />);
  fireEvent.click(screen.getByRole("button", { name: /Matcha morning/ }));
  fireEvent.click(screen.getByRole("button", { name: "Preview picture" }));
  expect(screen.queryByRole("button", { name: /^Tile/ })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Back to puzzle" }));
  expect(screen.getAllByRole("button", { name: /^Tile/ })).toHaveLength(9);
  fireEvent.click(screen.getByRole("button", { name: /Moonlight nook/ }));
  const saved = JSON.parse(localStorage.getItem("mochi-room-puzzles-v1")!);
  expect(Object.keys(saved)).toHaveLength(2);
});
