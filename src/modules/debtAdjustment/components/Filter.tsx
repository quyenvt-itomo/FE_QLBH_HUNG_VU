import React from "react";
import { Divider, Radio } from "antd";
import { FilterItem, SummaryData } from "@/shared/interfaces/api";
import { DebtSide, debtSideMap } from "@/shared/constants/enum";
import { formatMoney } from "@/shared/utils/number.util";

export type DebtAdjustmentFilterItem = FilterItem & {
  side: DebtSide;
  partnerGroupId: string;
};

interface DebtAdjustmentFilterProps {
  summary?: SummaryData | null;
  filterItems: DebtAdjustmentFilterItem[];
  side?: DebtSide;
  partnerGroupId?: string;
  onSelectSide?: (side: DebtSide) => void;
  onSelectGroup?: (side: DebtSide, partnerGroupId: string) => void;
  onClear?: () => void;
}

const FilterCard: React.FC<{
  items: DebtAdjustmentFilterItem[];
  side: DebtSide;
  selectedGroupId?: string;
  onSelect?: (side: DebtSide, groupId: string) => void;
}> = ({ items, side, selectedGroupId, onSelect }) => (
  <div className="mt-1 flex flex-col gap-1">
    {items.map((item) => (
      <div
        key={`${side}-${item.partnerGroupId}`}
        className={`flex items-center justify-between rounded-md py-1 pl-7 hover:bg-gray-50 ${
          selectedGroupId === item.partnerGroupId ? "bg-primary/10" : ""
        }`}
      >
        <Radio
          checked={selectedGroupId === item.partnerGroupId}
          onChange={() => onSelect?.(side, item.partnerGroupId)}
          className="m-0"
        >
          <div className="flex w-[250px] justify-between gap-3">
            <span className="block truncate" title={item.name}>
              {item.name}
            </span>
            <span className="shrink-0 font-medium">{formatMoney(item.value) || 0}</span>
          </div>
        </Radio>
      </div>
    ))}
  </div>
);

export const Filter: React.FC<DebtAdjustmentFilterProps> = ({
  summary,
  filterItems,
  side,
  partnerGroupId,
  onSelectSide,
  onSelectGroup,
  onClear,
}) => {
  const receivableItems = filterItems.filter((item) => item.side === DebtSide.RECEIVABLE);
  const payableItems = filterItems.filter((item) => item.side === DebtSide.PAYABLE);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto rounded-lg border bg-panel px-3 py-2 scrollbar-hide">
      <div className="flex items-center justify-between px-1 pb-3">
        <span className="text-base font-semibold">Thống kê tổng điều chỉnh</span>
        {(side || partnerGroupId) && (
          <button type="button" className="text-primary/80 hover:text-primary" onClick={onClear}>
            Xóa lọc
          </button>
        )}
      </div>

      <Radio
        checked={side === DebtSide.RECEIVABLE && !partnerGroupId}
        onChange={() => onSelectSide?.(DebtSide.RECEIVABLE)}
        className="m-0 gap-1 px-3 py-2 text-base font-semibold text-blue-500"
      >
        <div className="flex w-[262px] justify-between">
          <span>{debtSideMap[DebtSide.RECEIVABLE]}</span>
          <span>{formatMoney(summary?.totalReceivable) || 0}</span>
        </div>
      </Radio>
      <FilterCard
        items={receivableItems}
        side={DebtSide.RECEIVABLE}
        selectedGroupId={side === DebtSide.RECEIVABLE ? partnerGroupId : undefined}
        onSelect={onSelectGroup}
      />

      <Divider plain className="!my-2 !ml-7 !min-w-0 !text-xs !text-secondary" />

      <Radio
        checked={side === DebtSide.PAYABLE && !partnerGroupId}
        onChange={() => onSelectSide?.(DebtSide.PAYABLE)}
        className="m-0 gap-1 px-3 py-2 text-base font-semibold text-orange-500"
      >
        <div className="flex w-[262px] justify-between">
          <span>{debtSideMap[DebtSide.PAYABLE]}</span>
          <span>{formatMoney(summary?.totalPayable) || 0}</span>
        </div>
      </Radio>
      <FilterCard
        items={payableItems}
        side={DebtSide.PAYABLE}
        selectedGroupId={side === DebtSide.PAYABLE ? partnerGroupId : undefined}
        onSelect={onSelectGroup}
      />
    </div>
  );
};
