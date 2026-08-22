import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BaseFailurePayload,
  BaseState,
  createBaseInitialState,
  createBaseReducers,
} from "../../baseReducers";
import { PRODUCT_OPTION_MESSAGES } from "../../../constants/message/product";
import {
  ChangeIndexData,
  ChangeOptionIndexPayload,
  CreateManyOptionDto,
  IProductOption,
  ProductPartialQuery,
  ProductResponse,
} from "../../../models/product";
import { PayloadWithSubId } from "../../../models/base/api";
import { TypeMessage } from "../../../constants/enum";

const initialState = createBaseInitialState<IProductOption>();

const productOptionSlice = createSlice({
  name: "productOption",
  initialState,
  reducers: {
    ...createBaseReducers<IProductOption, ProductPartialQuery, ProductResponse>(
      PRODUCT_OPTION_MESSAGES,
    ),

    addManyItem: (state: BaseState, action: PayloadAction<CreateManyOptionDto>) => {
      state.loading = true;
    },
    addManyItemSuccess: (state: BaseState, action: PayloadAction<ProductResponse>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.success,
        message: PRODUCT_OPTION_MESSAGES?.ADD,
      };
      state.isCheckAdd = true;
    },
    addManyItemFailure: (state: BaseState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
      state.isCheckAdd = false;
    },

    changeIndex: (state: BaseState, action: PayloadAction<ChangeOptionIndexPayload>) => {
      state.loading = true;
    },
    changeIndexSuccess: (state: BaseState, action: PayloadAction<ProductResponse>) => {
      state.loading = false;
      state.isCheckUpdate = true;
      state.message = {
        type: TypeMessage.success,
        message: PRODUCT_OPTION_MESSAGES.UPDATE,
      };
    },
    changeIndexFailure: (state: BaseState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    deleteItems: (state: BaseState, action: PayloadAction<PayloadWithSubId>) => {
      state.loading = true;
    },
    deleteItemsSuccess: (state: BaseState, action: PayloadAction<ProductResponse>) => {
      state.loading = false;
      state.newData = action.payload.data;
      state.message = {
        type: TypeMessage.success,
        message: PRODUCT_OPTION_MESSAGES.DELETE,
      };
      state.isCheckUpdate = true;
    },
    deleteItemsFailure: (state: BaseState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },
  },
});

export const {
  getAll,
  getAllSuccess,
  getAllFailure,
  getItem,
  getItemSuccess,
  getItemFailure,
  addItem,
  addItemSuccess,
  addItemFailure,
  addManyItem,
  addManyItemSuccess,
  addManyItemFailure,
  updateItem,
  updateItemSuccess,
  updateItemFailure,
  changeIndex,
  changeIndexSuccess,
  changeIndexFailure,
  deleteItem,
  deleteItemSuccess,
  deleteItemFailure,
  deleteItems,
  deleteItemsSuccess,
  deleteItemsFailure,
  clearMessage,
  reset,
  resetItem,
  resetNewData,
  resetErrors,
  resetDeletedId,
} = productOptionSlice.actions;

export default productOptionSlice.reducer;
