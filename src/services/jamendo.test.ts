import { afterEach, describe, expect, it, vi } from "vitest";
import { stations } from "../data/stations";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.resetModules();
});
describe("Jamendo-only lofi collections", () => {
  it("assigns five distinct tracks to each of six stations", () => {
    expect(stations).toHaveLength(6);
    const ids = stations.flatMap((s) => s.trackIds);
    expect(ids).toHaveLength(30);
    expect(new Set(ids).size).toBe(30);
    expect(ids.every((id) => /^\d+$/.test(id))).toBe(true);
  });
  it("requests exact IDs, filters unlisted tracks, and preserves station order", async () => {
    vi.stubEnv("VITE_JAMENDO_CLIENT_ID", "test-client");
    const station = stations[0];
    const ids = station.trackIds;
    const track = (id: string) => ({
      id,
      name: "Lofi",
      audio: "http://example.com/audio.mp3",
      license_ccurl: "http://creativecommons.org/licenses/by/3.0/",
    });
    const fetch = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          headers: { status: "success" },
          results: [track(ids[1]), track("unlisted"), track(ids[0])],
        }),
      });
    vi.stubGlobal("fetch", fetch);
    const { jamendoProvider } = await import("./jamendo");
    const result = await jamendoProvider.getTracks(station);
    const url = new URL(fetch.mock.calls[0][0]);
    expect(url.hostname).toBe("api.jamendo.com");
    expect(url.searchParams.get("id")).toBe(ids.join("+"));
    expect(url.searchParams.has("tags")).toBe(false);
    expect(result.map((t) => t.id)).toEqual(ids.slice(0, 2));
    expect(result[0].audio).toMatch(/^https:/);
    await jamendoProvider.getTracks(station);
    expect(fetch).toHaveBeenCalledOnce();
  });
  it("reports an empty collection without falling back to generic music", async () => {
    vi.stubEnv("VITE_JAMENDO_CLIENT_ID", "test-client");
    const fetch = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ headers: { status: "success" }, results: [] }),
      });
    vi.stubGlobal("fetch", fetch);
    const { jamendoProvider } = await import("./jamendo");
    await expect(jamendoProvider.getTracks(stations[0])).rejects.toThrow(
      "temporarily unavailable",
    );
    expect(fetch).toHaveBeenCalledOnce();
  });
  it("rejects API errors rather than caching unsuccessful responses", async () => {
    vi.stubEnv("VITE_JAMENDO_CLIENT_ID", "test-client");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({
            headers: { status: "failed", error_message: "Invalid client" },
          }),
        }),
    );
    const { jamendoProvider } = await import("./jamendo");
    await expect(jamendoProvider.getTracks(stations[0])).rejects.toThrow(
      "Invalid client",
    );
  });
});
