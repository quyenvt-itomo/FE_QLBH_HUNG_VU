import { DatePicker } from "antd";
import dayjs from "dayjs";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { RangerItemPanel } from "./RangerItemPanel";
import { SearchItemPanel } from "./SearchPanel";
import { SortSelect } from "./SortSelect";
import {
  FilterKey,
  Ranger,
  RangerItem,
  Search,
  SearchItem,
  SortItem,
  SortValue,
} from "@/shared/interfaces/common";
import type { StatusItem } from "./filter.types";
import React from "react";
import { FilterPanel } from "./FilterPanel";

export interface PanelFilterProps {
  filterActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  status?: string;
  statusItems?: StatusItem[];
  onChangeStatus?: (status: string) => void;
  startAt?: string;
  endAt?: string;
  onChangeStartAt?: (date: string) => void;
  onChangeEndAt?: (date: string) => void;
  sortItems?: SortItem[];
  sortValue?: SortValue;
  onSortChange?: (value: SortValue) => void;
  rangerItems?: RangerItem[];
  rangerValue?: Ranger;
  onRangerChange?: (value: Ranger) => void;
  filterUses?: FilterKey[];
  filterLabels?: { [key in FilterKey]?: string };
  searchItems?: SearchItem[];
  searchValue?: Search;
  onSearchChange?: (value: Search) => void;
  filterContent?: React.ReactNode;
  onClearFilter?: () => void;
}

const DATE_PRESETS = [
  { label: "Hôm nay", start: dayjs().startOf("day"), end: dayjs().endOf("day") },
  { label: "Tháng này", start: dayjs().startOf("month"), end: dayjs().endOf("month") },
  { label: "Năm nay", start: dayjs().startOf("year"), end: dayjs().endOf("year") },
];

export const PanelFilter: React.FC<PanelFilterProps> = ({
  filterActive,
  className = "",
  style,
  status,
  statusItems = [],
  onChangeStatus,
  startAt,
  endAt,
  onChangeStartAt,
  onChangeEndAt,
  sortItems = [],
  sortValue,
  onSortChange,
  rangerItems = [],
  rangerValue,
  onRangerChange,
  searchItems = [],
  searchValue,
  onSearchChange,

  filterLabels,
  filterUses = [],

  filterContent,
  onClearFilter,
}) => {
  return (
    <aside
      className={`flex h-full w-64 shrink-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
      style={style}
      aria-label="Bộ lọc"
    >
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <FunnelIcon className="h-4 w-4" />
          Bộ lọc
        </div>
        {filterActive && onClearFilter && (
          <button type="button" className="text-xs text-green-700" onClick={onClearFilter}>
            Đặt lại
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {searchItems.length > 0 && (
          <section>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tìm kiếm
            </div>
            <SearchItemPanel
              searchItems={searchItems}
              value={searchValue}
              onChange={onSearchChange}
            />
          </section>
        )}
        {statusItems.length > 0 && (
          <section className="border-b border-gray-100 pt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Trạng thái
            </div>
            <div className="space-y-1">
              {statusItems.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onChangeStatus?.(item.value)}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm ${
                    status === item.value
                      ? "bg-green-50 font-medium text-green-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                  {item.total !== undefined && <span>{item.total}</span>}
                </button>
              ))}
            </div>
          </section>
        )}

        {sortItems.length > 0 && (
          <div className="flex flex-col w-full h-fit gap-4 border-b border-gray-100">
            <SortSelect
              size="small"
              sortItems={sortItems}
              value={sortValue}
              onChange={onSortChange}
            />
          </div>
        )}
        {rangerItems.length > 0 && (
          <div className="flex flex-col w-full h-fit gap-4 p-4 pt-2 border-b border-gray-100">
            <div className="flex flex-col w-full !justify-between gap-2">
              <span className="font-semibold text-xs uppercase tracking-wide text-gray-500">
                Lọc trong khoảng
              </span>

              <RangerItemPanel
                rangerItems={rangerItems}
                value={rangerValue}
                onChange={onRangerChange}
                defaultOpenAll
              />
            </div>
          </div>
        )}

        {filterContent && (
          <section className="border-b border-gray-100 pt-3">{filterContent}</section>
        )}

        {filterUses.length > 0 && (
          <div className="flex flex-col w-full h-fit gap-4 p-4 pt-2 border-b border-gray-100">
            <div className="flex flex-col w-full !justify-between gap-2">
              <span className="font-semibold text-xs uppercase tracking-wide text-gray-500">
                Lọc theo
              </span>

              <FilterPanel filterUses={filterUses} filterLabels={filterLabels} defaultOpenAll />
            </div>
          </div>
        )}
      </div>
      {filterActive && onClearFilter && (
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-3 py-2 text-xs text-gray-500">
          <span>Đang áp dụng bộ lọc</span>
          <button type="button" onClick={onClearFilter} className="text-red-600">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
