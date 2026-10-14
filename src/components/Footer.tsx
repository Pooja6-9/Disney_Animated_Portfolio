import { Heart } from 'lucide-react';
import { profile } from '../data/resume';

export function Footer() {
  return (
    <footer className="px-4 pb-10 text-center text-sm text-plum-soft">
      <p className="flex items-center justify-center gap-1.5">
        Crafted with <Heart className="h-4 w-4 fill-barbie text-barbie" aria-label="love" /> and a sprinkle of fairy dust
      </p>
      <p className="mt-1">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
