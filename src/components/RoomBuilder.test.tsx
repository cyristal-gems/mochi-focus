// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, expect, it } from "vitest";
import RoomBuilder from "./RoomBuilder";
const items = [
  { name: "Plant", hours: 1, icon: "🌱" },
  { name: "Lamp", hours: 5, icon: "🪔" },
];
function Room() {
  const [placed, setPlaced] = useState<string[]>([]);
  return (
    <RoomBuilder
      items={items}
      total={3600}
      placed={placed}
      setPlaced={setPlaced}
    />
  );
}
beforeEach(() => localStorage.clear());
afterEach(cleanup);
it("enforces unlocks, places items, saves bounded movement and removes them", () => {
  render(<Room />);
  expect(
    (screen.getByRole("button", { name: /Lamp/ }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: /Plant Add to room/ }));
  const plant = screen.getByRole("button", { name: "Move Plant" });
  fireEvent.keyDown(plant, { key: "ArrowRight" });
  expect(
    JSON.parse(localStorage.getItem("mochi-room-positions")!).Plant.x,
  ).toBe(20);
  for (let i = 0; i < 60; i++) fireEvent.keyDown(plant, { key: "ArrowLeft" });
  expect(
    JSON.parse(localStorage.getItem("mochi-room-positions")!).Plant.x,
  ).toBe(8);
  fireEvent.click(
    screen.getByRole("button", { name: "Remove selected object" }),
  );
  expect(screen.queryByRole("button", { name: "Move Plant" })).toBeNull();
});
it("restores saved room colors", () => {
  const view = render(<Room />);
  fireEvent.click(screen.getByRole("button", { name: "Moonlight" }));
  view.unmount();
  render(<Room />);
  expect(
    screen
      .getByRole("button", { name: "Moonlight" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});
