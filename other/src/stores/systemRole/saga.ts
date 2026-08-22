import * as SystemRoleActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { ISystemRole, SystemRoleQuery } from "../../models/systemRole";
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
} = SystemRoleActions;

function* updatePermissionItemSaga(): Generator {
  yield takeLatest(
    "systemRole/updatePermissionItem",
    function* (action: PayloadAction<ISystemRole>) {
      try {
        const response: ISystemRole = yield call(() =>
          putData(`${apiEndpoint.systemRole.base}/${action.payload.id}`, action.payload),
        );
        yield put(updatePermissionItemSuccess(response));
      } catch (error: any) {
        yield put(updatePermissionItemFailure(handleErrorMessage(error, "update", "systemRole")));
      }
    },
  );
}

export const SystemRoleSaga = createBaseSaga<ISystemRole, SystemRoleQuery>({
  name: "systemRole",
  api: apiEndpoint.systemRole.base,
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
