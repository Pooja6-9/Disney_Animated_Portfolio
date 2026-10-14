import { useEffect, useRef, useState } from 'react';
import { SlipperIcon } from './icons';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { GameProps } from './types';

type Phase = 'ready' | 'show' | 'shuffle' | 'pick' | 'won' | 'lost';
const SWAPS = 8;
const SWAP_MS = 430;

/** Watch which cushion hides the glass slipper, follow the shuffle, then pick it. */
export function SlipperShuffle({ onWin }: GameProps) {
  const reduced = useReducedMotion();
  const [slots, setSlots] = useState([0, 1, 2]); // slots[cup] = position 0..2
  const [prize, setPrize] = useState(1);
  const [phase, setPhase] = useState<Phase>('ready');
  const [picked, setPicked] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const start = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSlots([0, 1, 2]);
    setPrize(Math.floor(Math.random() * 3));
    setPicked(null);
    setPhase('show');
    timers.current.push(
      window.setTimeout(() => {
        setPhase('shuffle');
        if (reduced) {
          // No movement for reduced-motion users: the cushions simply lower.
          timers.current.push(window.setTimeout(() => setPhase('pick'), 400));
          return;
        }
        for (let i = 0; i < SWAPS; i++) {
          timers.current.push(
            window.setTimeout(() => {
              setSlots((prev) => {
                const a = Math.floor(Math.random() * 3);
                const b = (a + 1 + Math.floor(Math.random() * 2)) % 3;
                const next = [...prev];
                const cupA = next.indexOf(a);
                const cupB = next.indexOf(b);
                next[cupA] = b;
                next[cupB] = a;
                return next;
              });
              if (i === SWAPS - 1) timers.current.push(window.setTimeout(() => setPhase('pick'), SWAP_MS));
            }, i * SWAP_MS),
          );
        }
      }, 1400),
    );
  };

  const pick = (cup: number) => {
    if (phase !== 'pick') return;
    setPicked(cup);
    if (cup === prize) {
      setPhase('won');
      onWin();
    } else setPhase('lost');
  };

  const lifted = (cup: number) =>
    phase === 'show' || ((phase === 'won' || phase === 'lost') && (cup === picked || cup === prize));

  return (
    <div>
      <p className="mb-3 text-center text-sm font-semibold text-plum" aria-live="polite">
        {phase === 'ready' && 'Keep your eyes on the glass slipper!'}
        {phase === 'show' && 'Here it is… watch closely!'}
        {phase === 'shuffle' && 'Shuffling…'}
        {phase === 'pick' && 'Which cushion hides the slipper?'}
        {phase === 'won' && 'You found it! A perfect fit ✨'}
        {phase === 'lost' && 'Oh no, it was under another cushion.'}
      </p>
      <div className="game-area relative h-[300px] overflow-hidden rounded-3xl bg-[linear-gradient(180deg,#fde8f1,#efe7fb)]">
        <div className="absolute inset-x-[6%] bottom-[18%] h-3 rounded-full bg-rosegold/30 blur-sm" aria-hidden="true" />
        {[0, 1, 2].map((cup) => (
          <div
            key={cup}
            className="absolute bottom-[20%] w-[28%] -translate-x-1/2 transition-[left] ease-in-out"
            style={{ left: `${slots[cup] * 33.33 + 16.66}%`, transitionDuration: `${SWAP_MS - 60}ms` }}
          >
            {cup === prize && (
              <SlipperIcon className={`absolute bottom-1 left-1/2 w-[72%] -translate-x-1/2 transition-opacity duration-300 ${lifted(cup) ? 'opacity-100' : 'opacity-0'}`} />
            )}
            <button
              type="button"
              onClick={() => pick(cup)}
              disabled={phase !== 'pick'}
              aria-label={`Cushion ${slots[cup] + 1}`}
              className={`relative block w-full transition-transform duration-500 ${lifted(cup) ? '-translate-y-[90px]' : ''} ${
                phase === 'pick' ? 'cursor-pointer hover:-translate-y-2' : 'cursor-default'
              }`}
            >
              <svg viewBox="0 0 120 90" className="w-full drop-shadow-[0_12px_14px_rgba(176,18,106,0.3)]" aria-hidden="true">
                <defs>
                  <linearGradient id={`cushion-${cup}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ff8fc8" />
                    <stop offset="1" stopColor="#c9137a" />
                  </linearGradient>
                </defs>
                <path d="M10 82 C10 30 30 8 60 8 C90 8 110 30 110 82 Z" fill={`url(#cushion-${cup})`} />
                <path d="M6 80 H114 V88 H6 Z" fill="#e8b4a6" rx="3" />
                <path d="M30 30 C38 20 48 16 60 16" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
                <circle cx="60" cy="8" r="6" fill="#ffd1ea" stroke="#e8b4a6" strokeWidth="2" />
              </svg>
            </button>
          </div>
        ))}

        {(phase === 'ready' || phase === 'lost') && (
          <div className="absolute inset-x-0 top-4 flex justify-center">
            <button type="button" onClick={start} className="btn-magic btn-primary !py-2.5">
              {phase === 'ready' ? 'Start the shuffle' : 'Try again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
