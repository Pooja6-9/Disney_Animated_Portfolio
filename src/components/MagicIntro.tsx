import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Crown, Sparkles, X } from 'lucide-react';
import { Castle } from './Castle';
import { sparkleBurst } from './MagicButton';
import { education, profile } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';

/** Fired on window when the intro hands over to the About section. */
export const ABOUT_ARRIVE_EVENT = 'magic:about-arrive';

type Phase = 'sky' | 'book' | 'open' | 'exit';

// Milliseconds from start. The first viewing gets the full show; repeat clicks get a short one.
const FULL = { book: 1900, open: 2600, exit: 3800, done: 4500 };
const QUICK = { book: 0, open: 450, exit: 1600, done: 2300 };
const EXIT_MS = 700;

const DUST_COLORS = ['#ffffff', '#ffd1ea', '#ff8fc8', '#f4c9a8', '#e2d4fb'];
const SVG_NS = 'http://www.w3.org/2000/svg';
const ARC = 'M 70 480 C 260 30, 740 30, 930 400';

/**
 * Intercepts clicks on any link to #about and plays a short animated
 * sequence (shooting star, fireworks, 3D storybook) before going to the section.
 * Skipped completely when the user prefers reduced motion.
 */
export function MagicIntro() {
  const reduced = useReducedMotion();
  const [run, setRun] = useState<{ id: number; quick: boolean } | null>(null);
  const played = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href="#about"]');
      if (!link || link.closest('[data-no-magic]')) return;
      e.preventDefault();
      setRun({ id: Date.now(), quick: played.current });
      played.current = true;
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [reduced]);

  if (!run) return null;
  return <IntroShow key={run.id} quick={run.quick} onDone={() => setRun(null)} />;
}

