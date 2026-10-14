import type { AnchorHTMLAttributes, MouseEvent, PointerEvent, ReactNode } from 'react';

type MagicButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
};

const COLORS = ['#e0218a', '#ff9ccf', '#c9b6e8', '#e8b4a6', '#ffffff'];

/** Spawns a small, short-lived burst of star sparkles at a screen point. */
export function sparkleBurst(x: number, y: number, count = 12) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 30 + Math.random() * 40;
    s.className = 'sparkle-burst';
    s.textContent = i % 3 === 0 ? '✦' : '✧';
    s.setAttribute('aria-hidden', 'true');
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.color = COLORS[i % COLORS.length];
    s.style.fontSize = `${10 + Math.random() * 10}px`;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

/** A link styled as a glowing pill. It leans toward the mouse ("magnetic") and bursts sparkles on click. */
export function MagicButton({ variant = 'primary', className = '', children, onClick, ...rest }: MagicButtonProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    sparkleBurst(e.clientX, e.clientY);
    onClick?.(e);
  };
  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
    e.currentTarget.style.transform = `translate(${dx}px, ${dy - 2}px)`;
  };
  return (
    <a
      {...rest}
      onPointerMove={onMove}
      onPointerLeave={(e) => (e.currentTarget.style.transform = '')}
      onClick={handleClick}
      className={`btn-magic ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`}
    >
      {children}
    </a>
  );
}
