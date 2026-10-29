import { type RefObject, useLayoutEffect } from 'react';

const SIDEBAR_LISTEN_MQ = '(min-width: 901px)';

function navCollisionBottom(rail: HTMLElement) {
  const root = rail.parentElement;
  if (!root) return 0;

  const tabs = root.querySelector<HTMLElement>('.case-study-detail__tabs');
  const back = root.querySelector<HTMLElement>(
    '.case-study-detail__sidebar-top, .case-study-detail__toolbar',
  );

  let bottom = 0;
  if (tabs) {
    const rect = tabs.getBoundingClientRect();
    if (rect.height > 0) bottom = Math.max(bottom, rect.bottom);
  }
  if (back) {
    const rect = back.getBoundingClientRect();
    if (rect.height > 0) bottom = Math.max(bottom, rect.bottom);
  }
  return bottom;
}

/** Keeps the Listen control in the left rail, bottom-aligned with the hero intro card. */
export function useCaseStudyListenHeroSync(
  heroCardRef: RefObject<HTMLElement | null>,
  listenRailRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    const hero = heroCardRef.current;
    const rail = listenRailRef.current;
    if (!hero || !rail) return;

    const mq = window.matchMedia(SIDEBAR_LISTEN_MQ);
    const observedImages = new Set<HTMLImageElement>();

    const clearSync = () => {
      rail.style.removeProperty('--case-study-listen-rail-height');
      rail.classList.remove('is-occluded');
    };

    const sync = () => {
      if (!mq.matches) {
        clearSync();
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();
      const railHeight = Math.ceil(heroRect.bottom - railRect.top);

      if (railHeight > 0) {
        rail.style.setProperty('--case-study-listen-rail-height', `${railHeight}px`);
      }

      const listen = rail.querySelector<HTMLElement>('.case-study-detail__listen');
      if (!listen) return;

      const listenTop = listen.getBoundingClientRect().top;
      const navBottom = navCollisionBottom(rail);
      rail.classList.toggle('is-occluded', navBottom > 0 && listenTop < navBottom + 8);
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
    ro.observe(rail);

    observeImages();
    mq.addEventListener('change', scheduleSync);
    window.addEventListener('resize', scheduleSync);
    window.addEventListener('scroll', sync, { passive: true });
    scheduleSync();

    return () => {
      ro.disconnect();
      mq.removeEventListener('change', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      window.removeEventListener('scroll', sync);
      observedImages.forEach((img) => {
        img.removeEventListener('load', scheduleSync);
      });
      clearSync();
    };
  }, [heroCardRef, listenRailRef, ...deps]);
}
