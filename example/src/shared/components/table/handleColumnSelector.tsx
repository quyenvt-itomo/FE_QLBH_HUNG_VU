import React, { useEffect, useMemo, useState } from "react";
import { Button, Checkbox } from "antd";
import { ReactSortable } from "react-sortablejs";
import type { ColumnsType } from "antd/es/table";

export interface ColumnConfigItem {
  key: string; // Bắt buộc phải có key
  is_hide?: boolean; // Trường ẩn/hiện (tùy chọn)
  can_hide?: boolean;
  title: string;
  /** Người dùng có thể ghim trái/phải cột */
  fixed?: "left" | "right";
}

export type ColumnsConfigType<T = any> = (ColumnConfigItem & ColumnsType<T>[number])[];

interface ColumnSelectorProps {
  columns: ColumnsConfigType;
  onConfigColumns: (sortedColumns: any) => void;
  onResetColumns: () => void;
}

type SortableItem = ColumnsConfigType[number] & { id: string };

export const getTextFromReactNode = (node: React.ReactNode): string => {
  if (!node) return "";

  if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  }

  if (Array.isArray(node)) {
    return node.map(getTextFromReactNode).join("");
  }

  if (React.isValidElement(node)) {
    // ✅ Bắt case component có props.title
    if (node.props?.title) {
      return String(node.props.title);
    }

    // fallback: đọc children
    if (node.props?.children) {
      return getTextFromReactNode(node.props.children);
    }
  }

  return "";
};

/** Nhóm cột theo fixed */
const groupByFixed = (cols: ColumnsConfigType) => {
  return {
    left: cols.filter((c) => c.fixed === "left"),
    normal: cols.filter((c) => !c.fixed),
    right: cols.filter((c) => c.fixed === "right"),
  };
};

// ─── Section Header ───────────────────────────────────────────
const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; count: number }> = ({
  title,
  icon,
  count,
}) => (
  <div className="flex items-center gap-2 px-1 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600 mb-1">
    {icon}
    <span>{title}</span>
    <span className="ml-auto text-gray-400">{count}</span>
  </div>
);

