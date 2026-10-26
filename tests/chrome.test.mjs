import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageText } from './helpers.mjs';

test("nav has Services, About, Let's talk and no Clients", () => {
  const nav = readPage().match(/<nav[\s\S]*?<\/nav>/)[0];
  assert.ok(nav.includes('href="/#services"'));
  assert.ok(nav.includes('href="/#about"'));
  assert.ok(nav.includes('src="/logo.svg"'));
  assert.ok(!/Clients/.test(pageText(nav)));
  assert.match(pageText(nav), /Let's talk/);
});

test('every tally link opens safely in a new tab', () => {
  const anchors = readPage().match(/<a\b[^>]*tally\.so[^>]*>/g) || [];
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
