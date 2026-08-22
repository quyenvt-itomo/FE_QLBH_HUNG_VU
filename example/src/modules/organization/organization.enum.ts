import { getOptionsByMap } from "@/shared/constants/enum";

export enum OrganizationTypeEnum {
  HEADQUARTER = "headquarter",
  COMPANY = "company",
  BRANCH = "branch",
  DEPARTMENT = "department",
  FACTORY = "factory",
  TEAM = "team",
}
export const organizationTypeMap: Record<OrganizationTypeEnum, string> = {
  [OrganizationTypeEnum.HEADQUARTER]: "Tổng công ty",
  [OrganizationTypeEnum.COMPANY]: "Công ty",
  [OrganizationTypeEnum.BRANCH]: "Chi nhánh",
  [OrganizationTypeEnum.DEPARTMENT]: "Phòng ban",
  [OrganizationTypeEnum.FACTORY]: "Xưởng sản xuất",
  [OrganizationTypeEnum.TEAM]: "Tổ sản xuất",
};
export const organizationTypeOptions = getOptionsByMap(organizationTypeMap);

export const companyTypes = [OrganizationTypeEnum.HEADQUARTER, OrganizationTypeEnum.COMPANY];
export const departmentTypes = [
  OrganizationTypeEnum.DEPARTMENT,
  OrganizationTypeEnum.FACTORY,
  OrganizationTypeEnum.BRANCH,
];

export const organizationTypeChildrenMap: Record<OrganizationTypeEnum, OrganizationTypeEnum[]> = {
  [OrganizationTypeEnum.HEADQUARTER]: [
    OrganizationTypeEnum.COMPANY,
    OrganizationTypeEnum.BRANCH,
    OrganizationTypeEnum.DEPARTMENT,
  ],

  [OrganizationTypeEnum.COMPANY]: [
    OrganizationTypeEnum.BRANCH,
    OrganizationTypeEnum.DEPARTMENT,
    OrganizationTypeEnum.FACTORY,
  ],

  [OrganizationTypeEnum.BRANCH]: [OrganizationTypeEnum.DEPARTMENT, OrganizationTypeEnum.FACTORY],

  [OrganizationTypeEnum.DEPARTMENT]: [OrganizationTypeEnum.TEAM],

  [OrganizationTypeEnum.FACTORY]: [OrganizationTypeEnum.TEAM],

  [OrganizationTypeEnum.TEAM]: [],
};
export const organizationTypeOptionByParent = (parentType?: OrganizationTypeEnum | null) => {
  const availableTypes = parentType
    ? (organizationTypeChildrenMap[parentType] ?? [])
    : [OrganizationTypeEnum.HEADQUARTER];
  const availableTypesMap: Partial<Record<OrganizationTypeEnum, string>> = {};
  for (const type of availableTypes) {
    availableTypesMap[type] = organizationTypeMap[type];
  }
  return getOptionsByMap(availableTypesMap);
};
