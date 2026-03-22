# maciekpalmowski.dev — Design System & Style Guide

A reference for anyone (human or AI) adding new components, pages, or features to this site. Follow these guidelines precisely to maintain visual consistency.

---

## Typography

Three fonts. Each has a specific role — never swap them.

### Unbounded (Google Fonts)
- **Role**: All display text, headings, section titles, post titles, talk titles, stat numbers
- **Weights used**: 600 (post titles, talk titles), 700 (section headings, nl title), 800 (hero name, h1)
- **Letter-spacing**: `-0.03em` at large sizes, `-0.02em` at medium sizes
- **Usage**: `font-family: 'Unbounded', sans-serif`

```css
/* Hero / H1 */
font-family: 'Unbounded', sans-serif;
font-size: 40px;
font-weight: 800;
letter-spacing: -0.03em;
line-height: 1.05;

/* Section titles / H2 */
font-family: 'Unbounded', sans-serif;
font-size: 18px;
font-weight: 700;
letter-spacing: -0.03em;

/* Post titles */
font-family: 'Unbounded', sans-serif;
font-size: 15px;
font-weight: 600;
letter-spacing: -0.025em;
line-height: 1.4;

/* Article H2 */
font-family: 'Unbounded', sans-serif;
font-size: 16px;
font-weight: 700;
letter-spacing: -0.02em;

/* Article H3 */
font-family: 'Unbounded', sans-serif;
font-size: 12px;
font-weight: 600;
letter-spacing: -0.01em;
```

### Instrument Serif (Google Fonts)
- **Role**: One specific use only — the italic subtitle on the hero ("Developer & Speaker"). Also used for article lede paragraphs and blockquotes.
- **Weight**: 400 italic only
- **Never use it outside these contexts**

```css
/* Hero subtitle */
font-family: 'Instrument Serif', serif;
font-size: 42px;
font-weight: 400;
font-style: italic;
letter-spacing: -0.01em;
line-height: 1.1;

/* Article lede */
font-family: 'Instrument Serif', serif;
font-size: 20px;
font-style: italic;
line-height: 1.55;

/* Blockquote */
font-family: 'Instrument Serif', serif;
font-size: 18px;
font-style: italic;
line-height: 1.7;
```

### IBM Plex Mono (Google Fonts)
- **Role**: All metadata, labels, tags, dates, buttons, nav links, captions, footer text, breadcrumbs
- **Weights used**: 300 (fine print), 400 (standard)
- **Always uppercase + letter-spacing for labels**

```css
/* Section labels */
font-family: 'IBM Plex Mono', monospace;
font-size: 9px;
letter-spacing: 0.16em;
text-transform: uppercase;

/* Dates / metadata */
font-family: 'IBM Plex Mono', monospace;
font-size: 9px;
letter-spacing: 0.05em;

/* Buttons */
font-family: 'IBM Plex Mono', monospace;
font-size: 10–11px;
letter-spacing: 0.06–0.08em;
```

### Inter (Google Fonts)
- **Role**: Body text only — paragraphs, bio, about text, excerpts
- **Weights used**: 300 (body), 400 (default), 500 (strong/bold within body)

```css
/* Body / prose */
font-family: 'Inter', sans-serif;
font-size: 15–16px;
font-weight: 300;
line-height: 1.8–1.85;
```

---

## Color Palette

```css
--bg:   #0b0b0e;   /* Page background — near-black */
--bg1:  #111116;   /* Hover backgrounds, input fields, secondary surfaces */
--bd:   rgba(255,255,255,0.07);   /* Default borders — very subtle */
--bd2:  rgba(255,255,255,0.14);   /* Emphasis borders — hover states, author avatar */
--hi:   #eaeaf0;   /* Primary text — headings, strong, active elements */
--mid:  #9898b0;   /* Secondary text — body copy, excerpts, bio */
--dim:  #52526a;   /* Tertiary text — dates, events, footer, placeholders */
```

### Synthwave Accent Palette

Three accent colors used **only as gradients** — never as flat fills on large surfaces.

```css
--pk: #ff2d78;   /* Pink */
--vi: #a855f7;   /* Violet */
--gr: #00ffb3;   /* Neon green */

/* Full gradient (pink → violet → green) */
background: linear-gradient(90deg, #ff2d78, #a855f7, #00ffb3);

/* Pink → violet (buttons, nav CTA, decorative elements) */
background: linear-gradient(90deg, #ff2d78, #a855f7);

/* Violet → green (stat numbers, about link dash) */
background: linear-gradient(90deg, #a855f7, #00ffb3);
```

