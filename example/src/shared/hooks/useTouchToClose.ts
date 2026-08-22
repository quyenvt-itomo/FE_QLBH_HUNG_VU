import { useEffect, useRef } from "react";

type TouchToCloseProps = {
  onSwipeClose: () => void;
  direction?: "left" | "right"; // mặc định left
  threshold?: number; // ngưỡng px, mặc định 50
};

export const TouchToClose = ({
  onSwipeClose,
  direction = "left",
  threshold = 50,
}: TouchToCloseProps) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
      touchEndY.current = e.touches[0].clientY;

      // Nếu bắt đầu từ mép trái màn hình (<20px) và vuốt ngang => chặn back gesture
      if (
        touchStartX.current !== null &&
        touchStartY.current !== null &&
        Math.abs(touchStartX.current - touchEndX.current) >
          Math.abs(touchStartY.current - touchEndY.current) &&
        touchStartX.current < 20
      ) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (
        touchStartX.current !== null &&
        touchStartY.current !== null &&
        touchEndX.current !== null &&
        touchEndY.current !== null
      ) {
        const deltaX = touchStartX.current - touchEndX.current;
        const deltaY = touchStartY.current - touchEndY.current;

        // Vuốt ngang
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (direction === "left" && deltaX > threshold) {
            onSwipeClose();
          } else if (direction === "right" && deltaX < -threshold) {
            onSwipeClose();
          }
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
      touchEndX.current = null;
      touchEndY.current = null;
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false }); // quan trọng
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeClose, direction, threshold]);

  return null;
};
