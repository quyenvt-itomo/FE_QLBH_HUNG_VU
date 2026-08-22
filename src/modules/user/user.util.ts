import { User } from "./user.model";

export const generateRoleContent = (user?: User | null): string => {
  if (!user) return "";

  return user.companyUsers.map((cu) => `${cu.role?.name} - ${cu.company?.name}`).join(", ");
};
