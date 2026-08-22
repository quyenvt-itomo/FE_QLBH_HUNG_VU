import { createBaseStore } from "@/shared/base/createBaseStore";
import { Employee, EmployeeQuery } from "./employee.model";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";

export const useEmployeeStore = createBaseStore<Employee, EmployeeQuery>({
  key: "employees",
  apiUrl: apiEndpoint.employee.base,
  permissionModule: "employee",
});
