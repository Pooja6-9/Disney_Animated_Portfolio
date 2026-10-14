type ButterflyProps = {
  className?: string;
  hue?: 'pink' | 'lavender' | 'gold';
  delay?: number;
  size?: number;
};

const HUES = {
  pink: ['#ff8fc8', '#e0218a'],
  lavender: ['#e2d4fb', '#9b74d6'],
  gold: ['#ffe0d0', '#c98579'],
};

/** Original SVG butterfly with flapping wings, drifting along a gentle path. */
export function Butterfly({ className = '', hue = 'pink', delay = 0, size = 34 }: ButterflyProps) {
  const [light, deep] = HUES[hue];
  const gid = `bf-${hue}`;
  const wing = { transformOrigin: '50% 50%', animation: `flap 0.5s ease-in-out ${delay}s infinite` };

  return (
    <div
      className={`motion-decor pointer-events-none absolute ${className}`}
      style={{ animation: `butterfly-path 14s ease-in-out ${delay}s infinite` }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 40 40" style={{ perspective: 200 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={light} />
            <stop offset="1" stopColor={deep} />
          </linearGradient>
        </defs>
        <g style={wing}>
          <path d="M20 20 C12 6 2 6 3 15 C4 22 12 22 20 20Z" fill={`url(#${gid})`} opacity="0.95" />
          <path d="M20 21 C13 24 6 30 10 34 C14 37 18 29 20 21Z" fill={`url(#${gid})`} opacity="0.85" />
        </g>
        <g style={{ ...wing, animationDirection: 'reverse' }}>
          <path d="M20 20 C28 6 38 6 37 15 C36 22 28 22 20 20Z" fill={`url(#${gid})`} opacity="0.95" />
          <path d="M20 21 C27 24 34 30 30 34 C26 37 22 29 20 21Z" fill={`url(#${gid})`} opacity="0.85" />
        </g>
        <ellipse cx="20" cy="21" rx="1.4" ry="7" fill="#45173b" />
        <path d="M20 14 q-3 -5 -5 -6 M20 14 q3 -5 5 -6" stroke="#45173b" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
