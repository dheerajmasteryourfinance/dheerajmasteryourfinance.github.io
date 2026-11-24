// ffmpeg output arguments per deliverable. Input is a PNG stream on stdin (see render.mjs).
const H264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
const KINDS = {
  mp4: H264,
  square: H264,
  webm: ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p'],
};

export function encodeArgs(kind, { fps, size }) {
  const codec = KINDS[kind];
  if (!codec) throw new Error(`unknown output kind: ${kind}`);
  return [...codec, '-r', String(fps), '-s', size, '-an'];
}