// ─── Draggable Column Item ────────────────────────────────────
const ColumnItem: React.FC<{
  item: ColumnsConfigType[number];
  onToggle: (key: string, checked: boolean) => void;
}> = ({ item, onToggle }) => (
  <div
    className="
      flex grow w-full items-center bg-[#f5f5f5] dark:bg-[#333333]
      cursor-grab p-1.5 my-1 rounded
    "
  >
    <Checkbox
      onChange={(e) => onToggle(item.key, e.target.checked)}
      checked={!item.is_hide}
      disabled={item.can_hide === false}
      className="checkbox-large"
    />
    <span className="font-medium grow pl-2 truncate">{getTextFromReactNode(item.title)}</span>
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.99992 4.66667C7.26354 4.66667 6.66658 4.06971 6.66658 3.33333C6.66658 2.59695 7.26354 2 7.99992 2C8.7363 2 9.33325 2.59695 9.33325 3.33333C9.33325 4.06971 8.7363 4.66667 7.99992 4.66667Z"
        fill="#555555"
      />
      <path
        d="M7.99992 9.33333C7.26354 9.33333 6.66658 8.73638 6.66658 8C6.66658 7.26362 7.26354 6.66667 7.99992 6.66667C8.7363 6.66667 9.33325 7.26362 9.33325 8C9.33325 8.73638 8.7363 9.33333 7.99992 9.33333Z"
        fill="#555555"
      />
      <path
        d="M7.99992 14C7.26354 14 6.66658 13.403 6.66658 12.6667C6.66658 11.9303 7.26354 11.3333 7.99992 11.3333C8.7363 11.3333 9.33325 11.9303 9.33325 12.6667C9.33325 13.403 8.7363 14 7.99992 14Z"
        fill="#555555"
      />
      <path
        d="M13.9999 4.66667C13.2635 4.66667 12.6666 4.06971 12.6666 3.33333C12.6666 2.59695 13.2635 2 13.9999 2C14.7363 2 15.3333 2.59695 15.3333 3.33333C15.3333 4.06971 14.7363 4.66667 13.9999 4.66667Z"
        fill="#555555"
      />
      <path
        d="M13.9999 9.33333C13.2635 9.33333 12.6666 8.73638 12.6666 8C12.6666 7.26362 13.2635 6.66667 13.9999 6.66667C14.7363 6.66667 15.3333 7.26362 15.3333 8C15.3333 8.73638 14.7363 9.33333 13.9999 9.33333Z"
        fill="#555555"
      />
      <path
        d="M13.9999 14C13.2635 14 12.6666 13.403 12.6666 12.6667C12.6666 11.9303 13.2635 11.3333 13.9999 11.3333C14.7363 11.3333 15.3333 11.9303 15.3333 12.6667C15.3333 13.403 14.7363 14 13.9999 14Z"
        fill="#555555"
      />
    </svg>
  </div>
);

// ─── Main Component ───────────────────────────────────────────
const SORTABLE_GROUP = "column-pinning";

const HandleColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  onConfigColumns,
  onResetColumns,
}) => {
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [sortedColumns, setSortedColumns] = useState<ColumnsConfigType>(columns);

  // ── Helpers ─────────────────────────────────────────────────
  const hasChanged = (a: ColumnsConfigType, b: ColumnsConfigType) => {
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
      if (a[i].key !== b[i].key || a[i].is_hide !== b[i].is_hide || a[i].fixed !== b[i].fixed)
        return true;
    }
    return false;
  };

  // ── Toggle visibility ───────────────────────────────────────
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setSortedColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, is_hide: !checked } : col)),
    );
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSortedColumns((prev) =>
      prev.map((col) => ({
        ...col,
        is_hide: col.can_hide !== false && !checked,
      })),
    );
  };

  // ── Drag between sections ───────────────────────────────────
  const buildSortedFromGroups = (
    left: SortableItem[],
    normal: SortableItem[],
    right: SortableItem[],
  ): ColumnsConfigType => {
    const stripId = (item: SortableItem) => {
      const { id, ...rest } = item;
      return rest as ColumnsConfigType[number];
    };
    return [
      ...left.map((item) => ({ ...stripId(item), fixed: "left" as const })),
      ...normal.map((item) => ({ ...stripId(item), fixed: undefined })),
      ...right.map((item) => ({ ...stripId(item), fixed: "right" as const })),
    ];
  };

  const toSortable = (cols: ColumnsConfigType): SortableItem[] =>
    cols.map((col) => ({ ...col, id: col.key }));

  // Derived grouped lists from sortedColumns
  const {
    left: leftColumns,
    normal: normalColumns,
    right: rightColumns,
  } = useMemo(() => groupByFixed(sortedColumns), [sortedColumns]);

  // ── Sync external columns ───────────────────────────────────
  useEffect(() => {
    setIsChanged(hasChanged(columns, sortedColumns));
  }, [sortedColumns, columns]);

  useEffect(() => {
    if (!hasChanged(columns, sortedColumns)) return;
    setSortedColumns(columns);
  }, [columns]);

  // ── Actions ─────────────────────────────────────────────────
  const handleResetColumns = () => onResetColumns();

  const handleSaveColumns = () => {
    if (!isChanged) return;
    onConfigColumns(sortedColumns);
  };

  // ── Icons ───────────────────────────────────────────────────
  const PinLeftIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L12 22M12 2L8 6M12 2L16 6" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="4" y1="12" x2="10" y2="12" strokeLinecap="round" />
    </svg>
  );
  const PinRightIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L12 22M12 2L8 6M12 2L16 6" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="14" y1="12" x2="20" y2="12" strokeLinecap="round" />
    </svg>
  );
  const NormalIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
      <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="flex flex-col w-full pb-12" style={{ maxHeight: "100%" }}>
      {/* ── Toolbar ──────────────────────────────── */}
      <div
        className="flex grow w-full items-center justify-between mb-2"
        style={{ padding: "4px 6px" }}
      >
        <Checkbox
          onChange={(e) => handleSelectAllChange(e.target.checked)}
          checked={!sortedColumns.some((col) => col.is_hide)}
          className="font-semibold checkbox-large"
        >
          Tất cả
        </Checkbox>
        <div className="flex gap-2">
          <Button onClick={handleResetColumns} className="p-1" title="Đặt lại về mặc định">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
            >
              <path
                d="M20.0092 2V5.13219C20.0092 5.42605 19.6418 5.55908 19.4537 5.33333C17.6226 3.2875 14.9617 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Button onClick={handleSaveColumns} type={isChanged ? "primary" : "default"} title="Lưu">
            Lưu
          </Button>
        </div>
      </div>

      {/* ── Three-section drag area ───────────────── */}
      <div className="flex flex-col gap-3 overflow-y-auto" style={{ height: "calc(100% - 40px)" }}>
        {/* ── Ghim trái ── */}
        <div>
          <SectionHeader title="Ghim trái" icon={PinLeftIcon} count={leftColumns.length} />
          <ReactSortable
            list={toSortable(leftColumns)}
            setList={(newList) => {
              setSortedColumns((prev) => {
                const groups = groupByFixed(prev);
                return buildSortedFromGroups(
                  newList,
                  toSortable(groups.normal),
                  toSortable(groups.right),
                );
              });
            }}
            animation={200}
            ghostClass="gu-transit"
            group={SORTABLE_GROUP}
          >
            {leftColumns.map((item) => (
              <ColumnItem key={item.key} item={item} onToggle={handleCheckboxChange} />
            ))}
          </ReactSortable>
          {leftColumns.length === 0 && (
            <div className="text-xs text-gray-400 italic px-2 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center">
              Kéo cột vào đây để ghim trái
            </div>
          )}
        </div>

        {/* ── Bình thường ── */}
        <div>
          <SectionHeader title="Bình thường" icon={NormalIcon} count={normalColumns.length} />
          <ReactSortable
            list={toSortable(normalColumns)}
            setList={(newList) => {
              setSortedColumns((prev) => {
                const groups = groupByFixed(prev);
                return buildSortedFromGroups(
                  toSortable(groups.left),
                  newList,
                  toSortable(groups.right),
                );
              });
            }}
            animation={200}
            ghostClass="gu-transit"
            group={SORTABLE_GROUP}
          >
            {normalColumns.map((item) => (
              <ColumnItem key={item.key} item={item} onToggle={handleCheckboxChange} />
            ))}
          </ReactSortable>
          {normalColumns.length === 0 && (
            <div className="text-xs text-gray-400 italic px-2 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center">
              Kéo cột vào đây để hiển thị bình thường
            </div>
          )}
        </div>

        {/* ── Ghim phải ── */}
        <div>
          <SectionHeader title="Ghim phải" icon={PinRightIcon} count={rightColumns.length} />
          <ReactSortable
            list={toSortable(rightColumns)}
            setList={(newList) => {
              setSortedColumns((prev) => {
                const groups = groupByFixed(prev);
                return buildSortedFromGroups(
                  toSortable(groups.left),
                  toSortable(groups.normal),
                  newList,
                );
              });
            }}
            animation={200}
            ghostClass="gu-transit"
            group={SORTABLE_GROUP}
          >
            {rightColumns.map((item) => (
              <ColumnItem key={item.key} item={item} onToggle={handleCheckboxChange} />
            ))}
          </ReactSortable>
          {rightColumns.length === 0 && (
            <div className="text-xs text-gray-400 italic px-2 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center">
              Kéo cột vào đây để ghim phải
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandleColumnSelector;