### Where gradients are used

| Element | Gradient |
|---|---|
| Hairline dividers between sections | Full (pink → violet → green) |
| Hero subtitle text fill | Full |
| Stat numbers text fill | Violet → green |
| Section label dot | Pink → violet (as circle bg) |
| "Read more" dash | Pink → violet (as 12px line) |
| About link dash | Violet → green (as 16px line) |
| Pip/eyebrow dashes | Pink (18px), violet (10px), green (6px) |
| Primary CTA button border + bg tint | Green only |
| Subscribe button border + bg tint | Violet only |
| Nav contact button border + bg tint | Violet only |

**Never** use a gradient as a button background fill. All buttons are transparent with a tinted border.

---

## Buttons & Interactive Elements

All buttons follow the same pattern: **transparent background + colored border + matching tinted text + subtle background tint on hover**.

```css
/* Green variant — primary CTA ("Read the blog") */
border: 1px solid rgba(0,255,179,0.4);
color: #4dffd6;
background: rgba(0,255,179,0.06);
/* hover */
border-color: rgba(0,255,179,0.65);
background: rgba(0,255,179,0.1);

/* Violet variant — subscribe, nav contact, newsletter */
border: 1px solid rgba(168,85,247,0.45);
color: #c084fc;
background: rgba(168,85,247,0.07);
/* hover */
border-color: rgba(168,85,247,0.7);
background: rgba(168,85,247,0.12);

/* Ghost variant — secondary actions ("View talks") */
border: 1px solid rgba(255,255,255,0.14);
color: var(--mid);
background: transparent;
/* hover */
border-color: rgba(255,255,255,0.25);
color: var(--hi);

/* All buttons share */
font-family: 'IBM Plex Mono', monospace;
font-size: 10–12px;
letter-spacing: 0.05–0.08em;
padding: 8–10px 16–20px;
border-radius: 4px;
transition: border-color 0.15s, background 0.15s;
```

---

## Category Tags

Tags are transparent bordered pills in IBM Plex Mono. Each category has a fixed color from the accent palette:

```css
/* Base tag styles */
font-family: 'IBM Plex Mono', monospace;
font-size: 9px;
letter-spacing: 0.1em;
text-transform: uppercase;
padding: 3px 8px;
border-radius: 3px;

/* Conferences / WordPress → Violet */
color: #c084fc;
border: 1px solid rgba(168,85,247,0.3);
background: rgba(168,85,247,0.07);

/* Security → Pink */
color: #f472b6;
border: 1px solid rgba(255,45,120,0.3);
background: rgba(255,45,120,0.07);

/* Astro / WordCamp / Green topics */
color: #4dffd6;
border: 1px solid rgba(0,255,179,0.3);
background: rgba(0,255,179,0.06);
```

---

## Layout

### Column width
All content is constrained to a single centered column:

```css
.col {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 24px;
}
```

Full-bleed elements (hairline dividers, prev/next nav, newsletter strip on article pages) break out of the column intentionally.

### Section spacing
```css
/* Standard section padding */
padding: 52px 0;

/* Hero */
padding: 84px 0 76px;

/* Section header wrapper */
padding: 52px 0 24px;
```

### Borders
All structural borders use the same subtle value:
```css
border: 1px solid rgba(255,255,255,0.07); /* --bd */
```

Emphasis borders (hover states, focused inputs, author avatar):
```css
border: 1px solid rgba(255,255,255,0.14); /* --bd2 */
```

---

## Section Labels

Every section starts with a small mono label + gradient dot, followed by an Unbounded title:

```html
<div class="sec-label">
  <span class="sec-dot"></span>
  Writing
</div>
<div class="sec-title">Latest posts</div>
```

```css
.sec-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mid);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.sec-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff2d78, #a855f7);
  flex-shrink: 0;
}

.sec-title {
  font-family: 'Unbounded', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--hi);
}
```

---

## Gradient Hairline Dividers

Used between major sections. Always full-width (outside `.col`):

```html
<div class="grad-bar"></div>
```

```css
.grad-bar {
  height: 1px;
  background: linear-gradient(90deg, #ff2d78, #a855f7, #00ffb3);
}
```

Placed after: hero, about section, talks section, and footer.

---

## Logo

The `<>` chevron SVG with gradient strokes, paired with Unbounded wordmark:

