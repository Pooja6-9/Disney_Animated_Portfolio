import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type TypewriterProps = {
  prefix: string;
  phrases: string[];
  className?: string;
};

/** Types, pauses, and deletes each phrase in turn. Screen readers get one static sentence. */
export function Typewriter({ prefix, phrases, className = '' }: TypewriterProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const full = phrases[index];
    let delay = deleting ? 35 : 70;
    if (!deleting && text === full) delay = 1700;
    if (deleting && text === '') delay = 300;

    const id = window.setTimeout(() => {
      if (!deleting && text === full) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else setText(full.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, index, phrases, reduced]);

  return (
    <p className={className}>
      <span className="sr-only">
        {prefix} {phrases.join(', ')}.
      </span>
      <span aria-hidden="true">
        {prefix}{' '}
        <span className="text-magic font-semibold not-italic">{reduced ? phrases[0] : text}</span>
        <span className="typewriter-caret" />
      </span>
    </p>
  );
}
