import { NotificationTypeEnum } from "./enum";
import { privateRoutesName } from "./routerName";

const { dashboard } = privateRoutesName;

type RouteMap = {
  [key in NotificationTypeEnum]?: string;
};
export const notificationRouteMap: RouteMap = {};
