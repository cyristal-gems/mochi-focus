import type { MusicProvider, Track } from "../types/music";
export const hasClientId = Boolean(import.meta.env.VITE_JAMENDO_CLIENT_ID);
const cache = new Map<string, Track[]>();
export const jamendoProvider: MusicProvider = {
  async getTracks(station, signal) {
    if (!hasClientId)
      throw new Error(
        "Add your Jamendo Client ID to .env to connect music. Your timer and ambience are ready to use.",
      );
    if (cache.has(station.id)) return cache.get(station.id)!;
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_JAMENDO_CLIENT_ID,
      format: "json",
      limit: String(station.trackIds.length),
      id: station.trackIds.join("+"),
      audioformat: "mp32",
      include: "licenses",
    });
    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?${params}`,
      {
        signal: signal
          ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
          : AbortSignal.timeout(15000),
      },
    );
    if (!response.ok)
      throw new Error("Music is taking a little break. Please try again.");
    const body = await response.json();
    if (body.headers?.status !== "success")
      throw new Error(
        body.headers?.error_message || "Unable to load this station.",
      );
    const results = Array.isArray(body.results)
      ? (body.results as Track[])
      : [];
    const tracks = results
      .filter(
        (t) =>
          station.trackIds.includes(String(t.id)) &&
          /^https?:\/\//.test(t.audio || ""),
      )
      .map((t) => ({
        ...t,
        audio: t.audio.replace(/^http:/, "https:"),
        license_ccurl: t.license_ccurl?.replace(/^http:/, "https:"),
      }));
    if (!tracks.length)
      throw new Error(
        "This lofi collection is temporarily unavailable. Please try another station.",
      );
    tracks.sort(
      (a, b) =>
        station.trackIds.indexOf(String(a.id)) -
        station.trackIds.indexOf(String(b.id)),
    );
    cache.set(station.id, tracks);
    return tracks;
  },
};
