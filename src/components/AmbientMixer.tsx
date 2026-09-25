import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { CloudRain, Flame, Coffee, Waves, Moon, Volume2 } from "lucide-react";
import { useStored } from "../utils/storage";
const sounds = [
  { id: "rain", name: "Rain", Icon: CloudRain },
  { id: "cafe", name: "Café", Icon: Coffee },
  { id: "fire", name: "Fireplace", Icon: Flame },
  { id: "ocean", name: "Ocean", Icon: Waves },
  { id: "night", name: "Night", Icon: Moon },
];
export default function AmbientMixer() {
  const [selected, setSelected] = useState<string | null>(null),
    [volume, setVolume] = useStored("mochi-ambient-volume", 50),
    [error, setError] = useState("");
  const audio = useRef<Howl | null>(null);
  useEffect(() => {
    if (!selected) return;
    const h = new Howl({
      src: [`${import.meta.env.BASE_URL}ambience/${selected}.wav`],
      loop: true,
      volume: volume / 100,
      onloaderror: () => setError("This ambience could not load."),
      onplayerror: () => setError("Tap another ambience to try again."),
    });
    audio.current = h;
    h.play();
    return () => {
      h.unload();
      audio.current = null;
    };
  }, [selected]);
  useEffect(() => {
    audio.current?.volume(volume / 100);
  }, [volume]);
  return (
    <section className="panel ambience">
      <div className="section-heading">
        <h2>Set the mood</h2>
        <span>AMBIENCE</span>
      </div>
      <div className="ambient-options">
        {sounds.map(({ id, name, Icon }) => (
          <button
            key={id}
            aria-pressed={selected === id}
            className={selected === id ? "selected" : ""}
            onClick={() => {
              setError("");
              setSelected(selected === id ? null : id);
            }}
          >
            <Icon size={21} />
            <span>{name}</span>
          </button>
        ))}
      </div>
      <label className="volume">
        <Volume2 size={16} />
        <input
          aria-label="Ambience volume"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(+e.target.value)}
        />
        <span>{volume}%</span>
      </label>
      {error && <p role="alert">{error}</p>}
      <p className="hint">A little background comfort. Mix it your way.</p>
    </section>
  );
}
