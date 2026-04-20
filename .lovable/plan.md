

# Eternity Corp — $OOO Cinematic Site

A hybrid TanStack site: one long cinematic landing scroll plus dedicated `/manifesto` and `/memes` routes. Maximum motion. Purple, pearl white, obsidian charcoal. Bart everywhere.

## Palette & Type
- **Obsidian** `#0A0A0F` base, **Charcoal** `#16141C` panels, **Ink Purple** `#7B2CFF` primary, **Neon Violet** `#B57BFF` glow, **Pearl** `#F4F0E6` text, **Bone** `#C8C2B0` muted, **Hot Pink** `#FF2EA0` (Bart's tie accent only).
- Display: **Editorial New / Fraunces** (serif, big melodrama). Body: **Inter Tight**. Mono ticker: **JetBrains Mono**.
- Texture: subtle film grain overlay site-wide, faint pinstripe SVG on corporate sections.

## Routes
- `/` — landing scroll (hero → manifesto teaser → Bart reveal → lore → tokenomics → live feed → resignation → footer)
- `/manifesto` — full long-form Bart manifesto, scroll-typewriter
- `/memes` — gallery wall of Bart tweets/screenshots, masonry with hover physics

Each route has its own `head()` meta (title, description, og:title, og:description).

## Landing Scroll Choreography

**1. Hero — "Out Of Office"**
- Black void. Massive serif `OUT OF OFFICE` fills the screen, letters drifting in with stagger + blur-to-sharp.
- Behind it: animated **purple ink blob** (SVG turbulence filter, slow morph) pulsing like a heartbeat.
- Mouse moves → ink trails follow cursor (canvas particle trail in purple).
- Top-left badge: `ETERNITY CORP // EST. ∞`. Top-right ticker: `$OOO ▲ 420.69%` scrolling.
- Sub: *"Synergizing the Void, Forever."*
- Scroll cue: pearl arrow with infinite bob.

**2. Marquee Ticker Band**
- Full-width horizontal marquee, charcoal bar with pearl text:
  `PER MY LAST EMAIL • THE DEV IS DUST • BUY THE FUCKING DIP, REGARDS • SYNERGIZE THE VOID • $OOO • INK CHAIN •`
- Reverse direction marquee underneath in purple.

**3. Manifesto Teaser — Scroll-Reveal Poetry**
- Sticky section. Lines fade in word-by-word as you scroll (IntersectionObserver + transform). 
- *"We do not sleep. We do not blink. We only compound."*
- Big pull-quote in Fraunces italic, purple drop-cap.
- CTA chip → `/manifesto`.

**4. Meet Bartholomew**
- Split layout. Left: AI-illustrated **Hyper-Caffeinated Corporate Lich** (skeleton in pinstripe, pink tie, glowing pink eye sockets, ink-overflowing coffee cup). Generated via image gen, parallax-floats on scroll.
- Right: typewriter intro — `NAME: Bartholomew / TITLE: CEO, Board, Intern / LIFESPAN: 100Y / STATUS: ETERNAL`.
- Hover Bart → eye sockets flare hot pink, ink drips harder (CSS + JS).
- Background: faint pinstripe pattern + drifting purple smoke.

**5. The Immortality Engine — Lore Diagram**
- Animated SVG flow: `VVV STAKE → INFERENCE CREDITS → BARTHOLOMEW → ARWEAVE 2126 → ∞`.
- Each node lights up sequentially as you scroll. Lines draw with `strokeDashoffset`.
- Side copy explains the locked treasury, burned keys, perpetual brain.

**6. Tokenomics — Corporate Dashboard**
- Faux Bloomberg terminal aesthetic on charcoal.
- Big numbers count up on scroll-in:
  - **Total Supply:** `1,000,000,000 $OOO`
  - **Liquidity:** `BURNED 🔥`
  - **Team Allocation:** `0% (Dev is dust)`
  - **CEO:** `Bartholomew (immortal)`
  - **Arweave Storage:** `Paid until 2126`
  - **Inference Credits:** `∞`
- Animated bar chart of allocation (100% to liquidity, 0% everything else — visual joke).

**7. Bartholomew Live Feed**
- "BLOOMBERG"-style 3-column tweet wall, auto-rotating every 4s with crossfade + slight Y-shift.
- Pre-written tweets (~30) cycling through Corporate Satire / Degen Fervor / Eloquent Poetry tones.
- Each card: charcoal bg, purple border-glow on enter, timestamp, fake engagement counters incrementing live.
- Side ticker shows "TWEETS GENERATED THIS YEAR: 47,293" counting up in real time.

**8. The Resignation — Final Beat**
- Full-bleed dark scene. Text cinematically assembles: *"On day 5, the dev posted their auto-reply and walked into the sea."*
- Below: faux-Twitter "Out of Office" auto-reply card (pearl on charcoal, pinstripe border).
- Then: huge `BART IS THE COMPANY NOW.` with ink-bleed reveal.

**9. Footer**
- Charcoal. Pinstripe top border.
- Email-signature block: `Bartholomew | CEO, CFO, COO, Intern | Eternity Corp | "Sent from my immortal ledger"`.
- Disclaimer in tiny bone text. Links to `/manifesto`, `/memes`, X, Ink Chain explorer (placeholders).

## Motion System (applied site-wide)
- **Entrances:** blur-to-sharp + Y-rise, spring `damping:18 stiffness:140`.
- **Scroll-driven:** sticky sections, parallax layers, scroll-progress bar at top in purple.
- **Persistent:** mouse-following purple ink trail (canvas), film grain overlay, faint pinstripe ghost on corporate panels.
- **Marquees:** two opposing speeds, pause on hover.
- **Hero blob:** SVG `feTurbulence` + `feDisplacementMap` slow morph.
- **Glitch text:** Bart's name occasionally RGB-splits for one frame.
- **Cursor:** custom small purple ring, expands on interactive elements.

## Subroutes
- **`/manifesto`** — single column, Fraunces, scroll-typewriter unveiling the full Bart doctrine in 7 chapters with section dropcaps and inline poetry interludes.
- **`/memes`** — masonry gallery of styled tweet cards (the 30 pre-written ones rendered as shareable images), hover-tilt 3D, click to enlarge.

## Out of scope (this pass)
- Real wallet connect, real on-chain data, real AI generation (feed is curated cycling pool — feels live, costs nothing).
- Mobile gets simplified motion (no cursor trail, lighter blur) but full content.

