import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  BaseFailurePayload,
  BaseState,
  createBaseInitialState,
  createBaseReducers,
} from "../baseReducers";
import {
  NotificationData,
  NotificationQuery,
  NotificationResponse,
} from "../../models/base/notification";
import { TypeMessage } from "../../constants/enum";

export interface NotifyState extends BaseState<NotificationData> {
  totalUnread: number;
}

const initialState: NotifyState = {
  ...createBaseInitialState<NotificationData>(),
  totalUnread: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearMessage: (state: BaseState) => {
      state.message = { type: TypeMessage.none };
    },

    getNotification(state, action: PayloadAction<NotificationQuery>) {
      state.loading = true;
    },
    getNotificationSuccess(state, action: PayloadAction<NotificationResponse>) {
      state.data = action.payload.data;
      state.totalUnread = action.payload.summary?.totalUnread || 0;
      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    getNotificationFailure(state, action: PayloadAction<BaseFailurePayload>) {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    seenNotification(
      state,
      action: PayloadAction<{
        ids: string[];
      }>,
    ) {},
    seenNotificationSuccess(
      state,
      action: PayloadAction<NotificationResponse>,
    ) {
      state.isCheckUpdate = true;
    },
    seenNotificationFailure(state, action: PayloadAction<BaseFailurePayload>) {
      state.isCheckUpdate = false;
    },

    seenAllNotification(state, action: PayloadAction<any>) {},
    seenAllNotificationSuccess(
      state,
      action: PayloadAction<NotificationResponse>,
    ) {
      state.isCheckUpdate = true;
    },
    seenAllNotificationFailure(
      state,
      action: PayloadAction<BaseFailurePayload>,
    ) {
      state.isCheckUpdate = false;
    },

    resetIsCheckUpdate(state) {
      state.isCheckUpdate = false;
    },
  },
});

export const {
  clearMessage,

  getNotification,
  getNotificationSuccess,
  getNotificationFailure,

  seenNotification,
  seenNotificationFailure,
  seenNotificationSuccess,

  seenAllNotification,
  seenAllNotificationFailure,
  seenAllNotificationSuccess,

  resetIsCheckUpdate,
} = notificationSlice.actions;
export default notificationSlice.reducer;
