import * as vatAdjustmentActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { IVatAdjustment, VatAdjustmentQuery } from "../../models/store/vatAdjustment";

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
} = vatAdjustmentActions;

export const VatAdjustmentSaga = createBaseSaga<IVatAdjustment, VatAdjustmentQuery>({
  name: "vatAdjustment",
  api: apiEndpoint.vat.adjustment,
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
