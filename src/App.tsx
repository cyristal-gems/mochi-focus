import { useEffect, useState } from "react";
import {
  BookOpen,
  Headphones,
  Settings2,
  Sun,
  Moon,
  Leaf,
  ArrowUpRight,
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  SkipBack,
  SkipForward,
  Shuffle,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Check,
  Lock,
  Sparkles,
  Heart,
  Music2,
  ChartNoAxesColumnIncreasing,
  Armchair,
  CheckCircle2,
} from "lucide-react";
import { hasClientId } from "./services/jamendo";
import { stations } from "./data/stations";
import { useMusic } from "./hooks/useMusic";
import { modes, useTimer } from "./hooks/useTimer";
import { useStudyStats } from "./hooks/useStudyStats";
import { useStored } from "./utils/storage";
import { duration } from "./utils/stats";
import AmbientMixer from "./components/AmbientMixer";
import Mascot from "./components/Mascot";
import OfflineStatus from "./components/OfflineStatus";
import Modal from "./components/Modal";
const unlocks = [
  { hours: 1, name: "Little plant", icon: "🌱" },
  { hours: 5, name: "Desk lamp", icon: "🪔" },
  { hours: 10, name: "Book collection", icon: "📚" },
  { hours: 20, name: "Cuddle buddy", icon: "🧸" },
  { hours: 30, name: "Art print", icon: "🖼️" },
  { hours: 50, name: "Sakura plant", icon: "🌸" },
  { hours: 100, name: "Golden Neko", icon: "🐱" },
];
export default function App() {
  const [theme, setTheme] = useStored<"light" | "dark">(
    "mochi-theme",
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#262431" : "#f7f6ef");
  }, [theme]);
  const [stationId, setStationId] = useStored("mochi-current-station", "tokyo");
  const station = stations.find((s) => s.id === stationId) || stations[0];
  const music = useMusic(station),
    stats = useStudyStats(),
    timer = useTimer(stats.record);
  const [goal, setGoal] = useStored("mochi-daily-goal", 120),
    [decorations, setDecorations] = useStored<string[]>(
      "mochi-decorations",
      [],
    );
  const [modal, setModal] = useState<
      "stations" | "settings" | "history" | "room" | null
    >(null),
    [page, setPage] = useState("focus");
  const state = timer.celebrate
    ? "celebrating"
    : timer.phase === "break"
      ? "break"
      : timer.running
        ? "studying"
        : "idle";
  const nextUnlock = unlocks.find((u) => stats.total < u.hours * 3600);
  const time = `${String(Math.floor(timer.seconds / 60)).padStart(2, "0")}:${String(timer.seconds % 60).padStart(2, "0")}`;
  useEffect(() => {
    document.title = timer.running
      ? `${time} · Mochi Focus`
      : "Mochi Focus · Your cozy study corner";
  }, [time, timer.running]);
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Mochi Focus home">
          <span className="brand-cat" aria-hidden="true">
            ฅ^•ﻌ•^ฅ
          </span>
          <span>
            mochi<span className="brand-light">focus</span>
            <small>YOUR COZY STUDY CORNER</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={page === "focus" ? "active" : ""}
            onClick={() => setPage("focus")}
          >
            <Headphones size={17} />
            Focus room
          </button>
          <button
            className={page === "journey" ? "active" : ""}
            onClick={() => {
              setPage("journey");
              setModal("history");
            }}
          >
            <ChartNoAxesColumnIncreasing size={17} />
            My journey
          </button>
          <button
            className={page === "room" ? "active" : ""}
            onClick={() => {
              setPage("room");
              setModal("room");
            }}
          >
            <Armchair size={17} />
            My room
          </button>
        </nav>
        <div className="header-right">
          <button
            className="icon-button theme-toggle"
            aria-label={
              theme === "light"
                ? "Switch to kawaii dark mode"
                : "Switch to kawaii light mode"
            }
            title={theme === "light" ? "Kawaii dark mode" : "Kawaii light mode"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <span className="streak-pill">
            <Flame size={16} />
            {stats.streak} day streak
          </span>
          <button
            className="icon-button"
            aria-label="Settings"
            onClick={() => setModal("settings")}
          >
            <Settings2 size={20} />
          </button>
        </div>
      </header>
      <main>
        <OfflineStatus />
        <div className="welcome">
          <div>
            <div className="eyebrow">
              <span /> SLOW DOWN. SETTLE IN.
            </div>
            <h1>A little focus. A little lofi.</h1>
            <p>Make yourself a cozy corner. Let’s do something good today.</p>
          </div>
          <div className="daily-note">
            <Leaf size={20} />
            <span>
              Small steps count, too.
              <small>You've got this, one moment at a time.</small>
            </span>
          </div>
        </div>
        <div className="workspace">
          <div className="left-column">
            <section
              className={`room-scene scene-${station.id}`}
              aria-label={`${station.name} study room`}
            >
              <img
                src={`${import.meta.env.BASE_URL}backgrounds/tokyo-cafe.png`}
                alt="An illustrated sunlit Japanese café with plants, books, and a sleeping cat"
              />
              <div className="scene-shade" />
              <span className="scene-label">
                <span className="live-dot" /> YOUR LITTLE ESCAPE
              </span>
              <div className="scene-bottom">
                <div>
                  <span className="scene-kicker">MAKE YOURSELF AT HOME</span>
                  <h2>
                    {station.icon} {station.name}
                  </h2>
                  <p>{station.description}</p>
                </div>
                <button
                  aria-label="Choose station"
                  className="scene-button"
                  onClick={() => setModal("stations")}
                >
                  <ArrowUpRight size={21} />
                </button>
              </div>
              <div className="decorations">
                {unlocks
                  .filter(
                    (u) =>
                      decorations.includes(u.name) &&
                      stats.total >= u.hours * 3600,
                  )
                  .map((u) => (
                    <span key={u.name} title={u.name}>
                      {u.icon}
                    </span>
                  ))}
              </div>
            </section>
            <section className="panel music-panel">
              <div className={`record ${music.playing ? "spinning" : ""}`}>
                <Music2 size={22} />
              </div>
              <div className="track-info">
                <span className="eyebrow">
                  {music.playing ? "NOW PLAYING" : "LOFI FOR YOUR MIND"}
                </span>
                <h3>{music.track?.name || "Your next favorite daydream"}</h3>
                <p>
                  {music.track?.artist_name || "Connect Jamendo to tune in"}
                  {music.track && (
                    <>
                      {" "}
                      ·{" "}
                      <a
                        href={music.track.shareurl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Jamendo ↗
                      </a>{" "}
                      ·{" "}
                      <a
                        href={music.track.license_ccurl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        License
                      </a>
                    </>
                  )}
                </p>
              </div>
              <div className="playback">
                <button
                  className={`icon-button ${music.shuffle ? "enabled" : ""}`}
                  aria-label="Shuffle"
                  aria-pressed={music.shuffle}
                  onClick={() => music.setShuffle(!music.shuffle)}
                >
                  <Shuffle size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Previous track"
                  disabled={!music.track}
                  onClick={music.previous}
                >
                  <SkipBack size={18} />
                </button>
                <button
                  className="music-play"
                  aria-label={music.playing ? "Pause music" : "Play music"}
                  disabled={!music.track}
                  onClick={music.toggle}
                >
                  {music.playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  className="icon-button"
                  aria-label="Next track"
                  disabled={!music.track}
                  onClick={music.next}
                >
                  <SkipForward size={18} />
                </button>
              </div>
              <label className="music-volume">
                <button
                  aria-label={music.muted ? "Unmute music" : "Mute music"}
                  className="icon-button"
                  onClick={() => music.setMuted(!music.muted)}
                >
                  {music.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
                <input
                  aria-label="Music volume"
                  type="range"
                  min="0"
                  max="100"
                  value={music.volume}
                  onChange={(e) => music.setVolume(+e.target.value)}
                />
                <small>{music.volume}%</small>
              </label>
            </section>
            {(music.error || music.loading) && (
              <div className="music-notice" role="status">
                {music.loading ? "Finding a little lofi for you…" : music.error}
                {music.error && <button onClick={music.retry}>Retry</button>}
              </div>
            )}
            <AmbientMixer />
          </div>
          <aside className="right-column">
            <section className="panel timer-panel">
              <div className="section-heading">
                <h2>
                  <span className="small-flower">✿</span> Time to settle in
                </h2>
                <span className="focus-badge">
                  {timer.phase === "focus" ? "FOCUS" : "BREAK"}
                </span>
              </div>
              <div className="mode-tabs">
                {modes.slice(0, 3).map((m) => (
                  <button
                    key={m.id}
                    className={timer.mode === m.id ? "active" : ""}
                    onClick={() => timer.select(m.id)}
                  >
                    {m.name}
                  </button>
                ))}
                <select
                  aria-label="More timer modes"
                  value={
                    ["custom", "stopwatch"].includes(timer.mode)
                      ? timer.mode
                      : ""
                  }
                  onChange={(e) =>
                    e.target.value && timer.select(e.target.value)
                  }
                >
                  <option value="">•••</option>
                  <option value="stopwatch">Stopwatch</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {timer.mode === "custom" && (
                <label className="custom-duration">
                  Focus minutes{" "}
                  <input
                    type="number"
                    min="1"
                    max="240"
                    value={timer.custom}
                    onChange={(e) =>
                      timer.setCustom(
                        Math.max(1, Math.min(240, +e.target.value || 1)),
                      )
                    }
                  />
                </label>
              )}
              <div className="clock-area">
                <div className="timer-label">
                  {timer.celebrate
                    ? "A LITTLE WIN. WELL DONE!"
                    : timer.phase === "break"
                      ? "BREATHE. YOU EARNED THIS."
                      : timer.running
                        ? "ONE THING AT A TIME."
                        : "ROOM TO THINK. TIME TO FOCUS."}
                </div>
                <div
                  className="timer-digits"
                  role="timer"
                  aria-label={`${Math.floor(timer.seconds / 60)} minutes ${timer.seconds % 60} seconds`}
                >
                  {time}
                </div>
                <div className="timer-caption">
                  {timer.mode === "stopwatch"
                    ? "Follow your own rhythm"
                    : `${timer.mode === "custom" ? timer.custom : modes.find((m) => m.id === timer.mode)!.minutes} min focus · ${modes.find((m) => m.id === timer.mode)!.break} min break`}
                </div>
                <div className="session-dots">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={i <= stats.sessions % 4 ? "filled" : ""}
                    />
                  ))}
                </div>
              </div>
              <div className="timer-controls">
                <button
                  aria-label="Restart timer"
                  className="secondary-control"
                  onClick={timer.reset}
                >
                  <RotateCcw size={18} />
                  <span>Restart</span>
                </button>
                <button
                  className="station-control"
                  onClick={() => setModal("stations")}
                >
                  <Headphones size={18} />
                  <span>Change station</span>
                  <ChevronDown size={13} />
                </button>
                <button className="primary-control" onClick={timer.toggle}>
                  {timer.running ? <Pause size={17} /> : <Play size={17} />}
                  <span>
                    {timer.celebrate
                      ? "Continue"
                      : timer.running
                        ? "Pause"
                        : "Start"}
                  </span>
                </button>
              </div>
              {timer.mode === "stopwatch" && timer.elapsed > 0 && (
                <button className="text-button" onClick={timer.finish}>
                  Finish session
                </button>
              )}
              <div className="mochi-companion">
                <Mascot state={state} />
                <div>
                  <h3>
                    {timer.celebrate
                      ? "Look at you go!"
                      : timer.running
                        ? "Mochi is studying with you."
                        : "Your study buddy is here."}
                  </h3>
                  <p>
                    {timer.celebrate
                      ? "A little closer to your dreams."
                      : timer.phase === "break"
                        ? "Stretch, sip some tea, and breathe."
                        : "No rush. We’ll take it one page at a time."}
                  </p>
                </div>
                <Heart size={15} />
              </div>
            </section>
            <section className="panel stats-panel">
              <div className="section-heading">
                <h2>Today’s little wins</h2>
                <button
                  aria-label="View study history"
                  className="icon-button"
                  onClick={() => setModal("history")}
                >
                  <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="goal-line">
                <span>
                  {duration(stats.today)}
                  <small> / {duration(goal * 60)}</small>
                </span>
                <button
                  className="text-button"
                  onClick={() => setModal("settings")}
                >
                  Daily goal
                </button>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label="Daily focus goal"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(
                  100,
                  Math.floor((stats.today / (goal * 60)) * 100),
                )}
              >
                <div
                  style={{
                    width: `${Math.min(100, (stats.today / (goal * 60)) * 100)}%`,
                  }}
                />
              </div>
              <p className="goal-note">
                {stats.today >= goal * 60
                  ? "Your daily goal is complete. Beautiful work!"
                  : "Every focused minute is a little victory."}
              </p>
              <div className="stats-grid">
                <div>
                  <Flame size={19} />
                  <strong>
                    {stats.streak}
                    <small> days</small>
                  </strong>
                  <span>Current streak</span>
                </div>
                <div>
                  <BookOpen size={19} />
                  <strong>{stats.sessions}</strong>
                  <span>Sessions done</span>
                </div>
                <div>
                  <Clock size={19} />
                  <strong>{duration(stats.total)}</strong>
                  <span>Total focus</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
        <section className="room-unlock">
          <span className="plant-icon">🌱</span>
          <div>
            <h3>A little focus makes your room grow.</h3>
            <p>
              {nextUnlock
                ? `Your next little joy: ${nextUnlock.name.toLowerCase()} · unlocks at ${nextUnlock.hours} ${nextUnlock.hours === 1 ? "hour" : "hours"} of focus`
                : "Your cozy collection is complete. Keep growing."}
            </p>
          </div>
          <div className="unlock-progress">
            <span>
              {duration(stats.total)} /{" "}
              {nextUnlock ? `${nextUnlock.hours}h` : "Complete"}
            </span>
            <div className="progress-track">
              <div
                style={{
                  width: `${nextUnlock ? Math.min(100, (stats.total / (nextUnlock.hours * 3600)) * 100) : 100}%`,
                }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              setModal("room");
              setPage("room");
            }}
          >
            Explore my room <ArrowUpRight size={16} />
          </button>
        </section>
        <footer>
          <span>
            Made for softer days and brighter minds.{" "}
            <span className="footer-flower">✿</span>
          </span>
          <span>
            <span className="privacy-dot" /> Just you, your focus, and a little
            Mochi. <span className="local-note">Saved on this device</span>
          </span>
        </footer>
      </main>
      {modal && (
        <Modal
          title={
            modal === "stations"
              ? "Find your frequency"
              : modal === "settings"
                ? "Make it your own"
                : modal === "history"
                  ? "Your focus journey"
                  : "A room that grows with you"
          }
          close={() => {
            setModal(null);
            setPage("focus");
          }}
        >
          {modal === "stations" && (
            <>
              <p className="modal-description">
                Six little escapes. Where will your mind wander today?
              </p>
              <div className="station-grid">
                {stations.map((s) => (
                  <button
                    key={s.id}
                    className={`station-card ${station.id === s.id ? "selected" : ""}`}
                    onClick={() => {
                      setStationId(s.id);
                      setModal(null);
                    }}
                  >
                    <span
                      className="station-art"
                      style={{ background: s.color }}
                    >
                      {s.icon}
                    </span>
                    <strong>
                      {s.name}
                      {station.id === s.id && <Check size={16} />}
                    </strong>
                    <small>{s.description}</small>
                  </button>
                ))}
              </div>
            </>
          )}
          {modal === "settings" && (
            <div className="settings-content">
              <p className="modal-description">
                Little adjustments for your kind of day.
              </p>
              <label>
                Daily focus goal <span>{goal} minutes</span>
                <input
                  type="range"
                  min="15"
                  max="480"
                  step="15"
                  value={goal}
                  onChange={(e) => setGoal(+e.target.value)}
                />
              </label>
              <div className="settings-note">
                <Leaf size={24} />
                <p>
                  Your study history and preferences stay on this device. No
                  account, no pressure.
                </p>
              </div>
              <h3>Music connection</h3>
              {hasClientId ? (
                <p>
                  Jamendo is configured. Pick a station and press play to find
                  your flow.
                </p>
              ) : (
                <p>
                  Add your Jamendo Client ID in your project’s <code>.env</code>{" "}
                  file, then restart the app. See the README for setup.
                </p>
              )}
            </div>
          )}
          {modal === "history" && (
            <>
              <p className="modal-description">
                Progress comes one quiet moment at a time.
              </p>
              <div className="journey-summary">
                <div>
                  <strong>{duration(stats.total)}</strong>Total focus
                </div>
                <div>
                  <strong>{stats.longest} days</strong>Longest streak
                </div>
                <div>
                  <strong>{stats.sessions}</strong>Sessions
                </div>
              </div>
              <h3 className="history-title">Recent days</h3>
              {Object.entries(stats.history)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 30)
                .map(([date, day]) => (
                  <div className="history-row" key={date}>
                    <span>
                      <CheckCircle2 size={17} />
                      {new Date(`${date}T12:00:00`).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                    <span>
                      {duration(day.seconds)} · {day.sessions} sessions
                    </span>
                  </div>
                ))}
              {!Object.keys(stats.history).length && (
                <div className="empty-state">
                  <BookOpen size={32} />
                  <h3>Your first chapter starts here.</h3>
                  <p>Start the timer and we’ll save your little wins.</p>
                </div>
              )}
            </>
          )}
          {modal === "room" && (
            <>
              <p className="modal-description">
                Earn a little something just by showing up. Select unlocked
                objects to put them in your room.
              </p>
              <div className="unlocks-grid">
                {unlocks.map((u) => {
                  const available = stats.total >= u.hours * 3600,
                    selected = decorations.includes(u.name);
                  return (
                    <button
                      key={u.name}
                      disabled={!available}
                      aria-pressed={selected}
                      onClick={() =>
                        setDecorations(
                          selected
                            ? decorations.filter((n) => n !== u.name)
                            : [...decorations, u.name],
                        )
                      }
                      className={selected ? "selected" : ""}
                    >
                      <span>{u.icon}</span>
                      <strong>{u.name}</strong>
                      <small>
                        {available ? (
                          selected ? (
                            <>
                              <Check size={12} /> In your room
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} /> Place in room
                            </>
                          )
                        ) : (
                          <>
                            <Lock size={12} /> {u.hours}h of focus
                          </>
                        )}
                      </small>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
