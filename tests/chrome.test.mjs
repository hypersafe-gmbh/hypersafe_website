import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageText } from './helpers.mjs';

test("nav has Services, Let's talk and no About or Clients", () => {
  const nav = readPage().match(/<nav[\s\S]*?<\/nav>/)[0];
  assert.ok(nav.includes('href="/#services"'));
  assert.ok(!nav.includes('href="/#about"'));
  assert.ok(nav.includes('src="/logo.svg"'));
  assert.ok(!/Clients/.test(pageText(nav)));
  assert.match(pageText(nav), /Let's talk/);
});

test('every booking link opens safely in a new tab', () => {
  const anchors = readPage().match(/<a\b[^>]*cal\.com\/vquelque\/15min[^>]*>/g) || [];
  assert.ok(anchors.length >= 1);
  for (const a of anchors) {
    assert.match(a, /target="_blank"/);
    assert.match(a, /rel="noopener noreferrer"/);
  }
});

test('footer has build-time year, no client year script', () => {
  const html = readPage();
  const year = new Date().getFullYear();
  assert.ok(pageText(html).includes(`© ${year} HyperSafe GmbH · Geneva, Switzerland`));
  assert.ok(!html.includes('currentYear'));
});

test('footer has the contact email', () => {
  const footer = readPage().match(/<footer[\s\S]*?<\/footer>/)[0];
  assert.ok(footer.includes('href="mailto:info@hypersafe.xyz"'));
  assert.ok(pageText(footer).includes('info@hypersafe.xyz'));
});

test('no tally links left', () => {
  assert.ok(!readPage().includes('tally.so'));
});
