import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageText, readBuiltCss } from './helpers.mjs';

test('about copy and founder card', () => {
  const sec = readPage().match(/<section[^>]*id="about"[\s\S]*?<\/section>/)[0];
  const t = pageText(sec);
  assert.ok(t.includes('Headquartered in Geneva 🇨🇭'));
  assert.ok(t.includes('HyperSafe GmbH, Geneva. Founded by Valentin Quelquejay.'));
  assert.ok(t.includes('Founder'));
});

test('cta copy', () => {
  const t = pageText(readPage());
  assert.ok(t.includes("Let's make things happen"));
  assert.ok(t.includes('Let us know how we can help.'));
  assert.ok(t.includes("Heck yeah, let's talk →"));
});

test('/about redirects to /#about', () => {
  assert.match(readPage('about/index.html'), /http-equiv="refresh"[^>]*url=(https?:\/\/[^/"]+)?\/#about/i);
});

test('anchored sections clear the sticky nav', () => {
  assert.match(readBuiltCss(), /scroll-margin-top/);
});

test('nav, hero and cta each link to tally', () => {
  assert.ok((readPage().match(/<a\b[^>]*tally\.so[^>]*>/g) || []).length >= 3);
});

test('section order through to the end', () => {
  const html = readPage();
  const ids = ['hero', 'clients', 'specialties', 'services', 'about', 'cta'].map((id) => html.indexOf(`id="${id}"`));
  assert.deepEqual([...ids].sort((a, b) => a - b), ids);
  assert.ok(ids.every((i) => i > 0));
});
