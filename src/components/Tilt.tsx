import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  glare?: boolean;
};

/** Tilts its content in 3D toward the mouse, with a soft moving glare. Mouse-only. */
export function Tilt({ children, className = '', max = 8, glare = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div ref={ref} className={`tilt relative h-full rounded-3xl ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  );
}
