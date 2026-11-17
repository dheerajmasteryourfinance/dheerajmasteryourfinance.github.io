// Scroll-reveal fallback for browsers without scroll-driven animations (Safari, Firefox).
// Browsers with `animation-timeline: view()` are handled entirely by motion.css.

const TARGETS = '.rv, .lift, .stopcard, .reveal-item';

/** Reveal targets as they scroll into view. Returns a cleanup function. */
export function initReveal(root: Document = document): () => void {
  const supportsTimeline = typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'view()');
  const reduced = root.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (supportsTimeline || reduced || typeof IntersectionObserver === 'undefined') return () => {};

  root.documentElement.classList.add('js-reveal');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  root.querySelectorAll(TARGETS).forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}
