import { Button, DatePicker, Drawer } from "antd";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs from "dayjs";
dayjs.extend(isoWeek);

import { RangerItemPanel } from "./RangerItemPanel";
import { SortSelect } from "./SortSelect";
import { SearchItemPanel } from "./SearchPanel";
import {
  FilterKey,
  Ranger,
  RangerItem,
  Search,
  SearchItem,
  SortItem,
  SortValue,
} from "@/shared/interfaces/common";
import { TouchToClose } from "@/shared/hooks/useTouchToClose";
import { StatusItem } from ".";
import { CLASSNAME } from "@/shared/constants/ui";

type DatePreset = { label: string; start: ReturnType<typeof dayjs>; end: ReturnType<typeof dayjs> };

export const getDatePresets = (): DatePreset[] => [
  { label: "Hôm nay", start: dayjs().startOf("day"), end: dayjs().endOf("day") },
  {
    label: "Hôm qua",
    start: dayjs().subtract(1, "day").startOf("day"),
    end: dayjs().subtract(1, "day").endOf("day"),
  },
  { label: "Tuần này", start: dayjs().startOf("isoWeek"), end: dayjs().endOf("isoWeek") },
  {
    label: "Tuần trước",
    start: dayjs().subtract(1, "week").startOf("isoWeek"),
    end: dayjs().subtract(1, "week").endOf("isoWeek"),
  },
  { label: "Tháng này", start: dayjs().startOf("month"), end: dayjs().endOf("month") },
  {
    label: "Tháng trước",
    start: dayjs().subtract(1, "month").startOf("month"),
    end: dayjs().subtract(1, "month").endOf("month"),
  },
];

export const getActiveDatePresetLabel = (
  startAt?: string | null,
  endAt?: string | null,
): string | null => {
  if (!startAt || !endAt) return null;
  return (
    getDatePresets().find(
      (p) => dayjs(startAt).isSame(p.start, "day") && dayjs(endAt).isSame(p.end, "day"),
    )?.label ?? null
  );
};

const DRAWER_STYLES = {
  wrapper: { width: 442 },
  body: {
    padding: 0,
    display: "flex" as const,
    flexDirection: "column" as const,
    height: "100%",
  },
};

export interface DrawerFilterProps {
  open: boolean;
  onClose: () => void;

  status?: string;
  statusItems?: StatusItem[];
  onChangeStatus?: (status: string) => void;

  startAt?: string;
  endAt?: string;
  onChangeStartAt?: (date: string) => void;
  onChangeEndAt?: (date: string) => void;

  // * === Sort Props ===
  sortItems?: SortItem[];
  sortValue?: SortValue;
  onSortChange?: (value: SortValue) => void;

  // * === Ranger Props ===
  rangerItems?: RangerItem[];
  rangerValue?: Ranger;
  onRangerChange?: (value: Ranger) => void;

  // * === Filter Props ===
  filterUses?: FilterKey[];
  filterLabels?: { [key in FilterKey]?: string };

  // * === Search Props ===
  searchItems?: SearchItem[];
  searchValue?: Search;
  onSearchChange?: (value: Search) => void;

  /** Nội dung bộ lọc tuỳ chỉnh render trong phần "Lọc theo" */
  filterContent?: React.ReactNode;

  onClearFilter?: () => void;
}

