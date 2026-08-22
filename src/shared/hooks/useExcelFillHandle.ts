import { useState, useCallback, useRef } from "react";
import type { FormInstance } from "antd";

// ──── Types ────

export interface UseExcelFillHandleOptions {
  /** Ant Design Form instance */
  form: FormInstance<any>;
  /** Form.List field name, e.g. "inputs" or "outputs" */
  fieldName: string;
  /** Columns cho phép kéo fill */
  fillableColumns: string[];
  /** Tổng số dòng hiện tại */
  totalRows: number;
  /**
   * Mapping cột chính → cột phụ cần copy cùng.
   * Ví dụ: { warehouseId: "warehouse" } — khi fill warehouseId thì copy luôn object warehouse.
   */
  extraFields?: Record<string, string>;
}

export interface CellCoord {
  row: number;
  column: string;
}

// ──── Hook ────

export function useExcelFillHandle({
  form,
  fieldName,
  fillableColumns,
  totalRows,
  extraFields = {},
}: UseExcelFillHandleOptions) {
  /** Cell đang được hover (hiện handle xanh) */
  const [hoveredCell, setHoveredCell] = useState<CellCoord | null>(null);
  /** Cell đã được chọn làm nguồn fill (khi click vào handle) */
  const [selectedCell, setSelectedCell] = useState<CellCoord | null>(null);
  const [fillRange, setFillRange] = useState<{
    startRow: number;
    endRow: number;
    column: string;
  } | null>(null);

  // Refs để tránh stale closure trong mouse event handlers
  const isDragging = useRef(false);
  const dragStartRow = useRef(0);
  const dragColumn = useRef("");
  const dragEndRow = useRef(0);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement | null>(null);

  // ──── Cell value helpers ────

  const getValue = useCallback(
    (row: number, column: string) => form.getFieldValue([fieldName, row, column]),
    [form, fieldName],
  );

  // ──── Hover (hiện handle) ────

  const onCellMouseEnter = useCallback(
    (row: number, column: string) => {
      if (!fillableColumns.includes(column)) return;
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      // Nếu đang drag thì không thay đổi hover
      if (isDragging.current) return;
      setHoveredCell({ row, column });
    },
    [fillableColumns],
  );

  const onCellMouseLeave = useCallback(() => {
    // Delay nhỏ để chuột kịp vào handle
    hoverTimeout.current = setTimeout(() => {
      if (!isDragging.current) {
        setHoveredCell(null);
      }
    }, 100);
  }, []);

  // ──── Drag handle ────

  const onHandleMouseDown = useCallback(
    (e: React.MouseEvent, row: number, column: string) => {
      e.preventDefault();
      e.stopPropagation();

      // Chọn cell này làm nguồn fill
      setSelectedCell({ row, column });
      setHoveredCell(null);

      isDragging.current = true;
      dragStartRow.current = row;
      dragColumn.current = column;
      dragEndRow.current = row;

      setFillRange({ startRow: row, endRow: row, column });

      const onMouseMove = (ev: MouseEvent) => {
        if (!tableBodyRef.current) return;

        // Tính row đích dựa trên vị trí chuột so với tbody
        const tableRect = tableBodyRef.current.getBoundingClientRect();
        const rows = tableBodyRef.current.querySelectorAll("tr[data-fill-row]");
        if (rows.length === 0) return;

        // Tìm row dựa trên vị trí Y
        let targetRow = row;
        for (let i = 0; i < rows.length; i++) {
          const rowRect = rows[i].getBoundingClientRect();
          if (ev.clientY >= rowRect.top && ev.clientY <= rowRect.bottom) {
            targetRow = i;
            break;
          }
          // Nếu chuột ở dưới row cuối cùng
          if (i === rows.length - 1 && ev.clientY > rowRect.bottom) {
            targetRow = rows.length - 1;
          }
          // Nếu chuột ở trên row đầu tiên
          if (i === 0 && ev.clientY < rowRect.top) {
            targetRow = 0;
          }
        }

        const startRow = dragStartRow.current;
        if (targetRow === startRow) {
          setFillRange({ startRow, endRow: startRow, column });
          return;
        }

        // Cho phép kéo lên hoặc xuống
        const endRow = Math.max(0, Math.min(totalRows - 1, targetRow));
        dragEndRow.current = endRow;

        setFillRange({
          startRow: Math.min(startRow, endRow),
          endRow: Math.max(startRow, endRow),
          column,
        });
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        isDragging.current = false;

        const col = dragColumn.current;
        const startRow = dragStartRow.current;
        const endRow = dragEndRow.current;

        // Không fill nếu vẫn ở nguyên cell gốc
        if (endRow === startRow) {
          setFillRange(null);
          setSelectedCell(null);
          return;
        }

        // Lấy giá trị từ cell gốc
        const value = getValue(startRow, col);

        // Fill cả lên và xuống
        const from = Math.min(startRow, endRow);
        const to = Math.max(startRow, endRow);
        for (let i = from; i <= to; i++) {
          if (i === startRow) continue; // bỏ qua cell gốc
          form.setFieldValue([fieldName, i, col], value);

          // Copy extra fields nếu có
          const extraField = extraFields[col];
          if (extraField) {
            const extraValue = form.getFieldValue([fieldName, startRow, extraField]);
            form.setFieldValue([fieldName, i, extraField], extraValue);
          }
        }

        setFillRange(null);
        setSelectedCell(null);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [totalRows, getValue, form, fieldName, extraFields],
  );

  // ──── Hard click (Ctrl+Shift+Click): fill toàn bộ cột ────

  const onHandleHardClick = useCallback(
    (e: React.MouseEvent, row: number, column: string) => {
      e.preventDefault();
      e.stopPropagation();

      const value = getValue(row, column);
      const extraField = extraFields[column];
      const extraValue = extraField ? form.getFieldValue([fieldName, row, extraField]) : undefined;

      // Fill toàn bộ cột (tất cả các dòng), bỏ qua dòng gốc
      for (let i = 0; i < totalRows; i++) {
        if (i === row) continue;
        form.setFieldValue([fieldName, i, column], value);
        if (extraField && extraValue !== undefined) {
          form.setFieldValue([fieldName, i, extraField], extraValue);
        }
      }

      setSelectedCell(null);
      setHoveredCell(null);
    },
    [totalRows, getValue, form, fieldName, extraFields],
  );

  // ──── Check helpers ────

  const isInFillRange = useCallback(
    (row: number, column: string) => {
      if (!fillRange) return false;
      return column === fillRange.column && row >= fillRange.startRow && row <= fillRange.endRow;
    },
    [fillRange],
  );

  const showHandle = useCallback(
    (row: number, column: string) => {
      if (!fillableColumns.includes(column)) return false;
      return (
        (hoveredCell?.row === row && hoveredCell?.column === column) ||
        (selectedCell?.row === row && selectedCell?.column === column)
      );
    },
    [hoveredCell, selectedCell, fillableColumns],
  );

  /** Handle đã được "chọn" (đã click vào, sẵn sàng fill) */
  const isCellSelected = useCallback(
    (row: number, column: string) => {
      return selectedCell?.row === row && selectedCell?.column === column;
    },
    [selectedCell],
  );

  return {
    onCellMouseEnter,
    onCellMouseLeave,
    onHandleMouseDown,
    onHandleHardClick,
    isInFillRange,
    showHandle,
    isCellSelected,
    tableBodyRef,
    fillRange,
  } as const;
}
