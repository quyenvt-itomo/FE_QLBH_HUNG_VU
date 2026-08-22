import * as incomeExpenseActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { IIncomeExpense, IncomeExpenseQuery } from "../../models/store/incomeExpense";

const {
  getAllSuccess,
  getAllFailure,
  getItemSuccess,
  getItemFailure,
  addItemSuccess,
  addItemFailure,
  updateItemSuccess,
  updateItemFailure,
  deleteItemSuccess,
  deleteItemFailure,
} = incomeExpenseActions;

export const IncomeExpenseSaga = createBaseSaga<IIncomeExpense, IncomeExpenseQuery>({
  name: "incomeExpense",
  api: apiEndpoint.incomeExpense.base,
  actions: {
    getAllSuccess,
    getAllFailure,
    getItemSuccess,
    getItemFailure,
    addItemSuccess,
    addItemFailure,
    updateItemSuccess,
    updateItemFailure,
    deleteItemSuccess,
    deleteItemFailure,
  },
});
