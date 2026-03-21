'use client';

import type { CSSProperties } from 'react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const NAVBAR_ESTIMATE_PX = 80;

/**
 * Smooth scroll to a tab group with offset (navbar + sticky tab bar).
 * Active tab follows scroll position for stable highlighting (no IO flicker).
 */
export function useProfileTabNavigation(tabGroupIds: readonly string[]) {
  const tabsBarRef = useRef<HTMLDivElement | null>(null);
  const [scrollPadPx, setScrollPadPx] = useState(160);
  const [activeTabId, setActiveTabId] = useState<string>(tabGroupIds[0] ?? '');

  useLayoutEffect(() => {
    const el = tabsBarRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      setScrollPadPx(Math.round(NAVBAR_ESTIMATE_PX + h + 12));
    });
    ro.observe(el);
    const h = el.getBoundingClientRect().height;
    setScrollPadPx(Math.round(NAVBAR_ESTIMATE_PX + h + 12));
    return () => ro.disconnect();
  }, []);

  const scrollToTabGroup = useCallback(
    (id: string) => {
      const node = document.getElementById(id);
      if (!node) return;
      setActiveTabId(id);
      const top = node.getBoundingClientRect().top + window.scrollY - scrollPadPx;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      });
    },
    [scrollPadPx],
  );

  useEffect(() => {
    if (tabGroupIds.length === 0) return;

    let ticking = false;
    const updateActiveFromScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY + scrollPadPx + 4;
        let current = tabGroupIds[0];
        for (const id of tabGroupIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= y) current = id;
        }
        setActiveTabId((prev) => (prev === current ? prev : current));
      });
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll);
    return () => {
      window.removeEventListener('scroll', updateActiveFromScroll);
      window.removeEventListener('resize', updateActiveFromScroll);
    };
  }, [tabGroupIds, scrollPadPx]);

  return {
    tabsBarRef,
    activeTabId,
    scrollToTabGroup,
    scrollPadPx,
    scrollPaddingStyle: {
      ['--profile-scroll-pad' as string]: `${scrollPadPx}px`,
    } as CSSProperties,
  };
}
