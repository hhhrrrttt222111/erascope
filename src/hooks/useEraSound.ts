import { useEffect, useRef } from "react";
import { eraByYear, type EraId } from "../data";

/**
 * Era transition sounds. JSON `theme.sound` is either a synth preset name below,
 * or a filename (anything with a dot) played from /public/sounds.
 * All presets are generated with the Web Audio API, so no audio files ship with the app.
 */
type Preset = (ctx: AudioContext, out: AudioNode) => void;

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function burst(ctx: AudioContext, out: AudioNode, at: number, length: number, freq: number, gain: number, type: BiquadFilterType = "bandpass") {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, length);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + length);
  src.connect(filter).connect(g).connect(out);
  src.start(at);
}

function tone(ctx: AudioContext, out: AudioNode, at: number, length: number, freq: number, gain: number, type: OscillatorType = "sine", endFreq?: number) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, at + length);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(g).connect(out);
  osc.start(at);
  osc.stop(at + length + 0.05);
}

/** One preset per era; the validator makes sure no two eras share a sound. */
const PRESETS: Record<string, Preset> = {
  // 1900: shellac crackle under a wobbling horn tone.
  gramophone: (ctx, out) => {
    const t = ctx.currentTime;
    for (let i = 0; i < 14; i++) burst(ctx, out, t + Math.random() * 0.9, 0.012, 3000 + Math.random() * 3000, 0.35, "highpass");
    tone(ctx, out, t + 0.05, 0.9, 392, 0.06, "triangle", 370);
  },
  // 1920: three typewriter key strikes and a carriage bell.
  typewriter: (ctx, out) => {
    const t = ctx.currentTime;
    [0, 0.11, 0.19].forEach((d) => burst(ctx, out, t + d, 0.05, 2400, 0.6));
    tone(ctx, out, t + 0.32, 0.5, 2100, 0.15, "triangle");
  },
  // 1930: a film projector's shutter rattle and motor whir.
  projector: (ctx, out) => {
    const t = ctx.currentTime;
    for (let i = 0; i < 16; i++) burst(ctx, out, t + i * 0.05, 0.02, 1500, 0.4);
    tone(ctx, out, t, 0.85, 110, 0.05, "sawtooth", 130);
  },
  // 1945: a rubber stamp thud.
  stamp: (ctx, out) => {
    const t = ctx.currentTime;
    tone(ctx, out, t, 0.25, 140, 0.6, "sine", 45);
    burst(ctx, out, t, 0.08, 400, 0.7, "lowpass");
  },
  // 1960: a TV power switch: a click, a hum and a hiss.
  "tv-click": (ctx, out) => {
    const t = ctx.currentTime;
    burst(ctx, out, t, 0.03, 3000, 0.7, "highpass");
    tone(ctx, out, t + 0.02, 0.5, 60, 0.2, "sawtooth");
    burst(ctx, out, t + 0.05, 0.45, 6000, 0.12, "highpass");
  },
  // 1970: a stylus dropping onto vinyl, then surface noise.
  "needle-drop": (ctx, out) => {
    const t = ctx.currentTime;
    tone(ctx, out, t, 0.18, 90, 0.5, "sine", 50);
    burst(ctx, out, t + 0.02, 0.6, 5000, 0.08, "highpass");
    for (let i = 0; i < 6; i++) burst(ctx, out, t + 0.1 + Math.random() * 0.5, 0.01, 4000, 0.3, "highpass");
  },
  // 1984: a floppy drive's stepper motor seeking.
  floppy: (ctx, out) => {
    const t = ctx.currentTime;
    [0, 0.07, 0.14, 0.24, 0.3, 0.42].forEach((d, i) => tone(ctx, out, t + d, 0.05, 180 + (i % 3) * 60, 0.18, "square"));
  },
  // 1995: a dial-up modem handshake in miniature.
  dialup: (ctx, out) => {
    const t = ctx.currentTime;
    tone(ctx, out, t, 0.12, 1209, 0.12);
    tone(ctx, out, t, 0.12, 697, 0.12);
    tone(ctx, out, t + 0.16, 0.25, 2100, 0.1, "square");
    tone(ctx, out, t + 0.42, 0.18, 1200, 0.08, "square", 2400);
    burst(ctx, out, t + 0.55, 0.35, 1800, 0.25);
  },
  // 1999: a desktop startup chime (a rising major chord).
  "startup-chime": (ctx, out) => {
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(ctx, out, t + i * 0.09, 1.1 - i * 0.1, f, 0.12, "sine"));
  },
  // 2005: the soft tick of a click wheel.
  "click-wheel": (ctx, out) => {
    const t = ctx.currentTime;
    [0, 0.06, 0.12, 0.18].forEach((d) => burst(ctx, out, t + d, 0.008, 5000, 0.35, "bandpass"));
  },
  // 2010: a notification pop.
  pop: (ctx, out) => {
    const t = ctx.currentTime;
    tone(ctx, out, t, 0.12, 880, 0.3, "sine", 440);
    tone(ctx, out, t + 0.09, 0.15, 1320, 0.2, "sine", 990);
  },
  // 2020: a video call's two-note join chime.
  "call-join": (ctx, out) => {
    const t = ctx.currentTime;
    tone(ctx, out, t, 0.35, 587.33, 0.2, "sine");
    tone(ctx, out, t + 0.16, 0.5, 880, 0.2, "sine");
  },
  // 2050: a rising synth whoosh.
  whoosh: (ctx, out) => {
    const t = ctx.currentTime;
    burst(ctx, out, t, 0.7, 900, 0.4, "lowpass");
    tone(ctx, out, t, 0.7, 220, 0.12, "sawtooth", 880);
    tone(ctx, out, t + 0.05, 0.7, 330, 0.08, "triangle", 1320);
  },
};

let sharedCtx: AudioContext | null = null;

function play(sound: string) {
  if (sound.includes(".")) {
    void new Audio(`${import.meta.env.BASE_URL}sounds/${sound}`).play().catch(() => undefined);
    return;
  }
  const preset = PRESETS[sound];
  if (!preset) return;
  sharedCtx ??= new AudioContext();
  const ctx = sharedCtx;
  void ctx.resume();
  const master = ctx.createGain();
  master.gain.value = 0.35;
  master.connect(ctx.destination);
  preset(ctx, master);
}

/** Plays the arriving era's sound whenever the committed year changes (never on first load). */
export function useEraSound(year: EraId, muted: boolean) {
  const previous = useRef(year);
  useEffect(() => {
    if (previous.current === year) return;
    previous.current = year;
    const sound = eraByYear[year].theme.sound;
    if (!muted && sound) {
      try {
        play(sound);
      } catch {
        // Audio is decorative; ignore browsers that refuse it.
      }
    }
  }, [year, muted]);
}
