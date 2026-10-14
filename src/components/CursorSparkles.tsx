import { useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { sparkleBurst } from './MagicButton';

const COLORS = ['#e0218a', '#ff9ccf', '#b79be6', '#e8b4a6'];

/**
 * A light fairy-dust trail behind the mouse on desktop. Purely decorative:
 * it never replaces the cursor, ignores pointer events, and is disabled for
 * touch devices and reduced-motion users.
 */
export function CursorSparkles() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    let last = 0;
    let i = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      const s = document.createElement('span');
      s.className = 'cursor-sparkle';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = '✦';
      s.style.left = `${e.clientX + (Math.random() * 10 - 5)}px`;
      s.style.top = `${e.clientY + (Math.random() * 10 - 5)}px`;
      s.style.color = COLORS[i++ % COLORS.length];
      s.style.fontSize = `${8 + Math.random() * 6}px`;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    };
    // Clicking empty space (not a link, button or text field) casts a little sparkle spell.
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || t.closest('a, button, input, textarea, select, label, .princess-body')) return;
      sparkleBurst(e.clientX, e.clientY, 10);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, [reduced]);

  return null;
}
