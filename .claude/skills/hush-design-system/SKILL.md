---
name: "hush-design-system"
description: "Build any UI, page, slide or component in Maciek's Hush design system: dark, minimal, Linear-like, Fraunces Light titles, pink accents, grain and hover-glow background, pink frame."
---

# Hush design system

Hush is a dark, quiet interface system: near-black surfaces, small type, hairlines instead of shadows, one bright pink signal used sparingly. Dark only; there is no light theme. Apply it whenever Maciek asks for something "in Hush", "in my design system", or a new page, site, component or slide for his own projects.

The source of truth is the design system artifact: https://claude.ai/artifact/Pvn1EsxpR2tawD5UZp3bfC (read `project/README.md`, `project/tokens.json` and `project/components/bundle.css` with the Artifact tool when exact values or the latest changes matter). The values below are the snapshot at the time this skill was written.

## Tokens

Colors (dark):
- Ground and surfaces: `bg #08090a`, `surface-100 #0e0f10`, `surface-200 #141517`, `surface-300 #1b1c1f`, `surface-400 #26272b`. Elevation = one step lighter.
- Lines: `border-subtle #1d1e21` (decorative), `border #2a2b2f` (card outlines), `border-control #70717a` (interactive outlines, 3:1).
- Text: `ink #ededee` headings, `ink-muted #a3a4aa` body, `ink-subtle #85868d` placeholders and captions (never on surface-400).
- Accent: `accent #ff3d9a`, `accent-hover #ff70b4`, `accent-tint #ff3d9a1f` (selection wash), `on-accent #0a0a0b` (text on pink fills).
- Status: `success #5fd3a0`, `warning #e8b44f`, `danger #ff7a59` (orange on purpose, never confused with pink). Always pair with a word or icon. Never set danger on an accent fill.

Type:
- Titles: Fraunces Light (weight 300), ALWAYS upright, never italic, never bold. `display` 72/72, `title-1` 48/52 (both tracking -0.05em), `title-2` 30/36 (-0.025em). End a `display` line with a pink full stop (`<span class="hush-title-dot">.</span>`); no other title decoration. Fraunces is an approximation of Statamic's P22 Mackinac.
- Everything else: Geist (400/500). `title-3` 16/22 500, `body` 14/22, `body-sm` 13/20, `label` 13/16 500, `caption` 12/16. Code: Geist Mono 12.5/20.
- Load fonts as real files where possible (Fraunces Light woff2 from Google Fonts, latin subset); otherwise Google Fonts links.

Spacing (4px grid): 4, 8, 12, 16, 24, 32, 48. Radii: sm 4 (badges), md 6 (buttons, inputs), lg 8 (cards), xl 12 (modals, the page panel), full (dots). Shadows only for floating layers (`0 8px 24px rgba(0,0,0,.5)` popover, `0 24px 64px rgba(0,0,0,.6)` modal) and always with a `border` outline.

Motion: minimal. Durations 100ms (hover colour), 160ms (fades, menus), 240ms (modals, panels, glow fade); easing `cubic-bezier(0.2, 0, 0, 1)` in, `cubic-bezier(0.4, 0, 1, 1)` out. Animate only opacity, colour, transform; menus move at most 4px. Nothing bounces, loops or animates on scroll. Under `prefers-reduced-motion` drop transforms.

## Rules

- Separate regions with 1px hairlines, not shadows or fills. Cards: `surface-200`, `border`, 16px padding, radius 8, no card-in-card.
- Hover lifts a surface one step (200 to 300), pressed lifts to 400. Disabled: 40% opacity, no hover.
- Focus: solid 2px `accent` ring, 2px offset, on everything focusable.
- Pink is an accent, not a theme: focus ring, active-nav marker, selection wash, link hover, the title full stop, at most one filled `accent` button per view, and the page frame. Never pink for other large fills, gradients, chart series or status.
- Buttons are 32px tall: `primary` (ink fill, bg text), `secondary` (surface-200, `border-control`), `ghost`, `accent` (the single call to action). Inputs 32px, `border-control` outline, label always visible, placeholders show an example. Badges 20px with optional status dot.
- Copy: short and flat, sentence case, no exclamation marks, no emoji, "you" voice. Numbers, IDs and shortcuts in mono. Icons: 16px line set, 1.5px stroke, `currentColor` (Lucide fits), ink-muted by default; no emoji as icons.
- Slides in Hush: very little text, big serif titles, only graphs or data.
- Contrast: text 4.5:1 on the surface it sits on in every state (checked for all pairs above).

## Frame and background

