/**
 * Original SVG artwork of a flying fairy princess (fashion-doll style, not any
 * official character). Drawn facing right in a 140×90 box; the wand star sits
 * near (127, 12).
 */
export function PrincessArt({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#f6c6ff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#b79be6" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-dress`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4fa3" />
          <stop offset="0.55" stopColor="#ff8fc8" />
          <stop offset="1" stopColor="#ffd1ea" />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#ffe48a" />
          <stop offset="1" stopColor="#e9b04c" />
        </linearGradient>
        <radialGradient id={`${id}-star`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffe7a3" />
        </radialGradient>
      </defs>

      {/* wings */}
      <g className="princess-wings">
        <ellipse cx="66" cy="20" rx="24" ry="11" transform="rotate(-28 66 20)" fill={`url(#${id}-wing)`} stroke="#ffffff" strokeOpacity="0.8" />
        <ellipse cx="60" cy="33" rx="17" ry="7.5" transform="rotate(12 60 33)" fill={`url(#${id}-wing)`} stroke="#ffffff" strokeOpacity="0.8" />
      </g>

      {/* ponytail streaming behind */}
      <path d="M89 22 C78 12 66 18 54 10 C60 24 72 28 88 31 Z" fill={`url(#${id}-hair)`} />
      <path d="M86 24 C76 19 68 22 60 17" stroke="#fff3c4" strokeWidth="1.2" fill="none" opacity="0.8" />

      {/* legs + little heels trailing behind the gown */}
      <path d="M30 62 L10 69 M32 65 L13 74" stroke="#fbdccd" strokeWidth="3" strokeLinecap="round" />
      <path d="M5 67 q4 -3 7 1 l-2 2 z M8 72 q4 -3 7 1 l-2 2 z" fill="#e0218a" />

      {/* ball gown flowing back */}
      <path d="M80 41 C66 38 46 41 22 53 C33 56 29 63 16 71 C40 72 62 63 82 52 Z" fill={`url(#${id}-dress)`} />
      <path d="M22 53 C33 56 29 63 16 71" stroke="#ffffff" strokeWidth="1.4" fill="none" opacity="0.7" />
      <path d="M70 45 C56 47 42 54 32 62" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.5" />
      {/* bodice */}
      <path d="M78 38 Q87 35 91 42 L85 53 Q78 51 75 46 Z" fill="#e0218a" />
      <circle cx="84" cy="41" r="1.4" fill="#ffe7f3" />

      {/* arm + wand */}
      <path d="M88 38 Q99 34 110 26" stroke="#f9d2c1" strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="110" y1="26" x2="124" y2="14" stroke="#f4c9a8" strokeWidth="2" strokeLinecap="round" />
      <path
        className="princess-wand-star"
        d="M127 4 L129.5 10 L136 11 L131 15 L132.5 21.5 L127 18 L121.5 21.5 L123 15 L118 11 L124.5 10 Z"
        fill={`url(#${id}-star)`}
        stroke="#ffd36e"
        strokeWidth="0.8"
      />

      {/* head */}
      <circle cx="96" cy="28" r="9" fill="#fbdccd" />
      <path
        d="M86 31 C81 17 95 10 105 18 C106 21 104 22 101 21 C96 20 92 23 91 28 C90 33 88 35 86 31 Z"
        fill={`url(#${id}-hair)`}
      />
      <path d="M88 28 C87 36 84 40 80 41" stroke={`url(#${id}-hair)`} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* tiara */}
      <path d="M91 19 l1.6 -4.5 l2 3.2 l2.2 -5.4 l2.2 5.2 l2 -3 l1.4 4.6 Z" fill="#ffd1ea" stroke="#f4c9a8" strokeWidth="0.8" />
      <circle cx="96.8" cy="13.6" r="1" fill="#e0218a" />
      {/* face */}
      <ellipse cx="100" cy="27.5" rx="1.2" ry="1.7" fill="#45173b" />
      <circle cx="100.4" cy="26.9" r="0.4" fill="#fff" />
      <path d="M98.8 26.4 l-1.2 -1 M99.7 25.9 l-0.6 -1.3 M100.9 25.9 l0.2 -1.4" stroke="#45173b" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M99 25 q1.6 -1 3 0" stroke="#45173b" strokeWidth="0.6" fill="none" />
      <circle cx="101" cy="31" r="1.8" fill="#ff8fc8" opacity="0.55" />
      <path d="M100.5 33.2 q1.6 0.9 2.8 -0.4" stroke="#c9137a" strokeWidth="0.9" strokeLinecap="round" fill="none" />
    </>
  );
}
