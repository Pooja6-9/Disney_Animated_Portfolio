import type { CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  light?: boolean;
};

export function SectionHeading({ kicker, title, subtitle, light = false }: SectionHeadingProps) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <p className={`script-kicker text-3xl sm:text-4xl ${light ? '!text-blush-light' : ''}`}>{kicker}</p>
      <h2
        className={`mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl ${
          light ? 'text-white' : 'text-plum'
        }`}
      >
        <span className="sr-only">{title}</span>
        <span aria-hidden="true" style={{ perspective: 600 }}>
          {title.split(' ').map((word, i) => (
            <span key={i} className="title-word" style={{ '--i': i } as CSSProperties}>
              {word}
              {' '}
            </span>
          ))}
        </span>
      </h2>
      <div className="mt-5 flex items-center justify-center gap-3" aria-hidden="true">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-barbie/60" />
        <Sparkles className={`h-4 w-4 ${light ? 'text-blush' : 'text-barbie'}`} />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-barbie/60" />
      </div>
      {subtitle && (
        <p className={`mt-5 text-lg ${light ? 'text-white/85' : 'text-plum-soft'}`}>{subtitle}</p>
      )}
    </Reveal>
  );
}
