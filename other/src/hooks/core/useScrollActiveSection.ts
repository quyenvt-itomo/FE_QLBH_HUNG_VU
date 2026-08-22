import { useEffect } from "react";
import debounce from "lodash/debounce";

interface Props {
  containerRef: React.RefObject<HTMLElement>;
  sectionRefs: Record<string, React.RefObject<HTMLElement>>;
  onSectionInView: (key: string) => void;
}

export function useScrollActiveSection({
  containerRef,
  sectionRefs,
  onSectionInView,
}: Props) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastActiveKey: string | null = null;

    const handleScroll = debounce(() => {
      const containerTop = container.getBoundingClientRect().top;

      let closestKey: string | null = null;
      let closestOffset = Infinity;

      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (!ref.current) return;

        const sectionTop = ref.current.getBoundingClientRect().top;
        const offset = sectionTop - containerTop;

        if (offset >= -10 && offset < closestOffset) {
          closestOffset = offset;
          closestKey = key;
        }
      });

      if (closestKey && closestKey !== lastActiveKey) {
        lastActiveKey = closestKey;
        onSectionInView(closestKey);
      }
    }, 50);

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // chạy lần đầu

    return () => {
      container.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [containerRef, sectionRefs, onSectionInView]);
}
