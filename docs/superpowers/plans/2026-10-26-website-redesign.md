# HyperSafe Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the HyperSafe homepage as a single page that presents a security consulting and engineering firm specialised in Web3 and AI security. It follows the visual direction "C" in the spec, with exact copy, eight client logos and subtle motion.

**Architecture:**
- The site stays a static Astro 4 + Tailwind 3 build deployed to GitHub Pages.
- The homepage is composed of one Astro component per section. Logos and services come from small typed data files in `src/data/`.
- Tests are Node's built-in test runner (`node --test`) asserting on the built HTML in `dist/`. There are no new dependencies.

**Tech Stack:** Astro 4.7, Tailwind CSS 3.4, TypeScript, Node 20 (CI) / 22 (local), `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-26-website-redesign-design.md`. Read it fully before starting. Its "Decided: copy" section is verbatim source text. Reference mockup: `docs/superpowers/specs/assets/2026-10-26-website-redesign/homepage-c-v6.html`. Open it in a browser and take styling values from its `<style>` block.

## Global Constraints

- **Branch:** all work happens on branch `feat/redesign`. Never push and never merge to `main`, because a push to `main` deploys to production. Val pushes when ready.
- **Commits:** format `type(scope): subject`, present tense, lowercase, no trailing period. **No `Co-Authored-By` lines.**
- **Dependencies:** no new npm dependencies. No Astro or Tailwind major upgrades.
- **Copy:** use the spec's "Decided: copy" verbatim. Web3 always comes before AI. Don't add any marketing copy. Alt text and aria labels must be plain and literal.
- **Brand:**
  - `public/logo.svg` as-is, in the nav and footer.
  - Space Grotesk from Google Fonts.
  - Colours: `lime #B9FF66`, `stone #231F20`, the existing `zinc` scale, plus the new tokens `ink #141414`, `card-light #f0f0ee`, `muted #8a8a86` and `page #fafaf8`.
- **Contact links:** every "Let's talk" link goes to `https://tally.so/r/npL5jJ` with `target="_blank"` and `rel="noopener noreferrer"`.
- **Reduced motion:** under `@media (prefers-reduced-motion: reduce)`, all motion is off: fade-ins, the logo marquee, the blink, pupil tracking and hover lifts. In that mode the logo strip becomes a static, centred, wrapping row.
- **Paths:** the site is served at the root of `www.hypersafe.xyz`, so root-relative paths are correct.
- **Removals:** no Flowbite script, no client-side year script, no "Clients" nav link, no Microsoft or AWS logos.

## Review Focus

1. **Touch devices (no cursor):** the pupils stay centred and the eyes still blink, with no errors. *(Task 3 test: the eye script is gated on `(hover: hover)` and reduced motion.)*
2. **Reduced motion on:** the page is fully static, and the logos show as a wrapped row with none cut off. *(Task 1 test: the built CSS contains a reduced-motion block. Task 4 test: every logo is rendered once in a non-duplicated list.)*
3. **Old `/about` links** (bookmarks, search results) land on the About section of `/`, and the heading isn't hidden under the sticky nav. *(Task 6 test: the redirect page targets `/#about`, and `#about` has a scroll margin.)*
4. **Phone width (375px):** no horizontal scroll, and the hero, cards and logo strip all fit. *(Task 7 manual check: `scrollWidth <= innerWidth`.)*
5. **External links:** every Tally link opens safely in a new tab. *(Task 2 test: every `tally.so` anchor has both attributes.)*

---

## File Structure

