import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import UserImage from "@/shared/components/image/UserImage";
import { Employee } from "../employee.model";
import { getMainFile } from "@/shared/utils/file.util";
import { genderMap, maritalStatusMap } from "@/shared/constants/enum";
import { formatDateDDMMYYYY } from "@/shared/utils/date.util";
import { getFullAddress } from "@/shared/utils/common.util";
import { employeeContractTypeMap, employeeStatusMap, workingStatusMap } from "../employee.enum";

const EMPTY_TEXT = "--";

const formatText = (value?: string | null) => (value ? value : EMPTY_TEXT);

const formatDateValue = (value?: string | Date | null) => {
  if (!value) return EMPTY_TEXT;
  return formatDateDDMMYYYY(String(value)) || EMPTY_TEXT;
};

const formatMoneyValue = (value?: number | null) => {
  if (value === null || value === undefined) return EMPTY_TEXT;
  return Number(value).toLocaleString("vi-VN");
};

const formatIdentification = (record: Employee) => {
  const identification = record.identification;
  if (!identification) return EMPTY_TEXT;

  const type = formatText(identification.type);
  const identityCode = formatText(identification.identityCode);
  const issuedDate = formatDateValue(identification.issuedDate);
  const issuedPlace = formatText(identification.issuedPlace);

  return `${type} | ${identityCode} | ${issuedDate} | ${issuedPlace}`;
};

const formatEducation = (record: Employee) => {
  const education = record.education;
  if (!education) return EMPTY_TEXT;

  const parts = [
    education.educationLevel,
    education.trainingLevel,
    education.institution,
    education.faculty,
    education.major,
  ].filter(Boolean);

  return parts.length ? parts.join(" | ") : EMPTY_TEXT;
};

const formatEmergencyContact = (record: Employee) => {
  const emergencyContact = record.emergencyContact;
  if (!emergencyContact) return EMPTY_TEXT;

  const parts = [
    emergencyContact.name,
    emergencyContact.relationship,
    emergencyContact.phone,
  ].filter(Boolean);

  return parts.length ? parts.join(" | ") : EMPTY_TEXT;
};

const formatCurrentContract = (record: Employee) => {
  const contracts = record.contracts || [];
  if (!contracts.length) return EMPTY_TEXT;

  const latestContract = [...contracts].sort((a, b) => {
    const firstTime = a.startDate ? new Date(a.startDate).getTime() : 0;
    const secondTime = b.startDate ? new Date(b.startDate).getTime() : 0;
    return secondTime - firstTime;
  })[0];

  const type = latestContract?.type ? employeeContractTypeMap[latestContract.type] : EMPTY_TEXT;
  const number = formatText(latestContract?.contractNumber);
  const startDate = formatDateValue(latestContract?.startDate);
  const endDate = formatDateValue(latestContract?.endDate);

  return `${type} | ${number} | ${startDate} - ${endDate}`;
};

