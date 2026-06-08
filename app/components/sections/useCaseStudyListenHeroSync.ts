import { type RefObject, useLayoutEffect } from 'react';

const SIDEBAR_LISTEN_MQ = '(min-width: 901px)';

/** Keeps the sidebar Listen control bottom-aligned with the hero intro card. */
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

    const sync = () => {
      if (!mq.matches) {
        sidebar.style.removeProperty('--case-study-sidebar-sync-height');
        return;
      }
      sidebar.style.setProperty('--case-study-sidebar-sync-height', `${hero.offsetHeight}px`);
    };

    const ro = new ResizeObserver(sync);
    ro.observe(hero);
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    sync();

    return () => {
      ro.disconnect();
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, [heroCardRef, sidebarRef, ...deps]);
}
