import React, { useMemo } from "react";
import { Empty } from "antd";
import { EmptyCell } from "./TableCell";
import { useScrollShadow } from "@/shared/hooks/useScrollShadow";
import { isSummaryConfig, SummaryConfig } from "./DataTable.util";

// ──── Types ────

/** Alignment */
export type ColumnAlign = "left" | "center" | "right";

const ALIGN_CLASS: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ──── Deep Path Types ────

type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date;
type Prev = [never, 0, 1, 2, 3, 4, 5];

/** Deep path: cho phép đi sâu vào object với auto-complete */
export type DeepPath<T, Depth extends number = 4> = [Depth] extends [never]
  ? never
  : T extends Primitive
    ? never
    : {
        [K in keyof T & string]:
          | [K]
          | (DeepPath<NonNullable<T[K]>, Prev[Depth]> extends infer P
              ? P extends readonly PropertyKey[]
                ? [K, ...P]
                : never
              : never);
      }[keyof T & string];

/** Resolve value type at path */
type PathValue<T, P> = P extends readonly [infer K, ...infer Rest]
  ? K extends keyof T
    ? Rest extends readonly string[]
      ? Rest extends []
        ? T[K]
        : PathValue<NonNullable<T[K]>, Rest>
      : T[K]
    : never
  : T;

/** Context object truyền vào render */
export interface CellContext<T = any> {
  value: any;
  record: T;
  index: number;
}

/** Cột có dataIndex: render nhận ({ value, record, index }) */
export interface DataColumn<T = any> {
  title: React.ReactNode;
  key?: string;
  /** dataIndex: keyof T (string) hoặc DeepPath<T> (mảng) — có auto-complete */
  dataIndex?: keyof T | DeepPath<T>;
  width?: number;
  align?: ColumnAlign;
  className?: string;
  style?: React.CSSProperties;
  fixed?: "left" | "right";
  /** Cột con — hỗ trợ group header như FormListTable */
  children?: DataColumn<T>[];
  /** Render cell: ({ value, record, index }) => ReactNode */
  render?: (ctx: CellContext<T>) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  /** Định nghĩa các cột */
  columns: DataColumn<T>[];
  /** Dữ liệu */
  dataSource: T[];
  /** Key duy nhất cho mỗi row (field name hoặc function) */
  rowKey?: string | ((record: T, index: number) => string);
  /**
   * Summary row ở cuối bảng.
   * - ReactNode: hiển thị trực tiếp (cần tự viết <td>)
   * - SummaryConfig: tự động map values vào cột theo key
   * - true / không truyền: không hiển thị
   */
  summary?: React.ReactNode | SummaryConfig;
  /** Text khi không có dữ liệu */
  emptyText?: string;
  /** Class cho wrapper */
  className?: string;
  /** Class cho table */
  tableClassName?: string;
  /** Bật scroll shadow indicators */
  scrollShadow?: boolean;
  /** Style cho container */
  style?: React.CSSProperties;
  /** Có border ngoài không */
  bordered?: boolean;
  /** Kích thước: "small" | "middle" */
  size?: "small" | "middle";
  /** Callback khi click row */
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  /** CSS sticky cho header */
  stickyHeader?: boolean;
}

// ──── Helpers ────

/** Lấy giá trị từ object theo path (vd: ["a", "b"] => obj.a.b) */
function getValue(obj: any, path: string | string[]): any {
  const keys = Array.isArray(path) ? path : [path];
  let val = obj;
  for (const k of keys) {
    if (val == null) return undefined;
    val = val[k];
  }
  return val;
}

function getRowKey<T>(
  record: T,
  index: number,
  rowKey?: string | ((r: T, i: number) => string),
): string {
  if (!rowKey) return String(index);
  if (typeof rowKey === "function") return rowKey(record, index);
  return getValue(record, rowKey) ?? String(index);
}

/** Check if summary is config object */
// ──── Column tree helpers ────

/** Flatten column tree → leaf columns */
function flattenColumns<T>(cols: DataColumn<T>[]): DataColumn<T>[] {
  const result: DataColumn<T>[] = [];
  for (const col of cols) {
    if ((col as any).children?.length) {
      result.push(...flattenColumns((col as any).children));
    } else {
      result.push(col);
    }
  }
  return result;
}

/** Get max depth of column tree */
function getMaxDepth<T>(cols: DataColumn<T>[]): number {
  let max = 1;
  for (const col of cols) {
    if ((col as any).children?.length) {
      max = Math.max(max, 1 + getMaxDepth((col as any).children));
    }
  }
  return max;
}

