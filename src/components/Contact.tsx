import { useState, type MouseEvent as ReactMouseEvent } from 'react';
import { ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { Castle } from './Castle';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { MagicButton, sparkleBurst } from './MagicButton';
import { fireworkBurst } from '../effects';
import { profile } from '../data/resume';

type Channel = { label: string; value: string; href: string; icon: LucideIcon; external: boolean };

const CHANNELS: Channel[] = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail, external: false },
  { label: 'LinkedIn', value: profile.linkedinLabel, href: profile.linkedin, icon: Linkedin, external: true },
  { label: 'GitHub', value: profile.githubLabel, href: profile.github, icon: Github, external: true },
];

const SUNSET_STARS = [
  [8, 12], [18, 30], [27, 8], [40, 20], [55, 6], [63, 26], [74, 12], [86, 22], [93, 8], [12, 48], [88, 44],
];

export function Contact() {
  const [copied, setCopied] = useState(0);

  const copyEmail = async (e: ReactMouseEvent) => {
    const { clientX: x, clientY: y } = e;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied((n) => n + 1);
      sparkleBurst(x, y, 16);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative px-4 pb-16 pt-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_-30px_rgba(110,58,158,0.55)]">
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,#3d1b5c_0%,#7a3a8f_22%,#c9468f_48%,#f1798f_68%,#ffb38a_86%,#ffd3a8_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-[52%] h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ffe7b0_0%,#ffb38a_45%,transparent_70%)] opacity-80"
          aria-hidden="true"
        />
        {SUNSET_STARS.map(([x, y], i) => (
          <span
            key={i}
            className="absolute h-1 w-1 animate-twinkle rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}
            aria-hidden="true"
          />
        ))}

        <div className="relative px-5 pb-0 pt-16 sm:px-12">
          <SectionHeading
            light
            kicker="Send a little magic"
            title="Let’s Create Something Together"
            subtitle="I’m open to software engineering internships and placement opportunities. I’d love to hear from you."
          />

          <ul className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
            {CHANNELS.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 90}>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex h-full items-center gap-4 rounded-3xl border border-white/40 bg-white/15 p-5 text-white backdrop-blur-md transition hover:-translate-y-1 hover:border-white/80 hover:bg-white/25"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-barbie shadow-[0_0_24px_rgba(255,255,255,0.6)] transition-transform duration-500 group-hover:rotate-[360deg]">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{c.label}</span>
                    <span className="block break-all text-sm font-medium leading-snug sm:text-[0.95rem]">{c.value}</span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 opacity-70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  {c.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagicButton href={profile.resumeUrl} download="Pooja_Jain_Resume.pdf" className="!bg-white !bg-none !text-barbie-deep">
              <Download className="h-5 w-5" aria-hidden="true" />
              Download My Resume
            </MagicButton>
            <button
              type="button"
              onClick={copyEmail}
              className="btn-magic border border-white/60 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
            >
              {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
              {copied ? 'Email copied!' : 'Copy my email'}
            </button>
          </Reveal>

          <div className="mx-auto mt-6 max-w-2xl">
            <button
              type="button"
              className="castle-button block w-full"
              onClick={(e) => {
                fireworkBurst(e.clientX, e.clientY - 80);
                window.setTimeout(() => fireworkBurst(e.clientX + 90, e.clientY - 140), 250);
              }}
              aria-label="Light up the sunset castle with fireworks"
            >
              <Castle variant="sunset" idPrefix="sunset-castle" className="h-auto w-full" />
            </button>
          </div>
        </div>
      </div>

      {copied > 0 && (
        <p key={copied} className="toast rounded-full bg-plum px-5 py-2.5 text-sm font-medium text-white shadow-lg" role="status">
          ✨ Email copied to clipboard
        </p>
      )}
    </section>
  );
}
