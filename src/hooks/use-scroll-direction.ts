'use client';

import { useEffect, useState } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: 'up' | 'down';
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 0, initialDirection = 'up' } = options;
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>(initialDirection);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      const direction = scrollY > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      
      // Hide header when scrolling down and at least 100px from top
      // Show header when scrolling up or near the top
      setIsVisible(direction === 'up' || scrollY < 100);
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { scrollDirection, isVisible };
}
