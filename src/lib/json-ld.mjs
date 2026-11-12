// Serialise for an inline <script>. "<" becomes the six characters < so no
// value can ever close the script element early; JSON.parse reads it back unchanged.
export function safeJson(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
