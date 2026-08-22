import { useEffect, useRef, useState } from "react";
import { IconReset } from "../icon/Reset";

type PullToReloadProps = {
  onReload?: () => void;
  threshold?: number; // px, mặc định 60
  containerRef?: React.RefObject<HTMLDivElement>;
};

export const PullToReload = ({
  onReload,
  threshold = 60,
  containerRef,
}: PullToReloadProps) => {
  const startY = useRef<number | null>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!containerRef?.current) return;
    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current !== null && container.scrollTop === 0) {
        const delta = e.touches[0].clientY - startY.current;
        if (delta > 0) {
          e.preventDefault();
          setDistance(delta);
        }
      }
    };

    const handleTouchEnd = () => {
      if (distance >= threshold) {
        onReload?.();
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
  }, [onReload, threshold, containerRef, distance]);

  const rotate = distance * 2;

  return (
    <div
      className="flex z-50 relative justify-center items-center transition-all duration-200"
      style={{
        height: 0,
      }}
    >
      <div
        className="absolute bg-gray-100 rounded-full p-1 shadow-md"
        style={{
          top: Math.min(distance / 2 - 45, 40),
        }}
      >
        <div
          style={{
            transform: `rotate(${rotate}deg)`,
            transition: "transform 0.2s ease",
          }}
        >
          <IconReset color="#999" />
        </div>
      </div>
    </div>
  );
};
