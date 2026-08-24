import { createBaseStore } from "@/shared/base/createBaseStore";
import { User, UserQuery } from "./user.model";
import { postData, putData } from "@/shared/api/apiClient";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";

export const useUserStore = createBaseStore<
  User,
  UserQuery,
  {
    banUser?: (id: string) => void;
    assignStoreUser?: (
      id: string,
      data: { roleId?: string | null; employeeId?: string | null },
    ) => Promise<void>;
  }
>({
  key: "users",
  apiUrl: apiEndpoint.user.base,
  permissionModule: "user",
  extend: () => ({
    banUser: async (id: string) => {
      await postData(`/users/${id}/ban`, {});
    },
    assignStoreUser: async (
      id: string,
      data: { roleId?: string | null; employeeId?: string | null },
    ) => {
      await putData(`${apiEndpoint.user.base}/${id}/assign-company`, data);
    },
  }),
});
