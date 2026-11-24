import { test, expect } from 'vitest';
import { compose, SR, toWav } from '../../video/audio/compose.mjs';

const { left, right } = compose();
const rms = (a, from, to) => { let s = 0; for (let i = from * SR; i < to * SR; i++) s += a[i] * a[i]; return Math.sqrt(s / ((to - from) * SR)); };

test('exactly 60 s, stereo', () => {
  expect(left.length).toBe(60 * SR);
  expect(right.length).toBe(60 * SR);
});

test('never clips', () => {
  let peak = 0; for (const a of [left, right]) for (const v of a) peak = Math.max(peak, Math.abs(v));
  expect(peak).toBeLessThanOrEqual(0.98);
  expect(peak).toBeGreaterThan(0.5);
});

test('builds: the groove (13-30 s) is louder than the quiet open (0-4 s)', () => {
  expect(rms(left, 13, 30)).toBeGreaterThan(rms(left, 0, 4) * 1.5);
});

test('hits land on the triad cuts', () => {
  for (const t of [50, 51.5, 53]) expect(rms(left, t, t + 0.12)).toBeGreaterThan(rms(left, t - 0.25, t - 0.05) * 1.3);
});

test('fades to near silence so the loop restarts cleanly', () => {
  expect(rms(left, 59.8, 60)).toBeLessThan(0.01);
});

test('wav header is 48 kHz 16-bit stereo', () => {
  const buf = toWav(left, right);
  expect(buf.toString('ascii', 0, 4)).toBe('RIFF');
  expect(buf.readUInt16LE(22)).toBe(2);
  expect(buf.readUInt32LE(24)).toBe(48000);
  expect(buf.readUInt16LE(34)).toBe(16);
  expect(buf.length).toBe(44 + 60 * 48000 * 4);
});
