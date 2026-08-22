import { useState, useEffect, useCallback, type RefObject, useRef } from "react";

/**
 * Phát hiện container đang scroll ngang → bật shadow cho sticky columns.
 * - scrolledRight: đã cuộn sang phải → cột sticky-left cần shadow cạnh phải
 * - scrolledLeft:  chưa cuộn hết sang phải → cột sticky-right cần shadow cạnh trái
 */
export function useScrollShadow() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrolledRight, setScrolledRight] = useState(false);
  const [scrolledLeft, setScrolledLeft] = useState(false);

  const check = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setScrolledRight(el.scrollLeft > 1);
    setScrolledLeft(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, [scrollContainerRef]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    check();

    const ro = new ResizeObserver(() => check());
    ro.observe(el);

    el.addEventListener("scroll", check, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", check);
    };
  }, [check]);

  return { scrollContainerRef, scrolledRight, scrolledLeft };
}
