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
import RoomObject from "./RoomObject";

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
            <filter id="room-plaster">
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".72"
                numOctaves="3"
                seed="8"
              />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope=".065" />
              </feComponentTransfer>
              <feBlend in="SourceGraphic" mode="multiply" />
            </filter>
            <pattern
              id="room-grain"
              width="140"
              height="13"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 3q35-5 70 0t70 0M15 9q30-4 80 0t45 0"
                fill="none"
                stroke="#634a35"
                strokeOpacity=".13"
                strokeWidth=".7"
              />
            </pattern>
            <pattern
              id="room-weave"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 1h5M1 0v5"
                stroke="#fff1d5"
                strokeOpacity=".19"
                strokeWidth=".65"
              />
            </pattern>
            <linearGradient id="room-vignette">
              <stop stopColor="#402f29" stopOpacity="0" />
              <stop offset="1" stopColor="#302329" stopOpacity=".25" />
            </linearGradient>
            <linearGradient id="room-curtain">
              <stop stopColor="#e5d4bc" />
              <stop offset=".3" stopColor="#fff1da" />
              <stop offset=".55" stopColor="#c4b098" />
              <stop offset=".8" stopColor="#f1e1c9" />
              <stop offset="1" stopColor="#bda78e" />
            </linearGradient>
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
          <path
            className="room-wall"
            d="M0 0h800v500H0z"
            filter="url(#room-plaster)"
          />
          <path d="M0 0h800v330H0z" fill="url(#room-wall-light)" />
          <path d="M640 0h160v406l-160-94z" fill="#362936" opacity=".17" />
          <path className="room-floor" d="M0 342 640 312 800 406v94H0z" />
          <path d="M0 342 640 312 800 406v94H0z" fill="url(#room-grain)" />
          <path
            d="M640 0v313"
            stroke="#4b3e37"
            strokeOpacity=".15"
            strokeWidth="8"
          />
          <path
            d="M0 256 640 233 800 315v12L640 245 0 268z"
            fill="#f7e4ce"
            opacity=".5"
          />
          <g stroke="#756052" strokeOpacity=".16" fill="none" strokeWidth="2">
            <path d="M22 280 74 278v51l-52 3zM340 268l74-3v49l-74 4zM432 264l74-3v49l-74 4zM525 260l88-3v50l-88 4zM664 263l45 24v51l-45-26zM724 295l53 29v53l-53-31z" />
          </g>
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
          <path
            d="m75 54 242-12v224L75 278z"
            fill="#725e4c"
            opacity=".2"
            filter="url(#room-shadow)"
          />
          <path d="m78 54 240-12v223L78 278z" fill="#e8d5b6" />
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
            fill="url(#room-curtain)"
          />
          <path
            d="M59 47 343 34"
            stroke="#78614b"
            strokeWidth="5"
            strokeLinecap="round"
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
          <ellipse cx="400" cy="431" rx="198" ry="46" className="room-rug" />
          <ellipse cx="400" cy="431" rx="198" ry="46" fill="url(#room-weave)" />
          <ellipse
            cx="400"
            cy="431"
            rx="184"
            ry="38"
            fill="none"
            stroke="#f5d7d7"
            strokeWidth="2"
          />
          {/* Desk supports start beneath the four inset corners of the top. */}
          <path
            d="M141 418 443 397 488 447 149 469Z"
            fill="#4f3d30"
            opacity=".16"
            filter="url(#room-shadow)"
          />
          <g fill="#73513b">
            <path d="M131 311 145 310 145 416 135 417Z" />
            <path d="M421 294 435 293 435 394 425 395Z" />
          </g>
          <path d="M146 349 480 325 480 346 146 371Z" fill="#966a4c" />
          <path d="M128 315 147 343 147 369 128 338Z" fill="#805a41" />
          <path d="M146 347 162 346 159 461 147 462Z" fill="#b1815b" />
          <path d="M158 347 165 344 162 458 159 461Z" fill="#78533c" />
          <path d="M465 324 481 323 478 439 466 440Z" fill="#a67753" />
          <path d="M478 324 485 321 482 436 478 439Z" fill="#705039" />
          <path d="m113 304 322-20 67 32-366 26z" fill="url(#room-wood)" />
          <path d="m113 304 322-20 67 32-366 26z" fill="url(#room-grain)" />
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
            d="M568 353 581 353 581 416 568 416Z M692 351 705 351 705 404 692 404Z"
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
          <path
            d="M585 238q0-13 17-15l65-5q22 0 24 19l5 76-105 10z"
            fill="url(#room-weave)"
          />
          <path d="m611 254 56-4 7 52-57 5z" fill="#a3a48c" />
          <path
            d="m615 258 48-4 6 44-48 5z"
            fill="url(#room-weave)"
            stroke="#c8c5ad"
            strokeWidth="1.5"
          />
          <path
            d="M0 0h800v500H0z"
            fill="url(#room-vignette)"
            pointerEvents="none"
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
              <RoomObject name={item.name} />
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
              <span className="decoration-preview">
                <RoomObject name={item.name} />
              </span>
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
