// Adds the music bed to each rendered silent MP4, writing *-music.mp4 next to it.
// The silent files stay as they are: the Home page autoplays muted and uses those.
//   node video/audio/mux.mjs [path/to/track.wav]   (default: the composed track)
import { existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { compose, toWav } from './compose.mjs';

const OUT = fileURLToPath(new URL('../out/', import.meta.url));
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

let track = process.argv[2];
if (!track) {
  track = `${OUT}webgnr-intro-music.wav`;
  const { left, right } = compose();
  writeFileSync(track, toWav(left, right));
}

for (const lang of ['en', 'nl']) for (const kind of ['1080p', 'square']) {
  const video = `${OUT}webgnr-intro-${lang}-${kind}.mp4`;
  if (!existsSync(video)) { console.log(`skip (not rendered): ${video}`); continue; }
  const out = `${OUT}webgnr-intro-${lang}-${kind}-music.mp4`;
  execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-i', track,
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2',
    '-t', '60', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log(out);
}
