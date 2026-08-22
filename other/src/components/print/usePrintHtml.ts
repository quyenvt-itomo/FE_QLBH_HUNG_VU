import { useRef, useState, useCallback, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

/**
 * Reusable hook for printing React components via react-to-print.
 *
 * Usage:
 * 1. Call usePrintHtml<T>() in your component
 * 2. Render a hidden <div ref={contentRef}> with your print component
 * 3. Pass handlePrint to your print button/action
 */
export function usePrintHtml<T>() {
  const [printData, setPrintData] = useState<T | null>(null);
  const [shouldPrint, setShouldPrint] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // When data is set and we should print, trigger it after DOM update
  useEffect(() => {
    if (shouldPrint && printData !== null && contentRef.current) {
      // Small delay to ensure React has rendered the new data
      const timer = setTimeout(() => {
        reactToPrintFn();
        setShouldPrint(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [shouldPrint, printData, reactToPrintFn]);

  const handlePrint = useCallback((data: T) => {
    setPrintData(data);
    setShouldPrint(true);
  }, []);

  return { contentRef, printData, handlePrint } as const;
}
