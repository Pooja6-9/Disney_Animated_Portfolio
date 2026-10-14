/** Small DOM-based visual effects. All are decorative and skip themselves under reduced motion. */

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FIREWORK_COLORS = ['#ff4fa3', '#ffffff', '#c9b6e8', '#f4c9a8', '#ff9ccf'];

/** A round firework burst; every third one blooms into a heart. */
let fireworkCount = 0;
export function fireworkBurst(x: number, y: number) {
  if (prefersReduced()) return;
  const heart = ++fireworkCount % 3 === 0;
  const count = heart ? 32 : 26;
  for (let i = 0; i < count; i++) {
    const t = (Math.PI * 2 * i) / count;
    let dx: number;
    let dy: number;
    if (heart) {
      dx = 16 * Math.pow(Math.sin(t), 3) * 5;
      dy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 5;
    } else {
      const d = (i % 2 ? 110 : 80) + Math.random() * 20;
      dx = Math.cos(t) * d;
      dy = Math.sin(t) * d;
    }
    const p = document.createElement('span');
    p.className = 'firework-dot';
    p.setAttribute('aria-hidden', 'true');
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.background = heart && i % 3 ? '#ff4fa3' : FIREWORK_COLORS[i % FIREWORK_COLORS.length];
    p.style.setProperty('--dx', `${dx}px`);
    p.style.setProperty('--dy', `${dy}px`);
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
  const flash = document.createElement('span');
  flash.className = 'firework-flash';
  flash.setAttribute('aria-hidden', 'true');
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;
  document.body.appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove());
}

const BUTTERFLY_HUES = [
  ['#ff8fc8', '#e0218a'],
  ['#e2d4fb', '#9b74d6'],
  ['#ffe0d0', '#c98579'],
];

/** Releases a small swarm of butterflies that flutter outward from a point. */
export function releaseButterflies(x: number, y: number, count = 9) {
  if (prefersReduced()) return;
  for (let i = 0; i < count; i++) {
    const [light, deep] = BUTTERFLY_HUES[i % BUTTERFLY_HUES.length];
    const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.7; // mostly downward & sideways
    const dist = 180 + Math.random() * 320;
    const el = document.createElement('span');
    el.className = 'swarm-butterfly';
    el.setAttribute('aria-hidden', 'true');
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--tx', `${Math.cos(angle) * dist * (Math.random() > 0.5 ? 1 : -1)}px`);
    el.style.setProperty('--ty', `${Math.sin(angle) * dist - 120}px`);
    el.style.setProperty('--rot', `${Math.random() * 60 - 30}deg`);
    el.style.animationDelay = `${i * 60}ms`;
    el.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 40">
      <g class="swarm-wing"><path d="M20 20 C12 6 2 6 3 15 C4 22 12 22 20 20Z" fill="${light}"/><path d="M20 21 C13 24 6 30 10 34 C14 37 18 29 20 21Z" fill="${deep}"/></g>
      <g class="swarm-wing swarm-wing-r"><path d="M20 20 C28 6 38 6 37 15 C36 22 28 22 20 20Z" fill="${light}"/><path d="M20 21 C27 24 34 30 30 34 C26 37 22 29 20 21Z" fill="${deep}"/></g>
      <ellipse cx="20" cy="21" rx="1.4" ry="7" fill="#45173b"/></svg>`;
    document.body.appendChild(el);
    el.addEventListener('animationend', (e) => {
      if (e.target === el) el.remove();
    });
  }
}
