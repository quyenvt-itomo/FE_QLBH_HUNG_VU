import { useCallback, useEffect, useRef, useState } from "react";

/** Keeps the print target mounted until react-to-print has captured it. */
export const usePrintHtml = <T,>() => {
  const [printData, setPrintData] = useState<T | null>(null);
  const [shouldPrint, setShouldPrint] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!shouldPrint || printData === null || !contentRef.current) return;

    const timer = window.setTimeout(() => {
      const popup = window.open("", "_blank", "width=900,height=700");
      if (!popup) return;
      popup.document.write(`<!doctype html><html><head><title>In hóa đơn</title></head><body>${contentRef.current?.innerHTML || ""}</body></html>`);
      popup.document.close();
      popup.focus();
      popup.print();
      popup.close();
      setShouldPrint(false);
    }, 100);

    return () => window.clearTimeout(timer);
  }, [printData, shouldPrint]);

  const handlePrint = useCallback((data: T) => {
    setPrintData(data);
    setShouldPrint(true);
  }, []);

  return { contentRef, printData, handlePrint } as const;
};