| File | Responsibility |
|---|---|
| `package.json` | add `"test": "astro build && node --test tests/"` |
| `tailwind.config.mjs` | add the colour tokens `ink`, `card-light`, `muted` and `page` |
| `astro.config.mjs` | add `redirects: { '/about': '/#about' }` |
| `src/styles/global.css` | the keyframes (`rise`, `marquee`, `blink`), the `.rise`/`.d1`/`.d2` utility classes, `.card-lift`, and the reduced-motion block. Remove the `.font-outline*` and `ul.dashed` styles |
| `src/layouts/Layout.astro` | head meta, font, body classes. Remove Flowbite. Import `global.css` |
| `src/components/Navbar.astro` | sticky nav: logo, Services, About, Let's talk, and the mobile toggle |
| `src/components/Footer.astro` | logo and the build-time copyright line |
| `src/components/Hero.astro` | the H1, intro, two buttons and `<Eyes />` |
| `src/components/Eyes.astro` | two eyes with blink and cursor tracking |
| `src/components/LogoStrip.astro` | the "Clients & partners" marquee |
| `src/components/Specialties.astro` | the two specialty cards |
| `src/components/Services.astro` | the Security and Engineering groups of cards |
| `src/components/About.astro` | the About text and founder card |
| `src/components/CTA.astro` | the dark call-to-action box |
| `src/data/clients.ts` | `clients: Client[]` |
| `src/data/services.ts` | `serviceGroups: ServiceGroup[]` |
| `src/pages/index.astro` | composes the sections in spec order |
| `src/pages/about.astro` | **delete**; the redirect replaces it |
| `src/components/Quote.astro` | **delete**; it becomes unused |
| `public/clients/*` | the eight logo files, copied from the spec's assets folder |
| `tests/helpers.mjs` | `readPage`, `pageText`, `readBuiltCss`, `readBuiltJs` |
| `tests/*.test.mjs` | one test file per task |

---

### Task 1: Foundation (branch, test harness, tokens, layout)

**Files:**
- Modify: `package.json`, `tailwind.config.mjs`, `src/styles/global.css`, `src/layouts/Layout.astro`
- Create: `tests/helpers.mjs`, `tests/layout.test.mjs`

**Interfaces:**
- Produces:
  - `tests/helpers.mjs`:
    - `readPage(rel = 'index.html'): string` returns the raw HTML of `dist/<rel>`.
    - `pageText(html: string): string` strips tags, scripts and styles, decodes `&amp; &#39; &#x27; &quot; &lt; &gt; &nbsp;`, and collapses whitespace to single spaces.
    - `readBuiltCss(): string` concatenates every `dist/_astro/*.css`.
  - `readBuiltJs(): string` concatenates every `dist/_astro/*.js`. Astro may bundle component `<script>`s into external files, so script assertions check `readPage() + readBuiltJs()`.
  - `Layout.astro` props: `{ title: string; description: string }`.
  - CSS classes used by later tasks: `.rise`, `.d1`, `.d2` (staggered fade-up), `.card-lift` (hover lift with shadow 4px → 7px), and `.marquee-track`. Tailwind colours: `ink`, `card-light`, `muted`, `page`.

- [ ] **Step 1: Create the branch and commit the spec and plan**

```bash
git checkout -b feat/redesign
git add docs/superpowers .gitignore
git commit -m "docs: add website redesign spec and plan"
```

- [ ] **Step 2: Add the test script and helpers.** Add `"test": "astro build && node --test tests/"` to `package.json`. Write `tests/helpers.mjs` with the four functions above, using `node:fs` and `node:path` only.

- [ ] **Step 3: Write the failing test `tests/layout.test.mjs`**

```js
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
```

- [ ] **Step 4: Run `npm test`.** Expected: FAIL. The title doesn't match, `flowbite` is present, and there's no reduced-motion CSS.

