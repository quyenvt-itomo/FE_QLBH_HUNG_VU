import { Divider, Radio } from "antd";
import { FilterItem, SummaryData } from "@/shared/interfaces/api";
import { formatMoney } from "@/shared/utils/number.util";
import { AttributeType } from "@/modules/attribute/attribute.enum";
import { IncomeExpenseType } from "../incomeExpense.model";
import { FilterCard } from "./FilterCard";

interface IncomeExpenseFilterProps {
  filterType?: IncomeExpenseType;
  categoryId?: string;
  summary?: SummaryData | null;
  filterItems: FilterItem[];
  setCategoryId?: (id: string | undefined) => void;
  setFilterType?: (type: IncomeExpenseType | undefined) => void;
}

export const Filter: React.FC<IncomeExpenseFilterProps> = ({
  filterType,
  categoryId,
  summary,
  filterItems,
  setCategoryId,
  setFilterType,
}) => {
  const incomeItems = filterItems.filter(
    (item) => item.type === AttributeType.INCOME_CATEGORY && item.value > 0,
  );
  const expenseItems = filterItems.filter(
    (item) => item.type === AttributeType.EXPENSE_CATEGORY && item.value > 0,
  );
  const clearCategoryFilter = () => {
    setCategoryId?.(undefined);
    setFilterType?.(undefined);
  };
  const selectType = (type: IncomeExpenseType) => {
    setFilterType?.(type);
    setCategoryId?.(undefined);
  };
  const selectCategory = (id: string) => {
    setCategoryId?.(id);
    setFilterType?.(undefined);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto rounded-lg border bg-panel px-3 py-2 scrollbar-hide">
      <div className="flex items-center justify-between px-1 pb-3">
        <span className="text-base font-semibold">Thống kê theo hạng mục</span>
        {(filterType || categoryId) && (
          <button
            type="button"
            className="text-primary/80 transition-all hover:text-primary"
            onClick={clearCategoryFilter}
          >
            Xóa lọc
          </button>
        )}
      </div>

      <Radio
        checked={filterType === IncomeExpenseType.INCOME && !categoryId}
        onChange={() => selectType(IncomeExpenseType.INCOME)}
        className="m-0 gap-1 px-3 py-2 text-base font-semibold text-blue-500"
      >
        <div className="flex w-[262px] justify-between">
          <span>Tổng thu</span>
          <span>{formatMoney(summary?.totalIncome) || 0}</span>
        </div>
      </Radio>
      <FilterCard items={incomeItems} selectedId={categoryId} onSelect={selectCategory} />

      <Divider plain className="!my-2 !ml-7 !min-w-0 !text-xs !text-secondary" />

      <Radio
        checked={filterType === IncomeExpenseType.EXPENSE && !categoryId}
        onChange={() => selectType(IncomeExpenseType.EXPENSE)}
        className="m-0 gap-1 px-3 py-2 text-base font-semibold text-red-500"
      >
        <div className="flex w-[262px] justify-between">
          <span>Tổng chi</span>
          <span>{formatMoney(summary?.totalExpense) || 0}</span>
        </div>
      </Radio>
      <FilterCard items={expenseItems} selectedId={categoryId} onSelect={selectCategory} />
    </div>
  );
};
