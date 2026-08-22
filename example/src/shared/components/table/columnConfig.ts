import { ColumnsConfigType } from "./handleColumnSelector";

interface SavedColumnConfig {
  key: string;
  is_hide: boolean;
  fixed?: "left" | "right";
  width?: number;
}

export const getInitialConfigColumns = (
  columns: ColumnsConfigType,
  tableKey: string,
): ColumnsConfigType => {
  const savedConfig = localStorage.getItem(tableKey);
  if (!savedConfig) return columns;

  const savedColumns = JSON.parse(savedConfig) as SavedColumnConfig[];

  const savedMap = new Map(
    savedColumns.map((col) => [
      col.key,
      { is_hide: col.is_hide, fixed: col.fixed, width: col.width },
    ]),
  );

  const sortedColumns = savedColumns
    .map((savedCol) => {
      const originalCol = columns.find((col) => col.key === savedCol.key);
      if (!originalCol) return null;
      return {
        ...originalCol,
        is_hide: savedCol.is_hide ?? false,
        fixed: savedCol.fixed ?? originalCol.fixed,
        width: savedCol.width ?? originalCol.width,
      };
    })
    .filter(Boolean) as ColumnsConfigType;

  const newColumns = columns.filter((col) => !savedMap.has(col.key));

  return [...sortedColumns, ...newColumns.map((col) => ({ ...col, is_hide: false }))];
};
