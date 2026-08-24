import React, { useMemo, useRef } from "react";
import { Button, Empty, Form, FormInstance } from "antd";
import type { Rule, FormListFieldData } from "antd/es/form";
import { TrashIcon, GripVerticalIcon } from "lucide-react";
import { useScrollShadow } from "@/shared/hooks/useScrollShadow";
import { useExcelFillHandle } from "@/shared/hooks/useExcelFillHandle";
import { ExcelFillHandle } from "@/shared";
import { CLASSNAME } from "@/shared/constants/ui";
import { SummaryConfig, isSummaryConfig } from "../display/DataTable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ──── Types ────

type ColumnAlign = "left" | "center" | "right";

const ALIGN_CLASS: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/** Context truyền vào render cell */
export interface FormCellContext<T = any> {
  /** Index của dòng trong Form.List */
  name: number;
  /** restField từ Form.List (key & name đã bị destructure) */
  restField: Pick<FormListFieldData, "fieldKey">;
  /** Record hiện tại (dữ liệu đã watch) */
  record: T;
  /** Index của dòng (giống name) */
  index: number;
  /** Form instance */
  form: FormInstance;
}

/** Định nghĩa một cột trong FormListTable */
export interface FormColumn<T = any> {
  /** Tiêu đề cột */
  title: React.ReactNode;
  /** Tên field trong form (dùng làm name={[name, dataIndex]}) */
  dataIndex: string;
  /** Độ rộng cột (px) */
  width?: number;
  /** Căn chỉnh */
  align?: ColumnAlign;
  /** Class cho td */
  className?: string;
  /** Sticky column */
  fixed?: "left" | "right";

  // ── Edit mode ──
  /** Nếu true: cell được wrap trong Form.Item + rules. Nếu false: display-only */
  editable?: boolean;
  /** Cho phép Excel fill handle (chỉ khi editable=true) */
  fillable?: boolean;
  /** Validation rules (chỉ khi editable=true) */
  rules?: Rule[];

  // ── Render ──
  /**
   * Render nội dung cell.
   * - editable=false: ctx chứa record, index, form
   * - editable=true: form item đã được wrap, chỉ cần return input component
   * Bắt buộc với leaf column, bỏ qua với group column (có children).
   */
  render?: (ctx: FormCellContext<T>) => React.ReactNode;

  // ── Visibility ──
  /** Ẩn/hiện cột theo record */
  visible?: (ctx: { record: T; index: number }) => boolean;

  // ── Grouping ──
  /** Cột con — hỗ trợ group header nhiều cấp như Ant Design.
   *  Khi có children, dataIndex/render của cột cha bị bỏ qua. */
  children?: FormColumn<T>[];
}

export interface FormListTableProps<T = any> {
  /** Form instance */
  form: FormInstance;
  /** Tên field của Form.List */
  fieldName: string;
  /** Định nghĩa cột */
  columns: FormColumn<T>[];
  /** Dữ liệu đã watch (để tính toán summary, fill handle, ...) */
  records: T[];

  // ── Header ──
  /** Tiêu đề bảng */
  title?: React.ReactNode;
  /** Render phần tìm kiếm/thêm mới phía trên bảng */
  addWidth?: string | number;
  renderAdd?: (addFn: (data: any, insertIndex?: number) => void) => React.ReactNode;

  // ── Row ──
  /** Custom class cho mỗi row */
  rowClassName?: (record: T, index: number) => string;
  /** Map<rowIndex, Set<fieldName>> — các cell bị lỗi cần highlight đỏ */
  errorCells?: Map<number, Set<string>>;
  /** Cho phép xóa dòng */
  showDelete?: boolean;

  // ── Summary ──
  /** Render summary row. Có thể là ReactNode (tự viết td) hoặc SummaryConfig (auto-map) */
  renderSummary?:
    | ((ctx: { records: T[]; addFn: (data: any, insertIndex?: number) => void }) => React.ReactNode)
    | SummaryConfig;

  // ── Empty ──
  /** Text khi không có dữ liệu */
  emptyText?:
    | React.ReactNode
    | ((addFn: (data: any, insertIndex?: number) => void) => React.ReactNode);

  // ── Style ──
  className?: string;
  wrapperClassName?: string;

