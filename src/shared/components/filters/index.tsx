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

export interface StatusItem {
  label: string;
  value: string;
  total?: number;
  icon?: React.ReactNode;
}

export interface CustomFilterProps {
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

export const CustomFilter = ({
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
  filterContent,
  onClearFilter,
}: CustomFilterProps) => {
  return (
    <aside
      className={`fixed left-[220px] top-14 z-30 flex h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col border-r border-gray-200 bg-white ${className}`}
      style={style}
      aria-label="Bộ lọc"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4">
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
      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {searchItems.length > 0 && (
          <section>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Tìm kiếm</div>
            <SearchItemPanel searchItems={searchItems} value={searchValue} onChange={onSearchChange} />
          </section>
        )}
        {statusItems.length > 0 && (
          <section className="border-t border-gray-100 pt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái</div>
            <div className="space-y-1">
              {statusItems.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onChangeStatus?.(item.value)}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm ${
                    status === item.value ? "bg-green-50 font-medium text-green-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">{item.icon}{item.label}</span>
                  {item.total !== undefined && <span>{item.total}</span>}
                </button>
              ))}
            </div>
          </section>
        )}
        {onChangeStartAt && onChangeEndAt && (
          <section className="border-t border-gray-100 pt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Thời gian</div>
            <div className="mb-2 flex flex-wrap gap-1">
              {DATE_PRESETS.map((preset) => {
                const active = dayjs(startAt).isSame(preset.start, "day") && dayjs(endAt).isSame(preset.end, "day");
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onChangeStartAt(preset.start.format("YYYY-MM-DD"));
                      onChangeEndAt(preset.end.format("YYYY-MM-DD"));
                    }}
                    className={`rounded-full border px-2 py-1 text-xs ${active ? "border-green-600 bg-green-600 text-white" : "border-gray-200 text-gray-600"}`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-1">
              <DatePicker className="w-full" placeholder="Từ" format="DD/MM/YYYY" value={startAt ? dayjs(startAt) : null} onChange={(date) => onChangeStartAt(date?.format("YYYY-MM-DD") || "")} />
              <DatePicker className="w-full" placeholder="Đến" format="DD/MM/YYYY" value={endAt ? dayjs(endAt) : null} onChange={(date) => onChangeEndAt(date?.format("YYYY-MM-DD") || "")} />
            </div>
          </section>
        )}
        {sortItems.length > 0 && (
          <section className="border-t border-gray-100 pt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Sắp xếp</div>
            <SortSelect sortItems={sortItems} value={sortValue} onChange={onSortChange} />
          </section>
        )}
        {rangerItems.length > 0 && (
          <section className="border-t border-gray-100 pt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Khoảng giá trị</div>
            <RangerItemPanel rangerItems={rangerItems} value={rangerValue} onChange={onRangerChange} />
          </section>
        )}
        {filterContent && <section className="border-t border-gray-100 pt-3">{filterContent}</section>}
      </div>
      {filterActive && onClearFilter && (
        <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
          <span>Đang áp dụng bộ lọc</span>
          <button type="button" onClick={onClearFilter} className="text-red-600"><XMarkIcon className="h-4 w-4" /></button>
        </div>
      )}
    </aside>
  );
};

