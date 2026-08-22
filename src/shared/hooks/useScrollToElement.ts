import { useRef } from "react";

const useScrollToElement = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToElement = (id: string, offset: number = 50) => {
    const element = document.getElementById(id);
    if (element && scrollContainerRef.current) {
      const top = element.offsetTop;
      scrollContainerRef.current.scrollTo({
        top: top - offset, // Cuộn lên một chút để tránh bị che khuất
        behavior: "smooth", // Cuộn mượt
      });
    }
  };

  return { scrollContainerRef, scrollToElement };
};

export default useScrollToElement;
