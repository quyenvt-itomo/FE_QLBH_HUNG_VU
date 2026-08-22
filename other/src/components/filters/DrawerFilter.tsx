import { Button, Drawer } from "antd";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import {
  FilterKey,
  Ranger,
  RangerItem,
  Search,
  SearchItem,
  SortItem,
  SortValue,
} from "../../models/base/interface";
import { TouchToClose } from "../../hooks/core/useTouchToClose";
import { RangerItemPanel } from "./RangerItemPanel";
import { SortSelect } from "./SortSelect";
import { FilterPanel } from "./FilterPanel";
import { SearchItemPanel } from "./SearchPanel";

export interface DrawerFilterProps {
  open: boolean;
  onClose: () => void;

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

  onClearFilter?: () => void;
}

const DrawerFilter: React.FC<DrawerFilterProps> = ({
  open,
  onClose,

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

  onClearFilter,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(false);

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
      styles={{
        wrapper: {
          width: 442,
        },
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      <TouchToClose onSwipeClose={onClose} direction="right" />
      <div
        className={`flex h-12 items-center justify-between px-4 font-medium border-b bg-white sticky top-0 z-10 transition-shadow ${
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
        {sortItems.length > 0 && (
          <SortSelect sortItems={sortItems} value={sortValue} onChange={onSortChange} />
        )}

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

        {filterUses.length > 0 && (
          <div className="flex flex-col w-full h-fit gap-4 p-4">
            <div className="flex flex-col w-full !justify-between gap-2">
              <span className="font-semibold">Lọc theo</span>

              <FilterPanel filterUses={filterUses} filterLabels={filterLabels} />
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
          className={`sticky flex gap-2 justify-end bottom-0 border-t p-2 pb-4 bg-white transition-shadow mt-auto mb-0 z-50 ${
            isAtBottom ? "" : "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
          }`}
        >
          <Button
            htmlType="button"
            className=" w-1/2 h-8"
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
            className=" w-1/2 h-8"
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

export default DrawerFilter;
