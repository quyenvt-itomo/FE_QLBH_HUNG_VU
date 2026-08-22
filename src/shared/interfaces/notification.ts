import { Entity } from "../base/entity";
import { ActionType, NotificationType } from "../constants/enum";
import { ApiRequestQuery, ApiResponse } from "./api";

export interface NotificationQuery extends ApiRequestQuery {
  productId?: number;
}

export type MetaData = {
  highlightValues?: string[];
  featureId?: number;
  projectId?: number;
  [key: string]: any;
};

export interface Notification extends Entity {
  // ============================== FIELDS ==============================
  userId: string; // FK - Người nhận thông báo

  type: NotificationType; // Loại thông báo

  action: ActionType | null;

  title: string; // Tiêu đề

  body: string; // Nội dung

  data?: Record<string, unknown> | null; // Dữ liệu kèm theo (entityType, entityId, ...)

  isRead: boolean; // Đã đọc?

  readAt?: Date | null; // Thời điểm đọc

  entityType?: string | null; // Loại đối tượng liên quan (WorkOrder, Machine, ...)

  entityId?: string | null; // ID đối tượng liên quan
}

export interface CreateCollectorNotificationPayload {
  title: string;
  content: string;
  collectorIds: string[];
}

export interface NotificationResponse extends ApiResponse {}