- [ ] **Step 5: Implement**
  - **`tailwind.config.mjs`:** add `ink`, `card-light`, `muted` and `page` (values in Global Constraints).
  - **`global.css`:**
    - Add `@keyframes rise` (opacity 0 → 1, translateY 14px → 0), `marquee` (translateX 0 → −50%) and `blink` (scaleY 1 → 0.1 at 94% → 1).
    - Add `.rise { animation: rise .9s cubic-bezier(.2,.7,.2,1) both }`, with `.d1` and `.d2` delays of .12s and .24s.
    - Add `.card-lift` (transition on transform and box-shadow; hover `translateY(-3px)` and `box-shadow: 0 7px 0 #141414`).
    - Add one `@media (prefers-reduced-motion: reduce)` block that sets `animation: none !important; transition: none !important` on `*` and resets `.card-lift:hover` to `transform: none`.
    - Remove `.font-outline*` and `ul.dashed`.
  - **`Layout.astro`:**
    - Import `../styles/global.css`.
    - Use a single `<meta name="description" content={description}>`.
    - Use `<meta name="viewport" content="width=device-width, initial-scale=1">`.
    - Set body classes `bg-page text-ink font-SpaceGrotesk antialiased`, and drop `space-y-20`.
    - Remove the Flowbite script.
  - **`index.astro`:** pass the spec title and description to `Layout`.

- [ ] **Step 6: Run `npm test`.** Expected: all 3 tests pass, and `astro check` reports 0 errors.

- [ ] **Step 7: Commit**

```bash
git add package.json tailwind.config.mjs src/styles/global.css src/layouts/Layout.astro src/pages/index.astro tests/
git commit -m "build(site): add test harness, colour tokens and motion styles"
```

---

### Task 2: Navbar and Footer

**Files:**
- Modify: `src/components/Navbar.astro`, `src/components/Footer.astro`
- Create: `tests/chrome.test.mjs`

**Interfaces:**
- Consumes: the helpers in `tests/helpers.mjs` (Task 1). Every later test file imports what it needs from there.
- Produces: the exported constant `TALLY_URL = 'https://tally.so/r/npL5jJ'` from `src/data/links.ts`. Tasks 3 and 6 import it.

- [ ] **Step 1: Write the failing test `tests/chrome.test.mjs`**

```js
test('nav has Services, About, Let\'s talk and no Clients', () => {
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
```

Use the same imports as Task 1's test file.

- [ ] **Step 2: Run `npm test`.** Expected: FAIL on the nav, tally and footer tests.

- [ ] **Step 3: Implement**
  - **`src/data/links.ts`:** `export const TALLY_URL = 'https://tally.so/r/npL5jJ';`
  - **`Navbar.astro`:**
    - `sticky top-0 z-50`, background `bg-page/90 backdrop-blur`, and a thin bottom border.
    - Logo on the left. Services and About links, plus a dark `rounded-xl` "Let's talk" button using `TALLY_URL`.
    - On mobile, "Let's talk" stays visible next to the hamburger, and Services and About collapse into the toggled menu. Keep the existing vanilla toggle script, but drop its `console.warn` branches.
  - **`Footer.astro`:** the logo (height about 20px), plus `© {new Date().getFullYear()} HyperSafe GmbH · Geneva, Switzerland`, rendered at build time. Delete the inline script.

- [ ] **Step 4: Run `npm test`.** Expected: all tests pass.

- [ ] **Step 5: Commit** with message `feat(nav): redesign navbar and footer`.

---

### Task 3: Hero and Eyes

**Files:**
- Modify: `src/components/Hero.astro`, `src/components/Eyes.astro`
- Create: `tests/hero.test.mjs`

**Interfaces:**
- Consumes: `TALLY_URL` (Task 2). The `.rise`, `.d1` and `.d2` classes and the `blink` keyframes (Task 1).
- Produces: `<Eyes />`, which takes no props.

- [ ] **Step 1: Write the failing test `tests/hero.test.mjs`**

```js
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
```

- [ ] **Step 2: Run `npm test`.** Expected: all 3 hero tests fail.

