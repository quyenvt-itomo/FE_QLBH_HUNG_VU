import { createBaseStore } from "@/shared/base/createBaseStore";
import type { BaseStoreReturn } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PayloadWithSubId } from "@/shared/interfaces/api";
import { IncomeExpense, IncomeExpenseQuery, IncomeExpenseTypeEnum } from "./incomeExpense.model";

const createIncomeExpenseStore = (key: string, apiUrl: string) =>
  createBaseStore<IncomeExpense, IncomeExpenseQuery>({
    key,
    apiUrl,
    permissionModule: "incomeExpense",
  });

export const useIncomeStore = createIncomeExpenseStore(
  "incomes",
  apiEndpoint.incomeExpense.income,
);
export const useExpenseStore = createIncomeExpenseStore(
  "expenses",
  apiEndpoint.incomeExpense.expense,
);

type IncomeExpenseStore = BaseStoreReturn<IncomeExpense>;

const getStoreByType = (record?: Partial<IncomeExpense>) =>
  record?.type === IncomeExpenseTypeEnum.EXPENSE ? "expense" : "income";

/** Sổ quỹ hiển thị dữ liệu từ cả hai route `/income` và `/expense`. */
export const useIncomeExpenseStore = (
  params?: IncomeExpenseQuery,
  onSuccess?: () => void,
): IncomeExpenseStore => {
  const { type, ...query } = params || {};
  const income = useIncomeStore(query, onSuccess);
  const expense = useExpenseStore(query, onSuccess);
  const active = type === IncomeExpenseTypeEnum.EXPENSE ? expense : income;
  const data = type
    ? active.data
    : [...income.data, ...expense.data].sort((a, b) => {
        const left = new Date(a.occurredAt).getTime();
        const right = new Date(b.occurredAt).getTime();
        return query.sortOrder === "ASC" ? left - right : right - left;
      }).slice(0, query.size || 20);

  const pagination = type
    ? active.pagination
    : income.pagination || expense.pagination
      ? {
          currentPage: query.page || 1,
          size: query.size || 20,
          totalRecords:
            (income.pagination?.totalRecords || 0) +
            (expense.pagination?.totalRecords || 0),
          totalPages: Math.max(
            income.pagination?.totalPages || 0,
            expense.pagination?.totalPages || 0,
          ),
        }
      : undefined;

  const create = (data: Partial<IncomeExpense>, opts?: { onSuccess?: () => void }) =>
    (getStoreByType(data) === "expense" ? expense.create : income.create)?.(data, opts);
  const update = (data: Partial<IncomeExpense>, opts?: { onSuccess?: () => void }) =>
    (getStoreByType(data) === "expense" ? expense.update : income.update)?.(data, opts);
  const remove = (
    payload: string | (PayloadWithSubId & { type?: IncomeExpenseTypeEnum }),
    opts?: { onSuccess?: () => void },
  ) => {
    const source =
      (typeof payload === "object" ? payload.type : type) === IncomeExpenseTypeEnum.EXPENSE
        ? expense
        : income;
    const requestPayload = typeof payload === "object" ? payload.id : payload;
    source.remove?.(requestPayload, opts);
  };

  return {
    ...active,
    data,
    loading: income.loading || expense.loading,
    fetching: income.fetching || expense.fetching,
    creating: income.creating || expense.creating,
    updating: income.updating || expense.updating,
    deleting: income.deleting || expense.deleting,
    errors: [...income.errors, ...expense.errors],
    filterItems: [...income.filterItems, ...expense.filterItems],
    pagination,
    create,
    update,
    remove,
  };
};
