import * as storeTransferLineActions from "./slice";
import { apiEndpoint } from "../../../constants/ApiEndpoint";
import { createBaseSaga } from "../../createBaseSaga";
import { IStoreTransferLine, StoreTransferLineQuery } from "../../../models/storeTransferLine";

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
} = storeTransferLineActions;

export const StoreTransferLineSaga = createBaseSaga<IStoreTransferLine, StoreTransferLineQuery>({
  name: "storeTransferLine",
  api: apiEndpoint.storeTransfer.line,
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
