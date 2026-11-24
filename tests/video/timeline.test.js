import { test, expect } from 'vitest';
import { SCENES, DURATION, FPS } from '../../video/timeline.js';

test('60 s at 30 fps', () => { expect(DURATION).toBe(60); expect(FPS).toBe(30); });

test('scenes contiguous, ordered, cover 0..60', () => {
  expect(SCENES.map(s => s.id)).toEqual(['open', 'problem', 'reveal', 'brief', 'story', 'site', 'followup', 'triad', 'end']);
  expect(SCENES[0].start).toBe(0);
  expect(SCENES.at(-1).end).toBe(60);
  SCENES.forEach((s, i) => { if (i) expect(s.start).toBe(SCENES[i - 1].end); });
});

test('boundaries on the 0.5 s grid', () => SCENES.forEach(s => {
  expect((s.start * 2) % 1).toBe(0);
  expect((s.end * 2) % 1).toBe(0);
}));
