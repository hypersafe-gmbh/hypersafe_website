import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageText } from './helpers.mjs';

test('specialties: Web3 before AI, verbatim', () => {
  const sec = readPage().match(/<section[^>]*id="specialties"[\s\S]*?<\/section>/)[0];
  const t = pageText(sec);
  assert.ok(t.includes('Deep expertise in Web3 and AI'));
  assert.ok(t.indexOf('Web3 security') < t.indexOf('AI security'));
  assert.ok(t.includes('Smart contracts, protocols and the systems around them.'));
  assert.ok(t.includes('Expertise in securing AI-native companies.'));
});

test('services: groups and six cards, verbatim, in order', () => {
  const t = pageText(readPage().match(/<section[^>]*id="services"[\s\S]*?<\/section>/)[0]);
  const expected = [
    'What we do',
    'Security is the core of what we do. We also build software and infrastructure, secure by default.',
    'Security', 'our core',
    'Audits & code review', 'Line-by-line review of your code, from smart contracts to backends and apps.',
    'Penetration testing', 'We attack your apps and infrastructure, then tell you what broke and how to fix it.',
    'Infrastructure security', 'Review and hardening of your cloud, servers and network.',
    'Advisory & training', 'Help with security decisions, and training for your developers.',
    'Engineering', 'built secure',
    'Software development', 'We build software too, secure by default.',
    'Infrastructure & DevOps', "We set up and run infrastructure that doesn't fall over.",
  ];
  let at = 0;
  for (const s of expected) {
    const i = t.indexOf(s, at);
    assert.ok(i >= 0, s);
    at = i + s.length;
  }
});

test('sections in spec order', () => {
  const html = readPage();
  const ids = ['hero', 'clients', 'services', 'specialties'].map((id) => html.indexOf(`id="${id}"`));
  assert.deepEqual([...ids].sort((a, b) => a - b), ids);
  assert.ok(ids.every((i) => i > 0));
});
