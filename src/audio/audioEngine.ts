import { Howl, Howler } from 'howler';
import type { MotifNote } from '../data/content';

// ─────────────────────────────────────────────────────────────────────────────
// ENGINE DE ÁUDIO 100% PROCEDURAL
// - Trilha ambiente global gerada em runtime (WAV → Howler)
// - Pads espaciais por sala (Web Audio + panner)
// - Efeitos de interface (hover, clique, porta, descoberta)
// - Sintetizador de motivos musicais dos painéis
// ─────────────────────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientHowl: Howl | null = null;
let started = false;
let muted = false;

const roomPanners = new Map<string, { panner: PannerNode; gain: GainNode; oscs: OscillatorNode[] }>();

function audioCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

// ── Gera um WAV (PCM 16 bits) a partir de amostras float ──────────────────────
function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

// ── Trilha ambiente: pad evolutivo de ~24 s em loop ───────────────────────────
function generateAmbientTrack(): Blob {
  const sr = 22050;
  const dur = 24;
  const len = sr * dur;
  const out = new Float32Array(len);
  const chords = [
    [110.0, 164.81, 261.63, 329.63], // Am
    [87.31, 130.81, 220.0, 329.63], // F
    [98.0, 146.83, 246.94, 293.66], // G
    [110.0, 164.81, 261.63, 392.0], // Am7
  ];
  const chordLen = dur / chords.length;
  for (let c = 0; c < chords.length; c++) {
    const start = Math.floor(c * chordLen * sr);
    const end = Math.floor((c + 1) * chordLen * sr);
    for (let i = start; i < end; i++) {
      const t = i / sr;
      const local = (i - start) / (end - start);
      const fade = Math.min(local * 4, 1, (1 - local) * 4); // crossfade suave
      let v = 0;
      chords[c].forEach((f, idx) => {
        const lfo = 0.75 + 0.25 * Math.sin(2 * Math.PI * (0.08 + idx * 0.03) * t + idx);
        v += Math.sin(2 * Math.PI * f * t + idx * 0.5) * 0.06 * lfo;
        v += Math.sin(2 * Math.PI * f * 2.005 * t) * 0.015 * lfo; // brilho de oitava
      });
      out[i] += v * fade;
    }
  }
  return encodeWav(out, sr);
}

// ── Inicializa tudo (chamar após gesto do usuário) ────────────────────────────
export function startAudio(): void {
  if (started) return;
  started = true;
  const ac = audioCtx();
  if (ac.state === 'suspended') void ac.resume();

  const url = URL.createObjectURL(generateAmbientTrack());
  ambientHowl = new Howl({ src: [url], format: ['wav'], loop: true, volume: 0.5, html5: false });
  ambientHowl.play();
  applyMute();
}

export function audioStarted(): boolean {
  return started;
}

export function setMuted(m: boolean): void {
  muted = m;
  applyMute();
}

function applyMute(): void {
  Howler.volume(muted ? 0 : 1);
  if (masterGain) masterGain.gain.value = muted ? 0 : 0.8;
}

// ── Pads espaciais por sala ───────────────────────────────────────────────────
const ROOM_CHORDS: Record<string, number[]> = {
  hall: [130.81, 196.0, 261.63, 329.63],
  origem: [146.83, 220.0, 293.66],
  historia: [130.81, 164.81, 196.0],
  evolucao: [164.81, 246.94, 329.63],
  caracteristicas: [174.61, 261.63, 349.23],
  compositores: [196.0, 246.94, 293.66],
  exemplos: [146.83, 174.61, 220.0],
  curiosidades: [164.81, 207.65, 246.94],
  importancia: [130.81, 196.0, 246.94],
  conclusao: [110.0, 164.81, 220.0, 277.18],
};

export function createRoomPad(roomId: string, x: number, y: number, z: number): void {
  if (!started || roomPanners.has(roomId)) return;
  const ac = audioCtx();
  const freqs = ROOM_CHORDS[roomId] ?? ROOM_CHORDS.hall;

  const panner = ac.createPanner();
  panner.panningModel = 'equalpower';
  panner.distanceModel = 'inverse';
  panner.refDistance = 3;
  panner.maxDistance = 40;
  panner.rolloffFactor = 1.2;
  panner.positionX.value = x;
  panner.positionY.value = y;
  panner.positionZ.value = z;

  const gain = ac.createGain();
  gain.gain.value = 0.05;

  const oscs: OscillatorNode[] = [];
  freqs.forEach((f, i) => {
    const osc = ac.createOscillator();
    osc.type = i === 0 ? 'triangle' : 'sine';
    osc.frequency.value = f;
    const g = ac.createGain();
    g.gain.value = 1 / freqs.length;
    osc.connect(g).connect(gain);
    osc.start();
    oscs.push(osc);
  });

  gain.connect(panner).connect(masterGain!);
  roomPanners.set(roomId, { panner, gain, oscs });
}

