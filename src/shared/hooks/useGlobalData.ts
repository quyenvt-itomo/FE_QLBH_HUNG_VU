import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/shared/stores";
import {
  setCollapsed,
  setDrawerOpen,
  setCustomTitle,
  setFilter,
  setHorizontal,
  setThemeMode,
  setTotalUnread,
  setInfo,
  setIsMobile,
  clearState,
  setCurrentCompany,
} from "@/shared/stores/global.slice";
import { ThemeMode } from "@/shared/interfaces/common";
import { UserInfo } from "../interfaces/auth";
import { Organization } from "@/modules/organization";
import { privateRoutesName } from "../constants/routerName";

export const useGlobalData = () => {
  const dispatch = useDispatch();
  const {
    horizontal,
    collapsed,
    drawerOpen,
    format,
    info,
    isMobile,
    permissions,
    totalUnread,
    customTitle,
    themeMode,
    filter,
    currentCompany,
  } = useSelector((state: RootState) => state.Global, shallowEqual);

  const handleSetIsMobile = (isMobile: boolean) => {
    dispatch(setIsMobile(isMobile));
  };

  const handleSetTotalUnread = (count: number) => {
    dispatch(setTotalUnread(count));
  };

  const handleSetCustomTitle = (title: string | null) => {
    dispatch(setCustomTitle(title));
  };

  const handleSetFilter = (filterData: typeof filter) => {
    dispatch(setFilter(filterData));
  };

  const handleClearFilter = () => {
    dispatch(setFilter({}));
  };

  const handleSetInfo = (data?: UserInfo | null) => {
    dispatch(setInfo(data));
  };
  const handleSetHorizontal = (isHorizontal: boolean) => {
    dispatch(setHorizontal(isHorizontal));
  };
  const handleSetCollapsed = (isCollapsed: boolean) => {
    dispatch(setCollapsed(isCollapsed));
  };
  const handleSetDrawerOpen = (isOpen: boolean) => {
    dispatch(setDrawerOpen(isOpen));
  };
  const handleSetThemeMode = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
  };
  const handleSetCurrentCompany = (company?: Organization) => {
    if (company) localStorage.setItem("currentCompany", JSON.stringify(company));
    dispatch(setCurrentCompany(company));
    setTimeout(() => {
      window.location.href = privateRoutesName.dashboard;
    }, 500);
  };

  const handleClearState = () => {
    dispatch(clearState());
  };

  return {
    currentCompany,
    horizontal,
    collapsed,
    drawerOpen,
    format,
    info,
    isMobile,
    permissions,
    totalUnreadNotifications: totalUnread,
    customTitle,
    themeMode,
    filter,
    showBranch: false,
    filterBranch: null,
    handleSetIsMobile,
    handleSetTotalUnread,
    handleSetCustomTitle,
    handleSetFilter,
    handleClearFilter,
    handleSetInfo,
    handleSetHorizontal,
    handleSetCollapsed,
    handleSetThemeMode,
    handleSetDrawerOpen,
    handleSetCurrentCompany,
    handleClearState,
  };
};
