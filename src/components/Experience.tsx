import { useEffect, useRef, useState } from 'react';
import { Briefcase, CalendarDays, MapPin, Sparkle } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Tilt } from './Tilt';
import { experiences } from '../data/resume';

/**
 * Vertical timeline whose glowing path fills as you scroll, with a star that
 * travels down it. Each marker lights up once the star reaches it.
 */
export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState<boolean[]>(() => experiences.map(() => false));

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = list.getBoundingClientRect();
        const line = window.innerHeight * 0.6;
        const p = Math.min(Math.max((line - r.top) / r.height, 0), 1);
        list.style.setProperty('--tl', p.toFixed(4));
        const items = Array.from(list.children).filter((c) => c.tagName === 'LI') as HTMLElement[];
        setReached((prev) => {
          const next = items.map((li) => li.getBoundingClientRect().top + 40 < line);
          return next.every((v, i) => v === prev[i]) ? prev : next;
        });
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section id="experience" className="relative px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="Chapters of my adventure"
        title="My Journey Through the Kingdom"
        subtitle="Internships and roles where I’ve built, analysed and shipped."
      />

      <ol ref={listRef} className="relative mx-auto max-w-4xl">
        {/* faint path + glowing fill */}
        <span className="absolute bottom-4 left-[19px] top-4 w-[3px] rounded-full bg-blush/70 sm:left-[27px]" aria-hidden="true" />
        <span
          className="timeline-fill absolute bottom-4 left-[19px] top-4 w-[3px] rounded-full bg-gradient-to-b from-barbie via-lavender-deep to-rosegold shadow-[0_0_14px_rgba(224,33,138,0.7)] sm:left-[27px]"
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute bottom-4 left-[20px] top-4 w-0 sm:left-[28px]" aria-hidden="true">
          <span className="timeline-fairy absolute -translate-x-1/2 -translate-y-1/2 text-xl text-barbie drop-shadow-[0_0_8px_rgba(224,33,138,0.9)]">
            ✦
          </span>
        </span>

        {experiences.map((exp, i) => (
          <li
            key={`${exp.organization}-${exp.role}`}
            className={`relative pb-12 pl-14 last:pb-0 sm:pl-20 ${reached[i] ? 'is-reached' : ''}`}
          >
            <span
              className="timeline-marker absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-full bg-white shadow-[0_0_0_5px_rgba(248,200,220,0.6)] sm:h-14 sm:w-14"
              aria-hidden="true"
            >
              <Sparkle className="h-5 w-5 fill-barbie text-barbie sm:h-6 sm:w-6" />
            </span>

            <Reveal delay={80}>
              <Tilt max={5}>
                <article className="glass glass-hover p-6 sm:p-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-plum">{exp.role}</h3>
                      <p className="mt-1 flex items-center gap-2 font-medium text-barbie-deep">
                        <Briefcase className="h-4 w-4" aria-hidden="true" />
                        {exp.organization}
                      </p>
                      {exp.location && (
                        <p className="mt-1 flex items-center gap-2 text-sm text-plum-soft">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          {exp.location}
                        </p>
                      )}
                    </div>
                    <p className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-gradient-to-r from-blush-light to-lavender-light px-4 py-1.5 text-sm font-semibold text-plum">
                      <CalendarDays className="h-4 w-4 text-barbie" aria-hidden="true" />
                      {exp.period}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {exp.points.map((pt) => (
                      <li key={pt} className="flex gap-3 leading-relaxed text-plum-soft">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-barbie" aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                    {exp.tags.map((t) => (
                      <li key={t} className="chip chip-hover !py-1 !text-xs">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Tilt>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
