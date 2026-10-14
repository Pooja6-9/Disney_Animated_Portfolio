import { useState } from 'react';
import { Brain, Code2, Database, Globe, HeartHandshake, Server, Sparkles, Wrench, type LucideIcon } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Tilt } from './Tilt';
import { sparkleBurst } from './MagicButton';
import { skillCategories, type SkillCategory } from '../data/resume';

const ICONS: Record<SkillCategory['icon'], LucideIcon> = {
  code: Code2,
  web: Globe,
  server: Server,
  database: Database,
  brain: Brain,
  tools: Wrench,
  heart: HeartHandshake,
};

const ALL = 'All';

export function Skills() {
  const [filter, setFilter] = useState(ALL);
  const shown = filter === ALL ? skillCategories : skillCategories.filter((c) => c.title === filter);

  return (
    <section id="skills" className="relative px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="Spells & enchantments"
        title="My Magic Toolkit"
        subtitle="The languages, technologies and tools I work with. Pick a spell book to focus on one."
      />

      {/* Filter: each category is a "spell book" */}
      <Reveal className="mx-auto mb-10 flex max-w-5xl flex-wrap justify-center gap-2" >
        {[ALL, ...skillCategories.map((c) => c.title)].map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={filter === t}
            onClick={(e) => {
              setFilter(t);
              sparkleBurst(e.clientX, e.clientY, 8);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
              filter === t
                ? 'border-transparent bg-gradient-to-r from-barbie to-lavender-deep text-white shadow-[0_8px_20px_-8px_rgba(224,33,138,0.8)]'
                : 'border-barbie/20 bg-white/70 text-plum hover:-translate-y-0.5 hover:border-barbie/50'
            }`}
          >
            {t === ALL && <Sparkles className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />}
            {t}
          </button>
        ))}
      </Reveal>

      <div key={filter} className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((cat, i) => {
          const Icon = ICONS[cat.icon];
          const centreLast = shown.length % 3 === 1 && i === shown.length - 1;
          return (
            <Reveal key={cat.title} delay={(i % 3) * 90} className={centreLast ? 'lg:col-start-2' : ''}>
              <Tilt>
                <div className="glass glass-hover group relative h-full overflow-hidden p-7">
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-blush to-lavender opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center gap-4">
                    <span className="icon-orb h-12 w-12 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-xl font-semibold text-plum">{cat.title}</h3>
                  </div>
                  {cat.note && <p className="relative mt-3 text-sm text-plum-soft">{cat.note}</p>}
                  <ul className="relative mt-5 flex flex-wrap gap-2">
                    {cat.skills.map((s, k) => (
                      <li key={s} className="chip chip-hover skill-pop cursor-default" style={{ animationDelay: `${150 + k * 60}ms` }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Tilt>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
