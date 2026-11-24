import { test, expect } from 'vitest';
import { encodeArgs } from '../../video/lib/encode.mjs';

test('mp4 is h264 yuv420p faststart with no audio', () => {
  const a = encodeArgs('mp4', { fps: 30, size: '1920x1080' }).join(' ');
  expect(a).toMatch(/-c:v libx264/);
  expect(a).toMatch(/-pix_fmt yuv420p/);
  expect(a).toMatch(/-movflags \+faststart/);
  expect(a).toMatch(/-an/);
});

test('webm is vp9 with no audio', () => {
  const a = encodeArgs('webm', { fps: 30, size: '1920x1080' }).join(' ');
  expect(a).toMatch(/libvpx-vp9/);
  expect(a).toMatch(/-an/);
});

test('square is h264 at its own size', () => {
  const a = encodeArgs('square', { fps: 30, size: '1080x1080' }).join(' ');
  expect(a).toMatch(/libx264/);
  expect(a).toMatch(/-s 1080x1080/);
});

test('unknown kind throws', () => expect(() => encodeArgs('gif', { fps: 30, size: '1x1' })).toThrow());
