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
    const observedImages = new Set<HTMLImageElement>();

    const clearSync = () => {
      sidebar.style.removeProperty('--case-study-sidebar-sync-height');
      const listen = sidebar.querySelector<HTMLElement>('.case-study-detail__listen');
      listen?.style.removeProperty('margin-top');
    };

    const sync = () => {
      if (!mq.matches) {
        clearSync();
        return;
      }

      const listen = sidebar.querySelector<HTMLElement>('.case-study-detail__listen');
      const scrollNavBlock = sidebar.querySelector<HTMLElement>('.case-study-detail__scroll-nav');
      if (!listen || !scrollNavBlock) return;

      const heroRect = hero.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      const listenHeight = listen.getBoundingClientRect().height;
      const scrollNavHeight = scrollNavBlock.getBoundingClientRect().height;

      /* Match listen bottom to hero card bottom (not hero height alone). */
      const sidebarHeight = Math.ceil(heroRect.bottom - sidebarRect.top);
      const listenMarginTop = Math.ceil(
        heroRect.bottom - sidebarRect.top - scrollNavHeight - listenHeight,
      );

      if (sidebarHeight > 0) {
        sidebar.style.setProperty('--case-study-sidebar-sync-height', `${sidebarHeight}px`);
      }

      listen.style.marginTop = `${Math.max(0, listenMarginTop)}px`;
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
