import { ColumnsConfigType } from "./handleColumnSelector";

interface SavedColumnConfig {
  key: string;
  hidden: boolean;
  fixed?: "left" | "right";
  width?: number;
}

const MIN_COLUMN_WIDTH = 40;
const MAX_COLUMN_WIDTH = 600;

const getSavedColumnWidth = (width: unknown, fallback?: number) => {
  const value = typeof width === "number" ? width : Number(width);
  const defaultValue = typeof fallback === "number" ? fallback : 120;
  const safeValue = Number.isFinite(value) ? value : defaultValue;

  return Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, safeValue));
};

export const getInitialConfigColumns = (
  columns: ColumnsConfigType,
  tableKey: string,
): ColumnsConfigType => {
  const savedConfig = localStorage.getItem(tableKey);
  if (!savedConfig) return columns;

  let savedColumns: SavedColumnConfig[];
  try {
    const parsedConfig: unknown = JSON.parse(savedConfig);
    savedColumns = Array.isArray(parsedConfig) ? (parsedConfig as SavedColumnConfig[]) : [];
  } catch {
    // Ignore a corrupted/old localStorage value and use the current defaults.
    return columns;
  }

  const savedMap = new Map(
    savedColumns.map((col) => [
      col.key,
      { hidden: col.hidden, fixed: col.fixed, width: col.width },
    ]),
  );

  const sortedColumns = savedColumns
    .map((savedCol) => {
      const originalCol = columns.find((col) => col.key === savedCol.key);
      if (!originalCol) return null;
      return {
        ...originalCol,
        hidden: savedCol.hidden ?? false,
        fixed: savedCol.fixed ?? originalCol.fixed,
        width: getSavedColumnWidth(savedCol.width, Number(originalCol.width)),
      };
    })
    .filter(Boolean) as ColumnsConfigType;

  const newColumns = columns.filter((col) => !savedMap.has(col.key));

  return [...sortedColumns, ...newColumns.map((col) => ({ ...col, hidden: false }))];
};