/** Header cell descriptor */
interface HeaderCell {
  col: DataColumn<any>;
  colSpan: number;
  rowSpan: number;
  isGroup: boolean;
  /** Leaf index của cột đầu tiên thuộc cell này (dùng xác định first/last column) */
  firstLeafIdx: number;
  /** Leaf index của cột cuối cùng thuộc cell này */
  lastLeafIdx: number;
}

/**
 * Build header grid: mảng 2 chiều [level][colIndex] → HeaderCell.
 * Mỗi level chỉ chứa các cột xuất hiện ở level đó — giống FormListTable.
 */
function buildHeaderGrid<T>(
  cols: DataColumn<T>[],
  maxDepth: number,
  currentDepth: number,
  grid: HeaderCell[][],
  leafIdx: { current: number },
): void {
  if (!grid[currentDepth]) grid[currentDepth] = [];

  for (const col of cols) {
    const children = (col as any).children as DataColumn<T>[] | undefined;
    if (children?.length) {
      const childLeafCount = flattenColumns(children).length;
      const firstLeaf = leafIdx.current;
      // Group column: xuất hiện ở currentDepth, colspan = tổng leaf của children
      grid[currentDepth].push({
        col,
        colSpan: childLeafCount,
        rowSpan: 1,
        isGroup: true,
        firstLeafIdx: firstLeaf,
        lastLeafIdx: firstLeaf + childLeafCount - 1,
      });
      // Đệ quy children ở level tiếp theo
      buildHeaderGrid(children, maxDepth, currentDepth + 1, grid, leafIdx);
    } else {
      // Leaf column: xuất hiện ở currentDepth, rowspan = số level còn lại
      const idx = leafIdx.current++;
      grid[currentDepth].push({
        col,
        colSpan: 1,
        rowSpan: maxDepth - currentDepth,
        isGroup: false,
        firstLeafIdx: idx,
        lastLeafIdx: idx,
      });
    }
  }
}

/** Render toàn bộ header từ grid */
function renderHeaderGrid(
  grid: HeaderCell[][],
  resolvedColumns: DataColumn<any>[],
  stickyOffsets: { left: Record<string, number>; right: Record<string, number> },
  paddingY: string,
  leftBoundaryKey?: string,
  rightBoundaryKey?: string,
): React.ReactNode[] {
  const totalLeaves = resolvedColumns.length;

  return grid.map((row, level) => (
    <tr
      key={`header-level-${level}`}
      className="sticky"
      style={{
        top: 0 + level * 24.4, // 24.4px = height of header row
        zIndex: 30 - level * 10,
        boxShadow: "0 1px 0 0 var(--border-color, #e5e7eb)", // border-b không bị che bởi td
      }}
    >
      {row.map((cell) => {
        const isFirstCol = cell.firstLeafIdx === 0;
        const isLastCol = cell.lastLeafIdx === totalLeaves - 1;
        const borderClass = [isFirstCol ? "border-l-0" : "border-l", isLastCol ? "border-r-0" : ""]
          .filter(Boolean)
          .join(" ");

        if (cell.isGroup) {
          return (
            <th
              key={`group-${level}-${cell.col.key || String(cell.col.title)}`}
              colSpan={cell.colSpan}
              rowSpan={cell.rowSpan}
              className={`px-1 ${paddingY} bg-slate-100 dark:bg-slate-800 font-semibold text-center text-slate-600 dark:text-slate-300 ${borderClass}`}
            >
              {cell.col.title}
            </th>
          );
        }
        // Leaf column: lấy key & offset từ resolvedColumns
        const resolved = resolvedColumns[cell.firstLeafIdx];
        const key = resolved?.key || String(cell.firstLeafIdx);
        const offset =
          cell.col.fixed === "left"
            ? stickyOffsets.left[key]
            : cell.col.fixed === "right"
              ? stickyOffsets.right[key]
              : undefined;
        return (
          <th
            key={key}
            colSpan={cell.colSpan}
            rowSpan={cell.rowSpan}
            className={`px-2 ${paddingY} bg-slate-100 dark:bg-slate-800 font-semibold truncate text-center text-slate-600 dark:text-slate-300 ${borderClass} ${cell.col.className || ""} ${cell.col.fixed === "left" ? "sticky-left" : cell.col.fixed === "right" ? "sticky-right" : ""} ${cell.col.fixed === "left" && key === leftBoundaryKey ? "boundary-left" : ""} ${cell.col.fixed === "right" && key === rightBoundaryKey ? "boundary-right" : ""}`}
            style={{ ...(cell.col.style as any), ...(offset != null ? { left: offset } : {}) }}
          >
            {cell.col.title}
          </th>
        );
      })}
    </tr>
  ));
}

