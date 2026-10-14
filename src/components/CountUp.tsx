import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Counts up to a resume figure such as "2,000+", "~40%" or "10+" when it scrolls
 * into view. The final text is always exactly the original value.
 */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, '')) : 0;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    if (!match || reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCurrent(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
        else setCurrent(null);
      };
      setCurrent(0);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  const shown =
    current === null || !match ? value : `${match[1]}${current.toLocaleString('en-US')}${match[3]}`;

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
