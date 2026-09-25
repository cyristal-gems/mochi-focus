import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Lock,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useStored } from "../utils/storage";
import Mascot from "./Mascot";

type Item = { name: string; hours: number; icon: string };
type Position = { x: number; y: number };
const clamp = (n: number) => Math.max(8, Math.min(92, n));
export default function RoomBuilder({
  items,
  total,
  placed,
  setPlaced,
}: {
  items: Item[];
  total: number;
  placed: string[];
  setPlaced: (names: string[]) => void;
}) {
  const [positions, setPositions] = useStored<Record<string, Position>>(
    "mochi-room-positions",
    {},
  );
  const [palette, setPalette] = useStored("mochi-room-palette", "rose");
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<Position | null>(null);
  const dragRef = useRef<{
    name: string;
    pointer: number;
    startX: number;
    startY: number;
    origin: Position;
    next: Position;
  } | null>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const active = items.filter(
    (item) => placed.includes(item.name) && total >= item.hours * 3600,
  );
  const position = (name: string): Position =>
    positions[name] || {
      x: 18 + (items.findIndex((i) => i.name === name) % 6) * 12,
      y: 55 + Math.floor(items.findIndex((i) => i.name === name) / 6) * 12,
    };
  function move(dx: number, dy: number) {
    if (!selected) return;
    const p = position(selected);
    setPositions({
      ...positions,
      [selected]: { x: clamp(p.x + dx), y: clamp(p.y + dy) },
    });
  }
  return (
    <div className="room-builder">
      <p className="modal-description">
        Your own little study room. Add unlocked objects, then drag them into
        place. Select an object to move it with the arrow buttons or your
        keyboard. Changes save automatically.
      </p>
      <div className="room-palettes" aria-label="Room colors">
        {[
          ["rose", "Strawberry"],
          ["sage", "Matcha"],
          ["night", "Moonlight"],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={palette === id}
            onClick={() => setPalette(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className={`buildable-room palette-${palette}`}
        ref={canvas}
        aria-label="Your furnished study room"
      >
        <svg
          className="room-structure"
          viewBox="0 0 800 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="room-wall-light" x2="1" y2="1">
              <stop stopColor="#fff" stopOpacity=".36" />
              <stop offset="1" stopColor="#342135" stopOpacity=".18" />
            </linearGradient>
            <linearGradient id="room-wood" x2="0" y2="1">
              <stop stopColor="#e4b98e" />
              <stop offset="1" stopColor="#ad7856" />
            </linearGradient>
            <linearGradient id="room-upholstery" x2="1" y2="1">
              <stop stopColor="#dfb1b9" />
              <stop offset=".5" stopColor="#b37b91" />
              <stop offset="1" stopColor="#714d66" />
            </linearGradient>
            <linearGradient id="room-sky" x2="0" y2="1">
              <stop stopColor="#8faccc" />
              <stop offset="1" stopColor="#eed7c3" />
            </linearGradient>
            <radialGradient id="room-glow">
              <stop stopColor="#fff2c9" stopOpacity=".65" />
              <stop offset="1" stopColor="#fff2c9" stopOpacity="0" />
            </radialGradient>
            <filter
              id="room-shadow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <path className="room-wall" d="M0 0h800v500H0z" />
          <path d="M0 0h800v330H0z" fill="url(#room-wall-light)" />
          <path d="M640 0h160v406l-160-94z" fill="#362936" opacity=".17" />
          <path className="room-floor" d="M0 342 640 312 800 406v94H0z" />
          <path
            d="M0 342 640 312 800 406M0 354 640 324 800 418"
            fill="none"
            stroke="#74513f"
            strokeWidth="7"
          />
          <path
            d="M0 350 640 320 800 412"
            fill="none"
            stroke="#f8dbc0"
            strokeWidth="3"
          />
          <g stroke="#77513e" strokeOpacity=".27" strokeWidth="1.5">
            <path d="m0 386 692-36m-692 87 749-45M0 496l800-55M80 339 0 452m190-118L94 500m218-171-47 171m168-177 21 177m94-182 100 182m20-187 152 169" />
          </g>
          <path
            d="m96 231 162-6 254 209-316 17z"
            fill="#fff3cb"
            opacity=".17"
          />
          <ellipse cx="282" cy="198" rx="300" ry="210" fill="url(#room-glow)" />
          <path d="m82 59 229-11v208L82 267z" fill="#584448" />
          <path d="m94 70 204-10v185L94 256z" fill="url(#room-sky)" />
          <circle cx="251" cy="105" r="23" fill="#fff4cb" />
          <path d="m94 216q44-60 89-21t115-15v65L94 256z" fill="#829e98" />
          <path
            d="m195 66 0 184M94 158l204-10"
            stroke="#fff0d5"
            strokeWidth="8"
          />
          <path d="m82 267 229-11 17 14-239 13z" fill="#e9c4a0" />
          <path d="m89 283 239-13v9L89 292z" fill="#9a715b" />
          <path
            d="M69 49q18 73-2 202l29-9q12-111 2-188M298 42q-12 96 16 195l28 5q-24-116-18-199"
            fill="#f6e0d2"
            opacity=".85"
          />
          <ellipse
            cx="379"
            cy="429"
            rx="213"
            ry="51"
            fill="#392734"
            opacity=".2"
            filter="url(#room-shadow)"
          />
          <ellipse cx="400" cy="435" rx="198" ry="48" fill="#b7778c" />
          <ellipse cx="400" cy="431" rx="198" ry="46" fill="#dfb3bc" />
          <ellipse
            cx="400"
            cy="431"
            rx="184"
            ry="38"
            fill="none"
            stroke="#f5d7d7"
            strokeWidth="2"
          />
          <path
            d="m154 310 14 1-4 115-12 5zm315-18 13 3 8 104-12 4z"
            fill="#62483c"
          />
          <path
            d="m137 329 17 2-4 121-14-3zm293-10 19-2 8 115-17 8z"
            fill="#926447"
          />
          <path d="m139 330 302-14v31l-302 14z" fill="#9b6a4b" />
          <path d="m113 304 322-20 67 32-366 26z" fill="url(#room-wood)" />
          <path d="m136 342 366-26v12l-366 28z" fill="#a06d4c" />
          <path d="m113 304 23 38v14l-23-40z" fill="#bd8b64" />
          <path
            d="m125 305 310-18m-278 35 313-20"
            stroke="#fce0b3"
            strokeOpacity=".5"
            fill="none"
          />
          <path
            d="m238 305 54-9 28 7 53-7 19 15-61 10-29-5-56 8z"
            fill="#62483c"
            opacity=".2"
          />
          <path
            d="m231 298 56-7 27 7 57-8 17 17-65 10-27-7-57 8z"
            fill="#fff4da"
            stroke="#bd9e82"
          />
          <path
            d="m287 291 9 19m-44-10 31-4m-28 9 31-4m39-1 32-5"
            stroke="#c9b29a"
            fill="none"
          />
          <ellipse
            cx="622"
            cy="411"
            rx="88"
            ry="24"
            fill="#312133"
            opacity=".23"
            filter="url(#room-shadow)"
          />
          <path
            d="M568 353 562 414 574 417 587 357Z M681 351 692 405 705 402 700 346Z"
            stroke="#654633"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="#946a4e"
          />
          <path
            d="M569 238q-3-20 22-26l81-7q31-1 34 26l6 103-136 14z"
            fill="url(#room-upholstery)"
          />
          <path
            d="M585 238q0-13 17-15l65-5q22 0 24 19l5 76-105 10z"
            fill="#ddb0bb"
            opacity=".55"
          />
          <path d="m568 320 125-13 29 26-130 20z" fill="#e2b6c1" />
          <path
            d="m592 353 130-20v25q-59 19-127 21z"
            fill="url(#room-upholstery)"
          />
          <path
            d="M554 297q0-12 14-12t17 13l9 72q-1 16-18 12t-18-16zM701 284q1-11 14-10t16 16l4 61q0 16-15 16t-14-16z"
            fill="url(#room-upholstery)"
          />
          <path
            d="M560 299q7-7 15-1m136-12q6-5 12 2"
            stroke="#f5d0d8"
            strokeWidth="3"
            fill="none"
          />
        </svg>
        <div className="resident-mochi">
          <Mascot state="idle" />
        </div>
        {active.map((item) => {
          const p = selected === item.name && drag ? drag : position(item.name);
          return (
            <button
              key={item.name}
              className={`placed-object ${selected === item.name ? "object-selected" : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label={`Move ${item.name}`}
              aria-pressed={selected === item.name}
              onClick={() => setSelected(item.name)}
              onKeyDown={(e) => {
                const delta: Record<string, number[]> = {
                  ArrowLeft: [-2, 0],
                  ArrowRight: [2, 0],
                  ArrowUp: [0, -2],
                  ArrowDown: [0, 2],
                };
                if (delta[e.key]) {
                  e.preventDefault();
                  const [dx, dy] = delta[e.key];
                  const current = position(item.name);
                  setSelected(item.name);
                  setPositions({
                    ...positions,
                    [item.name]: {
                      x: clamp(current.x + dx),
                      y: clamp(current.y + dy),
                    },
                  });
                }
              }}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                setSelected(item.name);
                const origin = position(item.name);
                dragRef.current = {
                  name: item.name,
                  pointer: e.pointerId,
                  startX: e.clientX,
                  startY: e.clientY,
                  origin,
                  next: origin,
                };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                const d = dragRef.current;
                const rect = canvas.current?.getBoundingClientRect();
                if (!d || d.pointer !== e.pointerId || !rect) return;
                d.next = {
                  x: clamp(
                    d.origin.x + ((e.clientX - d.startX) / rect.width) * 100,
                  ),
                  y: clamp(
                    d.origin.y + ((e.clientY - d.startY) / rect.height) * 100,
                  ),
                };
                setDrag(d.next);
              }}
              onPointerUp={(e) => {
                const d = dragRef.current;
                if (!d || d.pointer !== e.pointerId) return;
                setPositions({ ...positions, [d.name]: d.next });
                dragRef.current = null;
                setDrag(null);
              }}
              onPointerCancel={() => {
                dragRef.current = null;
                setDrag(null);
              }}
            >
              <span aria-hidden="true">{item.icon}</span>
            </button>
          );
        })}
      </div>
      <div className="room-edit-toolbar">
        <strong aria-live="polite">
          {selected && placed.includes(selected)
            ? selected
            : "Select an object to arrange it"}
        </strong>
        <div className="room-move-buttons">
          {[
            [ArrowLeft, -2, 0, "Move left"],
            [ArrowUp, 0, -2, "Move up"],
            [ArrowDown, 0, 2, "Move down"],
            [ArrowRight, 2, 0, "Move right"],
          ].map(([Icon, dx, dy, label]) => {
            const Glyph = Icon as typeof ArrowLeft;
            return (
              <button
                key={String(label)}
                aria-label={String(label)}
                disabled={!selected || !placed.includes(selected)}
                onClick={() => move(Number(dx), Number(dy))}
              >
                <Glyph size={17} />
              </button>
            );
          })}
          <button
            aria-label="Remove selected object"
            disabled={!selected || !placed.includes(selected)}
            onClick={() => {
              setPlaced(placed.filter((n) => n !== selected));
              setSelected(null);
            }}
          >
            <Trash2 size={17} />
          </button>
          <button
            aria-label="Reset selected object position"
            disabled={!selected || !placed.includes(selected)}
            onClick={() => {
              if (selected) {
                const next = { ...positions };
                delete next[selected];
                setPositions(next);
              }
            }}
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
      <h3>Your decorations · {active.length} placed</h3>
      <div className="unlocks-grid">
        {items.map((item) => {
          const available = total >= item.hours * 3600,
            exists = placed.includes(item.name);
          return (
            <button
              key={item.name}
              disabled={!available}
              aria-pressed={exists && available}
              onClick={() => {
                if (!exists) setPlaced([...placed, item.name]);
                setSelected(item.name);
              }}
              className={exists && available ? "selected" : ""}
            >
              <span>{item.icon}</span>
              <strong>{item.name}</strong>
              <small>
                {available ? (
                  exists ? (
                    "Select in room"
                  ) : (
                    "Add to room"
                  )
                ) : (
                  <>
                    <Lock size={12} /> {item.hours}h ·{" "}
                    {Math.max(1, Math.ceil((item.hours * 3600 - total) / 60))}{" "}
                    min to go
                  </>
                )}
              </small>
            </button>
          );
        })}
      </div>
      {!active.length && (
        <p className="room-empty-note">
          Your desk, chair, and Mochi are already here. Your first decoration
          unlocks after 15 minutes of focus. Try a room color while you study
          toward it.
        </p>
      )}
    </div>
  );
}
