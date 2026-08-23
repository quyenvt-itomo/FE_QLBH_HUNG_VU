import { User } from "./user.model";

export const generateRoleContent = (user?: User | null): string => {
  if (!user) return "";

  return user.role?.name || "";
};
