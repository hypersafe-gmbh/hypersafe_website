import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageText, readBuiltCss } from './helpers.mjs';

test('cta copy, with geneva and the founder', () => {
  const sec = readPage().match(/<section[^>]*id="cta"[\s\S]*?<\/section>/)[0];
  const t = pageText(sec).replace(/ ([,.])/g, '$1');
  assert.ok(t.includes('Headquartered in Geneva 🇨🇭'));
  assert.ok(t.includes("Let's make things happen"));
  assert.ok(t.includes("You'll talk to Valentin, our founder."));
  assert.ok(sec.includes('src="/img/val.png"'));
  assert.ok(t.includes("Heck yeah, let's talk →"));
});

test('no separate about section', () => {
  assert.ok(!readPage().includes('id="about"'));
});

test('/about redirects to /#cta', () => {
  assert.match(readPage('about/index.html'), /http-equiv="refresh"[^>]*url=(https?:\/\/[^/"]+)?\/#cta/i);
});

test('anchored sections clear the sticky nav', () => {
  assert.match(readBuiltCss(), /scroll-margin-top/);
});

test('nav, hero and cta each link to the booking page', () => {
  assert.ok((readPage().match(/<a\b[^>]*cal\.com\/vquelque\/15min[^>]*>/g) || []).length >= 3);
});

test('section order through to the end', () => {
  const html = readPage();
  const ids = ['hero', 'clients', 'services', 'specialties', 'cta'].map((id) => html.indexOf(`id="${id}"`));
  assert.deepEqual([...ids].sort((a, b) => a - b), ids);
  assert.ok(ids.every((i) => i > 0));
});
