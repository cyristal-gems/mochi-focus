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
      aria-label={`Mochi the cat is ${state}`}
    >
      <div className="cat-ears">
        <i />
        <i />
      </div>
      <div className="cat-face">
        <span className="cat-eyes">{state === "sleeping" ? "⌒ ⌒" : "• •"}</span>
        <span className="cat-mouth">ω</span>
        <i className="blush left" />
        <i className="blush right" />
      </div>
      <div className="cat-paws">⌒　⌒</div>
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
