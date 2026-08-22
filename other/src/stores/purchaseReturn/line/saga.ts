import * as purchaseReturnLineActions from "./slice";
import { apiEndpoint } from "../../../constants/ApiEndpoint";
import { createBaseSaga } from "../../createBaseSaga";
import { IOrderLine, OrderLineQuery } from "../../../models/store/orderLine";

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
} = purchaseReturnLineActions;

export const PurchaseReturnLineSaga = createBaseSaga<IOrderLine, OrderLineQuery>({
  name: "purchaseReturnLine",
  api: apiEndpoint.purchaseReturn.line,
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
