import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { IncomeExpense, IncomeExpenseQuery } from "./incomeExpense.model";

const createIncomeExpenseStore = (key: string, apiUrl: string) => createBaseStore<IncomeExpense, IncomeExpenseQuery>({ key, apiUrl, permissionModule: "incomeExpense" });
export const useIncomeStore = createIncomeExpenseStore("incomes", apiEndpoint.incomeExpense.income);
export const useExpenseStore = createIncomeExpenseStore("expenses", apiEndpoint.incomeExpense.expense);
export const useIncomeExpenseStore = useIncomeStore;
