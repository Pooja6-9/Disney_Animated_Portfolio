import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { ArrowRight, Check, Lock, Play, Sparkles, Star, X } from 'lucide-react';
import { SectionHeading } from '../SectionHeading';
import { Reveal } from '../Reveal';
import { Tilt } from '../Tilt';
import { fireworkBurst, releaseButterflies } from '../../effects';
import { StarCatcher } from './StarCatcher';
import { SlipperShuffle } from './SlipperShuffle';
import { MirrorMemory } from './MirrorMemory';
import { LanternLights } from './LanternLights';
import { LanternIcon, MirrorIcon, SlipperIcon } from './icons';
import type { GameProps } from './types';

type Game = {
  id: string;
  name: string;
  blurb: string;
  goal: string;
  unlocks: string; // section id
  unlockLabel: string;
  art: ComponentType<{ className?: string }>;
  Component: ComponentType<GameProps>;
};

const StarArt = ({ className = '' }: { className?: string }) => (
  <Star className={`${className} fill-[#ffe7a3] text-[#ffd36e]`} aria-hidden="true" />
);

const GAMES: Game[] = [
  {
    id: 'stars',
    name: 'Star Catcher',
    blurb: 'Wishing stars are falling over the kingdom!',
    goal: 'Catch 8 stars with your tiara in 30 seconds.',
    unlocks: 'skills',
    unlockLabel: 'My Magic Toolkit',
    art: StarArt,
    Component: StarCatcher,
  },
  {
    id: 'slipper',
    name: 'Glass Slipper Shuffle',
    blurb: 'A glass slipper hides under one of three royal cushions.',
    goal: 'Follow the shuffle and find the slipper.',
    unlocks: 'experience',
    unlockLabel: 'My Journey Through the Kingdom',
    art: SlipperIcon,
    Component: SlipperShuffle,
  },
  {
    id: 'mirror',
    name: 'Magic Mirror Memory',
    blurb: 'The enchanted mirror shows each picture twice.',
    goal: 'Match all 6 pairs of fairytale cards.',
    unlocks: 'projects',
    unlockLabel: 'My Magical Creations',
    art: MirrorIcon,
    Component: MirrorMemory,
  },
  {
    id: 'lanterns',
    name: 'Lantern Lights',
    blurb: 'Floating lanterns wait to light up the night sky.',
    goal: 'Light all 12 lanterns in 20 seconds.',
    unlocks: 'achievements',
    unlockLabel: 'My Crown Collection',
    art: LanternIcon,
    Component: LanternLights,
  },
];

function goTo(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

function grandFinale() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  [0, 300, 600, 900, 1200, 1500].forEach((d, i) =>
    window.setTimeout(() => fireworkBurst(w * (0.2 + ((i * 0.27) % 0.6)), h * (0.25 + (i % 3) * 0.12)), d),
  );
  window.setTimeout(() => releaseButterflies(w / 2, h / 2, 14), 400);
}

