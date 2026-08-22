import { createBaseStore } from "@/shared/base/createBaseStore";
import { JobPosition, JobPositionQuery } from "./jobPosition.model";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";

export const useJobPositionStore = createBaseStore<JobPosition, JobPositionQuery>({
  key: "jobPositions",
  apiUrl: apiEndpoint.jobPosition.base,
  permissionModule: "jobPosition",
});