  // ── Excel Fill Handle ──
  /** Các cột hỗ trợ fill handle (phải khớp với dataIndex của column) */
  fillableColumns?: string[];
  /** Extra fields để fill handle cập nhật kèm (vd: { warehouseId: "warehouse" }) */
  extraFields?: Record<string, string>;

  // ── Keyboard ──
  /** Handler cho keyboard (Enter để thêm) */
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;

  // ── Sortable ──
  /** Bật chế độ kéo thả sắp xếp dòng. Tự động thêm cột drag handle. */
  sortable?: boolean;
  /** Callback khi thứ tự dòng thay đổi */
  onSort?: (records: T[]) => void;
}

// ──── Sortable Row ────

function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  return (
    <tr
      ref={setNodeRef}
      data-fill-row
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : undefined,
        position: "relative",
      }}
      className="border-b"
      {...attributes}
    >
      <td
        className="w-9 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 bg-panel border border-l-0"
        {...listeners}
      >
        <div className="flex items-center justify-center h-full">
          <GripVerticalIcon className="h-4 w-4" />
        </div>
      </td>
      {children}
    </tr>
  );
}

// ──── Helpers ────

/** Flatten column tree → leaf columns (những cột có dataIndex/render) */
function flattenColumns<T>(cols: FormColumn<T>[]): FormColumn<T>[] {
  const result: FormColumn<T>[] = [];
  for (const col of cols) {
    if (col.children && col.children.length > 0) {
      result.push(...flattenColumns(col.children));
    } else {
      result.push(col);
    }
  }
  return result;
}

/** Tính max depth của column tree */
function getMaxDepth<T>(cols: FormColumn<T>[]): number {
  let max = 1;
  for (const col of cols) {
    if (col.children && col.children.length > 0) {
      max = Math.max(max, 1 + getMaxDepth(col.children));
    }
  }
  return max;
}

/** Header cell descriptor */
interface HeaderCell {
  col: FormColumn<any>;
  colSpan: number;
  rowSpan: number;
  isGroup: boolean;
}

/**
 * Build header grid: mảng 2 chiều [level][colIndex] → HeaderCell.
 * Mỗi level chỉ chứa các cột xuất hiện ở level đó.
 */
function buildHeaderGrid<T>(
  cols: FormColumn<T>[],
  maxDepth: number,
  currentDepth: number,
  grid: HeaderCell[][],
): void {
  if (!grid[currentDepth]) grid[currentDepth] = [];

  for (const col of cols) {
    if (col.children && col.children.length > 0) {
      const childDepth = getMaxDepth(col.children);
      // Group column: xuất hiện ở currentDepth, colspan = tổng leaf của children
      grid[currentDepth].push({
        col,
        colSpan: flattenColumns(col.children).length,
        rowSpan: 1,
        isGroup: true,
      });
      // Đệ quy children ở level tiếp theo
      buildHeaderGrid(col.children, maxDepth, currentDepth + 1, grid);
    } else {
      // Leaf column: xuất hiện ở currentDepth, rowspan = số level còn lại
      grid[currentDepth].push({
        col,
        colSpan: 1,
        rowSpan: maxDepth - currentDepth,
        isGroup: false,
      });
    }
  }
}

