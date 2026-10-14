import { useEffect, useRef } from 'react';

/** A thin pink ribbon across the top that fills as you scroll, led by a tiny star. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        ref.current?.style.setProperty('--progress', String(p));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={ref} className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-bar" />
      <span className="scroll-progress-star">✦</span>
    </div>
  );
}
