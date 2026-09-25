import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { jamendoProvider } from "../services/jamendo";
import { useStored } from "../utils/storage";
import type { Station, Track, MusicProvider } from "../types/music";
export function useMusic(
  station: Station,
  provider: MusicProvider = jamendoProvider,
) {
  const [tracks, setTracks] = useState<Track[]>([]),
    [index, setIndex] = useState(0),
    [playing, setPlaying] = useState(false),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const [volume, setVolume] = useStored("mochi-volume", 70),
    [shuffle, setShuffle] = useStored("mochi-shuffle", false),
    [muted, setMuted] = useState(false);
  const sound = useRef<Howl | null>(null),
    wantPlay = useRef(false),
    shuffleRef = useRef(shuffle);
  shuffleRef.current = shuffle;
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    sound.current?.unload();
    setTracks([]);
    setIndex(0);
    setPlaying(false);
    setLoading(true);
    setError("");
    provider
      .getTracks(station, controller.signal)
      .then((t) => {
        if (controller.signal.aborted) return;
        setTracks(t);
        setLoading(false);
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(
            e.name === "TimeoutError"
              ? "Music is taking a little longer. Please try again."
              : e.message,
          );
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [station, provider, retry]);
  const step = (direction: number) => {
    setIndex((i) =>
      tracks.length < 2
        ? i
        : shuffleRef.current
          ? (i + 1 + Math.floor(Math.random() * (tracks.length - 1))) %
            tracks.length
          : (i + direction + tracks.length) % tracks.length,
    );
  };
  useEffect(() => {
    if (!tracks[index]) return;
    setError("");
    setPlaying(false);
    const h = new Howl({
      src: [tracks[index].audio],
      format: ["mp3"],
      html5: true,
      volume: volume / 100,
      onplay: () => setPlaying(true),
      onpause: () => setPlaying(false),
      onend: () => {
        if (tracks.length === 1) h.play();
        else step(1);
      },
      onloaderror: () => {
        setError("This track could not load. Try the next track.");
        setPlaying(false);
      },
      onplayerror: () => {
        setError("Playback was blocked. Press play to try again.");
        setPlaying(false);
      },
    });
    sound.current = h;
    if (wantPlay.current) h.play();
    return () => {
      h.unload();
      sound.current = null;
    };
  }, [tracks, index]);
  useEffect(() => {
    sound.current?.volume(volume / 100);
    sound.current?.mute(muted);
  }, [volume, muted, tracks, index]);
  return {
    track: tracks[index],
    playing,
    error,
    loading,
    volume,
    setVolume,
    shuffle,
    setShuffle,
    muted,
    setMuted,
    next: () => step(1),
    previous: () => step(-1),
    retry: () => setRetry((r) => r + 1),
    toggle: () => {
      const h = sound.current;
      if (!h) return;
      setError("");
      wantPlay.current = !h.playing();
      if (h.playing()) h.pause();
      else h.play();
    },
  };
}
