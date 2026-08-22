import { Entity } from "@/shared/base/entity";
import { GenderEnum, MaritalStatusEnum } from "@/shared/constants/enum";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import {
  Address,
  BankAccount,
  Compensation,
  EducationInfo,
  Identification,
  InsuranceInfo,
  Representative,
} from "@/shared/interfaces/common";
import { File } from "@/shared/interfaces/file";
import { Organization } from "../organization";
import { JobPosition } from "../jobPosititon";
import { EmployeeContractTypeEnum, EmployeeStatus, WorkingStatusEnum } from "./employee.enum";

export interface EmployeeQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface EmployeeContract extends Entity {
  document: File[];
  employeeId: string;
  employee: Employee | null;
  contractNumber: string;
  type: EmployeeContractTypeEnum;
  salary: number;
  startDate: string | null;
  endDate: string | null;
}

export interface Employee extends Entity {
  // TODO: THÔNG TIN CÁ NHÂN
  code: string;
  name: string;
  avatar: File[];
  gender: GenderEnum | null;
  dob: string | null;
  maritalStatus: MaritalStatusEnum | null;
  ethnicity: string | null;
  religion: string | null;
  taxCode: string | null;

  // TODO: THÔNG TIN ĐỊNH DANH
  identification: Identification | null;

  // TODO: THÔNG TIN HỌC VẤN, BẰNG CẤP, CHỨNG CHỈ
  education: EducationInfo | null;

  // TODO: THÔNG TIN LIÊN HỆ
  phone: string | null;
  email: string | null;

  // TODO: ĐỊA CHỈ
  permanentAddress: Address | null; // Địa chỉ thường trú
  currentAddress: Address | null; // Nơi ở hiện tại

  // TODO: THÔNG TIN LIÊN HỆ KHẨN CẤP
  emergencyContact: Representative | null;

  // TODO: THÔNG TIN CÔNG VIỆC
  workingOrganizationId: string | null;
  workingOrganization: Organization | null;

  jobPositionId: string | null;
  jobPosition: JobPosition | null;

  baseSalary: number | null;
  workingStatus: WorkingStatusEnum | null;
  employeeStatus: EmployeeStatus | null;
  trialDate: string | null;
  officialDate: string | null;

  // TODO: HỢP ĐỒNG LAO ĐỘNG
  contracts: EmployeeContract[];

  // TODO: CÁC KHOẢN PHỤ CẤP
  allowances: Compensation[] | null;

  // TODO: CÁC KHOẢN KHẤU TRỪ
  deductions: Compensation[] | null;

  // TODO: THÔNG TIN NGÂN HÀNG
  bankAccount: BankAccount | null;

  // TODO: THÔNG TIN BẢO HIỂM
  insuranceInfo: InsuranceInfo | null;
}

// ── Snapshot ──

export interface EmployeeSnapshot {
  id: string;
  code: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  positionId?: string | null;
}
