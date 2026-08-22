import * as saleReturnLineActions from "./slice";
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
} = saleReturnLineActions;

export const SaleReturnLineSaga = createBaseSaga<IOrderLine, OrderLineQuery>({
  name: "saleReturnLine",
  api: apiEndpoint.saleReturn.line,
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
