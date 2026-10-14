import { useEffect, useRef, useState } from 'react';
import { PrincessArt } from './Princess';
import { fireworkBurst } from '../effects';
import { useReducedMotion } from '../hooks/useReducedMotion';

const FIRST_FLIGHT_MS = 2500;
const BETWEEN_FLIGHTS_MS = 20000;
const FLIGHT_MS = 9000;
const TRAIL = ['#ffffff', '#ffd1ea', '#ff8fc8', '#ffe7a3', '#e2d4fb'];

/**
 * Every so often a fairy princess flies across the screen, sprinkling fairy dust
 * from her wand. Hover to pause her; click her for a heart firework.
 */
export function FlyingPrincess() {
  const reduced = useReducedMotion();
  const [flight, setFlight] = useState<{ id: number; dir: 1 | -1; top: number } | null>(null);
  const [twirl, setTwirl] = useState(false);
  const wandRef = useRef<HTMLSpanElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const count = useRef(0);

  // Schedule flights
  useEffect(() => {
    if (reduced) return;
    let id = 0;
    const launch = () => {
      const n = count.current++;
      setFlight({ id: Date.now(), dir: n % 2 === 0 ? 1 : -1, top: 14 + ((n * 23) % 46) });
      id = window.setTimeout(launch, FLIGHT_MS + BETWEEN_FLIGHTS_MS);
    };
    id = window.setTimeout(launch, FIRST_FLIGHT_MS);
    return () => clearTimeout(id);
  }, [reduced]);

  // Fairy-dust trail from the wand
  useEffect(() => {
    if (!flight) return;
    let i = 0;
    const timer = window.setInterval(() => {
      if (paused.current || document.hidden) return;
      const r = wandRef.current?.getBoundingClientRect();
      if (!r || r.right < 0 || r.left > window.innerWidth) return;
      const s = document.createElement('span');
      s.className = 'princess-dust';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = i % 4 === 0 ? '✦' : '•';
      s.style.left = `${r.left + r.width / 2 + (Math.random() * 8 - 4)}px`;
      s.style.top = `${r.top + r.height / 2 + (Math.random() * 8 - 4)}px`;
      s.style.color = TRAIL[i++ % TRAIL.length];
      s.style.fontSize = `${6 + Math.random() * 9}px`;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }, 55);
    return () => clearInterval(timer);
  }, [flight]);

  if (!flight) return null;

  return (
    <div
      key={flight.id}
      ref={flyerRef}
      className={`princess-flight ${flight.dir === 1 ? 'fly-ltr' : 'fly-rtl'}`}
      style={{ top: `${flight.top}vh`, animationDuration: `${FLIGHT_MS}ms` }}
      onAnimationEnd={(e) => e.target === flyerRef.current && setFlight(null)}
      aria-hidden="true"
    >
      <div className="princess-bob">
        <div
          className={`princess-body ${twirl ? 'is-twirling' : ''}`}
          style={{ transform: flight.dir === -1 ? 'scaleX(-1)' : undefined }}
          onPointerEnter={() => {
            paused.current = true;
            flyerRef.current?.classList.add('is-paused');
          }}
          onPointerLeave={() => {
            paused.current = false;
            flyerRef.current?.classList.remove('is-paused');
          }}
          onClick={(e) => {
            fireworkBurst(e.clientX, e.clientY);
            setTwirl(true);
            window.setTimeout(() => setTwirl(false), 900);
          }}
          title="Hi! ✨"
        >
          <svg viewBox="0 0 140 90" width="150" height="96" className="overflow-visible drop-shadow-[0_8px_18px_rgba(224,33,138,0.45)]">
            <PrincessArt id="flying-princess" />
          </svg>
          {/* invisible marker at the wand tip, used to emit the trail */}
          <span ref={wandRef} className="absolute h-2 w-2" style={{ left: '88%', top: '10%' }} />
        </div>
      </div>
    </div>
  );
}
