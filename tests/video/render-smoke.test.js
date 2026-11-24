import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { findBrowser, openStage } from '../../video/lib/browser.mjs';

describe.skipIf(!findBrowser())('render smoke', () => {
  let stage; const requests = [];
  beforeAll(async () => {
    stage = await openStage({ lang: 'en', format: 'wide', onRequest: u => requests.push(u) });
  }, 60000);
  afterAll(() => stage?.close());

  test('heading font is loaded before capture', async () => {
    expect(await stage.page.evaluate(() => document.fonts.check('800 48px "Bricolage Grotesque Variable"'))).toBe(true);
  });

  test('seek is pure: 50 then 20 equals a fresh 20', async () => {
    await stage.seek(20); const fresh = await stage.shot();
    await stage.seek(50); await stage.seek(20); const back = await stage.shot();
    expect(Buffer.compare(fresh, back)).toBe(0);
  }, 30000);

  test('only the local server is requested', () => {
    expect(requests.length).toBeGreaterThan(0);
    for (const u of requests) expect(u.startsWith(stage.origin), u).toBe(true);
  });
});
