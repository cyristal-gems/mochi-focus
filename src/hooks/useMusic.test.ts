// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { stations } from "../data/stations";
import type { Track } from "../types/music";
const mocks = vi.hoisted(() => ({ instances: [] as any[] }));
vi.mock("howler", () => ({ Howl: class {
  active=false;
  options: any;
  play=vi.fn(() => { this.active=true; this.options.onplay(); });
  pause=vi.fn(() => { this.active=false; this.options.onpause(); });
  playing=()=>this.active;
  unload=vi.fn(); volume=vi.fn(); mute=vi.fn();
  constructor(options: any) { this.options=options; mocks.instances.push(this); }
} }));
import { useMusic } from "./useMusic";
const provider={getTracks:async()=>[{id:"1",audio:"https://example.com/test.mp3"} as Track]};
afterEach(()=>{cleanup();mocks.instances.length=0;localStorage.clear();});
it("autoplays a loaded station and respects an explicit pause on station changes",async()=>{
 const {result,rerender}=renderHook(({station})=>useMusic(station,provider),{initialProps:{station:stations[0]}});
 await waitFor(()=>expect(result.current.playing).toBe(true));
 act(()=>result.current.toggle());
 rerender({station:stations[1]});
 await waitFor(()=>expect(mocks.instances.length).toBe(2));
 expect(mocks.instances[1].play).not.toHaveBeenCalled();
});
it("retries blocked autoplay after a user interaction",async()=>{
 const {result}=renderHook(()=>useMusic(stations[0],provider));
 await waitFor(()=>expect(result.current.playing).toBe(true));
 const sound=mocks.instances[0];
 act(()=>{sound.active=false;sound.options.onplayerror();});
 expect(result.current.error).toContain("Tap anywhere");
 act(()=>document.dispatchEvent(new MouseEvent("click",{bubbles:true})));
 expect(sound.play).toHaveBeenCalledTimes(2);
 expect(result.current.error).toBe("");
});
