export enum WorkingStatusEnum {
  WORKING = "working", // đang làm việc
  ON_LEAVE = "on_leave", // đang nghỉ phép
}
export const workingStatusMap: Record<WorkingStatusEnum, string> = {
  [WorkingStatusEnum.WORKING]: "Đang làm việc",
  [WorkingStatusEnum.ON_LEAVE]: "Đang nghỉ phép",
};

export enum EmployeeStatus {
  WORKING = "working", // đang làm việc
  RESIGNED = "resigned", // đã nghỉ việc
  RETIRED = "retired", // đã nghỉ hưu
  ON_LEAVE = "on_leave", // đang nghỉ phép
  PROBATION = "probation", // thử việc
  INTERN = "intern", // thực tập
  FREELANCE = "freelance", // tự do
}
export const employeeStatusMap: Record<EmployeeStatus, string> = {
  [EmployeeStatus.WORKING]: "Đang làm việc",
  [EmployeeStatus.RESIGNED]: "Đã nghỉ việc",
  [EmployeeStatus.RETIRED]: "Đã nghỉ hưu",
  [EmployeeStatus.ON_LEAVE]: "Đang nghỉ phép",
  [EmployeeStatus.PROBATION]: "Thử việc",
  [EmployeeStatus.INTERN]: "Thực tập",
  [EmployeeStatus.FREELANCE]: "Tự do",
};

export enum EmployeeContractTypeEnum {
  OFFICIAL = "official", // chính thức
  PROBATION = "probation", // thử việc
  INTERN = "intern", // thực tập
  FREELANCE = "freelance", // tự do
}
export const employeeContractTypeMap: Record<EmployeeContractTypeEnum, string> = {
  [EmployeeContractTypeEnum.OFFICIAL]: "Chính thức",
  [EmployeeContractTypeEnum.PROBATION]: "Thử việc",
  [EmployeeContractTypeEnum.INTERN]: "Thực tập",
  [EmployeeContractTypeEnum.FREELANCE]: "Tự do",
};
export const employeeContractTypeOptions = Object.values(EmployeeContractTypeEnum).map((type) => ({
  label: employeeContractTypeMap[type],
  value: type,
}));
