# HyperSafe website redesign: design

Date: 2026-10-26
Status: draft, awaiting Val's approval
Reference mockup: `docs/superpowers/specs/assets/2026-10-26-website-redesign/homepage-c-v6.html`. It is a static fragment from the brainstorming tool, so image paths in it (`/files/...`) won't resolve outside that tool. Use it for layout, spacing and styling values. The copy in this doc wins over the mockup wherever they differ.

## Intent

HyperSafe's current site presents it as a Web3-only security agency ("We secure your Web3 journey"). That no longer matches what HyperSafe does. The redesign repositions it as a **security consulting and engineering firm**. Security comes first and engineering second. **Web3 and AI security** are its two specialties, Web3 first.

The look should feel current and a bit more alive than today, while staying **sober**. Val likes the restraint of the current site and wants to keep it.

## Goals

- A visitor understands within one screen that HyperSafe does security consulting and engineering, specialises in Web3 and AI security, and is based in Geneva.
- Credibility comes from real client and partner logos, not from claims.
- The copy sounds like a person wrote it: short, plain and direct (see "Copy rules").
- Subtle motion makes the page feel alive.
- The page works well on phones.

## Non-goals

- No blog, case studies, pricing, or multi-language support. The site is English only.
- No new contact system. The existing Tally form stays.
- No change of hosting or framework.

## Anti-goals (would count as failure even if it "works")

- **Copy that reads AI-generated.** That means slogan pairs ("X is how we make it stick"), reflexive lists of three, hype words, or invented claims about seniority, years of experience or numbers.
- **Over-specific service claims.** Val explicitly wants services described generically. Don't name specific techniques such as passkeys, liveness or prompt injection, and don't name specific AI threats.
- **Flashy or busy motion.** No parallax circus, no particle backgrounds, no colour gradients.
- **Logos used against their owners' rules.** Microsoft and AWS logos are excluded for this reason: HyperSafe is not an enrolled partner (Val confirmed).

## Constraints

- **Stack stays:** Astro 4, Tailwind 3 and TypeScript, deployed to GitHub Pages by `.github/workflows/astro.yml` on push to `main`. Upgrading Astro or Tailwind major versions is out of scope.
- **Brand stays:**
  - The logo is `public/logo.svg`: the eye icon plus the spaced "HYPERSAFE" wordmark. Use it as-is in the nav and footer.
  - The font is Space Grotesk, loaded from Google Fonts.
  - The colours are the existing tokens in `tailwind.config.mjs`: `lime #B9FF66`, `stone #231F20`, and the `zinc` scale, plus black and white. The mockup also uses an off-white page background, `#fafaf8`. Add it as a token.
- **Contact:** every "Let's talk" call to action links to `https://tally.so/r/npL5jJ` in a new tab with `rel="noopener noreferrer"`.
- **Reduced motion:** all motion must be disabled under `prefers-reduced-motion: reduce`. That covers fade-ins, the logo scroll, eye tracking, blinking and hover lifts.
- **Flowbite:** the current layout loads Flowbite from a CDN only for the nav toggle. Remove it and keep the existing small vanilla toggle script.

## Decided: structure

One page (`/`) with anchor sections. The current `/about` page is replaced by a redirect to `/#about`. Use Astro's `redirects` config, which emits a meta-refresh page on static hosting. That's acceptable.

**Nav** (sticky, with a translucent page-coloured background and a thin bottom border):
- logo on the left, linking to `/`
- **Services** (`#services`) and **About** (`#about`)
- a dark **Let's talk** button linking to the Tally form

There is no "Clients" link; Val removed it. On mobile the nav collapses behind the existing hamburger toggle.

Sections, in order:

1. **Hero**: text on the left; on the right, two large grey "eyes" that blink and whose pupils follow the cursor (see Motion).
2. **Clients & partners**: a strip of official logos that scrolls slowly and endlessly.
3. **Specialties** (`#specialties`): two equal cards, Web3 security first, then AI security.
4. **Services** (`#services`): two groups. **Security** has four cards and **Engineering** has two.
5. **About** (`#about`): short text, plus a founder card with the photo `public/img/val.png`.
6. **CTA**: a large dark rounded box with a lime button.
7. **Footer**: logo, plus "© {current year} HyperSafe GmbH · Geneva, Switzerland". The year is computed at build time, not by client-side script.

