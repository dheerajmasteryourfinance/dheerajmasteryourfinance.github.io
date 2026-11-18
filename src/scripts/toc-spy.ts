// "On this page" scroll-spy: marks the contents link of the section being read with aria-current="true".
// The current section is the last heading whose top has passed 30% of the viewport height.
// Without JS the list is still a working set of links to every heading.
export function initTocSpy(root: Document = document): () => void {
  const toc = root.querySelector('.toc');
  if (!toc) return () => {};
  const heads = [...root.querySelectorAll<HTMLElement>('main h2[id]')];
  const links = new Map<string, HTMLAnchorElement>();
  for (const a of toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) links.set(a.getAttribute('href')!.slice(1), a);
  if (!heads.length || !links.size) return () => {};

  const win = root.defaultView ?? window;
  let ticking = false;

  const update = () => {
    ticking = false;
    const line = win.innerHeight * 0.3;
    let active = heads[0];
    for (const h of heads) {
      if (h.getBoundingClientRect().top <= line) active = h;
      else break;
    }
    for (const [id, a] of links) {
      if (id === active.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(update);
  };

  update();
  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onScroll, { passive: true });
  return () => {
    win.removeEventListener('scroll', onScroll);
    win.removeEventListener('resize', onScroll);
  };
}
