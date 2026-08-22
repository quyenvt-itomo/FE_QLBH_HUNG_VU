import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { IncomeExpense, IncomeExpenseQuery } from "./incomeExpense.model";

export const useIncomeExpenseStore = createBaseStore<IncomeExpense, IncomeExpenseQuery>({
  key: "incomeExpenses",
  apiUrl: apiEndpoint.incomeExpense.base,
  permissionModule: "incomeExpense",
});