- [ ] **Step 3: Implement**
  - **`Hero.astro`:**
    - `<section id="hero">`. On desktop it's a grid with 1.25fr text and 1fr eyes; on mobile it's one column with the eyes below the text and smaller.
    - H1: about 62px on desktop and about 40px on mobile, `tracking-[-0.04em]`, `font-medium`, `leading-[0.98]`. The `<mark>` is lime with about 8px horizontal padding and rounded corners.
    - The intro's first sentence is in `<b>` with the `text-ink` colour.
    - Buttons: "Let's talk" (dark, `TALLY_URL`) and "Our services" (outlined, `#services`).
    - Apply `.rise`, `.rise.d1` and `.rise.d2` to the H1, intro and buttons.
    - Delete the commented-out client-logo block.
  - **`Eyes.astro`:**
    - Two eyes about 140px on desktop and about 96px on mobile, fill `#d4d1cf`, with an ink pupil about 32px centred in each. The blink animation runs on a 5s loop.
    - Script: `if (matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches)`, then add a `mousemove` listener. The listener translates each pupil toward the cursor by `min(maxOffset, distance / 8)`, where `maxOffset` = (eye radius − pupil radius − 4px).

- [ ] **Step 4: Run `npm test`.** Expected: all tests pass.

- [ ] **Step 5: Commit** with message `feat(hero): new hero copy and cursor-tracking eyes`.

---

### Task 4: Clients & partners logo strip

**Files:**
- Create: `src/data/clients.ts`, `src/components/LogoStrip.astro`, `public/clients/{metamask,aave,uniswap,lido,linea,rocketpool,infomaniak}.svg`, `public/clients/lak3.png`, `tests/logos.test.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `src/data/clients.ts` exports:
  - `interface Client { name: string; src: string; height: number; label?: string; filter?: 'icon' }`
  - `const clients: Client[]`

- [ ] **Step 1: Copy the assets**

```bash
mkdir -p public/clients
cp docs/superpowers/specs/assets/2026-10-26-website-redesign/{metamask,aave,uniswap,lido,linea,rocketpool,infomaniak}.svg docs/superpowers/specs/assets/2026-10-26-website-redesign/lak3.png public/clients/
```

- [ ] **Step 2: Write the failing test `tests/logos.test.mjs`**

```js
const NAMES = ['MetaMask', 'Aave', 'Uniswap', 'Lido', 'Linea', 'Rocket Pool', 'Lake', 'Infomaniak'];

test('strip label and all eight logos with alt text, in order', () => {
  const html = readPage();
  const strip = html.match(/<section[^>]*id="clients"[\s\S]*?<\/section>/)[0];
  assert.ok(pageText(strip).includes('Clients & partners'));
  const list = strip.match(/<ul[^>]*data-logos[^>]*>[\s\S]*?<\/ul>/)[0];  // first, canonical copy
  const alts = [...list.matchAll(/<img[^>]*alt="([^"]*)"/g)].map(m => m[1]);
  assert.deepEqual(alts, NAMES.map(n => n === 'Rocket Pool' ? '' : n));
  assert.ok(pageText(list).includes('Rocket Pool'));
});

test('no microsoft or aws', () => {
  assert.ok(!/microsoft|aws/i.test(readPage().match(/<section[^>]*id="clients"[\s\S]*?<\/section>/)[0]));
});

test('logo files exist in dist', () => {
  for (const f of ['metamask.svg','aave.svg','uniswap.svg','lido.svg','linea.svg','rocketpool.svg','lak3.png','infomaniak.svg'])
    assert.ok(existsSync(`dist/clients/${f}`), f);
});
```

Import `existsSync` from `node:fs`. Rocket Pool's icon has `alt=""` because its visible text label names it.

- [ ] **Step 3: Run `npm test`.** Expected: the logo tests fail.

- [ ] **Step 4: Implement**
  - **`clients.ts`:** list the brands in spec order. Heights from the mockup:
    - MetaMask 22
    - Aave 22
    - Uniswap 32
    - Lido 30
    - Linea 26
    - Rocket Pool 30, with `label: 'Rocket Pool'` and `filter: 'icon'`
    - Lake 30, from `/clients/lak3.png`
    - Infomaniak 20
  - **`LogoStrip.astro`:**
    - `<section id="clients">` with the small uppercase label.
    - A track that renders the list twice: the first `<ul data-logos>` is the canonical copy; the second has `aria-hidden="true"` and empty alts.
    - The track is `.marquee-track`, about 30s per loop, linear, infinite, and pauses on hover. Edges fade with a `mask-image` linear gradient.
    - Logo filter: default `brightness(0) opacity(.42)`; `filter: 'icon'` uses `grayscale(1) opacity(.45)`. Hover removes the filter. The label text is `#00000070`.
    - Under reduced motion, hide the duplicate `<ul>`, and the canonical `<ul>` wraps and centres (`flex-wrap: wrap; justify-content: center`).
  - **`index.astro`:** place `<LogoStrip />` after `<Hero />`.

