import { Award, BadgeCheck, Crown, Star, Trophy } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Tilt } from './Tilt';
import { fireworkBurst } from '../effects';
import { achievements, certifications } from '../data/resume';

const ACHIEVEMENT_ICONS = { crown: Crown, star: Star, trophy: Trophy };

export function Achievements() {
  return (
    <section id="achievements" className="relative px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="Jewels in the tiara"
        title="My Crown Collection"
        subtitle="Hackathons, open-source contributions and certifications. Click a crown to celebrate."
      />

      <div className="mx-auto max-w-6xl">
        <h3 className="sr-only">Achievements</h3>
        <ul className="grid gap-6 md:grid-cols-3">
          {achievements.map((a, i) => {
            const Icon = ACHIEVEMENT_ICONS[a.icon];
            return (
              <Reveal as="li" key={a.title} delay={i * 100}>
                <Tilt max={12}>
                  <button
                    type="button"
                    onClick={(e) => fireworkBurst(e.clientX, e.clientY)}
                    aria-label={`${a.title}, ${a.detail}, ${a.year}. Celebrate with fireworks`}
                    className="glass glass-hover group relative block h-full w-full overflow-hidden px-6 pb-8 pt-10 text-center"
                  >
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-blush/60 to-transparent" aria-hidden="true" />
                    <span className="relative mx-auto grid h-24 w-24 place-items-center" aria-hidden="true">
                      <span className="absolute inset-0 animate-spin-slow rounded-full border-2 border-dashed border-barbie/30" />
                      <span className="coin icon-orb h-[4.5rem] w-[4.5rem]">
                        <Icon className="h-8 w-8" />
                      </span>
                    </span>
                    <span className="relative mt-5 inline-block rounded-full bg-gradient-to-r from-rosegold to-barbie px-3 py-0.5 text-xs font-bold tracking-wider text-white">
                      {a.year}
                    </span>
                    <span className="relative mt-3 block font-display text-xl font-semibold text-plum">{a.title}</span>
                    <span className="relative mt-1 block font-medium text-barbie-deep">{a.detail}</span>
                  </button>
                </Tilt>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-16">
          <h3 className="flex items-center justify-center gap-3 text-center font-display text-2xl font-semibold text-plum">
            <Award className="h-6 w-6 text-barbie" aria-hidden="true" />
            Certifications
          </h3>
        </Reveal>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {certifications.map((c, i) => (
            <Reveal as="li" key={c.title} delay={(i % 2) * 90}>
              <Tilt max={6}>
                <article className="glass glass-hover group flex h-full items-start gap-4 p-5 sm:p-6">
                  <span className="coin grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blush-light to-lavender-light text-barbie shadow-inner">
                    <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="font-semibold leading-snug text-plum">{c.title}</h4>
                    <p className="mt-1 text-sm text-plum-soft">
                      {c.issuer}
                      {c.date && <span className="text-barbie-deep"> · {c.date}</span>}
                    </p>
                  </div>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
