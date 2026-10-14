import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { LanternIcon } from './icons';
import { sparkleBurst } from '../MagicButton';
import type { GameProps } from './types';

const COUNT = 12;
const TIME = 20;

/** Light every floating lantern before the clock runs out. */
export function LanternLights({ onWin }: GameProps) {
  const [round, setRound] = useState(0);
  const [lit, setLit] = useState<boolean[]>(() => Array(COUNT).fill(false));
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [status, setStatus] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const litCount = lit.filter(Boolean).length;

  // Scatter the lanterns differently each round
  const spots = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        left: 6 + (i % 4) * 23 + Math.random() * 10,
        top: 8 + Math.floor(i / 4) * 28 + Math.random() * 10,
        delay: Math.random() * 3,
        dur: 3 + Math.random() * 3,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round],
  );

  useEffect(() => {
    if (status !== 'playing') return;
    const t = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          setStatus((st) => (st === 'playing' ? 'lost' : st));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [status]);

  const start = () => {
    setRound((r) => r + 1);
    setLit(Array(COUNT).fill(false));
    setTimeLeft(TIME);
    setStatus('playing');
  };

  const light = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    if (status !== 'playing' || lit[i]) return;
    sparkleBurst(e.clientX, e.clientY, 8);
    const next = lit.map((v, k) => (k === i ? true : v));
    setLit(next);
    if (next.every(Boolean)) {
      setStatus('won');
      onWin();
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-plum">
        <span aria-live="polite">
          🏮 {litCount} / {COUNT} lit
        </span>
        <span>⏳ {timeLeft}s</span>
      </div>
      <div className="game-area relative h-[340px] overflow-hidden rounded-3xl bg-[linear-gradient(180deg,#1d0b33,#4a1d5f_55%,#9c3b7a)]">
        {/* water reflection */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#ffb38a]/30 to-transparent" aria-hidden="true" />
        {spots.map((s, i) => (
          <button
            key={`${round}-${i}`}
            type="button"
            onClick={(e) => light(i, e)}
            disabled={status !== 'playing'}
            aria-label={`Lantern ${i + 1}, ${lit[i] ? 'lit' : 'unlit'}`}
            className={`lantern absolute w-[9%] min-w-[34px] ${lit[i] ? 'is-lit' : ''}`}
            style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }}
          >
            <LanternIcon lit={lit[i]} className="w-full" />
          </button>
        ))}

        {status !== 'playing' && (
          <div className="absolute inset-0 grid place-items-center bg-plum/40 backdrop-blur-[2px]">
            <div className="text-center text-white">
              {status === 'lost' && <p className="mb-3 font-display text-2xl">The night slipped away… try again?</p>}
              {status === 'won' && <p className="mb-3 font-display text-2xl">The sky is glowing! ✨</p>}
              {status !== 'won' && (
                <button type="button" onClick={start} className="btn-magic btn-primary">
                  {status === 'ready' ? 'Light the lanterns' : 'Play again'}
                </button>
              )}
              {status === 'ready' && <p className="mt-3 text-sm text-white/80">Tap all {COUNT} lanterns in {TIME} seconds</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