const DrawerFilter: React.FC<DrawerFilterProps> = ({
  open,
  onClose,

  status,
  statusItems,
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

  filterLabels,
  filterUses = [],

  searchItems = [],
  searchValue,
  onSearchChange,

  filterContent,

  onClearFilter,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(false);

  // Date preset state
  const activeDatePreset = getActiveDatePresetLabel(startAt, endAt);
  const [showCustomDates, setShowCustomDates] = useState(false);
  const displayCustomDates = showCustomDates || !activeDatePreset;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const canScroll = el.scrollHeight > el.clientHeight;
      const reachedTop = canScroll ? el.scrollTop < 10 : true;
      const reachedBottom = canScroll
        ? el.scrollHeight - el.scrollTop <= el.clientHeight + 10
        : true;

      setIsAtTop(reachedTop);
      setIsAtBottom(reachedBottom);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll(); // sync lần đầu

    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Drawer
      open={open}
      placement="right"
      closable={false}
      onClose={onClose}
      className="drawer-menu w-full !xl:w-96"
      styles={DRAWER_STYLES}
    >
      <TouchToClose onSwipeClose={onClose} direction="right" />
      <div
        className={`flex h-12 items-center justify-between px-4 font-medium border-b bg-panel sticky top-0 z-10 transition-shadow ${
          isAtTop ? "" : "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]"
        }`}
      >
        <span>Lọc dữ liệu</span>
        <button type="button" className="" onClick={onClose}>
          <ChevronRightIcon className="h-4" />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-col h-full overflow-x-hidden overflow-y-auto scrollbar-hide"
      >
        {onChangeStartAt && onChangeEndAt && (
          <div className="itomo-mobile-filter shadow-none flex flex-col w-full h-fit gap-4 p-4">
            <div className="card">
              <span className="title">Ngày thực hiện</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {getDatePresets().map((preset) => {
                  const isActive =
                    dayjs(startAt).isSame(preset.start, "day") &&
                    dayjs(endAt).isSame(preset.end, "day");
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        onChangeStartAt(preset.start.format("YYYY-MM-DD"));
                        onChangeEndAt(preset.end.format("YYYY-MM-DD"));
                        setShowCustomDates(false);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600"
                          : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setShowCustomDates(true)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    displayCustomDates
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Tùy chọn
                </button>
              </div>
              {displayCustomDates && (
                <div className="flex w-full gap-3 mt-3">
                  <DatePicker
                    placeholder="Từ ngày"
                    format={"DD/MM/YYYY"}
                    value={dayjs(startAt)}
                    onChange={(date) => onChangeStartAt?.(date?.format("YYYY-MM-DD") || "")}
                  />
                  <DatePicker
                    placeholder="Đến ngày"
                    format={"DD/MM/YYYY"}
                    value={dayjs(endAt)}
                    onChange={(date) => onChangeEndAt?.(date?.format("YYYY-MM-DD") || "")}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {sortItems.length > 0 && (
          <SortSelect sortItems={sortItems} value={sortValue} onChange={onSortChange} />
        )}

        {/* {statusItems?.length && (
          <div className="itomo-mobile-filter flex flex-col w-full h-fit gap-4 p-4">
            <div className="card">
              <span className="title">Trạng thái</span>
              <div className="flex flex-col w-full gap-3">
                {statusItems.map((item) => (
                  <div
                    key={item.value}
                    className={`status-item ${status === item.value ? "active" : ""}`}
                    onClick={() =>
                      status !== item.value ? onChangeStatus?.(item.value) : undefined
                    }
                  >
                    <span className="icon">{item.icon}</span>
                    <div className="flex flex-col">
                      <span className="label">{item.label}</span>
                      <span className="total">{item.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}

        {rangerItems.length > 0 && (
          <div className="flex flex-col w-full h-fit gap-4 p-4">
            <div className="flex flex-col w-full !justify-between gap-2">
              <span className="font-semibold">Lọc trong khoảng</span>

              <RangerItemPanel
                rangerItems={rangerItems}
                value={rangerValue}
                onChange={onRangerChange}
              />
            </div>
          </div>
        )}

        {filterContent && (
          <div className="flex flex-col w-full h-fit gap-4 p-4">
            <div className="flex flex-col w-full !justify-between gap-2">{filterContent}</div>
          </div>
        )}

        {filterUses.length > 0 && (
          <div className="flex flex-col w-full h-fit gap-4 p-4">
            <div className="flex flex-col w-full !justify-between gap-2">
              <span className="font-semibold">Lọc theo</span>

              <div className="text-sm text-secondary italic">
                Bộ lọc nâng cao (xem FilterPanel - chưa migrate)
              </div>
            </div>
          </div>
        )}

        {searchItems.length > 0 && (
          <div className="flex flex-col w-full h-fit gap-4 p-4">
            <div className="flex flex-col w-full !justify-between gap-2">
              <span className="font-semibold">Tìm kiếm theo</span>

              <SearchItemPanel
                searchItems={searchItems}
                value={searchValue}
                onChange={onSearchChange}
              />
            </div>
          </div>
        )}

        <div
          className={`sticky flex gap-2 justify-end bottom-0 border-t p-2 pb-4 bg-panel transition-shadow mt-auto mb-0 z-50 ${
            isAtBottom ? "" : "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
          }`}
        >
          <Button
            htmlType="button"
            className={`${CLASSNAME.inputHeight} w-1/2`}
            onClick={() => {
              onClose();
            }}
          >
            Đóng
          </Button>
          <Button
            disabled={!onClearFilter}
            type="primary"
            htmlType="button"
            className={`${CLASSNAME.inputHeight} w-1/2`}
            onClick={() => {
              onClearFilter?.();
              onClose();
            }}
          >
            Xóa lọc
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export { DrawerFilter };
