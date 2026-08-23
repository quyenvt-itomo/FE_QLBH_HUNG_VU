import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { IncomeExpense, IncomeExpenseQuery } from "./incomeExpense.model";

const createIncomeExpenseStore = (key: string, apiUrl: string, permissionModule: "income" | "expense") => createBaseStore<IncomeExpense, IncomeExpenseQuery>({ key, apiUrl, permissionModule });
export const useIncomeStore = createIncomeExpenseStore("incomes", apiEndpoint.incomeExpense.income, "income");
export const useExpenseStore = createIncomeExpenseStore("expenses", apiEndpoint.incomeExpense.expense, "expense");
export const useIncomeExpenseStore = useIncomeStore;
