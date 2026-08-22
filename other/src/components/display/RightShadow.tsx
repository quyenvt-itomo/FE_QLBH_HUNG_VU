import { RefObject, useEffect, useState } from "react";

interface RightShadowProps {
  containerRef: RefObject<HTMLDivElement>;
}

const RightShadow: React.FC<RightShadowProps> = ({ containerRef }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;

        // Show shadow if not scrolled to the end
        setShow(scrollLeft < scrollWidth - clientWidth - 12);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Check initial state
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [containerRef]);

  if (!show) return null;

  return (
    <div
      className="sticky right-0 z-10 min-w-3 w-3
          bg-gradient-to-r from-[#F0F0F00A] to-[#F0F0F0]"
    ></div>
  );
};

export default RightShadow;
