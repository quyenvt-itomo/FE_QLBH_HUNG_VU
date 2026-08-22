import * as RoleActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { IRole, RoleQuery } from "../../models/store/role";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { putData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";

const {
  getAllSuccess,
  getAllFailure,
  getItemSuccess,
  getItemFailure,
  addItemSuccess,
  addItemFailure,
  updateItemSuccess,
  updateItemFailure,

  updatePermissionItemSuccess,
  updatePermissionItemFailure,

  deleteItemSuccess,
  deleteItemFailure,
} = RoleActions;

function* updatePermissionItemSaga(): Generator {
  yield takeLatest("role/updatePermissionItem", function* (action: PayloadAction<IRole>) {
    try {
      const response: IRole = yield call(() =>
        putData(`${apiEndpoint.role.base}/${action.payload.id}`, action.payload),
      );
      yield put(updatePermissionItemSuccess(response));
    } catch (error: any) {
      yield put(updatePermissionItemFailure(handleErrorMessage(error, "update", "role")));
    }
  });
}

export const RoleSaga = createBaseSaga<IRole, RoleQuery>({
  name: "role",
  api: apiEndpoint.role.base,
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
  extraSagas: [updatePermissionItemSaga],
});
