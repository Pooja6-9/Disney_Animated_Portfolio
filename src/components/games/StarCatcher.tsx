import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Crown, Star } from 'lucide-react';
import { sparkleBurst } from '../MagicButton';
import type { GameProps } from './types';

const GOAL = 8;
const TIME = 30;
const TIARA_HALF_WIDTH = 9; // percent of the play area

type FallingStar = { id: number; x: number; y: number; speed: number; size: number };

/** Move the tiara (mouse, touch or ← →) to catch falling stars. */
export function StarCatcher({ onWin }: GameProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const tiaraX = useRef(50);
  const starsRef = useRef<FallingStar[]>([]);
  const caughtRef = useRef(0);
  const [, setFrame] = useState(0);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [status, setStatus] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');

  const start = () => {
    starsRef.current = [];
    caughtRef.current = 0;
    tiaraX.current = 50;
    setCaught(0);
    setTimeLeft(TIME);
    setStatus('playing');
    areaRef.current?.focus();
  };

  const burstAt = useCallback((xPct: number, yPct: number) => {
    const r = areaRef.current?.getBoundingClientRect();
    if (r) sparkleBurst(r.left + (xPct / 100) * r.width, r.top + (yPct / 100) * r.height, 10);
  }, []);

  // Game loop
  useEffect(() => {
    if (status !== 'playing') return;
    let raf = 0;
    let last = performance.now();
    let spawnIn = 0;
    let id = 0;
    let elapsed = 0; // game time, so slow devices aren't penalised by a wall clock
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      const remaining = Math.max(Math.ceil(TIME - elapsed), 0);
      setTimeLeft(remaining);
      if (remaining === 0) {
        setStatus('lost');
        return;
      }
      spawnIn -= dt;
      if (spawnIn <= 0) {
        spawnIn = 0.55 + Math.random() * 0.5;
        starsRef.current.push({ id: id++, x: 6 + Math.random() * 88, y: -6, speed: 22 + Math.random() * 18, size: 20 + Math.random() * 12 });
      }
      const next: FallingStar[] = [];
      for (const s of starsRef.current) {
        s.y += s.speed * dt;
        const hit = s.y > 80 && s.y < 92 && Math.abs(s.x - tiaraX.current) < TIARA_HALF_WIDTH;
        if (hit) {
          caughtRef.current += 1;
          setCaught(caughtRef.current);
          burstAt(s.x, 84);
        } else if (s.y < 106) next.push(s);
      }
      starsRef.current = next;
      if (caughtRef.current >= GOAL) {
        setStatus('won');
        onWin();
        return;
      }
      setFrame((f) => f + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, onWin, burstAt]);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = areaRef.current?.getBoundingClientRect();
    if (!r) return;
    tiaraX.current = Math.min(Math.max(((e.clientX - r.left) / r.width) * 100, 6), 94);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      tiaraX.current = Math.min(Math.max(tiaraX.current + (e.key === 'ArrowLeft' ? -7 : 7), 6), 94);
    } else if ((e.key === 'Enter' || e.key === ' ') && status !== 'playing') {
      e.preventDefault();
      start();
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-plum">
        <span aria-live="polite">
          ⭐ {caught} / {GOAL} stars
        </span>
        <span>⏳ {timeLeft}s</span>
      </div>
      <div
        ref={areaRef}
        tabIndex={0}
        role="application"
        aria-label="Star catcher play area. Use left and right arrow keys to move the tiara."
        onPointerMove={onPointerMove}
        onPointerDown={onPointerMove}
        onKeyDown={onKeyDown}
        className="game-area relative h-[340px] touch-none overflow-hidden rounded-3xl bg-[linear-gradient(180deg,#2a0f3d,#6a237a_55%,#d4267f)]"
      >
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="absolute h-0.5 w-0.5 animate-twinkle rounded-full bg-white"
            style={{ left: `${(i * 41) % 100}%`, top: `${(i * 23) % 70}%`, animationDelay: `${(i % 6) * 0.4}s` }}
            aria-hidden="true"
          />
        ))}

        {starsRef.current.map((s) => (
          <Star
            key={s.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 fill-[#ffe7a3] text-[#ffd36e] drop-shadow-[0_0_8px_rgba(255,231,163,0.9)]"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            aria-hidden="true"
          />
        ))}

        <div
          className="absolute bottom-[6%] grid h-12 w-[18%] -translate-x-1/2 place-items-center rounded-full bg-gradient-to-r from-barbie to-lavender-deep shadow-[0_0_24px_rgba(255,143,200,0.9)]"
          style={{ left: `${tiaraX.current}%` }}
          aria-hidden="true"
        >
          <Crown className="h-7 w-7 text-[#ffe1c4]" />
        </div>

        {status !== 'playing' && (
          <div className="absolute inset-0 grid place-items-center bg-plum/40 backdrop-blur-[2px]">
            <div className="text-center text-white">
              {status === 'lost' && <p className="mb-3 font-display text-2xl">So close! Try again?</p>}
              {status === 'won' && <p className="mb-3 font-display text-2xl">All stars caught! ✨</p>}
              {status !== 'won' && (
                <button type="button" onClick={start} className="btn-magic btn-primary">
                  {status === 'ready' ? 'Start catching' : 'Play again'}
                </button>
              )}
              {status === 'ready' && <p className="mt-3 text-sm text-white/80">Move with your mouse, finger, or ← → keys</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
