import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

const PIN_NAV_MQ = '(max-width: 900px)';

/** Pins the mobile toolbar + section tabs only after the user scrolls past them. */
export function useCaseStudyScrollPinNav(
  sentinelRef: RefObject<HTMLElement | null>,
  scrollNavRef: RefObject<HTMLElement | null>,
  anchorRef: RefObject<HTMLElement | null>,
) {
  const [navPinned, setNavPinned] = useState(false);
  const navPinnedRef = useRef(false);

  useLayoutEffect(() => {
    const sentinel = sentinelRef.current;
    const scrollNav = scrollNavRef.current;
    const anchor = anchorRef.current;
    if (!sentinel || !scrollNav || !anchor) return;

    const mq = window.matchMedia(PIN_NAV_MQ);

    const syncAnchorHeight = (pinned: boolean) => {
      if (!pinned) {
        anchor.style.removeProperty('min-height');
        return;
      }
      anchor.style.minHeight = `${scrollNav.offsetHeight}px`;
    };

    const setPinned = (pinned: boolean) => {
      navPinnedRef.current = pinned;
      setNavPinned(pinned);
      syncAnchorHeight(pinned);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!mq.matches) {
          setPinned(false);
          return;
        }
        setPinned(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    const onMqChange = () => {
      if (!mq.matches) setPinned(false);
    };

    const ro = new ResizeObserver(() => {
      if (navPinnedRef.current) syncAnchorHeight(true);
    });
    ro.observe(scrollNav);

    observer.observe(sentinel);
    mq.addEventListener('change', onMqChange);

    return () => {
      observer.disconnect();
      ro.disconnect();
      mq.removeEventListener('change', onMqChange);
      anchor.style.removeProperty('min-height');
    };
  }, [sentinelRef, scrollNavRef, anchorRef]);

  return navPinned;
}
