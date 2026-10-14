import { Palette, Rocket, Users } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Tilt } from './Tilt';
import { leadership } from '../data/resume';

const ICONS = [Palette, Rocket];

export function Leadership() {
  return (
    <section id="leadership" className="relative px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="Leading the royal court"
        title="Leadership & Activities"
        subtitle="Communities I help run and build."
      />

      <ul className="mx-auto grid max-w-5xl gap-7 md:grid-cols-2">
        {leadership.map((l, i) => {
          const Icon = ICONS[i] ?? Users;
          return (
            <Reveal as="li" key={l.role + l.organization} delay={i * 100}>
              <Tilt>
                <article className="glass glass-hover group relative h-full overflow-hidden p-8">
                  <svg
                    className="pointer-events-none absolute right-0 top-0 h-24 w-24 text-blush transition-all duration-500 group-hover:h-32 group-hover:w-32 group-hover:text-lavender"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    <path d="M100 0 V100 C60 80 20 40 0 0 Z" fill="currentColor" opacity="0.55" />
                    <path d="M100 0 C70 10 40 30 30 60" stroke="#e0218a" strokeWidth="1.2" fill="none" opacity="0.5" />
                  </svg>
                  <span className="coin icon-orb relative h-14 w-14">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="relative mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-rosegold">{l.period}</p>
                  <h3 className="relative mt-2 font-display text-2xl font-semibold text-plum">{l.role}</h3>
                  <p className="relative mt-2 text-lg font-medium text-barbie-deep">{l.organization}</p>
                </article>
              </Tilt>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
