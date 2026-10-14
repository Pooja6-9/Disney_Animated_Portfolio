/** Small original fairytale icons used by the games (sized by className, colored inline). */

type IconProps = { className?: string };

export function SlipperIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="slipper-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#d9ecff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#c9b6e8" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* heel */}
      <path d="M8 14 L12 14 L10 36 L7 36 Z" fill="url(#slipper-glass)" stroke="#9b74d6" strokeWidth="1" />
      {/* shoe body */}
      <path
        d="M6 12 C10 8 18 10 24 18 C32 26 44 26 56 27 C61 28 62 32 58 34 C46 37 30 37 18 32 C14 30 12 22 6 16 Z"
        fill="url(#slipper-glass)"
        stroke="#9b74d6"
        strokeWidth="1.2"
      />
      <path d="M22 20 C30 28 42 29 54 30" stroke="#ffffff" strokeWidth="1.4" fill="none" opacity="0.9" />
      <circle cx="44" cy="25" r="2" fill="#ff8fc8" />
    </svg>
  );
}

export function LanternIcon({ className = '', lit = true }: IconProps & { lit?: boolean }) {
  return (
    <svg viewBox="0 0 40 52" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={lit ? 'lantern-lit' : 'lantern-dim'} cx="50%" cy="55%" r="60%">
          <stop offset="0" stopColor={lit ? '#fff6c2' : '#f3dce6'} />
          <stop offset="0.6" stopColor={lit ? '#ffc46b' : '#e7c3d4'} />
          <stop offset="1" stopColor={lit ? '#ff8a5c' : '#c9a3b6'} />
        </radialGradient>
      </defs>
      <rect x="14" y="2" width="12" height="5" rx="1.5" fill="#b76e79" />
      <path d="M8 9 Q20 4 32 9 L35 38 Q20 46 5 38 Z" fill={`url(#${lit ? 'lantern-lit' : 'lantern-dim'})`} stroke="#b76e79" strokeWidth="1.2" />
      <path d="M14 10 L12 40 M26 10 L28 40" stroke="#b76e79" strokeWidth="0.8" opacity="0.6" />
      <rect x="15" y="42" width="10" height="4" rx="1.5" fill="#b76e79" />
      {lit && <ellipse cx="20" cy="25" rx="5" ry="7" fill="#fffbe0" opacity="0.9" />}
    </svg>
  );
}

export function MirrorIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 40 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mirror-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d8c7f3" />
        </linearGradient>
      </defs>
      <rect x="17" y="34" width="6" height="18" rx="3" fill="#e8b4a6" />
      <ellipse cx="20" cy="20" rx="16" ry="19" fill="#e8b4a6" />
      <ellipse cx="20" cy="20" rx="12" ry="15" fill="url(#mirror-glass)" />
      <path d="M13 12 Q16 8 20 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="2.5" r="2.2" fill="#e0218a" />
    </svg>
  );
}
