import * as debtAdjustmentActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { IDebtAdjustment, DebtAdjustmentQuery } from "../../models/store/debtAdjustment";

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
} = debtAdjustmentActions;

export const DebtAdjustmentSaga = createBaseSaga<IDebtAdjustment, DebtAdjustmentQuery>({
  name: "debtAdjustment",
  api: apiEndpoint.debt.adjustment,
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
