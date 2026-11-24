import { test, expect } from 'vitest';
import en from '../../video/copy.en.json' with { type: 'json' };
import nl from '../../video/copy.nl.json' with { type: 'json' };

const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) =>
  v && typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]);
const get = (o, k) => k.split('.').reduce((x, part) => x[part], o);

test('EN and NL have identical keys', () => expect(keys(nl).sort()).toEqual(keys(en).sort()));

test('no empty strings', () => {
  for (const [lang, obj] of [['en', en], ['nl', nl]]) {
    for (const k of keys(obj)) expect(String(get(obj, k)).trim(), `${lang}:${k}`).not.toBe('');
  }
});

test('end CTA matches the site trial button', () => {
  expect(en.end.cta).toBe('Start your free 14-day trial');
  expect(nl.end.cta).toBe('Start je gratis proefperiode van 14 dagen');
});

test('triad matches the hero H1', () => {
  expect(en.triad).toEqual(['Get found.', 'Get signed up.', 'Follow up.']);
  expect(nl.triad).toEqual(['Word gevonden.', 'Krijg aanmeldingen.', 'Volg op.']);
});

test('no pricing, card or testimonial claims', () => expect(JSON.stringify([en, nl]))
  .not.toMatch(/price|prijs|€|\$|no card|geen creditcard|testimonial/i));
