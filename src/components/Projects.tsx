import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Clock,
  ExternalLink,
  FileText,
  Github,
  HeartPulse,
  PiggyBank,
  RotateCcw,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Tilt } from './Tilt';
import { CountUp } from './CountUp';
import { MagicButton, sparkleBurst } from './MagicButton';
import { profile, projects, type Project } from '../data/resume';

const ILLUSTRATIONS: Record<Project['illustration'], { main: LucideIcon; orbit: LucideIcon[]; bg: string }> = {
  finance: { main: Wallet, orbit: [PiggyBank, BarChart3], bg: 'from-[#ffd1e8] via-[#fbe3f1] to-[#e9dcfb]' },
  health: { main: Stethoscope, orbit: [HeartPulse, FileText], bg: 'from-[#e9dcfb] via-[#f6e6fb] to-[#ffd6ea]' },
  meal: { main: UtensilsCrossed, orbit: [Clock, BarChart3], bg: 'from-[#ffe1d6] via-[#ffe8f1] to-[#f1defa]' },
};

function Illustration({ kind, index }: { kind: Project['illustration']; index: number }) {
  const { main: Main, orbit, bg } = ILLUSTRATIONS[kind];
  return (
    <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${bg}`} aria-hidden="true">
      <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(0deg,transparent_0_22px,rgba(183,110,121,0.25)_22px_23px)]" />
      <span className="absolute left-5 top-4 font-script text-4xl text-rosegold/80">Tale {index + 1}</span>
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative transition-transform duration-700 group-hover:scale-110">
          <span className="icon-orb h-20 w-20">
            <Main className="h-9 w-9" />
          </span>
          {/* little orbiting companions */}
          <span className="orbit absolute inset-[-34px]">
            {orbit.map((O, i) => (
              <span
                key={i}
                className={`orbit-item absolute grid h-10 w-10 place-items-center rounded-full border border-white bg-white/85 text-barbie shadow-md ${
                  i === 0 ? 'left-0 top-1/2 -translate-y-1/2' : 'right-0 top-1/2 -translate-y-1/2'
                }`}
              >
                <O className="h-5 w-5" />
              </span>
            ))}
          </span>
        </div>
      </div>
      <Sparkles className="absolute right-6 top-5 h-5 w-5 animate-twinkle text-barbie" />
      <Sparkles className="absolute bottom-5 left-10 h-4 w-4 animate-twinkle text-lavender-deep" style={{ animationDelay: '1.2s' }} />
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLElement>(null);
  const backBtn = useRef<HTMLButtonElement>(null);
  const frontBtn = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);

  // Keep the hidden face out of the tab order and away from screen readers.
  useEffect(() => {
    if (frontRef.current) frontRef.current.inert = flipped;
    if (backRef.current) backRef.current.inert = !flipped;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    (flipped ? backBtn : frontBtn).current?.focus({ preventScroll: true });
  }, [flipped]);

  const flip = (e: ReactMouseEvent) => {
    sparkleBurst(e.clientX, e.clientY, 10);
    setFlipped((f) => !f);
  };

  return (
    <div className="flip-scene group">
      <div className={`flip-inner ${flipped ? 'is-flipped' : ''}`}>
        {/* Front: the storybook cover page */}
        <article ref={frontRef} className="flip-face flip-front glass flex flex-col overflow-hidden">
          <Illustration kind={project.illustration} index={index} />
          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-barbie/10 px-3 py-1 text-barbie-deep">{project.context}</span>
              {project.status && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lavender-light px-3 py-1 text-lavender-deep">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lavender-deep" aria-hidden="true" />
                  {project.status}
                </span>
              )}
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-plum">{project.name}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-plum-soft">
              <CalendarDays className="h-4 w-4 text-barbie" aria-hidden="true" />
              {project.period}
            </p>
            <p className="mt-4 leading-relaxed text-plum">{project.description}</p>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              {project.outcomes.map((o) => (
                <div key={o.label} className="rounded-2xl border border-white bg-gradient-to-br from-white to-blush-light/70 p-3 text-center">
                  <dt className="sr-only">{o.label}</dt>
                  <dd>
                    <CountUp value={o.value} className="block font-display text-2xl font-semibold text-barbie-deep" />
                    <span className="block text-xs leading-snug text-plum-soft" aria-hidden="true">
                      {o.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto pt-6">
              <button ref={frontBtn} type="button" onClick={flip} className="btn-magic btn-primary w-full !py-3 text-sm">
                <BookOpen className="h-4 w-4" aria-hidden="true" /> Open the tale
              </button>
            </div>
          </div>
        </article>

        {/* Back: what I did */}
        <article ref={backRef} className="flip-face flip-back glass flex flex-col overflow-hidden p-6 sm:p-7">
          <p className="script-kicker text-3xl">Tale {index + 1}</p>
          <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-plum">{project.name}</h3>

          <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-rosegold">My contribution</h4>
          <ul className="mt-3 space-y-3">
            {project.contributions.map((c) => (
              <li key={c} className="flex gap-3 text-sm leading-relaxed text-plum-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-barbie" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>

          <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-rosegold">Technologies</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="chip !py-1 !text-xs">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-magic btn-secondary !px-4 !py-2 text-sm">
                <Github className="h-4 w-4" aria-hidden="true" /> Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-magic btn-primary !px-4 !py-2 text-sm">
                <ExternalLink className="h-4 w-4" aria-hidden="true" /> Live demo
              </a>
            )}
            <button ref={backBtn} type="button" onClick={flip} className="btn-magic btn-secondary flex-1 !py-3 text-sm">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Close the book
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="Enchanted storybook"
        title="My Magical Creations"
        subtitle="Things I’ve designed and built. Open each tale to see what I did."
      />

      <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 100} className="h-full">
            <Tilt max={6} glare={false}>
              <ProjectCard project={p} index={i} />
            </Tilt>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center">
        <MagicButton href={profile.github} target="_blank" rel="noopener noreferrer" variant="secondary">
          <Github className="h-5 w-5" aria-hidden="true" />
          Explore more on GitHub
        </MagicButton>
      </Reveal>
    </section>
  );
}
