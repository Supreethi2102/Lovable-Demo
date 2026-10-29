import { type RefObject, useLayoutEffect } from 'react';

const SIDEBAR_LISTEN_MQ = '(min-width: 901px)';

/** Sizes the sticky sidebar so Listen stays on screen, bottom-aligned with the hero card. */
export function useCaseStudyListenHeroSync(
  heroCardRef: RefObject<HTMLElement | null>,
  sidebarRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    const hero = heroCardRef.current;
    const sidebar = sidebarRef.current;
    if (!hero || !sidebar) return;

    const mq = window.matchMedia(SIDEBAR_LISTEN_MQ);
    const observedImages = new Set<HTMLImageElement>();

    const clearSync = () => {
      sidebar.style.removeProperty('--case-study-sidebar-sync-height');
    };

    const sync = () => {
      if (!mq.matches) {
        clearSync();
        return;
      }

      const heroHeight = Math.ceil(hero.offsetHeight);
      if (heroHeight > 0) {
        sidebar.style.setProperty('--case-study-sidebar-sync-height', `${heroHeight}px`);
      }
    };

    const scheduleSync = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(sync);
      });
    };

    const observeImages = () => {
      hero.querySelectorAll('img').forEach((img) => {
        if (observedImages.has(img)) return;
        observedImages.add(img);
        if (!img.complete) {
          img.addEventListener('load', scheduleSync);
        }
      });
    };

    const ro = new ResizeObserver(() => {
      observeImages();
      scheduleSync();
    });
    ro.observe(hero);
    ro.observe(sidebar);

    observeImages();
    mq.addEventListener('change', scheduleSync);
    window.addEventListener('resize', scheduleSync);
    scheduleSync();

    return () => {
      ro.disconnect();
      mq.removeEventListener('change', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      observedImages.forEach((img) => {
        img.removeEventListener('load', scheduleSync);
      });
      clearSync();
    };
  }, [heroCardRef, sidebarRef, ...deps]);
}
