import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../../models/base/auth";
import { FormatData } from "../../models/base/format";
import { Filter } from "../../models/base/interface";
import { PermissionStructure } from "../../constants/permission";

export interface ClientState {
  horizontal: boolean;
  collapsed: boolean;
  isMobile: boolean;
  drawerOpen: boolean;
  info: UserInfo | null;
  format: FormatData | null;
  currentStore: UserInfo["currentStore"] | null;
  permissions: PermissionStructure | null;
  totalUnread: number;
  customTitle: string | null;

  filter: Filter;

  openShiftModal: boolean;
}

const initialState: ClientState = {
  horizontal: localStorage.getItem("layout") !== "vertical",
  collapsed: false,
  isMobile:
    typeof navigator !== "undefined" ? /Mobi|Android|iPhone/i.test(navigator.userAgent) : false,
  drawerOpen: false,
  info: null,
  format: null,
  currentStore: null,
  permissions: null,
  totalUnread: 0,
  customTitle: null,

  filter: {},

  openShiftModal: false,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setHorizontal: (state, action: PayloadAction<boolean>) => {
      state.horizontal = action.payload;
      localStorage.setItem("layout", action.payload ? "horizontal" : "vertical");
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    setInfo: (state, action: PayloadAction<UserInfo>) => {
      state.info = action.payload;
      if (action.payload?.currentStore) {
        state.currentStore = action.payload?.currentStore;
        sessionStorage.setItem("currentStoreCode", action.payload?.currentStore.code);
        state.permissions = action.payload?.permissions;
      } else {
        state.currentStore = null;
        sessionStorage.removeItem("currentStoreCode");
        state.permissions = action.payload?.systemPermissions || null;
      }
    },
    setFormat: (state, action: PayloadAction<FormatData>) => {
      state.format = action.payload;
    },
    setCurrentStore: (state, action: PayloadAction<UserInfo["currentStore"] | null>) => {
      state.currentStore = action.payload;
      if (action.payload) {
        sessionStorage.setItem("currentStoreCode", action.payload.code);
      } else {
        sessionStorage.removeItem("currentStoreCode");
      }
    },
    setPermissions: (state, action: PayloadAction<PermissionStructure | null>) => {
      state.permissions = action.payload;
    },
    setTotalUnread: (state, action: PayloadAction<number>) => {
      state.totalUnread = action.payload;
    },
    setCustomTitle: (state, action: PayloadAction<string | null>) => {
      state.customTitle = action.payload;
    },

    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },

    setOpenShiftModal: (state, action: PayloadAction<boolean>) => {
      state.openShiftModal = action.payload;
    },
  },
});

export const {
  setHorizontal,
  setCollapsed,
  setIsMobile,
  setDrawerOpen,
  setInfo,
  setFormat,
  setCurrentStore,
  setPermissions,
  setTotalUnread,
  setCustomTitle,
  setFilter,
  setOpenShiftModal,
} = clientSlice.actions;

export default clientSlice.reducer;
