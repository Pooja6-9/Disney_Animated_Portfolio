type CastleProps = {
  variant?: 'dream' | 'sunset';
  className?: string;
  /** Unique prefix so multiple castles on a page don't share gradient ids. */
  idPrefix: string;
};

type TowerSpec = { x: number; w: number; top: number; roofH: number; flag?: boolean; windows?: number };

const GROUND = 400;

const PALETTES = {
  dream: {
    glow: ['#ffd6ec', '#f8c8dc00'],
    wall: ['#fff6fa', '#f9cfe2'],
    wallBack: ['#f3ecfd', '#d9c9f1'],
    roof: ['#ff6fb5', '#e0218a', '#9b5fd0'],
    roofBack: ['#d7c3f3', '#a98ad9'],
    trim: '#e8b4a6',
    gate: ['#8a3b77', '#45173b'],
    window: ['#fff7c7', '#ffc2e2'],
    flag: '#e0218a',
  },
  sunset: {
    glow: ['#ffc9a8', '#ffb3c700'],
    wall: ['#ffe9ef', '#f4b2cf'],
    wallBack: ['#e8d3f3', '#c3a1e0'],
    roof: ['#ff7fa8', '#c9137a', '#6e3a9e'],
    roofBack: ['#c7a4e6', '#8f6cc9'],
    trim: '#f2b48f',
    gate: ['#6e2a5f', '#2e0f29'],
    window: ['#fff1a8', '#ffb37a'],
    flag: '#ff9a62',
  },
} as const;

function archPath(x: number, y: number, w: number, h: number) {
  const r = w / 2;
  return `M${x} ${y + h} V${y + r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h} Z`;
}

function Crenellations({ x, y, w, size = 10, fill }: { x: number; y: number; w: number; size?: number; fill: string }) {
  const count = Math.floor(w / (size * 2));
  const offset = (w - (count * 2 - 1) * size) / 2;
  return (
    <g fill={fill}>
      {Array.from({ length: count }, (_, i) => (
        <rect key={i} x={x + offset + i * size * 2} y={y - size} width={size} height={size} rx={1.5} />
      ))}
    </g>
  );
}

function Tower({ spec, id, back, palette }: { spec: TowerSpec; id: string; back?: boolean; palette: (typeof PALETTES)[keyof typeof PALETTES] }) {
  const { x, w, top, roofH, flag, windows = 1 } = spec;
  const cx = x + w / 2;
  const roofBase = top - 6;
  const tipY = roofBase - roofH;
  const wall = back ? `url(#${id}-wallBack)` : `url(#${id}-wall)`;
  const roof = back ? `url(#${id}-roofBack)` : `url(#${id}-roof)`;
  const winW = Math.min(16, w * 0.28);

  return (
    <g>
      <rect x={x} y={top} width={w} height={GROUND - top} fill={wall} />
      {/* subtle shading strip for depth */}
      <rect x={x + w * 0.68} y={top} width={w * 0.32} height={GROUND - top} fill="#b0126a" opacity={back ? 0.04 : 0.07} />
      <rect x={x - 4} y={top - 7} width={w + 8} height={9} rx={2} fill={palette.trim} opacity={back ? 0.6 : 1} />
      <polygon points={`${x - 9},${roofBase} ${cx},${tipY} ${x + w + 9},${roofBase}`} fill={roof} />
      <polygon points={`${x - 9},${roofBase} ${cx},${tipY} ${cx - 2},${roofBase}`} fill="#fff" opacity={0.18} />
      <circle cx={cx} cy={tipY} r={3.2} fill={palette.trim} />
      {flag && (
        <g>
          <line x1={cx} y1={tipY} x2={cx} y2={tipY - 24} stroke={palette.trim} strokeWidth={2} strokeLinecap="round" />
          <path className="castle-flag" d={`M${cx + 1} ${tipY - 24} l20 5.5 l-20 5.5 z`} fill={palette.flag} />
        </g>
      )}
      {Array.from({ length: windows }, (_, i) => (
        <path
          key={i}
          className="castle-window"
          style={{ animationDelay: `${(x + i * 37) % 3}s` }}
          d={archPath(cx - winW / 2, top + 26 + i * 52, winW, winW * 1.7)}
          fill={`url(#${id}-window)`}
          stroke={palette.trim}
          strokeWidth={1.5}
          opacity={back ? 0.7 : 1}
        />
      ))}
    </g>
  );
}