- [ ] **Step 5: Run `npm test`.** Expected: the logo tests pass.

- [ ] **Step 6: Commit** with message `feat(clients): add clients and partners logo strip`.

---

### Task 5: Specialties and Services

**Files:**
- Create: `src/data/services.ts`, `src/components/Specialties.astro`, `tests/services.test.mjs`
- Modify: `src/components/Services.astro` (rewrite), `src/pages/index.astro`

**Interfaces:**
- Consumes: `.card-lift` (Task 1).
- Produces:
  - `interface Service { title: string; text: string; tone: 'light' | 'dark' | 'lime' }`
  - `interface ServiceGroup { name: string; tag: string; services: Service[] }`
  - `const serviceGroups: ServiceGroup[]`

- [ ] **Step 1: Write the failing test `tests/services.test.mjs`**

```js
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
  for (const s of expected) { const i = t.indexOf(s, at); assert.ok(i >= 0, s); at = i + s.length; }
});

test('sections in spec order', () => {
  const html = readPage();
  const ids = ['hero', 'clients', 'specialties', 'services'].map(id => html.indexOf(`id="${id}"`));
  assert.deepEqual([...ids].sort((a, b) => a - b), ids);
  assert.ok(ids.every(i => i > 0));
});
```

- [ ] **Step 2: Run `npm test`.** Expected: these tests fail.

- [ ] **Step 3: Implement**
  - **`services.ts`:** the spec's copy and tones:
    - Audits: light
    - Pentest: dark
    - Infrastructure security: dark
    - Advisory: light
    - Both Engineering cards: lime
  - **Cards (both components):** `rounded-[28px] border border-ink shadow-[0_4px_0_#141414] card-lift`. Fills: `bg-card-light`, `bg-stone text-white` or `bg-lime`. Each service card ends with a decorative round "↗" button with `aria-hidden="true"`.
  - **`Specialties.astro`:** `<section id="specialties">`. Two columns on desktop with a lime badge per card. Web3 card light, AI card dark.
  - **`Services.astro`:** `<section id="services">`. On desktop, a grid with a 180px column for the group name and sub-label, and the group's cards in 2 columns on the right. On mobile, one column.
  - Both section labels use `text-muted uppercase tracking-[0.14em] text-xs`.
  - **`index.astro`:** order is Hero, LogoStrip, Specialties, Services.

- [ ] **Step 4: Run `npm test`.** Expected: these tests pass.

- [ ] **Step 5: Commit** with message `feat(services): add specialties and redesigned services sections`.

---

### Task 6: About, CTA and the /about redirect

**Files:**
- Create: `src/components/About.astro`, `tests/about.test.mjs`
- Modify: `src/components/CTA.astro` (rewrite), `src/pages/index.astro`, `astro.config.mjs`, `src/styles/global.css` (scroll margin)
- Delete: `src/pages/about.astro`, `src/components/Quote.astro`

**Interfaces:**
- Consumes: `TALLY_URL` (Task 2) and `.card-lift` (Task 1).

- [ ] **Step 1: Write the failing test `tests/about.test.mjs`**