```html
<div class="logo">
  <svg width="26" height="20" viewBox="0 0 28 22" fill="none">
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff2d78"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
      <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a855f7"/>
        <stop offset="100%" stop-color="#00ffb3"/>
      </linearGradient>
    </defs>
    <polyline points="9,2 2,11 9,20" stroke="url(#lg1)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <polyline points="19,2 26,11 19,20" stroke="url(#lg2)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>
  <div class="logo-text">maciek<br>palmowski</div>
</div>
```

```css
.logo-text {
  font-family: 'Unbounded', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--hi);
  line-height: 1.4;
}
```

---

## Navigation

```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 54px;
  border-bottom: 1px solid var(--bd);
  position: sticky;
  top: 0;
  background: rgba(11,11,14,0.95);
  backdrop-filter: blur(12px);
  z-index: 10;
}

.nav-link {
  font-size: 13px;
  color: var(--mid);
  transition: color 0.15s;
}
.nav-link:hover { color: var(--hi); }
```

---

## Post List Items

Posts are plain bordered rows — no cards, no thumbnails:

```css
.post {
  border-top: 1px solid var(--bd);
  cursor: pointer;
  transition: background 0.12s;
}
.post:hover { background: var(--bg1); }
.post-inner { padding: 28px 0; }

/* Title dims slightly on default, full white on hover */
.post-title { color: var(--hi); }

/* "Read more" uses gradient dash */
.read-more {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--mid);
  transition: color 0.12s;
}
.post:hover .read-more { color: var(--hi); }

.rm-dot {
  width: 12px;
  height: 1px;
  background: linear-gradient(90deg, #ff2d78, #a855f7);
  display: inline-block;
  flex-shrink: 0;
}
```

---

## Article Body Typography

```css
/* Paragraph */
font-size: 16px;
line-height: 1.85;
color: var(--mid);
font-weight: 300;
margin-bottom: 24px;

/* Strong within paragraph */
color: var(--hi);
font-weight: 500;

/* Unordered list — gradient dash bullets */
ul li::before {
  content: '';
  display: block;
  width: 12px;
  height: 1px;
  background: linear-gradient(90deg, #ff2d78, #a855f7);
  flex-shrink: 0;
  margin-top: 12px;
}

/* Blockquote */
padding: 20px 24px;
border-left: 2px solid #a855f7;
background: rgba(168,85,247,0.05);
border-radius: 0 4px 4px 0;

/* Figure / inline image */
border-radius: 6px;
border: 1px solid var(--bd);
figcaption: IBM Plex Mono, 9px, var(--dim), centered
```

---

## Hover Conventions

| Element | Default state | Hover state |
|---|---|---|
| Nav links | `--mid` | `--hi` |
| Post rows | transparent bg | `--bg1` bg |
| Post titles | `--hi` | unchanged (row hover handles it) |
| Talk titles | `--mid` | `--hi` |
| "Read more" | `--mid` | `--hi` |
| Buttons (green) | `rgba(0,255,179,0.06)` bg | `rgba(0,255,179,0.1)` bg |
| Buttons (violet) | `rgba(168,85,247,0.07)` bg | `rgba(168,85,247,0.12)` bg |
| Social links | platform-specific tint | see below |
| Footer links | `--dim` | `--mid` |

### Social link hover tints
```css
.bsky:hover  { color: #74b9ff; border-color: rgba(116,185,255,0.35); }
.tw:hover    { color: #e8eaf0; border-color: rgba(255,255,255,0.3); }
.li:hover    { color: #60a5fa; border-color: rgba(96,165,250,0.35); }
.gh:hover    { color: #c084fc; border-color: rgba(192,132,252,0.35); }
```

---

## What NOT to do

- **No gradient fills on buttons** — borders and tints only
- **No gradient on hover effects** — hovers are color shifts, not gradient reveals
- **No solid neon color fills** — accents only appear through gradients, borders, and text fills
- **No shadows or glows** — depth is created with background color differences (`--bg` vs `--bg1`) and borders
- **No card components** — content is separated by `1px solid var(--bd)` borders, not elevated cards
- **No rounded corners larger than 6px** — tags use 3px, buttons 4px, images 6px
- **No Inter for headings** — Unbounded only
- **No Unbounded for body text** — Inter only
- **No Instrument Serif outside** the hero subtitle, article lede, and blockquotes
- **No color in section labels** — always `--mid`, with only the 5px gradient dot as the accent
- **Never increase `--mid` lightness further** — `#9898b0` is the accessibility-balanced value

---

## Google Fonts Import

Always include this at the top of any stylesheet:

```css
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700;800&family=Instrument+Serif:ital@1&family=IBM+Plex+Mono:wght@300;400&family=Inter:wght@300;400;500&display=swap');
```
