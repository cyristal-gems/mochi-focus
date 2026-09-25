// A short, original notification tone; no recording or generated music.
let context: AudioContext | undefined;
export async function prepareChime() {
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") await context.resume();
    return context;
  } catch {
    return undefined;
  }
}
export async function playChime() {
  const audio = await prepareChime();
  if (!audio || audio.state !== "running") return;
  [659.25, 783.99, 1046.5].forEach((frequency, index) => {
    const start = audio.currentTime + index * 0.18;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.12, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(start);
    oscillator.stop(start + 0.85);
  });
}