// ──── Component ────

export const DataTable = <T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey,
  summary,
  emptyText = "Không có dữ liệu",
  className,
  tableClassName,
  scrollShadow = true,
  style,
  bordered = true,
  size = "small",
  onRow,
  stickyHeader = true,
}: DataTableProps<T>) => {
  const { scrollContainerRef, scrolledRight, scrolledLeft } = useScrollShadow();

  const paddingY = size === "small" ? "py-1" : "py-2";
  const borderClass = bordered ? "border rounded-lg" : "";

  // Flatten column tree → leaf columns for data rendering
  const leafColumns = useMemo(() => flattenColumns(columns), [columns]);
  const maxDepth = useMemo(() => getMaxDepth(columns), [columns]);
  const hasGroupedColumns = maxDepth > 1;

  // Build header grid cho multi-level header (giống FormListTable)
  const headerGrid = useMemo(() => {
    const grid: HeaderCell[][] = [];
    buildHeaderGrid(columns, maxDepth, 0, grid, { current: 0 });
    return grid;
  }, [columns, maxDepth]);

  const resolvedColumns = useMemo(
    () =>
      leafColumns.map((col, idx) => ({
        ...col,
        key: String(
          col.key ??
            (Array.isArray(col.dataIndex)
              ? (col.dataIndex as string[]).join(".")
              : col.dataIndex) ??
            idx,
        ),
      })),
    [leafColumns],
  );

  // Compute cumulative sticky offsets so multiple sticky columns stack without overlapping
  const stickyOffsets = useMemo(() => {
    const left: Record<string, number> = {};
    const right: Record<string, number> = {};
    let leftAcc = 0;
    let rightAcc = 0;
    const leftSticky = resolvedColumns.filter((c) => c.fixed === "left");
    const rightSticky = resolvedColumns.filter((c) => c.fixed === "right").reverse();
    for (const col of leftSticky) {
      left[String(col.key)] = leftAcc;
      leftAcc += col.width ?? 100;
    }
    for (const col of rightSticky) {
      right[String(col.key)] = rightAcc;
      rightAcc += col.width ?? 100;
    }
    return { left, right };
  }, [resolvedColumns]);

  // Boundary (cạnh giáp vùng cuộn): chỉ cột này mới hiển thị shadow.
  // - left: cột fixed-left ngoài cùng bên phải của nhóm
  // - right: cột fixed-right ngoài cùng bên trái của nhóm
  const leftBoundaryKey = useMemo(() => {
    const l = resolvedColumns.filter((c) => c.fixed === "left");
    return l.length ? String(l[l.length - 1].key) : undefined;
  }, [resolvedColumns]);
  const rightBoundaryKey = useMemo(() => {
    const r = resolvedColumns.filter((c) => c.fixed === "right");
    return r.length ? String(r[0].key) : undefined;
  }, [resolvedColumns]);

  return (
    <div
      ref={scrollContainerRef}
      data-scrolled-left={scrollShadow && scrolledLeft ? "true" : "false"}
      data-scrolled-right={scrollShadow && scrolledRight ? "true" : "false"}
      className={`flex flex-col w-full overflow-auto ${borderClass} ${className || ""}`}
      style={style}
    >
      <table className={`min-w-full w-fit table-fixed ${tableClassName || ""}`}>
        {/* Colgroup */}
        <colgroup>
          {resolvedColumns.map((col) => (
            <col key={String(col.key)} style={{ width: col.width }} />
          ))}
        </colgroup>

        {/* Header */}
        <thead>
          {hasGroupedColumns ? (
            renderHeaderGrid(
              headerGrid,
              resolvedColumns,
              stickyOffsets,
              paddingY,
              leftBoundaryKey,
              rightBoundaryKey,
            )
          ) : (
            <tr className={`border-b ${stickyHeader ? "sticky top-0 z-10" : ""}`}>
              {resolvedColumns.map((col, idx) => {
                const isFirstCol = idx === 0;
                const isLastCol = idx === resolvedColumns.length - 1;
                return (
                  <th
                    key={String(col.key)}
                    className={`px-1 ${paddingY} bg-slate-100 dark:bg-slate-800 font-semibold truncate text-center text-slate-600 dark:text-slate-300 ${isFirstCol ? "border-l-0" : "border-l"} ${isLastCol ? "border-r-0" : ""} ${col.className || ""} ${col.fixed === "left" ? "sticky-left" : col.fixed === "right" ? "sticky-right" : ""} ${col.fixed === "left" && String(col.key) === leftBoundaryKey ? "boundary-left" : ""} ${col.fixed === "right" && String(col.key) === rightBoundaryKey ? "boundary-right" : ""}`}
                    style={{
                      ...col.style,
                      ...(col.fixed === "left"
                        ? { left: stickyOffsets.left[String(col.key)] }
                        : undefined),
                      ...(col.fixed === "right"
                        ? { right: stickyOffsets.right[String(col.key)] }
                        : undefined),
                    }}
                    title={
                      typeof col.title === "string" || typeof col.title === "number"
                        ? String(col.title)
                        : undefined
                    }
                  >
                    {col.title}
                  </th>
                );
              })}
            </tr>
          )}
        </thead>

        {/* Body */}
        <tbody>
          {dataSource.length === 0 ? (
            <tr>
              <td colSpan={resolvedColumns.length}>
                <div className="h-32 flex items-center justify-center">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
                </div>
              </td>
            </tr>
          ) : (
            dataSource.map((record, rowIdx) => {
              const rowKeyValue = getRowKey(record, rowIdx, rowKey);
              const rowProps = onRow?.(record, rowIdx) || {};

              return (
                <tr key={rowKeyValue} className={`border-t first:border-t-0 group`} {...rowProps}>
                  {resolvedColumns.map((col, idx) => {
                    const isFirstCol = idx === 0;
                    const isLastCol = idx === resolvedColumns.length - 1;
                    const value = col.dataIndex
                      ? getValue(record, String(col.dataIndex))
                      : undefined;
                    const content = col.render
                      ? (col as DataColumn<T>).render!({ value, record, index: rowIdx })
                      : (value ?? <EmptyCell />);

                    return (
                      <td
                        key={String(col.key)}
                        className={`
                          px-3 ${paddingY}
                          bg-panel group-hover:bg-[var(--bg-panel-hover)] transition-colors ease-in-out
                          ${isFirstCol ? "border-l-0" : "border-l"} truncate
                          ${ALIGN_CLASS[col.align || "left"]}
                          ${col.className || ""}
                          ${col.fixed === "left" ? "sticky-left" : col.fixed === "right" ? "sticky-right" : ""}
                          ${col.fixed === "left" && String(col.key) === leftBoundaryKey ? "boundary-left" : ""}
                          ${col.fixed === "right" && String(col.key) === rightBoundaryKey ? "boundary-right" : ""}
                        `}
                        style={{
                          ...col.style,
                          ...(col.fixed === "left"
                            ? { left: stickyOffsets.left[String(col.key)] }
                            : undefined),
                          ...(col.fixed === "right"
                            ? { right: stickyOffsets.right[String(col.key)] }
                            : undefined),
                        }}
                        title={
                          typeof content === "string" || typeof content === "number"
                            ? String(content)
                            : undefined
                        }
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>

        {/* Summary */}
        {summary && (
          <tfoot>
            <tr
              className="font-semibold sticky -bottom-px z-10"
              style={{
                boxShadow: "0 -1px 0 0 var(--border-color, #e5e7eb)",
              }}
            >
              {isSummaryConfig(summary)
                ? resolvedColumns.map((col, idx) => {
                    // Resolve value by key/dataIndex trước, title sau (tránh trùng title)
                    const colKey = col.key
                      ? String(col.key)
                      : typeof col.dataIndex === "string"
                        ? String(col.dataIndex)
                        : typeof col.title === "string"
                          ? String(col.title)
                          : String(idx);
                    const dataKey = Array.isArray(col.dataIndex)
                      ? col.dataIndex.join(".")
                      : col.dataIndex;

                    const isSummaryColKey = colKey === summary.summaryColKey;

                    const align = isSummaryColKey ? "center" : col.align || "left";

                    const val = isSummaryColKey
                      ? "Tổng"
                      : (summary[colKey] ??
                        (dataKey ? summary[dataKey] : undefined) ??
                        summary[idx]);

                    return (
                      <td
                        key={colKey}
                        className={`
                          ${paddingY} px-3 bg-slate-50 dark:bg-slate-950 
                          ${idx === 0 ? "border-l-0" : "border-l"} border-b-0
                          ${ALIGN_CLASS[col.align || "left"]} ${col.className || ""}
                          ${col.fixed === "left" ? "sticky-left" : col.fixed === "right" ? "sticky-right" : ""}
                        `}
                        style={{
                          ...(col.fixed === "left"
                            ? { left: stickyOffsets.left[String(col.key)] }
                            : undefined),
                          ...(col.fixed === "right"
                            ? { right: stickyOffsets.right[String(col.key)] }
                            : undefined),
                        }}
                      >
                        {val}
                      </td>
                    );
                  })
                : summary}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

