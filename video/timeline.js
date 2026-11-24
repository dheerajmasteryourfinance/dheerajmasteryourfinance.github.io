// The video's fixed timing. Pure data plus seek(), so Node tests can import it.
export const DURATION = 60;
export const FPS = 30;

export const SCENES = [
  { id: 'open', start: 0, end: 4 },
  { id: 'problem', start: 4, end: 9 },
  { id: 'reveal', start: 9, end: 13 },
  { id: 'brief', start: 13, end: 22 },
  { id: 'story', start: 22, end: 30 },
  { id: 'site', start: 30, end: 40 },
  { id: 'followup', start: 40, end: 50 },
  { id: 'triad', start: 50, end: 55 },
  { id: 'end', start: 55, end: 60 },
];

// Every animation is a CSS animation whose delay is its absolute time in the film, so
// setting currentTime to t on each one shows exactly frame t, in any seek order.
// The list is captured on the first call (main.js seeks to 0 once everything is built, when
// every animation is still pending): Chrome drops finished, non-filling animations from
// getAnimations(), so a later lookup would miss them and an earlier scene could never return.
let all = null;
export function seek(t) {
  if (typeof document === 'undefined') return;
  const ms = Math.max(0, Math.min(DURATION, t)) * 1000;
  all ??= document.getAnimations();
  for (const a of all) {
    a.pause();
    a.currentTime = ms;
  }
}
