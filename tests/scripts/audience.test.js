// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { initAudienceSwitch } from '../../src/scripts/audience.js';

let root;
const biz = () => root.querySelectorAll('[data-audience="business"]');
const agency = () => root.querySelectorAll('[data-audience="agency"]');
const btn = (k) => root.querySelector(`[data-audience-btn="${k}"]`);

beforeEach(() => {
  document.body.innerHTML = `
    <div id="root">
      <button type="button" data-audience-btn="business" aria-pressed="true">For businesses</button>
      <button type="button" data-audience-btn="agency" aria-pressed="false">For agencies</button>
      <div data-audience="business">B1</div>
      <div data-audience="agency" hidden>A1</div>
      <div data-audience="business">B2</div>
      <div data-audience="agency" hidden>A2</div>
    </div>`;
  root = document.getElementById('root');
  initAudienceSwitch(root);
});

describe('initAudienceSwitch', () => {
  it('clicking agency shows agency blocks, hides business, sets aria-pressed', () => {
    btn('agency').click();
    agency().forEach((e) => expect(e.hidden).toBe(false));
    biz().forEach((e) => expect(e.hidden).toBe(true));
    expect(btn('agency').getAttribute('aria-pressed')).toBe('true');
    expect(btn('business').getAttribute('aria-pressed')).toBe('false');
  });

  it('clicking business restores the initial state', () => {
    btn('agency').click();
    btn('business').click();
    biz().forEach((e) => expect(e.hidden).toBe(false));
    agency().forEach((e) => expect(e.hidden).toBe(true));
    expect(btn('business').getAttribute('aria-pressed')).toBe('true');
    expect(btn('agency').getAttribute('aria-pressed')).toBe('false');
  });

  it('works for a keyboard-activated native button (Enter dispatches a click)', () => {
    const b = btn('agency');
    b.focus();
    expect(document.activeElement).toBe(b);
    expect(b.tagName).toBe('BUTTON');
    b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(b.getAttribute('aria-pressed')).toBe('true');
  });
});
