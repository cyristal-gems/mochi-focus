import { useState } from "react";
import { RotateCcw, Eye, Check } from "lucide-react";
import { useStored } from "../utils/storage";
import PuzzleScene from "./PuzzleScene";

export const puzzles = [
  { name: "Strawberry study", palette: "rose", filter: "none", detail: "🍓" },
  { name: "Matcha morning", palette: "sage", filter: "hue-rotate(35deg)", detail: "🌱" },
  { name: "Moonlight nook", palette: "night", filter: "brightness(.72) saturate(.8)", detail: "🌙" },
  { name: "Peach afternoon", palette: "rose", filter: "sepia(.3) hue-rotate(340deg)", detail: "🍑" },
  { name: "Lavender library", palette: "rose", filter: "hue-rotate(290deg)", detail: "🪻" },
  { name: "Golden hour", palette: "sage", filter: "sepia(.55) saturate(1.3)", detail: "☀️" },
];
type Progress = { tiles: number[]; moves: number };
const solved = (tiles: number[]) => tiles.every((tile, index) => tile === index);
export function shuffleTiles(): number[] {
  const tiles = Array.from({ length: 9 }, (_, i) => i);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  if (solved(tiles)) [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  return tiles;
}
export default function RoomBuilder() {
  const [progress, setProgress] = useStored<Record<string, Progress>>("mochi-room-puzzles-v1", {});
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const puzzle = puzzles[active];
  const state = progress[puzzle.name];
  const complete = !!state && solved(state.tiles);
  const completed = puzzles.filter(p => progress[p.name] && solved(progress[p.name].tiles)).length;
  function start(index: number) {
    setActive(index); setSelected(null); setPreview(false);
    if (!progress[puzzles[index].name]) setProgress({ ...progress, [puzzles[index].name]: { tiles: shuffleTiles(), moves: 0 } });
  }
  function swap(index: number) {
    if (!state || complete) return;
    if (selected === null) { setSelected(index); return; }
    if (selected === index) { setSelected(null); return; }
    const tiles = [...state.tiles];
    [tiles[selected], tiles[index]] = [tiles[index], tiles[selected]];
    setProgress({ ...progress, [puzzle.name]: { tiles, moves: state.moves + 1 } });
    setSelected(null);
  }
  function picture() {
    return <div className={`puzzle-picture palette-${puzzle.palette}`} style={{ filter: puzzle.filter }}><PuzzleScene /><span className="puzzle-scene-detail" aria-hidden="true">{puzzle.detail}</span></div>;
  }
  return <div className="room-puzzles">
    <p className="modal-description">A little break, piece by piece. Choose one of six cozy room puzzles, then select two tiles to swap them. Your progress saves automatically.</p>
    <p className="puzzle-completion" aria-live="polite">{completed} of 6 puzzles completed</p>
    <div className="puzzle-collection" aria-label="Choose a puzzle">
      {puzzles.map((p, i) => <button key={p.name} aria-pressed={active === i} onClick={() => start(i)}><span aria-hidden="true">{p.detail}</span><strong>{p.name}</strong><small>{progress[p.name] ? solved(progress[p.name].tiles) ? "Completed ✓" : "Continue puzzle" : "Start puzzle"}</small></button>)}
    </div>
    <div className="puzzle-heading"><h3>{puzzle.name}</h3><span>{state?.moves || 0} swaps · 9 pieces</span></div>
    {!state ? <div className="puzzle-welcome">{picture()}<button className="puzzle-start" onClick={() => start(active)}>Start this puzzle</button></div> : <>
      <div className="puzzle-actions"><button aria-pressed={preview} onClick={() => setPreview(!preview)}><Eye size={16} /> {preview ? "Back to puzzle" : "Preview picture"}</button><button onClick={() => { setProgress({ ...progress, [puzzle.name]: { tiles: shuffleTiles(), moves: 0 } }); setSelected(null); setPreview(false); }}><RotateCcw size={16} /> Restart puzzle</button></div>
      {preview ? <div className="puzzle-preview">{picture()}</div> : <div className="puzzle-board" aria-label={`${puzzle.name} puzzle`}>
        {state.tiles.map((tile, index) => <button key={index} className={`puzzle-tile ${selected === index ? "tile-selected" : ""}`} aria-label={`Tile ${tile + 1}, position ${index + 1}`} aria-pressed={selected === index} disabled={complete} onClick={() => swap(index)}>
          <div className="puzzle-tile-art" style={{ left: `${-(tile % 3) * 100}%`, top: `${-Math.floor(tile / 3) * 100}%` }}>{picture()}</div><span className="puzzle-tile-number">{tile + 1}</span>
        </button>)}
      </div>}
      <p className="puzzle-status" role="status">{complete ? <><Check size={18} /> Lovely work! You completed this room in {state.moves} swaps.</> : selected === null ? "Select a tile, then another to swap their places." : "Now select a second tile. Select the same tile to cancel."}</p>
    </>}
  </div>;
}
