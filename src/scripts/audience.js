/**
 * Audience switch: toggles business/agency copy blocks.
 * Without JS the HTML ships business visible, agency `hidden`.
 */
export function initAudienceSwitch(root) {
  const buttons = [...root.querySelectorAll('[data-audience-btn]')];
  const blocks = [...root.querySelectorAll('[data-audience]')];
  const select = (which) => {
    for (const b of buttons) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-audience-btn') === which));
    }
    for (const el of blocks) {
      el.hidden = el.getAttribute('data-audience') !== which;
    }
  };
  for (const b of buttons) {
    b.addEventListener('click', () => select(b.getAttribute('data-audience-btn')));
  }
}
