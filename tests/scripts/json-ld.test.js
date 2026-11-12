import { describe, it, expect } from 'vitest';
import { safeJson } from '../../src/lib/json-ld.mjs';

describe('safeJson', () => {
  it('escapes < so a value cannot close the script element', () => {
    const out = safeJson({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('<');
    expect(out).toContain('\\u003c/script>');
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>');
  });
});
