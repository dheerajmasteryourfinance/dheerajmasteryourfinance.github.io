import { describe, it, expect } from 'vitest';
import { searchEntries } from '../../src/scripts/search-core.js';

const E = (url, title, headings, text) => ({ url, title, headings, text });
const entries = [
  E('/docs/forms/', 'Forms and leads', ['1. Know the three kinds of form', '3. See your leads'], 'Webgnr sorts what visitors send into three kinds. Click Manage, then the Leads tab to see every message.'),
  E('/docs/domain/', 'Connect your domain', ['1. Attach the domain'], 'Add the records at your provider. Forms are not needed for this step.'),
  E('/docs/campaign/', 'Send a campaign', ['2. Write the email'], 'Pick your audience and send. Leads who unsubscribed are skipped.'),
];

describe('searchEntries', () => {
  it('returns nothing for an empty or symbol-only query', () => {
    expect(searchEntries(entries, '')).toEqual([]);
    expect(searchEntries(entries, '  ?! ')).toEqual([]);
  });

  it('ranks a title match above a text-only match', () => {
    const r = searchEntries(entries, 'forms');
    expect(r.map((x) => x.url)).toEqual(['/docs/forms/', '/docs/domain/']);
  });

  it('requires every word of the query to match', () => {
    expect(searchEntries(entries, 'leads campaign').map((x) => x.url)).toEqual(['/docs/campaign/']);
    expect(searchEntries(entries, 'leads banana')).toEqual([]);
  });

  it('matches word starts, so a stem finds longer words', () => {
    expect(searchEntries(entries, 'unsub').map((x) => x.url)).toEqual(['/docs/campaign/']);
    expect(searchEntries(entries, 'ads')).toEqual([]);
  });

  it('ignores case and accents', () => {
    const nl = [E('/nl/a/', 'Formulieren en leads', [], 'Verzamel berichten en zie elke lead. Café-eigenaren ook.')];
    expect(searchEntries(nl, 'FORMULIER')).toHaveLength(1);
    expect(searchEntries(nl, 'cafe')).toHaveLength(1);
  });

  it('builds an excerpt around the match with <mark> around the matched words', () => {
    const [r] = searchEntries(entries, 'manage');
    expect(r.excerpt).toContain('<mark>Manage</mark>');
    expect(r.title).toBe('Forms and leads');
  });

  it('escapes HTML in the excerpt so only <mark> is markup', () => {
    const evil = [E('/x/', 'T', [], 'Use <script>alert(1)</script> & the forms here')];
    const [r] = searchEntries(evil, 'forms');
    expect(r.excerpt).not.toContain('<script>');
    expect(r.excerpt).toContain('&lt;script&gt;');
    expect(r.excerpt).toContain('&amp;');
    expect(r.excerpt).toContain('<mark>forms</mark>');
  });

  it('falls back to the start of the text when only the title matches', () => {
    const t = [E('/y/', 'Domains', [], 'Totally different words in the body of this page.')];
    expect(searchEntries(t, 'domains')[0].excerpt.startsWith('Totally different')).toBe(true);
  });

  it('limits the number of results', () => {
    const many = Array.from({ length: 20 }, (_, i) => E(`/p${i}/`, `Page ${i}`, [], 'shared words'));
    expect(searchEntries(many, 'shared')).toHaveLength(8);
    expect(searchEntries(many, 'shared', 3)).toHaveLength(3);
  });
});
