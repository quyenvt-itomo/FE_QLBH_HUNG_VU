import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import {
  setCurrentStore,
  setCustomTitle,
  setFilter,
  setOpenShiftModal,
  setTotalUnread,
} from "../../stores/client/slice";
import { getInfo } from "../../stores/auth/slice";
import { IStore } from "../../models/store";
import { privateRoutesName } from "../../constants/routerName";

export const useClientData = () => {
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
    currentStore,
    filter,
    openShiftModal,
  } = useSelector((state: RootState) => state.Client, shallowEqual);

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

  const handleSetCurrentStore = (store: IStore | null, reload: boolean = false) => {
    dispatch(setCurrentStore(store));

    setTimeout(() => {
      // if (reload) {
      //   window.location.reload();
      // } else {
      //   window.location.href = privateRoutesName.dashboard;
      // }
      dispatch(getInfo());
    }, 100);
  };
  const handleGetInfo = () => {
    dispatch(getInfo());
  };

  const handleSetOpenShiftModal = (open: boolean) => {
    dispatch(setOpenShiftModal(open));
  };

  return {
    horizontal,
    collapsed,
    drawerOpen,
    format,
    info,
    isMobile,
    currentStore,
    permissions,
    totalUnreadNotifications: totalUnread,
    customTitle,
    filter,
    openShiftModal,
    handleSetTotalUnread,
    handleSetCustomTitle,
    handleSetFilter,
    handleClearFilter,
    handleSetCurrentStore,
    handleGetInfo,
    handleSetOpenShiftModal,
  };
};