/** Render toàn bộ header từ grid */
function renderHeaderGrid(
  grid: HeaderCell[][],
  stickyOffsets: { left: Record<string, number>; right: Record<string, number> },
  firstLeafDataIndex: string | undefined,
  lastLeafDataIndex: string | undefined,
  leftBoundaryKey?: string,
  rightBoundaryKey?: string,
): React.ReactNode[] {
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
        const isFirstCol = cell.col.dataIndex === firstLeafDataIndex;
        const isLastCol = cell.col.dataIndex === lastLeafDataIndex;
        const borderClass = [isFirstCol ? "border-l-0" : "border-l", isLastCol ? "border-r-0" : ""]
          .filter(Boolean)
          .join(" ");
        if (cell.isGroup) {
          return (
            <th
              key={`group-${level}-${String(cell.col.title)}`}
              colSpan={cell.colSpan}
              rowSpan={cell.rowSpan}
              className={`!font-medium ${borderClass}  ${cell.col.className || ""} !bg-gray-50 dark:!bg-gray-950 text-center !border-[#D9D9D9]`}
            >
              {cell.col.title}
            </th>
          );
        }
        const offset =
          cell.col.fixed === "left"
            ? stickyOffsets.left[cell.col.dataIndex]
            : cell.col.fixed === "right"
              ? stickyOffsets.right[cell.col.dataIndex]
              : undefined;
        return (
          <th
            key={cell.col.dataIndex}
            colSpan={cell.colSpan}
            rowSpan={cell.rowSpan}
            className={`
              !font-medium ${borderClass} !bg-gray-50 dark:!bg-gray-950 truncate !border-[#D9D9D9]
              ${cell.col.align !== "center" ? "px-1" : ""} ${cell.col.className || ""}
              ${cell.col.fixed === "left" ? "sticky-left" : cell.col.fixed === "right" ? "sticky-right" : ""}
              ${cell.col.fixed === "left" && cell.col.dataIndex === leftBoundaryKey ? "boundary-left" : ""}
              ${cell.col.fixed === "right" && cell.col.dataIndex === rightBoundaryKey ? "boundary-right" : ""}
            `}
            style={{
              ...(cell.col.fixed === "left" ? { left: offset } : undefined),
              ...(cell.col.fixed === "right" ? { right: offset } : undefined),
            }}
            title={typeof cell.col.title === "string" ? cell.col.title : undefined}
          >
            {cell.col.title}
          </th>
        );
      })}
    </tr>
  ));
}

// ──── Component ────

