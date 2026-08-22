import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Notification, notificationQuery } from "./notification.model";

export const useNotificationStore = createBaseStore<Notification, notificationQuery>({
  key: "notifications",
  apiUrl: apiEndpoint.notification.base,
});
