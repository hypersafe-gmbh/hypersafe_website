import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, readBuiltCss } from './helpers.mjs';

test('head has spec title and description', () => {
  const html = readPage();
  assert.match(html, /<title>HyperSafe: security consulting &(amp;)? engineering<\/title>/);
  assert.ok(html.includes('content="HyperSafe is a security consulting and engineering firm in Geneva, specialised in Web3 and AI security."'));
  assert.equal((html.match(/name="description"/g) || []).length, 1);
});

test('flowbite is gone', () => {
  assert.ok(!readPage().includes('flowbite'));
});

test('built css disables motion under reduced motion', () => {
  const css = readBuiltCss();
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@keyframes\s+marquee/);
});