```js
test('about copy and founder card', () => {
  const sec = readPage().match(/<section[^>]*id="about"[\s\S]*?<\/section>/)[0];
  const t = pageText(sec);
  assert.ok(t.includes('Headquartered in Geneva 🇨🇭'));
  assert.ok(t.includes('HyperSafe GmbH, Geneva. Founded by Valentin Quelquejay.'));
  assert.ok(t.includes('Founder'));
  assert.match(sec, /<img[^>]*src="\/img\/val\.png"[^>]*alt="Valentin Quelquejay"/);
});

test('cta copy', () => {
  const t = pageText(readPage());
  assert.ok(t.includes("Let's make things happen"));
  assert.ok(t.includes('Let us know how we can help.'));
  assert.ok(t.includes("Heck yeah, let's talk →"));
});

test('/about redirects to /#about', () => {
  assert.match(readPage('about/index.html'), /http-equiv="refresh"[^>]*url=\/#about/i);
});

test('anchored sections clear the sticky nav', () => {
  assert.match(readBuiltCss(), /scroll-margin-top/);
});

test('nav, hero and cta each link to tally', () => {
  assert.ok((readPage().match(/<a\b[^>]*tally\.so[^>]*>/g) || []).length >= 3);
});

test('section order through to the end', () => {
  const html = readPage();
  const ids = ['hero','clients','specialties','services','about','cta'].map(id => html.indexOf(`id="${id}"`));
  assert.deepEqual([...ids].sort((a, b) => a - b), ids);
});
```

- [ ] **Step 2: Run `npm test`.** Expected: these tests fail.

- [ ] **Step 3: Implement**
  - **`About.astro`:** `<section id="about">`, two columns on desktop. On the left, the label, H2 and text. On the right, a founder card: `rounded-[36px]`, border, offset shadow, white background, a 92px round photo, the name and "Founder".
  - **`CTA.astro`:** `<section id="cta">`, a `bg-stone text-white rounded-[36px]` box. Title and text on the left, a lime button on the right with `TALLY_URL`. It stacks on mobile.
  - **`astro.config.mjs`:** `redirects: { '/about': '/#about' }`.
  - **`global.css`:** `section[id] { scroll-margin-top: 5rem; }`. Match this to the real nav height.
  - Delete `src/pages/about.astro` and `src/components/Quote.astro`.
  - **`index.astro`:** final order is Hero, LogoStrip, Specialties, Services, About, CTA.

- [ ] **Step 4: Run `npm test`.** Expected: **every** test in `tests/` passes.

- [ ] **Step 5: Commit** with message `feat(about): fold about into homepage and add cta`.

---

### Task 7: Visual verification and polish

**Files:** any component from Tasks 2–6, for visual fixes only.

- [ ] **Step 1:** Run `npm run dev` and open `http://localhost:4321/` at desktop width (about 1280px). Compare against the reference mockup, section by section: spacing, card shadows, type sizes and marquee speed. Fix any obvious drift.
- [ ] **Step 2:** At 375px width, run `document.documentElement.scrollWidth <= window.innerWidth` in the console. Expected: `true`. Also check that the mobile nav toggle opens and closes, and that "Let's talk" stays visible.
- [ ] **Step 3:** With reduced motion emulated (DevTools → Rendering → `prefers-reduced-motion: reduce`), check:
  - nothing animates
  - the logos are one centred, wrapping row with nothing cut off
  - the cards don't lift
  - the pupils stay centred
- [ ] **Step 4:** Open `http://localhost:4321/about`. Expected: it lands on `/#about` with the heading visible below the nav. In dev the redirect may behave differently, so confirm with `npm run build && npm run preview` if needed.
- [ ] **Step 5:** Run `npm test`. Expected: all tests pass, and `astro check` reports 0 errors.
- [ ] **Step 6:** Commit any fixes with message `style(site): polish spacing and responsive layout`. **Do not push.**
