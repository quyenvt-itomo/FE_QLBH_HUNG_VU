import { useNavigate } from "react-router-dom";
import { NotificationData } from "../../models/base/notification";
import { notificationRouteMap } from "../../constants/notificationRouteMap";
import { NotificationTypeEnum } from "../../constants/enum";
import { buildUrlWithId } from "../../utils/paramUtils";

export const useHandleNotification = () => {
  const navigate = useNavigate();

  const handleNotificationType = (item: NotificationData) => {
    const type = item.type;
    let url = notificationRouteMap[type];
    if (!url) return;

    navigate(url, {
      state: { notification: item },
    });
  };

  return { handleNotificationType };
};
