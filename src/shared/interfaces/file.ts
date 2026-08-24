import { FileCategory, EntityType, FileType, FileStatus } from "@/shared/constants/enum";
import { Entity } from "@/shared/base/entity";

export interface FileMetadata {
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

export interface File extends Entity {
  storeId: string;
  fileName: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  type: FileType;
  entityType: EntityType;
  entityId: string;
  thumbnailUrl?: string | null;
  metadata: FileMetadata;
  category: FileCategory;
  isPublic: boolean;
  isMain: boolean;
  alt?: string | null;
  status: FileStatus;
  downloadCount: number;
  expiresAt?: string | null;
}
