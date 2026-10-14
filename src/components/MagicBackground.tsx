import { useMemo, type CSSProperties } from 'react';

/** Deterministic pseudo-random so the sky looks the same on every render. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Cloud({ className, style }: { className: string; style?: CSSProperties }) {
  return (
    <div className={`absolute ${className}`} style={style} aria-hidden="true">
      <div className="relative h-full w-full" style={{ animation: 'cloud-drift 26s ease-in-out infinite alternate' }}>
        <span className="absolute bottom-0 left-[10%] h-[60%] w-[80%] rounded-full bg-white/80 blur-md" />
        <span className="absolute bottom-[20%] left-[22%] h-[75%] w-[38%] rounded-full bg-white/85 blur-md" />
        <span className="absolute bottom-[18%] left-[46%] h-[90%] w-[34%] rounded-full bg-white/80 blur-md" />
      </div>
    </div>
  );
}

/** Fixed, decorative sky behind the whole site: gradient, clouds, stars, fairy dust. */
export function MagicBackground() {
  const { stars, dust } = useMemo(() => {
    const rand = seeded(42);
    return {
      stars: Array.from({ length: 46 }, () => ({
        left: rand() * 100,
        top: rand() * 100,
        size: 2 + rand() * 3,
        delay: rand() * 4,
        dur: 2.5 + rand() * 3,
      })),
      dust: Array.from({ length: 18 }, () => ({
        left: rand() * 100,
        size: 3 + rand() * 4,
        delay: rand() * 18,
        dur: 16 + rand() * 14,
      })),
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#ffe1ef_0%,#fff3f8_45%,#f4ecfd_100%)]" />
      <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-blush/50 blur-3xl" />
      <div className="absolute -right-40 top-[30%] h-[560px] w-[560px] rounded-full bg-lavender/40 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[20%] h-[480px] w-[480px] rounded-full bg-rosegold-light/30 blur-3xl" />

      <Cloud className="left-[-4%] top-[14%] h-24 w-72 opacity-70" />
      <Cloud className="right-[-2%] top-[46%] h-28 w-80 opacity-60" style={{ animationDelay: '-8s' }} />
      <Cloud className="left-[30%] top-[78%] h-20 w-64 opacity-50" />

      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,180,220,0.9)]"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}

      <div className="motion-decor">
        {dust.map((d, i) => (
          <span
            key={i}
            className="absolute bottom-[-20px] rounded-full bg-gradient-to-br from-white to-blush"
            style={{
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              boxShadow: '0 0 10px 2px rgba(224,33,138,0.35)',
              animation: `rise ${d.dur}s linear ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
