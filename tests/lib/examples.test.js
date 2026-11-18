import { describe, it, expect, vi } from 'vitest';

// Images are Astro assets; outside Astro an import resolves to a stand-in object.
vi.mock('../../src/assets/examples/ex-tea.jpg', () => ({ default: { src: 'tea' } }));
vi.mock('../../src/assets/examples/ex-garden.jpg', () => ({ default: { src: 'garden' } }));
vi.mock('../../src/assets/examples/ex-heatpump.jpg', () => ({ default: { src: 'heatpump' } }));
vi.mock('../../src/assets/examples/ex-physio.jpg', () => ({ default: { src: 'physio' } }));
vi.mock('../../src/assets/screens/site-desktop.png', () => ({ default: { src: 'greenleaf' } }));

const { EXAMPLES, TRADE_KEYS } = await import('../../src/lib/examples.ts');

describe('EXAMPLES', () => {
  it('has the five example sites with unique ids', () => {
    expect(EXAMPLES.map((e) => e.id)).toEqual(['greenleaf', 'tea', 'garden', 'heatpump', 'physio']);
  });

  it('gives every image alt text in both languages', () => {
    for (const e of EXAMPLES) {
      expect(e.alt.en.trim(), e.id).not.toBe('');
      expect(e.alt.nl.trim(), e.id).not.toBe('');
    }
  });

  it('never shows the TEST prefix from the app', () => {
    for (const e of EXAMPLES) expect(e.name).not.toMatch(/TEST/);
  });

  it('uses only the five trade keys', () => {
    expect(TRADE_KEYS).toEqual(['bakery', 'restaurant', 'coach', 'agency', 'local']);
    for (const e of EXAMPLES) expect(TRADE_KEYS).toContain(e.tradeKey);
  });

  it('marks GreenLeaf as Dutch, French and German', () => {
    expect(EXAMPLES.find((e) => e.id === 'greenleaf').langs).toEqual(['nl', 'fr', 'de']);
  });
});
