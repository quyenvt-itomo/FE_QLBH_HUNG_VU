import { RefObject, useEffect, useState } from "react";

interface LeftShadowProps {
  containerRef: RefObject<HTMLDivElement>;
}

const LeftShadow: React.FC<LeftShadowProps> = ({ containerRef }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollLeft = containerRef.current.scrollLeft;
        setShow(scrollLeft > 12);
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
      className="sticky left-0 z-10 min-w-3 w-3
          bg-gradient-to-l from-[#F0F0F00A] to-[#F0F0F0]"
    ></div>
  );
};

export default LeftShadow;
