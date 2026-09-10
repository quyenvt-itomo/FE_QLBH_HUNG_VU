import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { IncomeExpense, IncomeExpenseQuery } from "./incomeExpense.model";

/** Một query duy nhất cho cả phiếu thu và phiếu chi. */
export const useIncomeExpenseStore = createBaseStore<IncomeExpense, IncomeExpenseQuery>({
  key: "income-expenses",
  apiUrl: apiEndpoint.incomeExpense.base,
  permissionModule: "incomeExpense",
});
