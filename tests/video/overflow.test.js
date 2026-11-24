import { describe, test, expect } from 'vitest';
import { findBrowser, openStage } from '../../video/lib/browser.mjs';

// Settled moments: after each scene's entrances, before its exit.
const MOMENTS = [3.2, 8.6, 12.6, 20.8, 29.5, 39.6, 49.3, 51.2, 52.7, 54.6, 59.5];
const CASES = [['en', 'wide'], ['en', 'square'], ['nl', 'wide'], ['nl', 'square']];

describe.skipIf(!findBrowser())('layout', () => {
  test.each(CASES)('%s %s: no copy clips or leaves the frame', async (lang, format) => {
    const stage = await openStage({ lang, format });
    try {
      for (const t of MOMENTS) {
        await stage.seek(t);
        const bad = await stage.page.evaluate(() => {
          const W = innerWidth, H = innerHeight, out = [];
          for (const el of document.querySelectorAll('[data-copy]')) {
            if (el.closest('.wire')) continue; // the falling template is decorative and meant to leave the frame
            if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
            const r = el.getBoundingClientRect();
            if (!r.width) continue;
            if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > H + 1) out.push(`${el.dataset.copy} outside frame`);
            const cs = getComputedStyle(el);
            if (cs.display !== 'inline' && (el.scrollWidth > el.clientWidth + 1)) out.push(`${el.dataset.copy} clipped`);
          }
          return out;
        });
        expect(bad, `t=${t}`).toEqual([]);
      }
    } finally { await stage.close(); }
  }, 120000);

  test('outro copy is on stage', async () => {
    const stage = await openStage();
    try {
      const keys = await stage.page.evaluate(() => [...document.querySelectorAll('[data-copy]')].map(e => e.dataset.copy));
      for (const k of ['followup.caption', 'followup.contactName', 'followup.tag', 'followup.emails.0', 'followup.chartLabel',
        'triad.0', 'triad.1', 'triad.2', 'end.cta', 'end.url']) expect(keys).toContain(k);
    } finally { await stage.close(); }
  }, 60000);

  test('loop seam: at t=0 only the opening scene is visible', async () => {
    const stage = await openStage();
    try {
      await stage.seek(0);
      const visible = await stage.page.evaluate(() => [...document.querySelectorAll('.scene')]
        .filter(s => getComputedStyle(s).opacity !== '0').map(s => s.dataset.scene));
      expect(visible).toEqual(['open']);
    } finally { await stage.close(); }
  }, 60000);
});
