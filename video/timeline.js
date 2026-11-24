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
export function seek(t) {
  if (typeof document === 'undefined') return;
  const ms = Math.max(0, Math.min(DURATION, t)) * 1000;
  for (const a of document.getAnimations()) {
    a.pause();
    a.currentTime = ms;
  }
}
