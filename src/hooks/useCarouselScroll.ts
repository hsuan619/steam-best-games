import React, { useRef, useState, useCallback } from 'react';

interface CarouselScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

export const useCarouselScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<CarouselScrollState>({
    canScrollLeft: false,
    canScrollRight: true,
  });

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollState({
      canScrollLeft: el.scrollLeft > 4,
      canScrollRight: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    });
  }, []);

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
  }, []);

  /** Enable drag-to-scroll on desktop */
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const startX = e.pageX - el.offsetLeft;
    const scrollLeft = el.scrollLeft;
    el.style.cursor = 'grabbing';

    const onMouseMove = (ev: MouseEvent) => {
      const x = ev.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX);
    };
    const onMouseUp = () => {
      el.style.cursor = 'grab';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, []);

  return { scrollRef, scrollState, updateScrollState, scrollBy, onMouseDown };
};
