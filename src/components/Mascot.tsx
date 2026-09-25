import { useEffect, useState } from "react";
export default function Mascot({ state }: { state: string }) {
  const [sleeping, setSleeping] = useState(false);
  useEffect(() => {
    setSleeping(false);
    if (state !== "idle") return;
    const timeout = setTimeout(() => setSleeping(true), 60000);
    return () => clearTimeout(timeout);
  }, [state]);
  if (sleeping) state = "sleeping";
  return (
    <div
      className={`mascot ${state}`}
      role="img"
      aria-label={`Mochi the tuxedo cat with a cherry blossom is ${state}`}
    >
      <svg viewBox="0 0 80 76" aria-hidden="true" className="tuxedo-cat">
        <path
          d="M17 38 12 9Q24 5 32 21h16Q59 6 68 9l-5 29"
          fill="#302d38"
          stroke="#211f29"
          strokeWidth="2"
        />
        <path d="m18 15 4 17 9-9m31-8-4 17-9-9" fill="#ee99af" />
        <ellipse cx="40" cy="53" rx="23" ry="21" fill="#302d38" />
        <ellipse cx="40" cy="55" rx="12" ry="17" fill="#fff9f0" />
        <ellipse cx="40" cy="35" rx="27" ry="22" fill="#302d38" />
        <path
          d="M40 23c-3 14-17 14-16 23 1 13 31 13 32 0 1-9-13-9-16-23"
          fill="#fff9f0"
        />
        {state === "sleeping" ? (
          <path
            d="m23 34 5 3 5-3m14 0 5 3 5-3"
            fill="none"
            stroke="#f5d98a"
            strokeWidth="2"
          />
        ) : (
          <g fill="#f5d98a">
            <ellipse cx="28" cy="34" rx="3" ry="4" />
            <ellipse cx="52" cy="34" rx="3" ry="4" />
          </g>
        )}
        <path d="m37 41 3 3 3-3" fill="#e88fa7" />
        <path
          d="M40 44v3m-5 0q3 4 5 0 3 4 6 0"
          fill="none"
          stroke="#302d38"
          strokeWidth="1.4"
        />
        <g fill="#fff9f0" stroke="#302d38" strokeWidth="1.5">
          <ellipse cx="25" cy="68" rx="10" ry="5" />
          <ellipse cx="55" cy="68" rx="10" ry="5" />
        </g>
        <g
          transform="translate(62 19)"
          fill="#f59bb9"
          stroke="#da668e"
          strokeWidth=".6"
        >
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-5"
              rx="3.5"
              ry="5"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle r="2.5" fill="#ffe8a0" />
        </g>
      </svg>
      <span className="cat-prop">
        {state === "studying"
          ? "📖"
          : state === "break"
            ? "🍵"
            : state === "celebrating"
              ? "✨"
              : "♡"}
      </span>
    </div>
  );
}
