# Pooja Jain — Portfolio 🎀🏰

A Barbie × fairytale-kingdom themed personal portfolio built with React, Vite, TypeScript, Tailwind CSS v4 and Lucide icons. All artwork (castle, fairy princess, butterflies, game icons) is original SVG/CSS; no official character artwork or logos are used.

## Highlights

- **Animated hero**: a pink castle (click it for fireworks), a typewriter "I build…" line, and mouse parallax.
- **Storybook intro**: clicking *About* plays a shooting-star arc flown by a fairy princess, fireworks, and a 3D storybook that opens onto the About section.
- **Flying fairy princess**: she flies across the screen leaving fairy dust. Hover to pause her, click for a heart firework.
- **Kingdom Funfair**: four mini-games (Star Catcher, Glass Slipper Shuffle, Magic Mirror Memory, Lantern Lights). Each one unlocks and leads to a section; every section can also be reached directly.
- **3D and interactive details**: tilt cards, flip-card projects with count-up stats, a scroll-filled timeline, coin-flip badges, magnetic buttons, a scroll-progress ribbon, and copy-email.
- **Accessible**: keyboard-friendly, and every animation is disabled when the visitor prefers reduced motion.

## Run locally

```bash
npm install
npm run dev
```

Build for production with `npm run build` (output in `dist/`).

## Editing content

All content lives in [`src/data/resume.ts`](src/data/resume.ts) and is taken from the resume. To add a link to a project, set its `githubUrl` / `liveUrl` there. The project buttons only appear when a URL is set.

The downloadable resume is `public/Pooja_Jain_Resume.pdf`. Replace that file to update it.

## Structure

- `src/components/`: one component per section, plus shared pieces (`Castle`, `Princess`, `MagicIntro`, `FlyingPrincess`, `Tilt`, `Reveal`, `MagicButton`, …)
- `src/components/games/`: the Kingdom Funfair mini-games
- `src/effects.ts`: fireworks and butterfly-swarm effects
- `src/hooks/`: reduced-motion and active-section hooks
- `src/index.css`: theme tokens (`@theme`), component styles, keyframes and reduced-motion overrides
