import { useEffect, useRef, useState } from "react";
import { IconReset } from "../icon/Reset";

type PullToLoadMoreProps = {
  onLoadMore?: () => void;
  threshold?: number; // px, mặc định 60
  containerRef?: React.RefObject<HTMLDivElement>;
  disabled?: boolean;
  maxPullHeight?: number; // max chiều cao khi kéo
};

export const PullToLoadMore = ({
  onLoadMore,
  disabled = false,
  threshold = 60,
  containerRef,
  maxPullHeight = 64,
}: PullToLoadMoreProps) => {
  const startY = useRef<number | null>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (disabled || !containerRef?.current) return;
    const container = containerRef.current;

    const getScrollBottom = () =>
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const handleTouchStart = (e: TouchEvent) => {
      if (getScrollBottom() <= 1) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current !== null && getScrollBottom() <= 1) {
        const delta = startY.current - e.touches[0].clientY; // kéo lên
        if (delta > 0) {
          e.preventDefault();
          setDistance(Math.min(delta, maxPullHeight));
        }
      }
    };

    const handleTouchEnd = () => {
      if (distance >= threshold && getScrollBottom() <= 1) {
        onLoadMore?.();
      }
      setDistance(0);
      startY.current = null;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onLoadMore, threshold, containerRef, distance, disabled, maxPullHeight]);

  return <></>;
};
