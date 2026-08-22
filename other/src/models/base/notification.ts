import {
  NotificationActionTypeEnum,
  NotificationTypeEnum,
} from "../../constants/enum";
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

export interface NotificationData {
  id: string;
  oid: string;
  projectid: string | null;
  title: string;
  content: string;
  type: NotificationTypeEnum;
  action?: NotificationActionTypeEnum | null;
  isRead: boolean;
  metadata: MetaData;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse extends ApiResponse {}
