import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function encodeCssUrl(url: string) {
  return `url("${encodeURI(url)}")`;
}

export function useSwipeToggle(onPrev: () => void, onNext: () => void) {
  const startX = useRef<number | null>(null);

  return {
    onTouchStart: (event: { touches: ArrayLike<{ clientX: number }> }) => {
      startX.current = event.touches[0]?.clientX ?? null;
    },
    onTouchEnd: (event: { changedTouches: ArrayLike<{ clientX: number }> }) => {
      if (startX.current == null) return;
      const dx = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
      startX.current = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) onNext();
      else onPrev();
    },
  };
}

export function useTeaserSlide(initialUrl: string) {
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef(0);
  const busyRef = useRef(false);
  const currentUrlRef = useRef(initialUrl);

  const paint = (el: HTMLDivElement | null, url: string) => {
    if (!el) return;
    el.style.backgroundImage = encodeCssUrl(url);
  };

  useEffect(() => {
    paint(layerARef.current, initialUrl);
    paint(layerBRef.current, initialUrl);
    gsap.set(layerARef.current, { x: '0%', opacity: 1 });
    gsap.set(layerBRef.current, { x: '-120%', opacity: 1 });
    currentUrlRef.current = initialUrl;
  }, [initialUrl]);

  const slideTo = (url: string) => {
    if (url === currentUrlRef.current) return;
    const front = slotRef.current === 0 ? layerARef.current : layerBRef.current;
    const incoming = slotRef.current === 0 ? layerBRef.current : layerARef.current;
    if (!front || !incoming) return;

    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      paint(front, url);
      paint(incoming, url);
      gsap.set(front, { x: '0%', opacity: 1 });
      gsap.set(incoming, { x: '-120%', opacity: 1 });
      currentUrlRef.current = url;
      return;
    }

    if (busyRef.current) return;
    busyRef.current = true;
    paint(incoming, url);
    gsap.set(incoming, { x: '-120%', opacity: 1 });
    gsap.set(front, { x: '0%', opacity: 1 });

    gsap
      .timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          slotRef.current = slotRef.current === 0 ? 1 : 0;
          currentUrlRef.current = url;
          busyRef.current = false;
        },
      })
      .to(front, { duration: 0.45, x: '120%', opacity: 0, force3D: true }, 0)
      .to(incoming, { duration: 0.5, x: '0%', opacity: 1, ease: 'power3.out', force3D: true }, 0.08);
  };

  return { layerARef, layerBRef, slideTo };
}