Every page sits in a 16px pink (`accent`) frame with the `bg` page as a rounded (radius-xl) panel inside, like a card inset in a coloured mat (reference: the CMS Conf slide, lime border around a dark panel). Content never crosses the frame. Full-bleed hero screens may drop it.

Inside the panel, a layered background (kept subtle; tuned down after feedback that it was too bright):
1. Static film grain (SVG feTurbulence data URI, alpha ~.06).
2. A 24px dot grid, dots `rgb(133 134 141 / .2)`, fading out toward the bottom via a radial mask.
3. On hover, pink dots (`accent`, ~1.1px) within ~180px of the pointer light up at ~.5 opacity, trailing the cursor slightly (lerp .18), fading over 240ms when the pointer leaves. Nothing moves on its own. Touch devices see only the static grid.

Implementation pattern (CSS custom properties `--hush-x` / `--hush-y` set by a small `pointermove` script that also toggles `html.hush-hover`):

```css
html { background: var(--accent); padding: 16px; box-sizing: border-box; min-height: 100vh; }
body { position: relative; isolation: isolate; background: var(--bg); border-radius: 12px; min-height: calc(100vh - 32px); margin: 0; }
body::before, body::after { content: ""; position: fixed; inset: 16px; border-radius: 12px; z-index: -1; pointer-events: none; }
body::before { /* grain + grey dots */
  background-image: radial-gradient(circle, rgb(133 134 141 / .2) 1px, transparent 1.6px), url("data:image/svg+xml,...feTurbulence...");
  background-size: 24px 24px, 200px 200px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, #000 35%, rgb(0 0 0 / .25) 100%); }
body::after { /* pink hover dots */
  background-image: radial-gradient(circle, var(--accent) 1.1px, transparent 1.8px); background-size: 24px 24px;
  mask-image: radial-gradient(circle 180px at var(--hush-x, -400px) var(--hush-y, -400px), #000, transparent);
  opacity: 0; transition: opacity 240ms cubic-bezier(0.2, 0, 0, 1); }
html.hush-hover body::after { opacity: .5; }
```

Pitfalls learned: use real `::before`/`::after` rules with `position: fixed` and a negative z-index inside an `isolation: isolate` body; make sure no edit removes the base pseudo-element rule (the layers silently vanish); test in a real headless browser with a simulated mouse move before claiming it works.

## Workflow

1. Read the artifact files above if you need the exact current values; tell Maciek if they differ from this skill.
2. Build with the tokens as CSS custom properties; never hard-code hex values in components.
3. Keep the page minimal: one centred column, generous empty space, left-aligned text.
4. Verify by rendering (screenshot) before delivering, and check contrast of any new colour pair.
## Project overrides (palmiak-astro-blog)

Maciek asked for motion and scroll-based animation on this site, which overrides "Nothing bounces, loops or animates on scroll" above. Everything else in the system still holds.

- Scroll motion uses CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`) inside `@supports (animation-timeline: view())`, so unsupported browsers show the finished state. Shared helpers live in `src/styles/motion.css` (`[data-reveal]`, `[data-rule]`, `.scroll-lit`).
- Animate only `opacity`, `transform`, colour and `clip-path`. Use the Hush easings; scroll-linked motion is linear. No bounce, no looping, no auto-playing motion.
- Spend the motion budget in a few places: the hero title reveal, the scroll-lit about paragraph, drawn hairlines on lists, the footer sign-off. Lists reveal rows; do not animate every card.
- `prefers-reduced-motion: reduce` shows the final state with no transforms (handled globally in `motion.css`).
- The pink frame is fixed to the viewport (`--frame`, 16px, 8px under 640px) so it stays while content scrolls beneath it.
- Tokens live in `src/styles/tokens.css`; fonts are self-hosted from `public/fonts` (Fraunces, Geist, Geist Mono variable woff2).
- Buttons and badges are global classes (`.btn .btn-primary|secondary|ghost|accent`, `.badge`); page templates reuse `PostRow`, `SectionHeader`, `ScrollLit`, `Tag` and `NewsletterBox` in `src/components`; `/style-guide` documents them.
- The home hero uses a `display-xl` size (up to 168px) on top of the `display` token. Long-form post prose is 17-18px; Hush's 14px body is too small for reading.
- Other motion in use: header morph (full-width bar to a container-width floating bar over the first 90px of scroll), pinned hero recede, hero name weight 300 to 450 near the pointer (`Hero.astro`), text-roll hover on `.btn`, `.nav-link` and footer links (wrapped by `hush.ts`), post outline with a sliding pink marker (`toc.ts`), and the scroll-linked event ticker (`Ticker.astro`).
- `/style-guide` shows every component live (tokens, type, controls, navigation, rows, map, gallery, ticker, social images). Keep it in step when a component changes.
