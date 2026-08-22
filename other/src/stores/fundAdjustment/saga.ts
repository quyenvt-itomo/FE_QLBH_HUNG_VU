import * as fundAdjustmentActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { IFundAdjustment, FundAdjustmentQuery } from "../../models/fundAdjustment";

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
} = fundAdjustmentActions;

export const FundAdjustmentSaga = createBaseSaga<IFundAdjustment, FundAdjustmentQuery>({
  name: "fundAdjustment",
  api: apiEndpoint.fundBalance.adjustment,
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
