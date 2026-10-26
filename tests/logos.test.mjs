import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readPage, pageText, readBuiltCss } from './helpers.mjs';

const NAMES = ['MetaMask', 'Aave', 'Uniswap', 'Lido', 'Linea', 'Rocket Pool', 'Lake', 'Infomaniak'];
const strip = () => readPage().match(/<section[^>]*id="clients"[\s\S]*?<\/section>/)[0];

test('strip label and all eight logos with alt text, in order', () => {
  const s = strip();
  assert.ok(pageText(s).includes('Clients & partners'));
  const list = s.match(/<ul[^>]*data-logos[^>]*>[\s\S]*?<\/ul>/)[0];
  const alts = [...list.matchAll(/<img[^>]*alt="([^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(alts, NAMES.map((n) => (n === 'Rocket Pool' ? '' : n)));
  assert.ok(pageText(list).includes('Rocket Pool'));
});

test('no microsoft or aws', () => {
  assert.ok(!/microsoft|aws/i.test(strip()));
});

test('logo files exist in dist', () => {
  for (const f of ['metamask.svg', 'aave.svg', 'uniswap.svg', 'lido.svg', 'linea.svg', 'rocketpool.svg', 'lak3.png', 'infomaniak.svg'])
    assert.ok(existsSync(new URL(`../dist/clients/${f}`, import.meta.url)), f);
});

test('each logo copy spans at least the viewport so the loop never shows a gap', () => {
  assert.match(readBuiltCss(), /ul\[data-astro-cid-[\w-]+\]\{[^}]*min-width:100vw/);
});
