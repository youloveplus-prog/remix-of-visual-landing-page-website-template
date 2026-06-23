import { useState, useEffect, useRef } from 'react';

interface ScrollDirectionResult {
  scrollDirection: 'up' | 'down' | null;
  isScrolled: boolean;
  scrollY: number;
}

export function useScrollDirection(threshold = 10): ScrollDirectionResult {
  // Use refs for the bookkeeping values so the scroll listener never
  // resubscribes and we only call setState when something the UI actually
  // cares about flips (direction or scrolled-vs-top).
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const lastYRef = useRef(0);
  const lastDirRef = useRef<'up' | 'down' | null>(null);
  const lastScrolledRef = useRef(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const current = window.scrollY;
      const last = lastYRef.current;
      const scrolled = current > 0;
      if (scrolled !== lastScrolledRef.current) {
        lastScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }
      if (Math.abs(current - last) >= threshold) {
        const dir: 'up' | 'down' = current > last ? 'down' : 'up';
        if (dir !== lastDirRef.current) {
          lastDirRef.current = dir;
          setScrollDirection(dir);
        }
        lastYRef.current = current;
        setScrollY(current);
      }
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrollDirection, isScrolled, scrollY };
}
