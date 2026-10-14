import { useMemo, useRef, useState } from 'react';
import { Apple, Castle, Crown, Flower2, Gem, Wand2, type LucideIcon } from 'lucide-react';
import { MirrorIcon } from './icons';
import type { GameProps } from './types';

const SYMBOLS: { icon: LucideIcon; name: string }[] = [
  { icon: Crown, name: 'crown' },
  { icon: Castle, name: 'castle' },
  { icon: Apple, name: 'apple' },
  { icon: Flower2, name: 'rose' },
  { icon: Wand2, name: 'wand' },
  { icon: Gem, name: 'gem' },
];

function shuffled() {
  const deck = [...SYMBOLS.keys(), ...SYMBOLS.keys()];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/** Classic pairs-matching memory game with magic-mirror cards. */
export function MirrorMemory({ onWin }: GameProps) {
  const [round, setRound] = useState(0);
  const deck = useMemo(() => shuffled(), [round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const locked = useRef(false);
  const won = matched.size === deck.length;

  // Refs mirror the state so two very quick clicks never read stale values.
  const openRef = useRef<number[]>([]);
  const matchedRef = useRef<Set<number>>(new Set());

  const flip = (i: number) => {
    if (locked.current || openRef.current.includes(i) || matchedRef.current.has(i)) return;
    const next = [...openRef.current, i];
    openRef.current = next;
    setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next;
    if (deck[a] === deck[b]) {
      const m = new Set(matchedRef.current).add(a).add(b);
      matchedRef.current = m;
      openRef.current = [];
      setMatched(m);
      setOpen([]);
      if (m.size === deck.length) onWin();
    } else {
      locked.current = true;
      window.setTimeout(() => {
        openRef.current = [];
        setOpen([]);
        locked.current = false;
      }, 850);
    }
  };

  const restart = () => {
    setRound((r) => r + 1);
    openRef.current = [];
    matchedRef.current = new Set();
    setOpen([]);
    setMatched(new Set());
    setMoves(0);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-plum">
        <span aria-live="polite">
          🪞 {matched.size / 2} / {SYMBOLS.length} pairs
        </span>
        <span>Moves: {moves}</span>
      </div>
      <ul className="mx-auto grid max-w-[400px] grid-cols-4 gap-2.5 sm:gap-3">
        {deck.map((sym, i) => {
          const faceUp = open.includes(i) || matched.has(i);
          const { icon: Icon, name } = SYMBOLS[sym];
          return (
            <li key={`${round}-${i}`}>
              <button
                type="button"
                onClick={() => flip(i)}
                aria-label={faceUp ? `Card ${i + 1}: ${name}` : `Card ${i + 1}: hidden`}
                aria-pressed={faceUp}
                className="memory-card block aspect-[3/4] w-full"
              >
                <span className={`memory-inner ${faceUp ? 'is-up' : ''} ${matched.has(i) ? 'is-matched' : ''}`}>
                  <span className="memory-face memory-back">
                    <MirrorIcon className="h-[55%]" />
                  </span>
                  <span className="memory-face memory-front">
                    <Icon className="h-[45%] w-[45%] text-barbie" aria-hidden="true" />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {won ? (
        <p className="mt-4 text-center font-display text-xl text-barbie-deep">Mirror, mirror… you matched them all in {moves} moves! ✨</p>
      ) : (
        moves > 0 && (
          <div className="mt-4 text-center">
            <button type="button" onClick={restart} className="text-sm font-semibold text-barbie-deep underline-offset-4 hover:underline">
              Shuffle & restart
            </button>
          </div>
        )
      )}
    </div>
  );
}
