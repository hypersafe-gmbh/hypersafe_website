import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, readBuiltCss, readBuiltJs } from './helpers.mjs';

// Removes `@media (...) { ... }` blocks whose query matches `pattern`, honouring nested braces.
function stripMedia(css, pattern) {
  let out = '';
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf('@media', i);
    if (at < 0) return out + css.slice(i);
    const open = css.indexOf('{', at);
    out += css.slice(i, at);
    let depth = 1;
    let j = open + 1;
    while (depth > 0 && j < css.length) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    if (!pattern.test(css.slice(at, open))) out += css.slice(at, j);
    i = j;
  }
  return out;
}

test('cta title is a heading', () => {
  assert.match(readPage(), /<h2[^>]*>Let's make things happen<\/h2>/);
});

test('hover effects only apply on devices that can hover', () => {
  const css = stripMedia(stripMedia(readBuiltCss(), /hover:\s*hover/), /prefers-reduced-motion/);
  assert.ok(!/\.card-lift:hover/.test(css), 'card lift');
  assert.ok(!/animation-play-state:\s*paused/.test(css), 'marquee pause');
  assert.ok(!/\.logo[^{}]*:hover/.test(css), 'logo colour');
});

test('founder photo alt does not repeat the visible name', () => {
  assert.match(readPage(), /<img[^>]*src="\/img\/val\.png"[^>]*alt=""/);
});

test('menu button label reflects open state', () => {
  assert.ok((readPage() + readBuiltJs()).includes('Close main menu'));
});

test('logo strip images load eagerly', () => {
  const strip = readPage().match(/<section[^>]*id="clients"[\s\S]*?<\/section>/)[0];
  assert.ok(!strip.includes('loading="lazy"'));
});
