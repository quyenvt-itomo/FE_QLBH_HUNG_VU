import { useCallback } from "react";
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
  setCurrentStore,
} from "@/shared/stores/global.slice";
import { ThemeMode } from "@/shared/interfaces/common";
import { UserInfo } from "../interfaces/auth";
import { Store } from "@/shared/base/entity";
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
    currentStore,
  } = useSelector((state: RootState) => state.Global, shallowEqual);

  const handleSetIsMobile = useCallback(
    (isMobile: boolean) => {
      dispatch(setIsMobile(isMobile));
    },
    [dispatch],
  );

  const handleSetTotalUnread = useCallback(
    (count: number) => {
      dispatch(setTotalUnread(count));
    },
    [dispatch],
  );

  const handleSetCustomTitle = useCallback(
    (title: string | null) => {
      dispatch(setCustomTitle(title));
    },
    [dispatch],
  );

  const handleSetFilter = useCallback(
    (filterData: typeof filter) => {
      dispatch(setFilter(filterData));
    },
    [dispatch],
  );

  const handleClearFilter = useCallback(() => {
    dispatch(setFilter({}));
  }, [dispatch]);

  const handleSetInfo = useCallback(
    (data?: UserInfo | null) => {
      dispatch(setInfo(data));
    },
    [dispatch],
  );
  const handleSetHorizontal = useCallback(
    (isHorizontal: boolean) => {
      dispatch(setHorizontal(isHorizontal));
    },
    [dispatch],
  );
  const handleSetCollapsed = useCallback(
    (isCollapsed: boolean) => {
      dispatch(setCollapsed(isCollapsed));
    },
    [dispatch],
  );
  const handleSetDrawerOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setDrawerOpen(isOpen));
    },
    [dispatch],
  );
  const handleSetThemeMode = useCallback(
    (mode: ThemeMode) => {
      dispatch(setThemeMode(mode));
    },
    [dispatch],
  );
  const handleSetCurrentStore = useCallback(
    (company?: Store | null, reload: boolean = true) => {
      if (company) {
        sessionStorage.setItem("currentStore", JSON.stringify(company));
      } else {
        sessionStorage.removeItem("currentStore");
      }
      dispatch(setCurrentStore(company));

      if (reload) {
        setTimeout(() => {
          window.location.href = privateRoutesName.dashboard; // Chuyển hướng đến trang dashboard sau khi thay đổi cửa hàng
        }, 500);
      }
    },
    [dispatch],
  );

  const handleClearState = useCallback(() => {
    dispatch(clearState());
  }, [dispatch]);

  return {
    currentStore,
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
    handleSetCurrentStore,
    handleClearState,
  };
};
