import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Attribute, AttributeSnapshot } from "../attribute";

export interface JobPositionQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface JobPosition extends Entity {
  name: string;
  level: string | null;

  jobTitleId: string | null;
  jobTitleSnapshot: AttributeSnapshot | null; // Chức danh
  jobTitle: Attribute | null;
}