## Decided: copy (final; use verbatim)

**Hero**
- H1: "We **break** your product before someone else does." Only "break" gets the lime highlight, a rounded `mark` box.
- Intro paragraph: "**HyperSafe is a security consulting and engineering firm in Geneva.** We audit code and infrastructure, pentest apps, and help you fix what we find. Specialised in Web3 and AI security." The first sentence is bold and darker; the rest is regular grey.
- Buttons: "Let's talk" (primary, dark, goes to Tally) and "Our services" (outlined, goes to `#services`).

**Logo strip**
- Label (small uppercase): "Clients & partners"

**Specialties**
- Label: "Specialties"
- H2: "Deep expertise in Web3 and AI"
- Card 1, light: badge "Web3 security"; text "Smart contracts, protocols and the systems around them."
- Card 2, dark: badge "AI security"; text "Expertise in securing AI-native companies."

**Services**
- Label: "Services"
- H2: "What we do"
- Intro: "Security is the core of what we do. We also build software and infrastructure, secure by default."
- Group **Security** (sub-label "our core"):
  - Audits & code review: "Line-by-line review of your code, from smart contracts to backends and apps." (light card)
  - Penetration testing: "We attack your apps and infrastructure, then tell you what broke and how to fix it." (dark card)
  - Infrastructure security: "Review and hardening of your cloud, servers and network." (dark card)
  - Advisory & training: "Help with security decisions, and training for your developers." (light card)
- Group **Engineering** (sub-label "built secure"):
  - Software development: "We build software too, secure by default." (lime card)
  - Infrastructure & DevOps: "We set up and run infrastructure that doesn't fall over." (lime card)

**About**
- Label: "About"
- H2: "Headquartered in Geneva 🇨🇭"
- Text: "HyperSafe GmbH, Geneva. Founded by Valentin Quelquejay."
- Founder card: photo, "Valentin Quelquejay", "Founder"

**CTA**
- Title: "Let's make things happen"
- Text: "Let us know how we can help."
- Button: "Heck yeah, let's talk →", going to Tally.

**Meta**
- Title: "HyperSafe: security consulting & engineering"
- Description: "HyperSafe is a security consulting and engineering firm in Geneva, specialised in Web3 and AI security."

### Copy rules (for any copy the builder must add, e.g. alt text or aria labels)

Write it short, plain and literal, the way a person would say it. Don't add new marketing copy.

## Decided: look

These are the details of "Direction C", chosen from three options:
- **Page:** off-white background `#fafaf8` and near-black text `#141414`. Generous whitespace.
- **Headings:** large and tight. The H1 is about 62px on desktop with letter-spacing of about −0.04em; H2s are about 40px. All headings use font weight 500.
- **Cards:**
  - 28px corner radius, 1px near-black border, and a solid 4px offset shadow straight down (`0 4px 0 #141414`).
  - On hover, a card lifts by 3px and its shadow grows to 7px.
  - Three fills: light grey `#f0f0ee`, dark `stone`, and `lime`.
  - Service cards end with a small round arrow button "↗". It's decorative; the cards don't link anywhere.
- **Section labels:** small, uppercase, letter-spacing about 0.14em, grey `#8a8a86`.
- **Layout on desktop:**
  - The services section is a two-column grid: the group name on the left, about 180px wide, and its cards on the right in two columns.
  - The specialties are two columns.
  - About is two columns: text on the left, founder card on the right.
- **Layout on mobile:** everything stacks into one column, and the eyes go below the hero text and are smaller.

## Decided: motion (all subtle; none under reduced-motion)

- **Hero:** the H1, intro and buttons fade up in sequence on load (about 0.9s each, staggered by about 0.12s).
- **Eyes:**
  - They blink about every 5 seconds.
  - The pupils follow the mouse cursor within the eye, using a small vanilla script.
  - On touch devices, where there's no cursor, the pupils stay centred and the eyes still blink.
