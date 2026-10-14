import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { sparkleBurst } from './MagicButton';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={(e) => {
        sparkleBurst(e.clientX, e.clientY, 10);
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      }}
      className={`group fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-barbie to-lavender-deep opacity-90 shadow-[0_10px_30px_-6px_rgba(224,33,138,0.7)] transition-transform duration-300 group-hover:scale-110" />
      <span className="absolute inset-[-6px] rounded-full border border-dashed border-barbie/40 animate-spin-slow" aria-hidden="true" />
      <Star className="relative h-6 w-6 fill-white text-white transition-transform duration-500 group-hover:rotate-[72deg]" />
    </button>
  );
}
