import { describe, test, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const OUT = 'video/out';
const rendered = existsSync(`${OUT}/webgnr-intro-en-1080p.mp4`);
const probe = f => JSON.parse(execFileSync(process.env.FFPROBE || 'ffprobe',
  ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', f]).toString());

describe.skipIf(!rendered)('rendered files', () => {
  for (const lang of ['en', 'nl']) {
    test(`${lang} 1080p mp4: 60 s, 1920x1080, 30 fps, yuv420p, silent, under 8 MB`, () => {
      const f = `${OUT}/webgnr-intro-${lang}-1080p.mp4`, p = probe(f);
      const v = p.streams.find(s => s.codec_type === 'video');
      expect(Math.abs(Number(p.format.duration) - 60)).toBeLessThan(0.05);
      expect([v.width, v.height]).toEqual([1920, 1080]);
      expect(v.r_frame_rate).toBe('30/1');
      expect(v.pix_fmt).toBe('yuv420p');
      expect(v.codec_name).toBe('h264');
      expect(p.streams.some(s => s.codec_type === 'audio')).toBe(false);
      expect(statSync(f).size).toBeLessThan(8 * 1024 * 1024);
    });
    test(`${lang} webm is vp9 1920x1080`, () => {
      const v = probe(`${OUT}/webgnr-intro-${lang}-1080p.webm`).streams.find(s => s.codec_type === 'video');
      expect(v.codec_name).toBe('vp9');
      expect([v.width, v.height]).toEqual([1920, 1080]);
    });
    test(`${lang} square mp4 is 1080x1080 and 60 s`, () => {
      const p = probe(`${OUT}/webgnr-intro-${lang}-square.mp4`);
      const v = p.streams.find(s => s.codec_type === 'video');
      expect([v.width, v.height]).toEqual([1080, 1080]);
      expect(Math.abs(Number(p.format.duration) - 60)).toBeLessThan(0.05);
    });
    test(`${lang} poster exists`, () => expect(statSync(`${OUT}/webgnr-intro-${lang}-poster.webp`).size).toBeGreaterThan(1000));
  }
});