function IntroShow({ quick, onDone }: { quick: boolean; onDone: () => void }) {
  const timeline = quick ? QUICK : FULL;
  const [phase, setPhase] = useState<Phase>(quick ? 'book' : 'sky');
  const [fireworks, setFireworks] = useState(false);
  const timers = useRef<number[]>([]);
  const exited = useRef(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  const arrive = useCallback(() => {
    const about = document.getElementById('about');
    if (about) {
      about.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      history.replaceState(null, '', '#about');
      about.setAttribute('tabindex', '-1');
      about.focus({ preventScroll: true });
    }
    window.dispatchEvent(new Event(ABOUT_ARRIVE_EVENT));
  }, []);

  const exit = useCallback(() => {
    if (exited.current) return;
    exited.current = true;
    timers.current.forEach(clearTimeout);
    setPhase('exit');
    arrive();
    timers.current = [window.setTimeout(onDone, EXIT_MS)];
  }, [arrive, onDone]);

  // Timeline + scroll lock + keyboard skip
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    skipRef.current?.focus({ preventScroll: true });

    const t = timers.current;
    if (!quick) t.push(window.setTimeout(() => setPhase('book'), timeline.book));
    t.push(
      window.setTimeout(() => {
        setPhase('open');
        const r = bookRef.current?.getBoundingClientRect();
        if (r) window.setTimeout(() => sparkleBurst(r.left + r.width, r.top + r.height / 2, 26), 350);
      }, timeline.open),
    );
    t.push(window.setTimeout(exit, timeline.exit));

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && exit();
    window.addEventListener('keydown', onKey);
    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: (i * 37.7) % 100,
        top: (i * 23.3) % 70,
        size: 1 + ((i * 7) % 3),
        delay: (i % 10) * 0.3,
      })),
    [],
  );

  return (
    <div
      className={`intro-overlay phase-${phase} ${phase === 'exit' ? 'is-exit' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Opening the story of the About section"
      onClick={exit}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          aria-hidden="true"
        />
      ))}

      {!quick && <SkyShow onArcDone={() => setFireworks(true)} fireworks={fireworks} />}

      <div className="intro-castle" aria-hidden="true">
        <Castle variant="sunset" idPrefix="intro-castle" className="h-auto w-full" />
      </div>

      {phase !== 'sky' && (
        <div className="book-stage" aria-hidden="true">
          <p className="intro-kicker script-kicker">Once upon a timeâ€¦</p>
          <div className="book-glow" />
          <div ref={bookRef} className={`book ${phase === 'open' || phase === 'exit' ? 'is-open' : ''}`}>
            <div className="book-page">
              <p className="text-[0.62em] font-semibold uppercase tracking-[0.3em] text-rosegold">Chapter One</p>
              <Sparkles className="mx-auto my-[0.5em] h-[1.1em] w-[1.1em] text-barbie" />
              <p className="font-display text-[1.45em] font-semibold leading-tight text-plum">The Girl Behind the Magic</p>
              <span className="mx-auto my-[0.7em] block h-px w-1/2 bg-gradient-to-r from-transparent via-barbie/60 to-transparent" />
              <p className="font-script text-[1.5em] leading-none text-barbie-deep">{profile.name}</p>
              <p className="mt-[0.6em] text-[0.62em] text-plum-soft">{education.institution}</p>
            </div>
            <div className="book-leaf" />
            <div className="book-cover">
              <div className="cover-face cover-front">
                <div className="cover-frame">
                  <Crown className="h-[2.2em] w-[2.2em] text-[#ffe1c4] drop-shadow-[0_0_10px_rgba(255,225,196,0.9)]" />
                  <p className="mt-[0.6em] font-script text-[1.6em] leading-none text-white">The Story of</p>
                  <p className="font-display text-[1.7em] font-semibold italic leading-tight text-white">{profile.name}</p>
                  <span className="mt-[0.8em] text-[0.6em] tracking-[0.4em] text-[#ffe1c4]">âœ¦ âœ¦ âœ¦</span>
                </div>
              </div>
              <div className="cover-face cover-back">
                <p className="font-script text-[1.4em] text-rosegold">Dream World</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        ref={skipRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          exit();
        }}
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/30"
      >
        Skip <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/** Shooting star arc with a fairy-dust trail, followed by fireworks. */
function SkyShow({ onArcDone, fireworks }: { onArcDone: () => void; fireworks: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const dustRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const path = pathRef.current!;
    const head = headRef.current!;
    const dust = dustRef.current!;
    const len = path.getTotalLength();
    const start = performance.now() + 250;
    const dur = 1400;
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    let raf = 0;
    let i = 0;

    const spawn = (x: number, y: number) => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('cx', String(x + (Math.random() * 10 - 5)));
      c.setAttribute('cy', String(y + (Math.random() * 10 - 5)));
      c.setAttribute('r', String(0.8 + Math.random() * 2.4));
      c.setAttribute('fill', DUST_COLORS[i++ % DUST_COLORS.length]);
      c.setAttribute('class', 'intro-dust');
      c.style.setProperty('--dx', `${Math.random() * 30 - 15}px`);
      c.style.setProperty('--dy', `${30 + Math.random() * 60}px`);
      c.addEventListener('animationend', () => c.remove());
      dust.appendChild(c);
    };

    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / dur, 0), 1);
      const e = ease(t);
      const p = path.getPointAtLength(e * len);
      path.style.strokeDashoffset = String(1 - e);
      head.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${now / 4})`);
      head.style.opacity = t > 0 && t < 1 ? '1' : '0';
      if (t > 0 && t < 1) {
        spawn(p.x, p.y);
        spawn(p.x, p.y);
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else onArcDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg className="intro-sky" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff8fc8" stopOpacity="0" />
          <stop offset="0.35" stopColor="#ffd1ea" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <filter id="arc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        ref={pathRef}
        className="intro-arc"
        d={ARC}
        pathLength={1}
        fill="none"
        stroke="url(#arc-grad)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset="1"
        filter="url(#arc-glow)"
      />
      <g ref={dustRef} />
      <g ref={headRef} style={{ opacity: 0 }} filter="url(#arc-glow)">
        <circle r="9" fill="#fff" opacity="0.5" />
        <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4 Z" fill="#fff" />
        <circle r="4" fill="#ffe7f3" />
      </g>

      {fireworks && (
        <g>
          <Firework x={230} y={190} delay={0} colors={['#ff8fc8', '#ffffff', '#f4c9a8']} />
          <Firework x={780} y={170} delay={0.2} colors={['#e2d4fb', '#ffffff', '#ff8fc8']} />
          <HeartFirework x={500} y={150} delay={0.42} />
        </g>
      )}
    </svg>
  );
}

function Firework({ x, y, delay, colors }: { x: number; y: number; delay: number; colors: string[] }) {
  const count = 26;
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill="#fff" className="fw-flash" style={{ animationDelay: `${delay}s` }} />
      {Array.from({ length: count }, (_, i) => {
        const a = (Math.PI * 2 * i) / count;
        const d = i % 2 ? 95 : 70;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 2 ? 2.6 : 2}
            fill={colors[i % colors.length]}
            className="fw-particle"
            style={
              {
                '--dx': `${Math.cos(a) * d}px`,
                '--dy': `${Math.sin(a) * d}px`,
                animationDelay: `${delay}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </g>
  );
}

/** A firework that bursts into a heart outline. */
function HeartFirework({ x, y, delay }: { x: number; y: number; delay: number }) {
  const count = 34;
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="#fff" className="fw-flash" style={{ animationDelay: `${delay}s` }} />
      {Array.from({ length: count }, (_, i) => {
        const t = (Math.PI * 2 * i) / count;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={2.6}
            fill={i % 3 === 0 ? '#ffffff' : '#ff6fb5'}
            className="fw-particle fw-heart"
            style={
              {
                '--dx': `${hx * 5.5}px`,
                '--dy': `${hy * 5.5}px`,
                animationDelay: `${delay}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </g>
  );
}
