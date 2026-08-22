import * as inventoryAdjustmentLineActions from "./slice";
import { apiEndpoint } from "../../../constants/ApiEndpoint";
import { createBaseSaga } from "../../createBaseSaga";
import {
  IInventoryAdjustmentLine,
  InventoryAdjustmentLineQuery,
} from "../../../models/store/inventoryAdjustmentLine";

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
} = inventoryAdjustmentLineActions;

export const InventoryAdjustmentLineSaga = createBaseSaga<
  IInventoryAdjustmentLine,
  InventoryAdjustmentLineQuery
>({
  name: "inventoryAdjustmentLine",
  api: apiEndpoint.inventoryAdjustment.line,
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
