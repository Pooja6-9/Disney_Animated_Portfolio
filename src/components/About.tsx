import { useEffect, useState, type ReactNode } from 'react';
import { BookOpen, Compass, Feather, GraduationCap, Heart, MapPin, type LucideIcon } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { ABOUT_ARRIVE_EVENT } from './MagicIntro';
import { education, experiences, hobbies, profile } from '../data/resume';

export function About() {
  const places = experiences.filter((e) => e.location).map((e) => e.location!);
  // Re-mount the storybook when the intro hands over, so it unfolds again every time.
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const onArrive = () => setReplay((n) => n + 1);
    window.addEventListener(ABOUT_ARRIVE_EVENT, onArrive);
    return () => window.removeEventListener(ABOUT_ARRIVE_EVENT, onArrive);
  }, []);

  return (
    <section id="about" className="relative px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="Once upon a time…"
        title="The Girl Behind the Magic"
        subtitle="A little story about who I am, what I study, and where I’m headed."
      />

      <div className="mx-auto max-w-6xl">
        <Reveal key={replay} variant="book" className="glass relative grid overflow-hidden lg:grid-cols-2">
          <div
            className="pointer-events-none absolute inset-y-6 left-1/2 hidden w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-blush/60 to-transparent lg:block"
            aria-hidden="true"
          />

          {/* Left page */}
          <div className="relative p-8 sm:p-12">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-rosegold">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Chapter One
            </div>
            <h3 className="mt-3 font-display text-3xl font-semibold text-plum">My Story</h3>
            <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-plum-soft">
              {profile.summary.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-barbie'
                      : ''
                  }
                >
                  {para}
                </p>
              ))}
            </div>
            {places.length > 0 && (
              <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-plum-soft">
                <MapPin className="h-4 w-4 text-barbie" aria-hidden="true" />
                Experience with organizations in {places.join(' and ')}
              </p>
            )}
          </div>

          {/* Right page */}
          <div className="page-flip relative space-y-5 border-t border-blush/60 bg-white/30 p-8 sm:p-12 lg:border-l lg:border-t-0">
            <InfoCard icon={GraduationCap} label="Education">
              <h4 className="mt-1 font-display text-xl font-semibold text-plum">{education.degree}</h4>
              <p className="text-plum-soft">{education.institution}</p>
              <p className="mt-1 text-sm font-medium text-barbie-deep">{education.period}</p>
            </InfoCard>
            <InfoCard icon={Compass} label="Career Direction">
              <p className="mt-1 text-plum">{profile.careerDirection}</p>
            </InfoCard>
            <InfoCard icon={Heart} label="Beyond the Code">
              <ul className="mt-3 flex flex-wrap gap-2">
                {hobbies.map((h) => (
                  <li key={h} className="chip chip-hover">
                    <Feather className="h-3.5 w-3.5 text-barbie" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </InfoCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <article className="group rounded-2xl border border-white bg-white/70 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-14px_rgba(224,33,138,0.45)]">
      <div className="flex items-start gap-4">
        <span className="icon-orb h-12 w-12 shrink-0 transition-transform duration-700 group-hover:rotate-[360deg]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rosegold">{label}</p>
          {children}
        </div>
      </div>
    </article>
  );
}
