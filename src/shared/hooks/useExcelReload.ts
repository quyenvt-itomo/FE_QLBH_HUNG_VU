import { useEffect } from "react";

/** Compatibility hook retained for excluded legacy screens. */
export function useExcelReload(_entityType: string, _onReload: () => void) {
  useEffect(() => undefined, []);
}
