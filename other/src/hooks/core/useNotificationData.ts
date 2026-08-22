import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import {
  getNotification,
  seenAllNotification,
  seenNotification,
} from "../../stores/notification/slice";
import { UseDataParams } from "../../models/base/interface";

export const useNotificationData = ({
  page,
  size,
  keyword,
  isLockHook,
  reload,
}: UseDataParams) => {
  const dispatch = useDispatch();
  const {
    data: notificationData,
    totalUnread,
    loading,
    pagination,
  } = useSelector((state: RootState) => state.Notification, shallowEqual);

  const fetchNotificationData = () => {
    if (isLockHook) return;
    dispatch(
      getNotification({
        page,
        size,
        keyword,
      }),
    );
  };

  const seenNotifications = (ids: string[]) => {
    dispatch(
      seenNotification({
        ids,
      }),
    );
  };

  const seenAllNotifications = () => {
    dispatch(seenAllNotification({}));
  };

  useEffect(() => {
    fetchNotificationData();
  }, [dispatch, page, size, keyword, isLockHook, reload]);

  return {
    notificationData,
    totalUnread,
    loading,
    pagination,
    seenNotifications,
    seenAllNotifications,
  };
};
