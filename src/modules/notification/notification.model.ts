import { EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { ActionType, NotificationType } from "@/shared/constants/enum";

export interface notificationQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface Notification extends EntityWithStore {
  userId: string;
  type: NotificationType;
  action: ActionType | null;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: Date | null;
  entityType?: string | null;
  entityId?: string | null;
}
