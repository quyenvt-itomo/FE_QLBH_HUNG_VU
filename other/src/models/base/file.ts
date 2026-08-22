import { FileCategoryEnum, FileEntityEnum } from "../../constants/enum";
import { IEntity } from "./entity";

export interface IFileMetadata {
  extension: string;
  dimensions?: {
    width: number;
    height: number;
  };
  thumbnailDimensions?: {
    width: number;
    height: number;
  };
}

export type FileStatus = "pending" | "active" | "deleted";
export type FileType = "image" | "video" | "audio" | "document" | "other";

export interface IFile extends IEntity {
  storeId: string;
  fileName: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  type: FileType;
  entityType: FileEntityEnum;
  entityId: string;
  thumbnailUrl?: string | null;
  metadata: IFileMetadata;
  category: FileCategoryEnum;
  isPublic: boolean;
  isMain: boolean;
  alt?: string | null;
  status: FileStatus;
  downloadCount: number;
  expiresAt?: string | null;
}