export function Castle({ variant = 'dream', className = '', idPrefix }: CastleProps) {
  const p = PALETTES[variant];
  const id = idPrefix;

  const backTowers: TowerSpec[] = [
    { x: 58, w: 40, top: 262, roofH: 70 },
    { x: 502, w: 40, top: 262, roofH: 70 },
    { x: 222, w: 38, top: 168, roofH: 92, flag: true },
    { x: 340, w: 38, top: 168, roofH: 92, flag: true },
  ];
  const frontTowers: TowerSpec[] = [
    { x: 96, w: 50, top: 252, roofH: 80, windows: 2 },
    { x: 454, w: 50, top: 252, roofH: 80, windows: 2 },
    { x: 158, w: 62, top: 188, roofH: 102, flag: true, windows: 2 },
    { x: 380, w: 62, top: 188, roofH: 102, flag: true, windows: 2 },
  ];
  const centre: TowerSpec = { x: 262, w: 76, top: 132, roofH: 112, flag: true, windows: 2 };

  return (
    <svg
      viewBox="0 0 600 440"
      className={className}
      role="img"
      aria-label="Illustration of a pink fairytale castle"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor={p.glow[0]} />
          <stop offset="100%" stopColor={p.glow[1]} />
        </radialGradient>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.wall[0]} />
          <stop offset="100%" stopColor={p.wall[1]} />
        </linearGradient>
        <linearGradient id={`${id}-wallBack`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.wallBack[0]} />
          <stop offset="100%" stopColor={p.wallBack[1]} />
        </linearGradient>
        <linearGradient id={`${id}-roof`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.roof[0]} />
          <stop offset="55%" stopColor={p.roof[1]} />
          <stop offset="100%" stopColor={p.roof[2]} />
        </linearGradient>
        <linearGradient id={`${id}-roofBack`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.roofBack[0]} />
          <stop offset="100%" stopColor={p.roofBack[1]} />
        </linearGradient>
        <linearGradient id={`${id}-gate`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.gate[0]} />
          <stop offset="100%" stopColor={p.gate[1]} />
        </linearGradient>
        <radialGradient id={`${id}-window`} cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor={p.window[0]} />
          <stop offset="100%" stopColor={p.window[1]} />
        </radialGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <ellipse cx="300" cy="260" rx="290" ry="210" fill={`url(#${id}-glow)`} />

      {backTowers.map((t, i) => (
        <Tower key={`b${i}`} spec={t} id={id} back palette={p} />
      ))}

      {/* curtain wall */}
      <rect x="120" y="300" width="360" height={GROUND - 300} fill={`url(#${id}-wall)`} />
      <Crenellations x={120} y={300} w={360} size={11} fill={p.wall[1]} />
      <rect x="120" y="300" width="360" height="6" fill={p.trim} opacity="0.7" />

      {frontTowers.map((t, i) => (
        <Tower key={`f${i}`} spec={t} id={id} palette={p} />
      ))}

      {/* keep */}
      <rect x="214" y="240" width="172" height={GROUND - 240} fill={`url(#${id}-wall)`} />
      <Crenellations x={214} y={240} w={172} size={10} fill={p.wall[0]} />
      <rect x="214" y="240" width="172" height="6" fill={p.trim} />
      {[236, 352].map((wx) => (
        <path
          key={wx}
          className="castle-window"
          d={archPath(wx, 262, 14, 26)}
          fill={`url(#${id}-window)`}
          stroke={p.trim}
          strokeWidth={1.5}
        />
      ))}

      <Tower spec={centre} id={id} palette={p} />

      {/* rose window */}
      <circle cx="300" cy="284" r="13" fill={`url(#${id}-window)`} stroke={p.trim} strokeWidth="2" className="castle-window" />
      <path d="M300 276 v16 M292 284 h16" stroke={p.trim} strokeWidth="1.5" />

      {/* gate */}
      <path d={archPath(270, 318, 60, 82)} fill={`url(#${id}-gate)`} stroke={p.trim} strokeWidth="3" />
      <path d="M300 336 V400 M285 345 V400 M315 345 V400" stroke={p.trim} strokeWidth="1.2" opacity="0.45" />
      {/* little heart crest above the gate */}
      <path
        d="M300 314 c-4-6-13-4-12 3 c1 5 7 8 12 12 c5-4 11-7 12-12 c1-7-8-9-12-3z"
        fill={p.flag}
        stroke="#fff"
        strokeWidth="1.2"
      />

      {/* path leading to the gate */}
      <path d="M270 400 L240 440 L360 440 L330 400 Z" fill={p.wall[1]} opacity="0.8" />

      {/* cloud bank */}
      <g fill="#fff" filter={`url(#${id}-soft)`} opacity="0.95">
        <ellipse cx="300" cy="408" rx="250" ry="18" />
        <circle cx="70" cy="398" r="22" />
        <circle cx="110" cy="388" r="30" />
        <circle cx="160" cy="400" r="24" />
        <circle cx="215" cy="396" r="28" />
        <circle cx="390" cy="398" r="26" />
        <circle cx="440" cy="390" r="30" />
        <circle cx="490" cy="398" r="26" />
        <circle cx="532" cy="402" r="20" />
      </g>
      <g fill="#fff" opacity="0.9">
        <circle cx="120" cy="392" r="18" />
        <circle cx="450" cy="394" r="18" />
      </g>

      {/* glints */}
      {[
        [80, 120],
        [520, 100],
        [140, 60],
        [470, 190],
        [560, 240],
        [40, 220],
      ].map(([sx, sy], i) => (
        <path
          key={i}
          className="animate-twinkle"
          style={{ animationDelay: `${i * 0.6}s`, transformBox: 'fill-box', transformOrigin: 'center' }}
          d={`M${sx} ${sy - 8} L${sx + 2} ${sy - 2} L${sx + 8} ${sy} L${sx + 2} ${sy + 2} L${sx} ${sy + 8} L${sx - 2} ${sy + 2} L${sx - 8} ${sy} L${sx - 2} ${sy - 2} Z`}
          fill={i % 2 ? '#fff' : p.trim}
        />
      ))}
    </svg>
  );
}
