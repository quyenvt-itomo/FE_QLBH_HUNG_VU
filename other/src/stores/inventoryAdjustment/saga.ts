import * as inventoryAdjustmentActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import {
  IInventoryAdjustment,
  InventoryAdjustmentQuery,
} from "../../models/store/inventoryAdjustment";

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
} = inventoryAdjustmentActions;

export const InventoryAdjustmentSaga = createBaseSaga<
  IInventoryAdjustment,
  InventoryAdjustmentQuery
>({
  name: "inventoryAdjustment",
  api: apiEndpoint.inventoryAdjustment.base,
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
