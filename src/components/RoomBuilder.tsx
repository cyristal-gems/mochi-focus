import { useState } from "react";
import { RotateCcw, Eye, Check, Lock } from "lucide-react";
import { useStored } from "../utils/storage";

export const puzzles = [
  {
    name: "Strawberry study",
    title: "Hillside Teahouse",
    artwork: "puzzle-teahouse.png",
    hours: 0.25,
  },
  {
    name: "Matcha morning",
    title: "Rainy Artist Attic",
    artwork: "puzzle-rain.png",
    hours: 0.5,
  },
  {
    name: "Moonlight nook",
    title: "Moonlit Observatory",
    artwork: "puzzle-moon.png",
    hours: 1,
  },
  {
    name: "Peach afternoon",
    title: "Lakeside Cottage",
    artwork: "puzzle-garden.png",
    hours: 2,
  },
  {
    name: "Lavender library",
    title: "Enchanted Bookshop",
    artwork: "puzzle-books.png",
    hours: 3,
  },
  {
    name: "Golden hour",
    title: "Seaside Sunset",
    artwork: "puzzle-coast.png",
    hours: 5,
  },
  {
    name: "Blossom café",
    title: "Snowy Cabin",
    artwork: "puzzle-snow.png",
    hours: 7,
  },
  {
    name: "Greenhouse morning",
    title: "Greenhouse Morning",
    artwork: "puzzle-greenhouse.png",
    hours: 10,
  },
];
type Progress = { tiles: number[]; moves: number };
const solved = (tiles: number[]) =>
  tiles.every((tile, index) => tile === index);
export function shuffleTiles(): number[] {
  const tiles = Array.from({ length: 9 }, (_, i) => i);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  if (solved(tiles)) [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  return tiles;
}
export default function RoomBuilder({ total }: { total: number }) {
  const [progress, setProgress] = useStored<Record<string, Progress>>(
    "mochi-room-puzzles-v2",
    {},
  );
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const puzzle = puzzles[active];
  const available = total >= puzzle.hours * 3600;
  const state = available ? progress[puzzle.name] : undefined;
  const complete = !!state && solved(state.tiles);
  const completed = puzzles.filter(
    (p) => progress[p.name] && solved(progress[p.name].tiles),
  ).length;
  function start(index: number) {
    if (total < puzzles[index].hours * 3600) return;
    setActive(index);
    setSelected(null);
    setPreview(false);
    if (!progress[puzzles[index].name])
      setProgress({
        ...progress,
        [puzzles[index].name]: { tiles: shuffleTiles(), moves: 0 },
      });
  }
  function swap(index: number) {
    if (!available || !state || complete) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    const tiles = [...state.tiles];
    [tiles[selected], tiles[index]] = [tiles[index], tiles[selected]];
    setProgress({
      ...progress,
      [puzzle.name]: { tiles, moves: state.moves + 1 },
    });
    setSelected(null);
  }
  function picture() {
    return (
      <div className="puzzle-picture">
        <img
          src={`${import.meta.env.BASE_URL}backgrounds/${puzzle.artwork}`}
          alt=""
          draggable={false}
        />
      </div>
    );
  }
  return (
    <div className="room-puzzles">
      <p className="modal-description">
        A little break, piece by piece. Choose one of eight cozy scene puzzles,
        then select two tiles to swap them. Unlock pictures with your total
        study time. Your progress saves automatically.
      </p>
      <p className="puzzle-completion" aria-live="polite">
        {completed} of {puzzles.length} puzzles completed
      </p>
      <div className="puzzle-collection" aria-label="Choose a puzzle">
        {puzzles.map((p, i) => {
          const unlocked = total >= p.hours * 3600;
          return (
            <button
              key={p.name}
              disabled={!unlocked}
              aria-pressed={active === i}
              onClick={() => start(i)}
            >
              <img
                className="puzzle-thumbnail"
                src={`${import.meta.env.BASE_URL}backgrounds/${p.artwork}`}
                alt=""
              />
              <strong>{p.title}</strong>
              <small>
                {!unlocked ? (
                  <>
                    <Lock size={12} /> Unlocks at{" "}
                    {p.hours < 1 ? `${p.hours * 60} min` : `${p.hours}h`} ·{" "}
                    {Math.ceil((p.hours * 3600 - total) / 60)} min to go
                  </>
                ) : progress[p.name] ? (
                  solved(progress[p.name].tiles) ? (
                    "Completed ✓"
                  ) : (
                    "Continue puzzle"
                  )
                ) : (
                  "Start puzzle"
                )}
              </small>
            </button>
          );
        })}
      </div>
      <div className="puzzle-heading">
        <h3>{puzzle.title}</h3>
        <span>{state?.moves || 0} swaps · 9 pieces</span>
      </div>
      {!available ? (
        <p className="puzzle-status" role="status">
          <Lock size={18} /> Your first puzzle unlocks after 15 minutes of
          study. Keep focusing to collect all eight pictures.
        </p>
      ) : !state ? (
        <div className="puzzle-welcome">
          {picture()}
          <button className="puzzle-start" onClick={() => start(active)}>
            Start this puzzle
          </button>
        </div>
      ) : (
        <>
          <div className="puzzle-actions">
            <button aria-pressed={preview} onClick={() => setPreview(!preview)}>
              <Eye size={16} /> {preview ? "Back to puzzle" : "Preview picture"}
            </button>
            <button
              onClick={() => {
                setProgress({
                  ...progress,
                  [puzzle.name]: { tiles: shuffleTiles(), moves: 0 },
                });
                setSelected(null);
                setPreview(false);
              }}
            >
              <RotateCcw size={16} /> Restart puzzle
            </button>
          </div>
          {preview ? (
            <div className="puzzle-preview">{picture()}</div>
          ) : (
            <div
              className={`puzzle-board ${complete ? "puzzle-solved" : "puzzle-scattered"}`}
              aria-label={`${puzzle.title} puzzle`}
            >
              {state.tiles.map((tile, index) => (
                <button
                  key={index}
                  className={`puzzle-tile ${selected === index ? "tile-selected" : ""}`}
                  style={{
                    transform: complete
                      ? undefined
                      : `translate(${((tile * 7) % 9) - 4}%, ${((tile * 5) % 7) - 3}%) rotate(${((tile * 11) % 13) - 6}deg) scale(.86)`,
                  }}
                  aria-label={`Tile ${tile + 1}, position ${index + 1}`}
                  aria-pressed={selected === index}
                  disabled={complete}
                  onClick={() => swap(index)}
                >
                  <div
                    className="puzzle-tile-art"
                    style={{
                      left: `${-(tile % 3) * 100}%`,
                      top: `${-Math.floor(tile / 3) * 100}%`,
                    }}
                  >
                    {picture()}
                  </div>
                </button>
              ))}
            </div>
          )}
          <p className="puzzle-status" role="status">
            {complete ? (
              <>
                <Check size={18} /> Lovely work! You completed this room in{" "}
                {state.moves} swaps.
              </>
            ) : selected === null ? (
              "Select a tile, then another to swap their places."
            ) : (
              "Now select a second tile. Select the same tile to cancel."
            )}
          </p>
        </>
      )}
    </div>
  );
}