// ── Atualiza a posição do ouvinte (a cada frame) ──────────────────────────────
export function updateListener(px: number, py: number, pz: number, fx: number, fz: number): void {
  if (!ctx || !started) return;
  const l = ctx.listener;
  if ('positionX' in l) {
    l.positionX.value = px; l.positionY.value = py; l.positionZ.value = pz;
    l.forwardX.value = fx; l.forwardY.value = 0; l.forwardZ.value = fz;
    l.upX.value = 0; l.upY.value = 1; l.upZ.value = 0;
  } else {
    // Navegadores antigos
    (l as unknown as { setPosition: (x: number, y: number, z: number) => void }).setPosition(px, py, pz);
    (l as unknown as { setOrientation: (x: number, y: number, z: number, ux: number, uy: number, uz: number) => void }).setOrientation(fx, 0, fz, 0, 1, 0);
  }
}

// ── Efeitos sonoros de interface ──────────────────────────────────────────────
function blip(freq: number, dur: number, type: OscillatorType, vol: number, slide = 0): void {
  if (!started || muted) return;
  const ac = audioCtx();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  if (slide !== 0) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), ac.currentTime + dur);
  g.gain.setValueAtTime(vol, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(g).connect(masterGain!);
  osc.start();
  osc.stop(ac.currentTime + dur + 0.02);
}

export const sfx = {
  hover: () => blip(880, 0.06, 'sine', 0.05),
  click: () => blip(520, 0.12, 'triangle', 0.12, 240),
  open: () => { blip(392, 0.18, 'sine', 0.1, 392); blip(784, 0.25, 'sine', 0.06, 200); },
  close: () => blip(660, 0.15, 'sine', 0.08, -300),
  door: () => {
    if (!started || muted) return;
    const ac = audioCtx();
    const dur = 0.5;
    const buffer = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2400, ac.currentTime + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.12, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    src.connect(filter).connect(g).connect(masterGain!);
    src.start();
  },
  discover: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      window.setTimeout(() => blip(f, 0.35, 'sine', 0.09), i * 90),
    );
  },
};

// ── Sintetizador de motivos dos painéis ───────────────────────────────────────
let motifStop: (() => void) | null = null;

export function playMotif(notes: MotifNote[]): void {
  if (!started || muted) return;
  stopMotif();
  const ac = audioCtx();
  const g = ac.createGain();
  g.gain.value = 0.22;
  // Eco simples para dar profundidade
  const delay = ac.createDelay(0.6);
  delay.delayTime.value = 0.28;
  const feedback = ac.createGain();
  feedback.gain.value = 0.25;
  delay.connect(feedback).connect(delay);
  g.connect(masterGain!);
  g.connect(delay).connect(masterGain!);

  const oscs: OscillatorNode[] = [];
  const now = ac.currentTime + 0.05;
  notes.forEach((n) => {
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = n.freq;
    const env = ac.createGain();
    env.gain.setValueAtTime(0, now + n.time);
    env.gain.linearRampToValueAtTime(1, now + n.time + 0.03);
    env.gain.setValueAtTime(1, now + n.time + Math.max(0.03, n.dur - 0.08));
    env.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur + 0.15);
    osc.connect(env).connect(g);
    osc.start(now + n.time);
    osc.stop(now + n.time + n.dur + 0.2);
    oscs.push(osc);
  });
  const total = Math.max(...notes.map((n) => n.time + n.dur)) + 0.4;
  const timeout = window.setTimeout(() => stopMotif(), total * 1000);
  motifStop = () => {
    window.clearTimeout(timeout);
    oscs.forEach((o) => { try { o.stop(); } catch { /* já parado */ } });
    g.disconnect();
  };
}

export function stopMotif(): void {
  if (motifStop) { motifStop(); motifStop = null; }
}
