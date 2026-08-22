import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormatData } from "@/shared/interfaces/format";
import { PermissionStructure } from "@/shared/constants/permission";
import { Filter, ThemeMode } from "@/shared/interfaces/common";
import { UserInfo } from "../interfaces/auth";
import { Organization } from "@/modules/organization";

export interface GlobalState {
  horizontal: boolean;
  collapsed: boolean;
  isMobile: boolean;
  drawerOpen: boolean;
  info: UserInfo | null;
  format: FormatData | null;
  permissions: PermissionStructure | null;
  totalUnread: number;
  customTitle: string | null;
  themeMode: ThemeMode;
  filter: Filter;
  currentCompany?: Organization | null;
}

const getDefaultTheme = (): ThemeMode => {
  const saved = localStorage.getItem("themeMode") as ThemeMode | null;
  if (saved) return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getDefaultCollapsed = (): boolean => {
  const saved = localStorage.getItem("collapsed");
  if (saved) return saved === "true";

  return false;
};

export const getInitialCurrentCompany = (): Organization | undefined => {
  const saved = localStorage.getItem("currentCompany");
  if (saved) {
    try {
      return JSON.parse(saved) as Organization;
    } catch (error) {
      console.error("Failed to parse currentCompany from localStorage:", error);
      return undefined;
    }
  }
};

const initialState: GlobalState = {
  // horizontal: localStorage.getItem("layout") !== "vertical",
  horizontal: false,
  collapsed: getDefaultCollapsed(),
  isMobile:
    typeof navigator !== "undefined" ? /Mobi|Android|iPhone/i.test(navigator.userAgent) : false,
  drawerOpen: false,
  info: null,
  format: null,
  permissions: null,
  totalUnread: 0,
  customTitle: null,
  // themeMode: getDefaultTheme(),
  themeMode: "light",
  filter: {},
  currentCompany: getInitialCurrentCompany(),
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearState: (state) => {
      state.info = null;
      state.permissions = null;
      state.currentCompany = null;
      state.totalUnread = 0;
      state.customTitle = null;
      state.filter = {};
    },

    setHorizontal: (state, action: PayloadAction<boolean>) => {
      state.horizontal = action.payload;
      localStorage.setItem("layout", action.payload ? "horizontal" : "vertical");
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
      localStorage.setItem("collapsed", action.payload ? "true" : "false");
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    setInfo: (state, action: PayloadAction<UserInfo | null | undefined>) => {
      state.info = action.payload || null;
      state.permissions = action.payload?.permissions || null;
      state.currentCompany = action.payload?.currentCompany || null;
      if (action.payload?.currentCompany) {
        localStorage.setItem("currentCompany", JSON.stringify(action.payload.currentCompany));
      }
    },
    setFormat: (state, action: PayloadAction<FormatData>) => {
      state.format = action.payload;
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
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      localStorage.setItem("themeMode", action.payload);
    },
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
    setCurrentCompany: (state, action: PayloadAction<Organization | null | undefined>) => {
      state.currentCompany = action.payload;
    },
  },
});

export const {
  clearState,
  setHorizontal,
  setCollapsed,
  setIsMobile,
  setDrawerOpen,
  setInfo,
  setFormat,
  setPermissions,
  setTotalUnread,
  setCustomTitle,
  setThemeMode,
  setFilter,
  setCurrentCompany,
} = clientSlice.actions;

export default clientSlice.reducer;
