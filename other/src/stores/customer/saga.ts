import * as customerActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { IPartner, PartnerQuery } from "../../models/partner";

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
} = customerActions;

export const CustomerSaga = createBaseSaga<IPartner, PartnerQuery>({
  name: "customer",
  api: apiEndpoint.customer.base,
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