export function FormListTable<T extends Record<string, any>>({
  form,
  fieldName,
  columns,
  records,
  title,
  addWidth,
  renderAdd,
  rowClassName,
  showDelete = true,
  renderSummary,
  emptyText = "Chưa có dữ liệu",
  className,
  wrapperClassName,
  fillableColumns = [],
  extraFields = {},
  onKeyDown,
  errorCells,
  sortable = false,
  onSort,
}: FormListTableProps<T>) {
  const { scrollContainerRef, scrolledRight, scrolledLeft } = useScrollShadow();

  const {
    onCellMouseEnter,
    onCellMouseLeave,
    onHandleMouseDown,
    onHandleHardClick,
    isInFillRange,
    showHandle,
    isCellSelected,
    tableBodyRef,
  } = useExcelFillHandle({
    form,
    fieldName,
    fillableColumns: fillableColumns as string[],
    totalRows: records.length,
    extraFields: extraFields as Record<string, string>,
  });

  // Resolve columns: flatten tree → leaf columns for data rendering
  const leafColumns = useMemo(() => flattenColumns(columns), [columns]);
  const maxDepth = useMemo(() => getMaxDepth(columns), [columns]);
  const hasGroupedColumns = maxDepth > 1;

  // Build header grid cho multi-level header
  const headerGrid = useMemo(() => {
    const grid: HeaderCell[][] = [];
    buildHeaderGrid(columns, maxDepth, 0, grid);
    return grid;
  }, [columns, maxDepth]);

  // Compute cumulative sticky offsets (dùng leaf columns)
  const stickyOffsets = useMemo(() => {
    const left: Record<string, number> = {};
    const right: Record<string, number> = {};
    let leftAcc = 0;
    let rightAcc = 0;
    const leftSticky = leafColumns.filter((c) => c.fixed === "left");
    const rightSticky = leafColumns.filter((c) => c.fixed === "right").reverse();
    for (const col of leftSticky) {
      left[col.dataIndex] = leftAcc;
      leftAcc += col.width || 0;
    }
    for (const col of rightSticky) {
      right[col.dataIndex] = rightAcc;
      rightAcc += col.width || 0;
    }
    return { left, right };
  }, [leafColumns]);

  // Boundary (cạnh giáp vùng cuộn): chỉ cột này mới hiển thị shadow
  const leftBoundaryKey = useMemo(() => {
    const l = leafColumns.filter((c) => c.fixed === "left");
    return l.length ? l[l.length - 1].dataIndex : undefined;
  }, [leafColumns]);
  const rightBoundaryKey = useMemo(() => {
    const r = leafColumns.filter((c) => c.fixed === "right");
    return r.length ? r[0].dataIndex : undefined;
  }, [leafColumns]);

  // Sortable
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const moveRef = useRef<(from: number, to: number) => void>(() => {});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    if (isNaN(oldIndex) || isNaN(newIndex)) return;

    moveRef.current(oldIndex, newIndex);
    onSort?.(arrayMove([...records], oldIndex, newIndex));
  };

  const extraCols = (sortable ? 1 : 0) + (showDelete ? 1 : 0);
  const totalCols = leafColumns.length + extraCols;

  // Helper: render a single cell
  const renderCell = (col: FormColumn<T>, ctx: FormCellContext<T>, rowName: number) => {
    const colFillable = !!(col.fillable ?? fillableColumns.includes(col.dataIndex));
    const isFillable = colFillable && col.editable;
    const fillClass = isFillable && isInFillRange(rowName, col.dataIndex) ? "!bg-blue-50" : "";

    // Lỗi field (fallback qua getFieldError) hoặc từ prop errorCells → nháy đỏ cell
    const fieldErrors: string[] = col.editable
      ? (form.getFieldError([fieldName, rowName, col.dataIndex]) as string[])
      : [];
    const isErrorCell = !!errorCells?.get(rowName)?.has(col.dataIndex) || fieldErrors.length > 0;

    const baseClass = `border-l !border-[#D9D9D9] relative bg-panel group-hover:bg-[var(--bg-panel-hover)] ${fillClass} transition-colors ease-in-out ${ALIGN_CLASS[col.align || "left"]} ${col.className || ""} ${col.fixed === "left" ? "sticky-left" : col.fixed === "right" ? "sticky-right" : ""} ${col.fixed === "left" && col.dataIndex === leftBoundaryKey ? "boundary-left" : ""} ${col.fixed === "right" && col.dataIndex === rightBoundaryKey ? "boundary-right" : ""} ${isErrorCell ? "error-cell" : ""}`;
    const baseStyle: React.CSSProperties = {
      ...(col.fixed === "left" ? { left: stickyOffsets.left[col.dataIndex] } : undefined),
      ...(col.fixed === "right" ? { right: stickyOffsets.right[col.dataIndex] } : undefined),
    };

    if (col.editable) {
      return (
        <td
          key={col.dataIndex}
          className={baseClass}
          style={baseStyle}
          title={isErrorCell ? fieldErrors.join("; ") || undefined : undefined}
          onMouseEnter={colFillable ? () => onCellMouseEnter(rowName, col.dataIndex) : undefined}
          onMouseLeave={colFillable ? onCellMouseLeave : undefined}
        >
          <Form.Item {...ctx.restField} name={[rowName, col.dataIndex]} noStyle rules={col.rules}>
            {col.render?.(ctx) as React.ReactElement}
          </Form.Item>
          {colFillable && (
            <ExcelFillHandle
              visible={showHandle(rowName, col.dataIndex)}
              selected={isCellSelected(rowName, col.dataIndex)}
              onMouseDown={(e) => onHandleMouseDown(e, rowName, col.dataIndex)}
              onHardClick={(e) => onHandleHardClick(e, rowName, col.dataIndex)}
            />
          )}
        </td>
      );
    }
    return (
      <td
        key={col.dataIndex}
        className={`${baseClass} ${col.align !== "center" ? "px-3" : ""} border-l !border-[#D9D9D9] first:border-l-0 truncate`}
        style={baseStyle}
        title={typeof col.render?.(ctx) === "string" ? (col.render?.(ctx) as string) : undefined}
      >
        {col.render?.(ctx)}
      </td>
    );
  };

  return (
    <Form.List name={fieldName}>
      {(fields, { add, remove, move }) => {
        moveRef.current = move;

        return (
          <div className={`flex flex-col gap-1 h-full ${className || ""}`} onKeyDown={onKeyDown}>
            {/* Header bar */}
            {(title || renderAdd) && (
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                {title &&
                  (typeof title === "string" ? (
                    <span className="text-lg !font-medium">{title}</span>
                  ) : (
                    title
                  ))}
                {renderAdd && (
                  <div className="w-full lg:w-96" style={{ width: addWidth || "24rem" }}>
                    {renderAdd(add)}
                  </div>
                )}
              </div>
            )}

            {/* Table */}
            <div
              ref={scrollContainerRef}
              data-scrolled-left={scrolledLeft ? "true" : "false"}
              data-scrolled-right={scrolledRight ? "true" : "false"}
              className={`flex flex-col w-full overflow-auto border rounded-lg ${wrapperClassName || ""}`}
            >
              {sortable ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <table className="min-w-full w-fit table-fixed">
                    {/* Colgroup */}
                    <colgroup>
                      {sortable && <col style={{ width: 36 }} />}
                      {leafColumns.map((col) => (
                        <col key={col.dataIndex} style={{ width: col.width }} />
                      ))}
                      {showDelete && <col style={{ width: 40 }} />}
                    </colgroup>

                    {/* Header */}
                    <thead>
                      {hasGroupedColumns ? (
                        renderHeaderGrid(
                          headerGrid,
                          stickyOffsets,
                          leafColumns[0]?.dataIndex,
                          leafColumns[leafColumns.length - 1]?.dataIndex,
                          leftBoundaryKey,
                          rightBoundaryKey,
                        ).map((row, level) => (
                          <React.Fragment key={`header-level-${level}`}>
                            {React.cloneElement(row as React.ReactElement, {}, [
                              sortable && level === 0 ? (
                                <th
                                  key="sortable-col"
                                  className="w-9 !bg-gray-50 dark:!bg-gray-950"
                                  rowSpan={maxDepth}
                                />
                              ) : null,
                              ...React.Children.toArray((row as React.ReactElement).props.children),
                              showDelete && level === 0 ? (
                                <th
                                  key="delete-col"
                                  className="border-l !font-medium sticky-right boundary-right !bg-gray-50 dark:!bg-gray-950"
                                  rowSpan={maxDepth}
                                />
                              ) : null,
                            ])}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr className="border-b sticky top-0 z-10">
                          {sortable && <th className="w-9 !bg-gray-50 dark:!bg-gray-950" />}
                          {leafColumns.map((col) => (
                            <th
                              key={col.dataIndex}
                              className={`
                                !font-medium border-l first:border-l-0 !bg-gray-50 dark:!bg-gray-950 truncate text-center
                                ${col.align !== "center" ? "px-3" : ""}
                                ${col.fixed === "left" ? "sticky-left" : col.fixed === "right" ? "sticky-right" : ""}
                                ${col.fixed === "left" && col.dataIndex === leftBoundaryKey ? "boundary-left" : ""}
                                ${col.fixed === "right" && col.dataIndex === rightBoundaryKey ? "boundary-right" : ""}
                              `}
                              style={{
                                ...(col.fixed === "left"
                                  ? { left: stickyOffsets.left[col.dataIndex] }
                                  : undefined),
                                ...(col.fixed === "right"
                                  ? { right: stickyOffsets.right[col.dataIndex] }
                                  : undefined),
                              }}
                              title={typeof col.title === "string" ? col.title : undefined}
                            >
                              {col.title}
                            </th>
                          ))}
                          {showDelete && (
                            <th className="border-l !font-medium sticky-right boundary-right !bg-gray-50 dark:!bg-gray-950" />
                          )}
                        </tr>
                      )}
                    </thead>
                    <SortableContext
                      items={fields.map((_, i) => String(i))}
                      strategy={verticalListSortingStrategy}
                    >
                      <tbody ref={tableBodyRef}>
                        {fields.length === 0 ? (
                          <tr>
                            <td colSpan={totalCols}>
                              <div className="h-32 flex items-center justify-center">
                                {typeof emptyText === "function" ? (
                                  emptyText(add)
                                ) : (
                                  <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={emptyText}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          fields.map(({ key, name, ...restField }) => {
                            const record = records?.[name];
                            const rowClass = rowClassName?.(record, name) || "";
                            return (
                              <SortableRow key={key} id={String(name)}>
                                {leafColumns.map((col) => {
                                  const isVisible = col.visible
                                    ? col.visible({ record, index: name })
                                    : true;
                                  if (!isVisible)
                                    return <td key={col.dataIndex} className="border" />;
                                  const ctx: FormCellContext<T> = {
                                    name,
                                    restField,
                                    record,
                                    index: name,
                                    form,
                                  };
                                  return renderCell(col, ctx, name);
                                })}
                                {showDelete && (
                                  <td
                                    className="text-center border border-r-0 sticky-right boundary-right bg-panel group-hover:bg-[var(--bg-panel-hover)] transition-colors ease-in-out"
                                    style={{ right: 0 }}
                                  >
                                    <Button
                                      type="text"
                                      htmlType="button"
                                      className={`${CLASSNAME.inputHeight} w-8 p-0 text-gray-400 hover:!text-red-500`}
                                      onClick={() => remove(name)}
                                      icon={<TrashIcon className="h-4 w-4" />}
                                    />
                                  </td>
                                )}
                              </SortableRow>
                            );
                          })
                        )}
                      </tbody>
                    </SortableContext>
                    {/* Summary */}
                    {renderSummary && records.length > 0 && (
                      <tfoot>
                        <tr
                          className="!font-medium bg-gray-50 dark:bg-gray-950 sticky -bottom-px z-10"
                          style={{
                            boxShadow: "0 -1px 0 0 var(--border-color, #e5e7eb)",
                          }}
                        >
                          {sortable && <td className="border-r-0" />}
                          {typeof renderSummary === "function"
                            ? renderSummary({ records, addFn: add })
                            : isSummaryConfig(renderSummary)
                              ? leafColumns.map((col, idx) => {
                                  const colKey = col.dataIndex;
                                  const isSummaryCol = colKey === renderSummary.summaryColKey;
                                  const val = isSummaryCol
                                    ? (renderSummary.label ?? "Tổng")
                                    : (renderSummary[colKey] ?? renderSummary[idx]);
                                  return (
                                    <td
                                      key={colKey}
                                      className={`px-3 border-l first:border-l-0 border-b-0 ${ALIGN_CLASS[col.align || "left"]} ${col.fixed === "left" ? "sticky-left" : col.fixed === "right" ? "sticky-right" : ""} ${col.fixed === "left" && colKey === leftBoundaryKey ? "boundary-left" : ""} ${col.fixed === "right" && colKey === rightBoundaryKey ? "boundary-right" : ""}`}
                                      style={{
                                        ...(col.fixed === "left"
                                          ? { left: stickyOffsets.left[col.dataIndex] }
                                          : undefined),
                                        ...(col.fixed === "right"
                                          ? { right: stickyOffsets.right[col.dataIndex] }
                                          : undefined),
                                      }}
                                      title={typeof val === "string" ? val : undefined}
                                    >
                                      {val}
                                    </td>
                                  );
                                })
                              : renderSummary}
                          {showDelete && (
                            <td
                              className="border-r-0 sticky-right boundary-right"
                              style={{ right: 0 }}
                            />
                          )}
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </DndContext>
              ) : (
                <table className="min-w-full w-fit table-fixed">
                  {/* Colgroup */}
                  <colgroup>
                    {leafColumns.map((col) => (
                      <col key={col.dataIndex} style={{ width: col.width }} />
                    ))}
                    {showDelete && <col style={{ width: 40 }} />}
                  </colgroup>
                  {/* Header */}
                  <thead>
                    {hasGroupedColumns ? (
                      renderHeaderGrid(
                        headerGrid,
                        stickyOffsets,
                        leafColumns[0]?.dataIndex,
                        leafColumns[leafColumns.length - 1]?.dataIndex,
                        leftBoundaryKey,
                        rightBoundaryKey,
                      ).map((row, level) => (
                        <React.Fragment key={`header-level-${level}`}>
                          {React.cloneElement(row as React.ReactElement, {}, [
                            ...React.Children.toArray((row as React.ReactElement).props.children),
                            showDelete && level === 0 ? (
                              <th
                                key="delete-col"
                                className="border-l !font-medium sticky-right !bg-gray-50 dark:!bg-gray-950"
                                rowSpan={maxDepth}
                              />
                            ) : null,
                          ])}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr className="border-b sticky top-0 z-10">
                        {leafColumns.map((col) => (
                          <th
                            key={col.dataIndex}
                            className={`
                            !font-medium border-l first:border-l-0 !bg-gray-50 dark:!bg-gray-950 truncate
                            ${col.align !== "center" ? "px-3" : ""}
                            ${ALIGN_CLASS[col.align || "left"]} ${col.className || ""}
                            ${col.fixed === "left" ? "sticky-left" : col.fixed === "right" ? "sticky-right" : ""}
                            ${col.fixed === "left" && col.dataIndex === leftBoundaryKey ? "boundary-left" : ""}
                            ${col.fixed === "right" && col.dataIndex === rightBoundaryKey ? "boundary-right" : ""}
                           `}
                            style={{
                              ...(col.fixed === "left"
                                ? { left: stickyOffsets.left[col.dataIndex] }
                                : undefined),
                              ...(col.fixed === "right"
                                ? { right: stickyOffsets.right[col.dataIndex] }
                                : undefined),
                            }}
                            title={typeof col.title === "string" ? col.title : undefined}
                          >
                            {col.title}
                          </th>
                        ))}
                        {showDelete && (
                          <th className="border-l !font-medium sticky-right boundary-right !bg-gray-50 dark:!bg-gray-950" />
                        )}
                      </tr>
                    )}
                  </thead>
                  <tbody ref={tableBodyRef}>
                    {fields.length === 0 ? (
                      <tr>
                        <td colSpan={totalCols}>
                          <div className="h-32 flex items-center justify-center">
                            {typeof emptyText === "function" ? (
                              emptyText(add)
                            ) : (
                              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      fields.map(({ key, name, ...restField }) => {
                        const record = records?.[name];
                        const rowClass = rowClassName?.(record, name) || "";
                        return (
                          <tr
                            key={key}
                            data-fill-row
                            className={`${rowClass} border-b last:border-b-0 group`}
                          >
                            {leafColumns.map((col) => {
                              const isVisible = col.visible
                                ? col.visible({ record, index: name })
                                : true;
                              if (!isVisible) return <td key={col.dataIndex} className="border" />;
                              const ctx: FormCellContext<T> = {
                                name,
                                restField,
                                record,
                                index: name,
                                form,
                              };
                              return renderCell(col, ctx, name);
                            })}
                            {showDelete && (
                              <td
                                className="text-center border border-r-0 sticky-right boundary-right bg-panel group-hover:bg-[var(--bg-panel-hover)] transition-colors ease-in-out"
                                style={{ right: 0 }}
                              >
                                <Button
                                  type="text"
                                  htmlType="button"
                                  className={`${CLASSNAME.inputHeight} w-8 p-0 text-gray-400 hover:!text-red-500`}
                                  onClick={() => remove(name)}
                                  icon={<TrashIcon className="h-4 w-4" />}
                                />
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {/* Summary */}
                  {renderSummary && records.length > 0 && (
                    <tfoot>
                      <tr
                        className="!font-medium bg-gray-50 dark:bg-gray-950 sticky -bottom-px z-10"
                        style={{
                          boxShadow: "0 -1px 0 0 var(--border-color, #e5e7eb)",
                        }}
                      >
                        {typeof renderSummary === "function"
                          ? renderSummary({ records, addFn: add })
                          : isSummaryConfig(renderSummary)
                            ? leafColumns.map((col, idx) => {
                                const colKey = col.dataIndex;
                                const isSummaryCol = colKey === renderSummary.summaryColKey;
                                const val = isSummaryCol
                                  ? (renderSummary.label ?? "Tổng")
                                  : (renderSummary[colKey] ?? renderSummary[idx]);
                                return (
                                  <td
                                    key={colKey}
                                    className={`px-3 border-l first:border-l-0 border-b-0 ${ALIGN_CLASS[col.align || "left"]} ${col.fixed === "left" ? "sticky-left" : col.fixed === "right" ? "sticky-right" : ""} ${col.fixed === "left" && colKey === leftBoundaryKey ? "boundary-left" : ""} ${col.fixed === "right" && colKey === rightBoundaryKey ? "boundary-right" : ""}`}
                                    style={{
                                      ...(col.fixed === "left"
                                        ? { left: stickyOffsets.left[col.dataIndex] }
                                        : undefined),
                                      ...(col.fixed === "right"
                                        ? { right: stickyOffsets.right[col.dataIndex] }
                                        : undefined),
                                    }}
                                  >
                                    {val}
                                  </td>
                                );
                              })
                            : renderSummary}
                        {showDelete && (
                          <td
                            className="border-r-0 sticky-right boundary-right bg-gray-50 dark:bg-gray-950"
                            style={{ right: 0 }}
                          />
                        )}
                      </tr>
                    </tfoot>
                  )}
                </table>
              )}
            </div>
          </div>
        );
      }}
    </Form.List>
  );
}

