import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ArrowDown, Github, GraduationCap, Linkedin, MousePointerClick, Sparkles } from 'lucide-react';
import { Castle } from './Castle';
import { Butterfly } from './Butterfly';
import { MagicButton } from './MagicButton';
import { Tilt } from './Tilt';
import { Typewriter } from './Typewriter';
import { fireworkBurst } from '../effects';
import { education, profile } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Every phrase is taken from the resume summary and projects.
const BUILD_PHRASES = [
  'Python automation scripts',
  'SQL-backed applications',
  'responsive web pages',
  'AI-powered solutions with NLP',
  'relational database designs',
];

// Decorative stars that drift with the mouse at different depths.
const PARALLAX_STARS = [
  { left: '8%', top: '18%', depth: 30, size: 18 },
  { left: '46%', top: '12%', depth: -22, size: 12 },
  { left: '92%', top: '30%', depth: 26, size: 16 },
  { left: '60%', top: '82%', depth: -34, size: 14 },
  { left: '18%', top: '76%', depth: 20, size: 10 },
  { left: '78%', top: '8%', depth: -16, size: 10 },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const castleRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);
  const reduced = useReducedMotion();

  // Gentle scroll parallax: the castle drifts slower than the page.
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        if (castleRef.current) castleRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduced]);

  // Mouse parallax for the decoration layers.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse' || !sectionRef.current) return;
    sectionRef.current.style.setProperty('--mx', String(e.clientX / window.innerWidth - 0.5));
    sectionRef.current.style.setProperty('--my', String(e.clientY / window.innerHeight - 0.5));
  };

  const lightCastle = (x: number, y: number) => {
    fireworkBurst(x, y - 120);
    window.setTimeout(() => fireworkBurst(x - 110, y - 60), 220);
    window.setTimeout(() => fireworkBurst(x + 110, y - 80), 420);
    setLit((n) => n + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      {PARALLAX_STARS.map((s, i) => (
        <span
          key={i}
          className="parallax-layer motion-decor pointer-events-none absolute text-barbie/70"
          style={{ left: s.left, top: s.top, fontSize: s.size, '--depth': s.depth } as CSSProperties}
          aria-hidden="true"
        >
          <span className="block animate-twinkle" style={{ animationDelay: `${i * 0.5}s` }}>
            ✦
          </span>
        </span>
      ))}

      <div className="parallax-layer" style={{ '--depth': 18 } as CSSProperties}>
        <Butterfly className="left-[6%] top-[22%]" hue="pink" />
      </div>
      <div className="parallax-layer" style={{ '--depth': -14 } as CSSProperties}>
        <Butterfly className="right-[38%] top-[14%] hidden md:block" hue="lavender" delay={3} size={28} />
        <Butterfly className="bottom-[18%] right-[8%]" hue="gold" delay={6} size={30} />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div className="relative z-10 text-center lg:text-left">
          <p className="animate-enter script-kicker text-3xl sm:text-4xl" style={{ animationDelay: '0.1s' }}>
            Welcome to my Dream World
          </p>

          <h1
            className="animate-enter mt-3 font-display text-6xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
            style={{ animationDelay: '0.25s' }}
          >
            <span className="text-plum">{profile.firstName}</span>{' '}
            <span className="text-magic italic">{profile.lastName}</span>
          </h1>

          <p
            className="animate-enter mt-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-1.5 text-sm font-medium text-plum-soft backdrop-blur"
            style={{ animationDelay: '0.4s' }}
          >
            <GraduationCap className="h-4 w-4 text-barbie" aria-hidden="true" />
            {education.degree.replace('in ', '')} · {education.institution.split(',')[0]}
          </p>

          <p
            className="animate-enter mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft lg:mx-0"
            style={{ animationDelay: '0.55s' }}
          >
            {profile.intro}
          </p>

          <div className="animate-enter" style={{ animationDelay: '0.7s' }}>
            <Typewriter
              prefix="I build"
              phrases={BUILD_PHRASES}
              className="mx-auto mt-4 min-h-[2.2em] max-w-xl font-display text-xl italic text-plum lg:mx-0"
            />
          </div>

          <div
            className="animate-enter mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            style={{ animationDelay: '0.85s' }}
          >
            <MagicButton href="#about">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Explore My World
            </MagicButton>
            <MagicButton href="#projects" variant="secondary">
              View My Projects
            </MagicButton>
          </div>

          <div
            className="animate-enter mt-8 flex items-center justify-center gap-3 lg:justify-start"
            style={{ animationDelay: '1s' }}
          >
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/60 text-plum transition hover:-translate-y-1 hover:rotate-6 hover:text-barbie"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/60 text-plum transition hover:-translate-y-1 hover:-rotate-6 hover:text-barbie"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div ref={castleRef} className="will-change-transform">
            <div className="animate-enter" style={{ animationDelay: '0.3s', animationDuration: '1.6s' }}>
              <Tilt max={14} glare={false}>
                <button
                  type="button"
                  key={lit}
                  className={`castle-button block w-full ${lit ? 'castle-lit' : ''}`}
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    lightCastle(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
                  }}
                  aria-label="Light up the castle with fireworks"
                >
                  <span className="block animate-float">
                    <Castle idPrefix="hero-castle" className="h-auto w-full drop-shadow-[0_30px_40px_rgba(224,33,138,0.25)]" />
                  </span>
                </button>
              </Tilt>
            </div>
          </div>
          <p className="hint-bounce motion-decor pointer-events-none absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-semibold text-barbie-deep shadow-sm backdrop-blur">
            <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" /> Tap the castle for fireworks
          </p>
          <div
            className="pointer-events-none absolute left-1/2 top-[8%] -z-10 h-[78%] w-[78%] -translate-x-1/2 rounded-full border border-white/70 bg-white/20 blur-[1px]"
            aria-hidden="true"
          />
        </div>
      </div>

      <a
        href="#skills"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium uppercase tracking-[0.25em] text-plum-soft sm:flex"
        aria-label="Scroll down to Skills"
      >
        Scroll
        <ArrowDown className="h-4 w-4 animate-bounce text-barbie" aria-hidden="true" />
      </a>
    </section>
  );
}
