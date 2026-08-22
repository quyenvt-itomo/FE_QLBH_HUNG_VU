import * as saleActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { IOrder, OrderQuery } from "../../models/store/order";

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
} = saleActions;

export const SaleSaga = createBaseSaga<IOrder, OrderQuery>({
  name: "sale",
  api: apiEndpoint.sale.base,
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
