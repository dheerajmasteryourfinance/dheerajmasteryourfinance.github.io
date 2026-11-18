// Dark mode toggle. The theme follows the system until the visitor picks one with the header button;
// the choice is kept in localStorage and applied before first paint by the inline script in Base.astro.
export type Theme = 'light' | 'dark';

export function currentTheme(root: Document = document): Theme {
  const set = root.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  const win = root.defaultView ?? window;
  return win.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function initThemeToggle(root: Document = document): () => void {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')];
  const sync = () => {
    const dark = currentTheme(root) === 'dark';
    for (const b of buttons) b.setAttribute('aria-pressed', String(dark));
  };
  const onClick = () => {
    const next: Theme = currentTheme(root) === 'dark' ? 'light' : 'dark';
    // Colour transitions would make the whole page fade between themes; switch instantly instead.
    root.documentElement.classList.add('theme-switching');
    root.documentElement.dataset.theme = next;
    setTimeout(() => root.documentElement.classList.remove('theme-switching'), 80);
    try { localStorage.setItem('theme', next); } catch { /* private mode or blocked: the choice lasts for this page only */ }
    sync();
  };
  for (const b of buttons) b.addEventListener('click', onClick);
  sync();
  return () => { for (const b of buttons) b.removeEventListener('click', onClick); };
}
