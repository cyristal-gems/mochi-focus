import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, it, expect, vi } from "vitest";
function setup(root = "https://example.com/mochi-focus/") {
  const listeners: Record<string, (e: any) => void> = {};
  const entries = new Map<string, Response>();
  const cache = {
    addAll: vi.fn(async (urls: string[]) => {
      for (const u of urls)
        entries.set(
          u,
          new Response(u.endsWith(".wav") ? "0123456789" : "cached app"),
        );
    }),
    match: vi.fn(async (k: string) => entries.get(k)?.clone()),
  };
  const caches = {
    open: vi.fn(async () => cache),
    keys: vi.fn(async () => [
      "mochi-offline:/mochi-focus/:old",
      "other-app-cache",
    ]),
    delete: vi.fn(async () => true),
  };
  const fetch = vi.fn(async () => {
    throw new Error("Network disconnected");
  });
  const claim = vi.fn();
  const code = readFileSync(
    new URL("./sw-template.js", import.meta.url),
    "utf8",
  )
    .replace("'__VERSION__'", "'test'")
    .replace(
      "__FILES__",
      JSON.stringify(["index.html", "assets/app.js", "ambience/rain.wav"]),
    );
  runInNewContext(code, {
    self: {
      registration: { scope: root },
      clients: { claim },
      addEventListener: (name: string, callback: any) => {
        listeners[name] = callback;
      },
    },
    caches,
    fetch,
    URL,
    Response,
    Headers,
  });
  async function lifecycle(name: string) {
    let done: Promise<unknown> | undefined;
    listeners[name]({ waitUntil: (p: Promise<unknown>) => (done = p) });
    await done;
  }
  async function request(url: string, mode = "cors", range?: string) {
    let result: Promise<Response> | undefined;
    listeners.fetch({
      request: {
        url,
        mode,
        method: "GET",
        headers: new Headers(range ? { range } : undefined),
      },
      respondWith: (p: Promise<Response>) => (result = p),
    });
    return await result;
  }
  return { lifecycle, request, caches, fetch, cache, claim };
}
describe("offline service worker", () => {
  it("serves a repository-subpath app without the network", async () => {
    const s = setup();
    await s.lifecycle("install");
    const response = await s.request(
      "https://example.com/mochi-focus/",
      "navigate",
    );
    expect(await response?.text()).toBe("cached app");
    expect(s.fetch).not.toHaveBeenCalled();
  });
  it("serves cached JS and audio offline", async () => {
    const s = setup();
    await s.lifecycle("install");
    expect(
      await (
        await s.request("https://example.com/mochi-focus/assets/app.js")
      )?.text(),
    ).toBe("cached app");
    expect(
      await (
        await s.request("https://example.com/mochi-focus/ambience/rain.wav")
      )?.text(),
    ).toBe("0123456789");
  });
  it("supports valid audio ranges and rejects invalid ones", async () => {
    const s = setup();
    await s.lifecycle("install");
    const r = await s.request(
      "https://example.com/mochi-focus/ambience/rain.wav",
      "cors",
      "bytes=2-5",
    );
    expect(r?.status).toBe(206);
    expect(await r?.text()).toBe("2345");
    expect(r?.headers.get("Content-Range")).toBe("bytes 2-5/10");
    expect(
      (
        await s.request(
          "https://example.com/mochi-focus/ambience/rain.wav",
          "cors",
          "bytes=99-",
        )
      )?.status,
    ).toBe(416);
  });
  it("never intercepts Jamendo or unrelated paths", async () => {
    const s = setup();
    expect(
      await s.request("https://api.jamendo.com/v3.0/tracks/"),
    ).toBeUndefined();
    expect(
      await s.request("https://example.com/another-app/", "navigate"),
    ).toBeUndefined();
  });
  it("cleans only this app scope on activation", async () => {
    const s = setup();
    await s.lifecycle("activate");
    expect(s.caches.delete.mock.calls).toEqual([
      ["mochi-offline:/mochi-focus/:old"],
    ]);
    expect(s.claim).toHaveBeenCalledOnce();
  });
  it("supports hosting at the domain root", async () => {
    const s = setup("https://example.com/");
    await s.lifecycle("install");
    expect(
      await (await s.request("https://example.com/", "navigate"))?.text(),
    ).toBe("cached app");
  });
});
