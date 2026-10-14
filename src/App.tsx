import { MagicBackground } from './components/MagicBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { GameKingdom } from './components/games/GameKingdom';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Achievements } from './components/Achievements';
import { Leadership } from './components/Leadership';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { CursorSparkles } from './components/CursorSparkles';
import { MagicIntro } from './components/MagicIntro';
import { FlyingPrincess } from './components/FlyingPrincess';
import { ScrollProgress } from './components/ScrollProgress';

export default function App() {
  return (
    <>
      <a
        href="#about"
        data-no-magic
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-barbie-deep"
      >
        Skip to content
      </a>
      <MagicBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <GameKingdom />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Leadership />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <CursorSparkles />
      <MagicIntro />
      <FlyingPrincess />
      <ScrollProgress />
    </>
  );
}
