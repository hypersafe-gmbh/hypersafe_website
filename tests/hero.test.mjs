import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageText, readBuiltJs } from './helpers.mjs';

test('hero copy is verbatim', () => {
  const html = readPage();
  const t = pageText(html);
  assert.match(html, /<h1[^>]*>\s*We\s*<mark[^>]*>break<\/mark>\s*your product before someone else does\.\s*<\/h1>/);
  assert.ok(t.includes('HyperSafe is a security consulting and engineering firm in Geneva. We audit code and infrastructure, pentest apps, and help you fix what we find. Specialised in Web3 and AI security.'));
  assert.match(html, /<(b|strong)[^>]*>HyperSafe is a security consulting and engineering firm in Geneva\.<\/(b|strong)>/);
});

test('hero buttons', () => {
  const hero = readPage().match(/<section[^>]*id="hero"[\s\S]*?<\/section>/)[0];
  assert.match(hero, /href="#services"[^>]*>[\s\S]*?Our services/);
  assert.match(hero, /tally\.so[\s\S]*?Let's talk/);
});

test('eye tracking only runs with a hover pointer and motion allowed', () => {
  const src = readPage() + readBuiltJs();
  assert.ok(src.includes('(hover: hover)'));
  assert.ok(src.includes('prefers-reduced-motion: reduce'));
});
