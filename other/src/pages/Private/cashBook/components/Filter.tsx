import { Radio } from "antd";
import { AttributeTypeEnum, IncomeExpenseTypeEnum } from "../../../../constants/enum";
import { useIncomeExpenseData } from "../../../../hooks/useIncomeExpenseData";
import { formatMoney } from "../../../../utils/formatNumber";
import { FilterCard } from "./FilterCard";

interface IncomeExpenseProps {
  filterType?: IncomeExpenseTypeEnum;
  setFilterType?: (type: IncomeExpenseTypeEnum | undefined) => void;
  categoryId?: string;
  setCategoryId?: (id: string | undefined) => void;
  fundCategoryGroupId?: string;
  setFundCategoryGroupId?: (id: string | undefined) => void;
}

export const Filter: React.FC<IncomeExpenseProps> = ({
  filterType,
  categoryId,
  fundCategoryGroupId,
  setCategoryId,
  setFilterType,
  setFundCategoryGroupId,
}) => {
  const { summary, filterItems } = useIncomeExpenseData({
    isLockHook: true,
  });

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto scrollbar-hide bg-white border rounded-lg px-3 py-2">
      <div className="flex flex-col pb-3 z-10">
        <div className="flex w-full items-center justify-between px-1">
          <span className="text-base font-semibold">Thống kê theo hạng mục</span>

          {(filterType || categoryId || fundCategoryGroupId) && (
            <button
              className="text-primary/80 hover:text-primary transition-all ease-in-out"
              onClick={() => {
                setCategoryId?.(undefined);
                setFilterType?.(undefined);
                setFundCategoryGroupId?.(undefined);
              }}
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <Radio
          checked={filterType === IncomeExpenseTypeEnum.INCOME}
          onChange={(e) => {
            setFilterType?.(e.target.checked ? IncomeExpenseTypeEnum.INCOME : undefined);
            setCategoryId?.(undefined);
            setFundCategoryGroupId?.(undefined);
          }}
          className="text-base font-semibold !me-o px-3 py-2 gap-1 m-0 text-blue-500"
        >
          <div className="flex w-[262px] justify-between">
            <span>Tổng thu</span>
            <span>{formatMoney(summary?.totalIncome) || 0}</span>
          </div>
        </Radio>
        <FilterCard
          items={filterItems?.filter(
            (item) => item.type === AttributeTypeEnum.INCOME_CATEGORY && item.value > 0,
          )}
          selectedId={fundCategoryGroupId || categoryId}
          onSelect={(id, parentId) => {
            setFilterType?.(undefined);
            if (parentId) {
              setFundCategoryGroupId?.(undefined);
              setCategoryId?.(id);
            } else {
              setFundCategoryGroupId?.(id);
              setCategoryId?.(undefined);
            }
          }}
        />
      </div>

      <div className="flex flex-col mt-3 border-t">
        <Radio
          checked={filterType === IncomeExpenseTypeEnum.EXPENSE}
          onChange={(e) => {
            setFilterType?.(e.target.checked ? IncomeExpenseTypeEnum.EXPENSE : undefined);
            setCategoryId?.(undefined);
            setFundCategoryGroupId?.(undefined);
          }}
          className="text-base font-semibold !me-o px-3 py-2 gap-1 text-red-500"
        >
          <div className="flex w-[262px] justify-between">
            <span>Tổng chi</span>
            <span>{formatMoney(summary?.totalExpense) || 0}</span>
          </div>
        </Radio>
        <FilterCard
          items={filterItems?.filter(
            (item) => item.type === AttributeTypeEnum.EXPENSE_CATEGORY && item.value > 0,
          )}
          selectedId={fundCategoryGroupId || categoryId}
          onSelect={(id, parentId) => {
            setFilterType?.(undefined);
            if (parentId) {
              setFundCategoryGroupId?.(undefined);
              setCategoryId?.(id);
            } else {
              setFundCategoryGroupId?.(id);
              setCategoryId?.(undefined);
            }
          }}
        />
      </div>
    </div>
  );
};
