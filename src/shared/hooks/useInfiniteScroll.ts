import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  containerRef: React.RefObject<HTMLElement>;
  onLoadMore: () => void;
  offset?: number; // khoảng cách trước khi chạm đáy (px)
  disabled?: boolean; // để chặn khi đang load
  delay?: number; // debounce delay (ms)
}

export const useInfiniteScroll = ({
  containerRef,
  onLoadMore,
  offset = 20,
  disabled = false,
  delay = 200,
}: UseInfiniteScrollProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!containerRef.current || disabled) return;

    const handleScroll = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const el = containerRef.current;
        if (!el) return;

        const { scrollTop, scrollHeight, clientHeight } = el;

        if (scrollHeight - scrollTop - clientHeight <= offset) {
          onLoadMore();
        }
      }, delay);
    };

    const el = containerRef.current;
    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [containerRef, onLoadMore, offset, disabled, delay]);
};