/** A fairground of mini-games; each one unlocks (and leads to) a section of the portfolio. */
export function GameKingdom() {
  const [active, setActive] = useState<Game | null>(null);
  const [won, setWon] = useState<Set<string>>(new Set());
  const wonRef = useRef(new Set<string>());
  const opener = useRef<HTMLElement | null>(null);
  const allDone = won.size === GAMES.length;

  const markWon = (id: string) => {
    if (wonRef.current.has(id)) return;
    wonRef.current.add(id);
    setWon(new Set(wonRef.current));
    if (wonRef.current.size === GAMES.length) window.setTimeout(grandFinale, 1200);
  };

  const open = (g: Game, el: HTMLElement) => {
    opener.current = el;
    setActive(g);
  };
  const close = useCallback(() => {
    setActive(null);
    opener.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section id="kingdom" className="relative px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="Play your way in"
        title="The Kingdom Funfair"
        subtitle="Win a mini-game to unlock a corner of my world, or skip straight there. Every section is always open."
      />

      <div className="relative mx-auto max-w-6xl">
        {/* winding fairground path behind the attractions */}
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M40 150 C 180 40, 300 260, 500 150 S 820 40, 960 150" fill="none" stroke="#f8c8dc" strokeWidth="10" strokeLinecap="round" strokeDasharray="2 22" />
        </svg>

        <ul className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((g, i) => {
            const done = won.has(g.id);
            const Art = g.art;
            return (
              <Reveal as="li" key={g.id} delay={i * 90} className={i % 2 ? 'lg:mt-12' : ''}>
                <Tilt>
                  <article className="glass glass-hover group relative flex h-full flex-col overflow-hidden p-6 text-center">
                    <span className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${done ? 'bg-barbie text-white' : 'bg-white/80 text-plum-soft'}`}>
                      {done ? <Check className="h-3 w-3" aria-hidden="true" /> : <Lock className="h-3 w-3" aria-hidden="true" />}
                      {done ? 'Unlocked' : 'Locked'}
                    </span>
                    <div className="mx-auto mt-4 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blush-light to-lavender-light shadow-inner transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110">
                      <Art className="h-14 w-14 animate-float" />
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-rosegold">Attraction {i + 1}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-plum">{g.name}</h3>
                    <p className="mt-2 text-sm text-plum-soft">{g.blurb}</p>
                    <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs text-plum">
                      Unlocks <span className="font-semibold text-barbie-deep">{g.unlockLabel}</span>
                    </p>
                    <div className="mt-auto flex flex-col gap-2 pt-5">
                      <button type="button" onClick={(e) => open(g, e.currentTarget)} className="btn-magic btn-primary !py-2.5 text-sm">
                        <Play className="h-4 w-4" aria-hidden="true" /> {done ? 'Play again' : 'Play'}
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo(g.unlocks)}
                        className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-barbie-deep underline-offset-4 hover:underline"
                      >
                        Skip to section <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-10 text-center">
          <p className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold ${allDone ? 'border-transparent bg-gradient-to-r from-barbie to-lavender-deep text-white' : 'border-white bg-white/70 text-plum'}`}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {allDone ? 'You unlocked the whole kingdom! 👑' : `${won.size} of ${GAMES.length} attractions won. Win them all for a fireworks finale`}
          </p>
        </Reveal>
      </div>

      {active && (
        <GameModal
          key={active.id}
          game={active}
          onClose={close}
          onWin={() => markWon(active.id)}
          onEnter={() => {
            setActive(null);
            window.setTimeout(() => goTo(active.unlocks), 50);
          }}
        />
      )}
    </section>
  );
}

function GameModal({ game, onClose, onWin, onEnter }: { game: Game; onClose: () => void; onWin: () => void; onEnter: () => void }) {
  const [won, setWon] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { Component } = game;

  // Stable callback so game loops don't restart on re-render.
  const handleWin = useCallback(() => {
    setWon(true);
    onWin();
    const r = panelRef.current?.getBoundingClientRect();
    if (r) {
      fireworkBurst(r.left + r.width * 0.3, r.top + 80);
      window.setTimeout(() => fireworkBurst(r.left + r.width * 0.7, r.top + 60), 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="game-backdrop fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-plum/50 p-3 backdrop-blur-md sm:p-6" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="game-panel glass relative my-auto w-full max-w-xl p-5 outline-none sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close game"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-plum transition hover:rotate-90 hover:text-barbie"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="script-kicker text-2xl">Kingdom Funfair</p>
        <h3 id="game-title" className="font-display text-2xl font-semibold text-plum">
          {game.name}
        </h3>
        <p className="mb-5 mt-1 text-sm text-plum-soft">{game.goal}</p>

        <Component onWin={handleWin} />

        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          {won ? (
            <>
              <p className="font-semibold text-barbie-deep">✨ Unlocked: {game.unlockLabel}</p>
              <button type="button" onClick={onEnter} className="btn-magic btn-primary !py-2.5 text-sm">
                Enter now <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <span className="text-xs text-plum-soft">Press Esc to close</span>
              <button type="button" onClick={onEnter} className="text-sm font-semibold text-barbie-deep underline-offset-4 hover:underline">
                Skip the game and go to {game.unlockLabel} →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
