import { useLayoutEffect, type RefObject } from 'react';

const MOBILE_TABS_MQ = '(max-width: 900px)';

function scrollActiveTabIntoView(tabs: HTMLElement, activeTab: HTMLElement, smooth: boolean) {
  const tabsRect = tabs.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();
  const targetLeft =
    tabs.scrollLeft +
    (tabRect.left - tabsRect.left) +
    tabRect.width / 2 -
    tabsRect.width / 2;

  tabs.scrollTo({
    left: Math.max(0, targetLeft),
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/** Keeps the active section tab visible in the horizontal tab rail while scrolling on mobile. */
export function useCaseStudyActiveTabScroll(
  tabsRef: RefObject<HTMLElement | null>,
  activeSection: string,
) {
  useLayoutEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs || !window.matchMedia(MOBILE_TABS_MQ).matches) return;

    const activeTab = tabs.querySelector('.case-study-detail__tab.is-active') as HTMLElement | null;
    if (!activeTab) return;

    scrollActiveTabIntoView(tabs, activeTab, false);
  }, [activeSection, tabsRef]);
}
