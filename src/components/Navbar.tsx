import { useEffect, useState } from 'react';
import { Menu, Sparkles, X } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';
import { profile } from '../data/resume';
import { releaseButterflies } from '../effects';

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'kingdom', label: 'Games' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Journey' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Crowns' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'contact', label: 'Contact' },
];

const SECTION_IDS = ['home', ...NAV_LINKS.map((l) => l.id)];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled || open
            ? 'border-white/80 bg-blush-light/75 shadow-[0_10px_30px_-12px_rgba(224,33,138,0.35)] backdrop-blur-xl'
            : 'border-white/40 bg-white/30 backdrop-blur-md'
        }`}
      >
        <a
          href="#home"
          className="group flex items-center gap-2"
          aria-label={`${profile.name} — home`}
          onClick={(e) => releaseButterflies(e.clientX || 40, e.clientY || 40)}
        >
          <span className="icon-orb h-9 w-9">
            <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
          </span>
          <span className="font-display text-lg font-semibold text-plum">
            {profile.firstName}
            <span className="text-barbie">.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active === link.id ? 'bg-white/80 text-barbie-deep shadow-sm' : 'text-plum-soft hover:text-barbie-deep'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-plum hover:bg-white/70 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-white/80 bg-blush-light/90 backdrop-blur-xl transition-all duration-400 lg:hidden ${
          open ? 'visible max-h-[480px] opacity-100' : 'invisible max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col p-3">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium ${
                  active === link.id ? 'bg-white text-barbie-deep' : 'text-plum hover:bg-white/70'
                }`}
              >
                <Sparkles className="h-4 w-4 text-barbie" aria-hidden="true" />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
