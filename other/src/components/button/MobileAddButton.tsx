import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";

interface MobileAddButtonProps {
  onOpenAdd?: () => void;
  onClick?: () => void;
}

const MobileAddButton: React.FC<MobileAddButtonProps> = ({
  onOpenAdd,
  onClick,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const DRAG_THRESHOLD = 10; // Minimum pixels to consider as drag

  useEffect(() => {
    const initialX = window.innerWidth - 58;
    const initialY = window.innerHeight - 120;
    setPosition({ x: initialX, y: initialY });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setHasMoved(false);
    setTouchStartPos({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > DRAG_THRESHOLD && !hasMoved) {
      setIsDragging(true);
      setHasMoved(true);
    }

    if (isDragging) {
      const newX = touch.clientX - 20; // Center button on touch
      const newY = touch.clientY - 20;

      const maxX = window.innerWidth - 40;
      const maxY = window.innerHeight - 110;

      setPosition({
        x: Math.max(16, Math.min(newX, maxX)),
        y: Math.max(64, Math.min(newY, maxY)),
      });
    }
  };

  const handleTouchEnd = () => {
    if (hasMoved) {
      const centerX = position.x + 20;
      const snapToRight = centerX > window.innerWidth / 2;

      setPosition((prev) => ({
        x: snapToRight ? window.innerWidth - 56 : 16,
        y: prev.y,
      }));
    }

    setIsDragging(false);
    setTimeout(() => setHasMoved(false), 100);
  };

  const handleClick = () => {
    if (!hasMoved) {
      onOpenAdd?.();
      onClick?.();
    }
  };

  if (!onOpenAdd) return null;

  return (
    <div
      ref={buttonRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 999,
        transition: isDragging ? "none" : "left 0.3s ease-out",
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Button
        onClick={handleClick}
        type="primary"
        shape="circle"
        size="large"
        className="
          !flex !items-center !justify-center
          !bg-primary hover:!bg-primary/95 
          shadow-lg shadow-primary/40
          transition-transform duration-200 
          active:scale-95
        "
        style={{
          width: 40,
          height: 40,
          pointerEvents: isDragging ? "none" : "auto",
        }}
      >
        <PlusIcon className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default MobileAddButton;