- **Logo strip:** a slow, endless horizontal scroll, about 30s per loop. The edges fade out with a mask. Scrolling pauses on hover.
- **Logo colour:** each logo is rendered in one flat grey (`filter: brightness(0) opacity(.42)`) and shows its original colours on hover. Rocket Pool is the exception: its icon uses `grayscale(1) opacity(.45)`, because `brightness(0)` would turn it into a solid disc. Its "Rocket Pool" text label is the same grey.
- **Cards:** they lift on hover, as described under Look.

## Decided: client and partner logos

Eight logos, in this order: MetaMask, Aave, Uniswap, Lido, Linea, Rocket Pool, Lake (Lak3), Infomaniak. The final files are in `docs/superpowers/specs/assets/2026-10-26-website-redesign/`. Copy them to `public/clients/`.

| Logo | File | Source | Notes |
|---|---|---|---|
| MetaMask | metamask.svg | Official logo pack from metamask.io/assets | Wordmark only (no fox) |
| Aave | aave.svg | aave.com brand assets zip | Ghost and wordmark. Aave's rules: don't distort or recolour it beyond the strip treatment |
| Uniswap | uniswap.svg | github.com/Uniswap/brand-assets | Unicorn and wordmark |
| Lido | lido.svg | lido.fi press kit | Drop and wordmark |
| Linea | linea.svg | linea.build brand kit | Wordmark. Its viewBox was cropped to remove empty margins |
| Rocket Pool | rocketpool.svg | rocketpool.net brand kit | **Icon only**; no official wordmark exists. Show the icon with the text "Rocket Pool" next to it in the strip |
| Lake (Lak3) | lak3.png | lak3.io site header | **PNG only** (524×168); no SVG exists. It's sharp enough at strip height |
| Infomaniak | infomaniak.svg | infomaniak.com press page | Name-only version, without the tagline or flag |

The logos are shown at different heights so they look visually balanced. The mockup used about 20–34px, depending on the logo. Each image needs alt text with the brand name.

Microsoft and AWS are **excluded**. HyperSafe is not an enrolled partner, and both companies restrict logo use to licensed partners.

## Left to the builder

- **Components:** how to split the page into Astro components. Reusing or replacing the existing `Hero`, `Services`, `CTA`, `Footer`, `Navbar`, `Container` and `Eyes` is fine. `Quote.astro` can go if nothing uses it.
- **Implementation choices:** whether to use Tailwind utilities or scoped `<style>` blocks, and the exact breakpoints. Spacing and size values may vary a few pixels from the mockup.
- **Clean-up:** removing dead code, such as the commented-out client logos in `Hero.astro`, the unused `.font-outline` styles and the Flowbite script.
- **Verification:** `npm run build`, which runs `astro check`, must pass. Check the page by eye at desktop width and at about 375px width, with and without reduced motion.

## Builder's calls already made (by Claude, during review; Val can override)

- **Base path:** the site is served at the custom domain `www.hypersafe.xyz` with no base path, so root-relative paths (`/logo.svg`, `/clients/...`, `/#about`) are correct.
- **Colour tokens:** add `#141414` (ink), `#f0f0ee` (card-light), `#8a8a86` (muted) and `#fafaf8` (page) as Tailwind tokens alongside the existing ones.
- **Logo data:** drive the logo strip from a single data list, so a logo can be removed by deleting one entry. The scrolling track duplicates the list enough times to loop without gaps.
- **Reduced motion:** with reduced motion on, the logo strip becomes a static, centred, wrapping row.
- **Mobile nav:** "Let's talk" stays visible next to the hamburger. Services and About collapse into the menu.
- **Sticky nav:** anchor sections get `scroll-margin-top` equal to the nav height, so the sticky nav doesn't cover their headings.

## Release gate

Pushing to `main` deploys to production. The work therefore ends on a feature branch, with nothing pushed or merged until Val says so. Val confirmed on 2026-10-26 that all eight logos may be shown publicly as clients or partners.

## Open items for Val

- **Lak3:** resolved. Val confirmed on 2026-10-26 that the LAKE logo (lak3.io) is correct and fine to keep as the PNG.
