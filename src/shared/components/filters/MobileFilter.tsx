import "./MobileFilter.css";
import { DrawerFilter, DrawerFilterProps, getActiveDatePresetLabel } from "./DrawerFilter";
import { useState } from "react";
import { SearchInput } from "../input";
import { StatusFilter } from "./StatusFilter";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatDateDDMMYYYY } from "@/shared/utils/date.util";

export interface MobileFilterProps extends Omit<DrawerFilterProps, "open" | "onClose"> {
  filterActive?: boolean;
  keyword?: string;
  onSearch: (value: string) => void;
}

const MobileFilter: React.FC<MobileFilterProps> = ({
  filterActive,

  keyword,
  onSearch,

  startAt,
  endAt,
  onChangeStartAt,
  onChangeEndAt,

  statusItems,
  status,
  onChangeStatus,

  onClearFilter,

  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className="
      itomo-mobile-filter
      flex flex-col w-full bg-panel px-4 py-2 gap-1"
    >
      <div className="flex justify-between">
        {filterActive ? (
          <button className="flex gap-1 item-center text-primary" onClick={onClearFilter}>
            Đang lọc <XMarkIcon className="h-[22px]" />
          </button>
        ) : (
          <span className="font-medium">Lọc dữ liệu</span>
        )}
        <button className="flex items-center gap-1 text-primary" onClick={() => setOpen(true)}>
          Thêm lọc
          <svg
            width="16"
            height="15"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6667 1H1L5.66667 6.51833V10.3333L8 11.5V6.51833L12.6667 1Z"
              stroke="#16a34a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="card">
        <div className="flex justify-between w-full">
          <span className="title">Tìm kiếm</span>

          {onChangeStartAt && onChangeEndAt && (
            <button className="text-gray-400 text-xs" onClick={() => setOpen(true)}>
              {getActiveDatePresetLabel(startAt, endAt) ??
                `${formatDateDDMMYYYY(startAt)} – ${formatDateDDMMYYYY(endAt)}`}
            </button>
          )}
        </div>
        <div className="flex flex-col w-full">
          <SearchInput value={keyword} onSearch={onSearch} />
        </div>
      </div>

      {statusItems?.length && (
        <StatusFilter status={status} items={statusItems} onChangeStatus={onChangeStatus} />
      )}
      <DrawerFilter
        open={open}
        onClose={() => setOpen(false)}
        startAt={startAt}
        endAt={endAt}
        onChangeStartAt={onChangeStartAt}
        onChangeEndAt={onChangeEndAt}
        statusItems={statusItems}
        status={status}
        onChangeStatus={onChangeStatus}
        onClearFilter={filterActive ? onClearFilter : undefined}
        {...rest}
      />
    </div>
  );
};

export { MobileFilter };
