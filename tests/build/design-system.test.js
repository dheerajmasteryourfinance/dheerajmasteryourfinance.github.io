import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers.js';

const ROOT = process.cwd();
const tokens = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8');

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const astroDir = join(ROOT, 'dist/_astro');
const css = existsSync(astroDir)
  ? walk(astroDir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
  : '';
const flat = css.replace(/\s+/g, '');

/** Split CSS into top-level blocks so rules inside @supports / @media can be told apart. */
function topLevelBlocks(src) {
  const blocks = [];
  let depth = 0, start = 0;
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { blocks.push(src.slice(start, i + 1)); start = i + 1; } }
  }
  return blocks;
}

describe('tokens', () => {
  it('uses the aqua accent', () => {
    expect(tokens).toMatch(/--accent:\s*#40E0F5/i);
    expect(tokens).toMatch(/--accent-hover:\s*#90F0FB/i);
    expect(tokens).toMatch(/--accent-deep:\s*#1EC0DC/i);
  });

  it('leaves no yellow anywhere in src/', () => {
    const files = walk(join(ROOT, 'src')).filter((f) => !f.includes(`${join('src', 'assets')}`) && /\.(css|astro|ts|js|mjs)$/.test(f));
    const hits = files.filter((f) => /#FFC93C|#F5BB22|rgba\(\s*255\s*,\s*201\s*,\s*60/i.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });
});

describe('built css', () => {
  it('exists', () => {
    expect(css.length).toBeGreaterThan(0);
  });

  it('only hides .rv/.lift outside @supports behind .js-reveal, with an .is-visible restore', () => {
    for (const block of topLevelBlocks(css.replace(/\s+/g, ' '))) {
      if (/^\s*@supports\s*\(animation-timeline/.test(block)) continue;
      if (/^\s*@media[^{]*prefers-reduced-motion/.test(block)) continue;
      const rules = block.match(/[^{}]+\{[^{}]*\}/g) ?? [];
      for (const rule of rules) {
        const [sel, body] = rule.split('{');
        if (!/(^|[\s,])\.(rv|lift)\b/.test(sel)) continue;
        if (/opacity:\s*0[;}\s]/.test(body)) expect(sel, rule).toMatch(/\.js-reveal/);
      }
    }
    expect(flat).toMatch(/\.js-reveal[^{]*\.is-visible[^{]*\{[^}]*opacity:1/);
  });

  it('never animates transform in the reveal keyframes', () => {
    for (const name of ['rvin', 'rvcard']) {
      const m = flat.match(new RegExp(`@keyframes${name}\\{(.*?\\})\\}`));
      expect(m, name).not.toBeNull();
      expect(m[1]).not.toMatch(/transform:/);
    }
  });

  it('turns every animation off for reduced motion', () => {
    const blocks = topLevelBlocks(css).filter((b) => /prefers-reduced-motion:\s*reduce/.test(b)).join(' ');
    for (const cls of ['.rv', '.blob', '.marq-track', '.pulse', '.drift', '.drift2']) {
      expect(blocks, cls).toContain(cls);
    }
    expect(blocks).toMatch(/animation:\s*none/);
  });

  it('clips sideways overflow and wraps long words in headings', () => {
    expect(flat).toMatch(/html,body\{[^}]*overflow-x:clip/);
    expect(flat).toMatch(/h1,h2,h3\{[^}]*overflow-wrap:(break-word|anywhere)/);
  });
});

describe('hidden attribute', () => {
  // The example filter hides cards with the hidden attribute. Component CSS gives cards display:flex/grid,
  // which beats the browser's [hidden] rule, so every page that can hide things needs a global
  // !important rule (found in the final review: the rule only existed in the Home page's CSS).
  const cssOf = (route) => {
    const doc = loadPage(route);
    const sheets = [...doc.querySelectorAll('link[rel="stylesheet"][href^="/"]')].map((l) => readFileSync(join(process.cwd(), 'dist', l.getAttribute('href')), 'utf8'));
    const inline = [...doc.querySelectorAll('style')].map((st) => st.textContent);
    return [...sheets, ...inline].join('\n').replace(/\s+/g, '');
  };
  it.each(['/examples/', '/nl/examples/'])('%s loads an unscoped [hidden] { display: none !important } rule', (route) => {
    expect(cssOf(route)).toMatch(/(^|[},])\[hidden\]\{display:none!important\}/);
  });
});