const formatCompensationSummary = (items?: Employee["allowances"] | Employee["deductions"]) => {
  if (!items || !items.length) return EMPTY_TEXT;

  const total = items.reduce((sum, item) => sum + (item?.amount || 0), 0);
  const names = items
    .map((item) => item?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  return `${items.length} khoản | ${names || "Không tên"} | Tổng: ${formatMoneyValue(total)}`;
};

const formatBankAccount = (record: Employee) => {
  const bankAccount = record.bankAccount;
  if (!bankAccount) return EMPTY_TEXT;

  const parts = [bankAccount.bankName, bankAccount.accountNumber, bankAccount.accountHolder].filter(
    Boolean,
  );

  return parts.length ? parts.join(" | ") : EMPTY_TEXT;
};

const formatInsurance = (record: Employee) => {
  const insurance = record.insuranceInfo as any;
  if (!insurance) return EMPTY_TEXT;

  const insuranceNumber = insurance.insuranceNumber || insurance.insurance_number;
  const salary = formatMoneyValue(insurance.salary);
  const rate =
    insurance.rate !== undefined && insurance.rate !== null ? `${insurance.rate}%` : EMPTY_TEXT;
  const startDate = formatDateValue(insurance.startDate);

  return [formatText(insuranceNumber), salary, rate, startDate].join(" | ");
};

export const EmployeeTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const columns: any = [
    {
      title: "Mã nhân sự",
      dataIndex: "code",
      key: "code",
      className: "code-column",
      width: 120,
    },
    {
      title: "Tên nhân sự",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name: string, record: Employee) => (
        <div className="flex items-center gap-2">
          <UserImage image={getMainFile(record.avatar)} size={24} />
          <div className="flex flex-col">
            <span title={name} className="w-40 truncate">
              {name}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      align: "center",
      render: (phone: string) => formatText(phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (email: string) => formatText(email),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center",
      render: (gender: Employee["gender"]) => (gender ? genderMap[gender] : ""),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 120,
      align: "center",
      render: (dob: string) => formatDateValue(dob),
    },
    {
      title: "Tình trạng hôn nhân",
      dataIndex: "maritalStatus",
      key: "maritalStatus",
      width: 150,
      render: (status: Employee["maritalStatus"]) =>
        status ? maritalStatusMap[status] : EMPTY_TEXT,
    },
    {
      title: "Dân tộc",
      dataIndex: "ethnicity",
      key: "ethnicity",
      width: 140,
      render: (value: string) => formatText(value),
    },
    {
      title: "Tôn giáo",
      dataIndex: "religion",
      key: "religion",
      width: 140,
      render: (value: string) => formatText(value),
    },
    {
      title: "Mã số thuế",
      dataIndex: "taxCode",
      key: "taxCode",
      width: 160,
      render: (value: string) => formatText(value),
    },
    {
      title: "Thông tin định danh",
      key: "identification",
      width: 320,
      render: (_: any, record: Employee) => formatIdentification(record),
    },
    {
      title: "Trình độ - Bằng cấp",
      key: "education",
      width: 280,
      render: (_: any, record: Employee) => formatEducation(record),
    },
    {
      title: "Địa chỉ thường trú",
      key: "permanentAddress",
      width: 260,
      render: (_: any, record: Employee) => formatText(getFullAddress(record.permanentAddress)),
    },
    {
      title: "Nơi ở hiện tại",
      key: "currentAddress",
      width: 260,
      render: (_: any, record: Employee) => formatText(getFullAddress(record.currentAddress)),
    },
    {
      title: "Liên hệ khẩn cấp",
      key: "emergencyContact",
      width: 240,
      render: (_: any, record: Employee) => formatEmergencyContact(record),
    },

    {
      title: "Đơn vị công tác",
      dataIndex: ["workingOrganization", "name"],
      key: "workingOrganizationName",
      width: 150,
      render: (value: string) => formatText(value),
    },
    {
      title: "Vị trí công việc",
      dataIndex: ["jobPosition", "name"],
      key: "jobPositionName",
      width: 200,
      render: (value: string) => formatText(value),
    },
    {
      title: "Lương cơ bản",
      dataIndex: "baseSalary",
      key: "baseSalary",
      width: 140,
      align: "right",
      render: (value: number) => formatMoneyValue(value),
    },
    {
      title: "Trạng thái làm việc",
      dataIndex: "workingStatus",
      key: "workingStatus",
      width: 150,
      render: (value: Employee["workingStatus"]) => (value ? workingStatusMap[value] : EMPTY_TEXT),
    },
    {
      title: "Trạng thái nhân sự",
      dataIndex: "employeeStatus",
      key: "employeeStatus",
      width: 150,
      render: (value: Employee["employeeStatus"]) =>
        value ? employeeStatusMap[value] : EMPTY_TEXT,
    },
    {
      title: "Ngày thử việc",
      dataIndex: "trialDate",
      key: "trialDate",
      width: 120,
      align: "center",
      render: (value: string) => formatDateValue(value),
    },
    {
      title: "Ngày chính thức",
      dataIndex: "officialDate",
      key: "officialDate",
      width: 120,
      align: "center",
      render: (value: string) => formatDateValue(value),
    },
    {
      title: "Hợp đồng hiện tại",
      key: "contracts",
      width: 320,
      render: (_: any, record: Employee) => formatCurrentContract(record),
    },
    {
      title: "Phụ cấp",
      key: "allowances",
      width: 300,
      render: (_: any, record: Employee) => formatCompensationSummary(record.allowances),
    },
    {
      title: "Khấu trừ",
      key: "deductions",
      width: 300,
      render: (_: any, record: Employee) => formatCompensationSummary(record.deductions),
    },
    {
      title: "Tài khoản ngân hàng",
      key: "bankAccount",
      width: 300,
      render: (_: any, record: Employee) => formatBankAccount(record),
    },
    {
      title: "Thông tin BHXH",
      key: "insuranceInfo",
      width: 280,
      render: (_: any, record: Employee) => formatInsurance(record),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      align: "center",
      render: (value: string) => formatDateValue(value),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 220,
      render: (value: string) => formatText(value),
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      itemName={"nhân sự"}
      tableKey={"employee-table"}
      {...rest}
    />
  );
};
