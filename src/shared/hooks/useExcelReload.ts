import { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/shared/stores";
import { ExcelEntityType } from "@/modules/excel/excel.enum";

/**
 * Hook dùng trong các page để tự động reload khi import Excel hoàn tất.
 *
 * Usage:
 *   const { pageAction } = usePageState();
 *   useExcelReload(ExcelEntityType.PRODUCT, pageAction.handleReload);
 */
export function useExcelReload(entityType: ExcelEntityType, onReload: () => void) {
  const importCompleted = useSelector(
    (state: RootState) => state.Excel.importCompleted?.[entityType as string],
    shallowEqual,
  );
  const prevRef = useRef(importCompleted);

  useEffect(() => {
    if (importCompleted !== undefined && importCompleted !== prevRef.current) {
      prevRef.current = importCompleted;
      onReload();
    }
  }, [importCompleted, onReload]);
}
