// An original 60 s music bed for the intro video, synthesised from scratch (no samples, no
// licensing). 120 BPM in F major, so every cut on the video's 0.5 s grid lands on a beat.
// Arrangement follows the storyboard: quiet open, tense problem, reveal hit, groove from 13 s,
// a lift at 30 s and 40 s, three hits on the triad cuts, a final chord that fades out by 60 s.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SR = 48000;
const LEN = 60 * SR;
const BEAT = 0.5;

const hz = m => 440 * 2 ** ((m - 69) / 12);
// Deterministic noise so every render is identical.
let seed = 1;
const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 31 - 1; };

// Chords (MIDI): F, C, Dm, Bb. Bass roots one octave below.
const CH = {
  F: { notes: [65, 69, 72], root: 41 }, C: { notes: [64, 67, 72], root: 36 },
  Dm: { notes: [62, 65, 69], root: 38 }, Bb: { notes: [62, 65, 70], root: 34 },
};
function chordAt(t) {
  if (t < 4) return t < 2 ? CH.F : CH.C;
  if (t < 9) return Math.floor((t - 4) / 2) % 2 ? CH.Bb : CH.Dm;
  return [CH.F, CH.C, CH.Dm, CH.Bb][Math.floor((t - 9) / 2) % 4];
}

export function compose() {
  seed = 1;
  const dry = [new Float32Array(LEN), new Float32Array(LEN)];
  const wet = [new Float32Array(LEN), new Float32Array(LEN)]; // reverb send
  const echo = [new Float32Array(LEN), new Float32Array(LEN)]; // dotted-eighth delay send

  const add = (t0, dur, fn, { pan = 0, gain = 1, rev = 0, dly = 0 } = {}) => {
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
    const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
    for (let i = 0; i < n && s0 + i < LEN; i++) {
      if (s0 + i < 0) continue;
      const v = fn(i / SR);
      dry[0][s0 + i] += v * gl; dry[1][s0 + i] += v * gr;
      if (rev) { wet[0][s0 + i] += v * gl * rev; wet[1][s0 + i] += v * gr * rev; }
      if (dly) { echo[0][s0 + i] += v * gl * dly; echo[1][s0 + i] += v * gr * dly; }
    }
  };

  // --- instruments ---
  const pad = (t0, dur, notes, amp, bright = 0.08) => notes.forEach((m, k) => {
    for (const det of [-0.0045, 0.0045]) {
      const f = hz(m) * (1 + det); let ph = k * 0.21, lp = 0;
      add(t0, dur + 1.2, t => {
        ph = (ph + f / SR) % 1;
        lp += bright * ((2 * ph - 1) - lp);
        const env = Math.min(1, t / 0.35) * (t > dur ? Math.exp(-(t - dur) * 4) : 1);
        return lp * env * amp;
      }, { pan: det > 0 ? 0.45 : -0.45, rev: 0.5 });
    }
  });
  const pluck = (t0, m, amp, pan = 0) => {
    const f = hz(m);
    add(t0, 0.9, t => (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t * 9))
      * Math.exp(-t * 6) * Math.min(1, t / 0.004) * amp, { pan, rev: 0.35, dly: 0.35 });
  };
  const kick = (t0, amp = 0.9) => {
    let ph = 0;
    add(t0, 0.45, t => { ph += (45 + 110 * Math.exp(-t * 28)) / SR; return Math.sin(2 * Math.PI * ph) * Math.exp(-t * 7.5) * amp; });
  };
  const clap = (t0, amp = 0.32) => {
    let a = 0, b = 0;
    add(t0, 0.3, t => {
      const x = noise(); a += 0.45 * (x - a); b += 0.08 * (a - b); // crude band-pass
      const bursts = [0, 0.011, 0.022].reduce((s, o) => s + (t >= o ? Math.exp(-(t - o) * (o < 0.02 ? 60 : 14)) : 0), 0);
      return (a - b) * bursts * amp;
    }, { rev: 0.4, pan: 0.05 });
  };
  const hat = (t0, amp = 0.09, pan = 0.25) => {
    let p = 0;
    add(t0, 0.06, t => { const x = noise(), y = x - p; p = x; return y * Math.exp(-t * 70) * amp; }, { pan });
  };
  const bass = (t0, dur, m, amp = 0.32) => {
    const f = hz(m);
    add(t0, dur, t => Math.tanh(1.6 * Math.sin(2 * Math.PI * f * t)) * Math.min(1, t / 0.006)
      * Math.min(1, (dur - t) / 0.03) * Math.exp(-t * 2.2) * amp);
  };
  const riser = (t0, t1, amp = 0.22) => {
    const d = t1 - t0; let lp = 0, ph = 0;
    add(t0, d, t => {
      const k = t / d; lp += (0.01 + 0.35 * k * k) * (noise() - lp);
      ph += (200 + 900 * k * k) / SR;
      return (lp * 1.4 + 0.25 * Math.sin(2 * Math.PI * ph)) * k * k * amp;
    }, { rev: 0.5 });
  };
  const fall = (t0, amp = 0.16) => {
    let ph = 0;
    add(t0, 1.2, t => { ph += (900 * Math.exp(-t * 2.6) + 60) / SR; return Math.sin(2 * Math.PI * ph) * Math.exp(-t * 2.2) * amp; }, { rev: 0.6, pan: -0.2 });
  };
  const impact = (t0, amp = 0.8) => {
    let ph = 0, lp = 0;
    add(t0, 2.2, t => {
      ph += (38 + 60 * Math.exp(-t * 12)) / SR; lp += 0.05 * (noise() - lp);
      return (Math.sin(2 * Math.PI * ph) * Math.exp(-t * 2.4) + lp * 3 * Math.exp(-t * 9)) * amp;
    }, { rev: 0.7 });
  };
  const crash = (t0, amp = 0.12) => {
    let p = 0;
    add(t0, 2.5, t => { const x = noise(), y = x - p; p = x; return y * Math.exp(-t * 2.2) * amp; }, { rev: 0.4, pan: -0.15 });
  };

  // --- arrangement ---
  // 0-4 open: soft pad and a gentle pluck on each beat.
  pad(0, 2, CH.F.notes, 0.05, 0.04); pad(2, 2, CH.C.notes, 0.05, 0.04);
  for (let t = 0.5; t < 4; t += BEAT) pluck(t, chordAt(t).notes[Math.round(t / BEAT) % 3] + 12, 0.11, (Math.round(t / BEAT) % 2) ? 0.3 : -0.3);
  // 4-9 problem: darker pad, a ticking clock, a falling sweep as the template collapses.
  pad(4, 2, CH.Dm.notes, 0.055, 0.03); pad(6, 2, CH.Bb.notes, 0.055, 0.03); pad(8, 1, CH.Dm.notes, 0.05, 0.03);
  for (let t = 4; t < 8.9; t += BEAT / 2) hat(t, 0.045, (Math.round(t * 4) % 2) ? 0.4 : -0.4);
  fall(6.0);
  riser(8.0, 9.0, 0.18);
  // 9-13 reveal: a hit on the cut, a bigger one as the logo lands, a rising arpeggio.
  impact(9.0, 0.45); impact(10.3, 0.75); crash(10.3, 0.1);
  for (let t = 9; t < 13; t += 2) pad(t, 2, chordAt(t).notes, 0.065, 0.06);
  for (let t = 10.5; t < 13; t += BEAT / 2) { const c = chordAt(t).notes, i = Math.round(t * 4) % 4; pluck(t, (c[i % 3] ?? c[0]) + (i === 3 ? 24 : 12), 0.08, i % 2 ? 0.35 : -0.35); }
  riser(12.0, 13.0, 0.14);

  // 13-49.75 groove. Lifts at 22, 30 and 40.
  for (let t = 13; t < 49.75; t += BEAT) {
    const beat = Math.round(t / BEAT) % 4, c = chordAt(t);
    kick(t, 0.85);
    if (beat === 1 || beat === 3) clap(t);
    hat(t + BEAT / 2, 0.08);
    if (t >= 40) hat(t + BEAT / 4, 0.04, -0.3), hat(t + 3 * BEAT / 4, 0.04, -0.3);
    bass(t, BEAT * 0.45, c.root, 0.3); bass(t + BEAT / 2, BEAT * 0.4, c.root + 12, 0.16);
    for (let k = 0; k < 2; k++) {
      const tt = t + k * BEAT / 2, i = (beat * 2 + k) % 4;
      pluck(tt, c.notes[i % 3] + 12 + (i === 3 ? 12 : 0), t >= 30 ? 0.085 : 0.07, i % 2 ? 0.35 : -0.35);
      if (t >= 30) pluck(tt + 0.002, c.notes[(i + 1) % 3] + 24, 0.035, i % 2 ? -0.5 : 0.5);
    }
  }
  for (let t = 13; t < 49; t += 2) pad(t, 2, chordAt(t).notes, t >= 30 ? 0.06 : 0.05, t >= 40 ? 0.1 : 0.07);
  crash(22, 0.1); crash(30, 0.12); crash(40, 0.13);
  riser(48.6, 49.75, 0.2);

  // 50-55 triad: silence, then a big hit on each hard cut.
  [[50, CH.F], [51.5, CH.Dm], [53, CH.C]].forEach(([t, c]) => {
    impact(t, 0.95); kick(t, 0.9); crash(t, 0.09);
    pad(t, 0.9, c.notes.map(m => m - 12).concat(c.notes), 0.075, 0.12);
    bass(t, 1.0, c.root, 0.34);
  });
  riser(54.2, 55.0, 0.16);

  // 55-60 end card: the home chord rings out, a few sparkles, then silence for the loop.
  impact(55, 0.6); kick(55, 0.8);
  pad(55, 2.2, [53, 57, 60, 65, 69, 72], 0.06, 0.08); bass(55, 2.5, 41, 0.3);
  [77, 76, 72, 69].forEach((m, i) => pluck(55.25 + i * 0.25, m, 0.06, i % 2 ? 0.4 : -0.4));

  // --- effects and master ---
  const out = [new Float32Array(LEN), new Float32Array(LEN)];
  for (const ch of [0, 1]) {
    const combs = [1557, 1617, 1491, 1422].map(d => ({ buf: new Float32Array(d + ch * 23), i: 0, lp: 0 }));
    const aps = [225, 556].map(d => ({ buf: new Float32Array(d + ch * 7), i: 0 }));
    const dl = Math.round(0.375 * SR), dbuf = new Float32Array(dl); let di = 0;
    for (let n = 0; n < LEN; n++) {
      let r = 0;
      for (const c of combs) { const y = c.buf[c.i]; c.lp += 0.25 * (y - c.lp); c.buf[c.i] = wet[ch][n] + c.lp * 0.8; c.i = (c.i + 1) % c.buf.length; r += y; }
      r *= 0.25;
      for (const a of aps) { const y = a.buf[a.i]; const x = r + y * -0.5; a.buf[a.i] = x; a.i = (a.i + 1) % a.buf.length; r = y + x * 0.5; }
      // Ping-pong-ish: each side feeds from the other side's send.
      const e = dbuf[di]; dbuf[di] = echo[1 - ch][n] + e * 0.35; di = (di + 1) % dl;
      out[ch][n] = dry[ch][n] + r * 0.6 + e * 0.5;
    }
  }
  // Fades and soft clip, then normalise the peak to 0.95.
  let peak = 0;
  for (let n = 0; n < LEN; n++) {
    const t = n / SR;
    const env = Math.min(1, t / 0.05) * (t < 58.3 ? 1 : Math.max(0, 1 - (t - 58.3) / 1.5) ** 2);
    for (const ch of [0, 1]) { const v = Math.tanh(out[ch][n] * 1.1) * env; out[ch][n] = v; peak = Math.max(peak, Math.abs(v)); }
  }
  const g = 0.95 / peak;
  for (const ch of [0, 1]) for (let n = 0; n < LEN; n++) out[ch][n] *= g;
  return { left: out[0], right: out[1] };
}

export function toWav(left, right) {
  const n = left.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0, 'ascii'); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8, 'ascii');
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36, 'ascii'); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), 46 + i * 4);
  }
  return buf;
}

// node video/audio/compose.mjs [out.wav]
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const outFile = process.argv[2] || fileURLToPath(new URL('../out/webgnr-intro-music.wav', import.meta.url));
  const { left, right } = compose();
  writeFileSync(outFile, toWav(left, right));
  console.log(outFile);
}
