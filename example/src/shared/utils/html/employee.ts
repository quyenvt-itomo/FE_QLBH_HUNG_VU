import { Employee } from "@/modules/employee/employee.model";
import {
  employeeContractTypeMap,
  employeeStatusMap,
  workingStatusMap,
} from "@/modules/employee/employee.enum";
import { genderMap, maritalStatusMap } from "@/shared/constants/enum";
import { formatDateDDMMYYYY } from "@/shared/utils/date.util";
import { getFullAddress } from "@/shared/utils/common.util";
import { formatMoney } from "@/shared/utils/number.util";

const EMPTY_TEXT = "--";

const formatText = (value?: string | null) => value || EMPTY_TEXT;

const formatDate = (value?: string | Date | null) => {
  if (!value) return EMPTY_TEXT;
  return formatDateDDMMYYYY(String(value)) || EMPTY_TEXT;
};

const formatMoneyValue = (value?: number | null) => formatMoney(value, null) || EMPTY_TEXT;

export const getEmployeeHtmlContent = (employee: Employee) => {
  const contracts = (employee.contracts || []).slice().sort((a, b) => {
    const firstTime = a.startDate ? new Date(a.startDate).getTime() : 0;
    const secondTime = b.startDate ? new Date(b.startDate).getTime() : 0;
    return secondTime - firstTime;
  });

  const contractRows = contracts.length
    ? contracts
        .map(
          (contract, index) => `
						<tr>
							<td class="text-center">${index + 1}</td>
							<td>${contract.type ? employeeContractTypeMap[contract.type] : EMPTY_TEXT}</td>
							<td>${formatText(contract.contractNumber)}</td>
							<td class="text-right">${formatMoneyValue(contract.salary)}</td>
							<td class="text-center">${formatDate(contract.startDate)}</td>
							<td class="text-center">${formatDate(contract.endDate)}</td>
						</tr>
					`,
        )
        .join("")
    : `<tr><td colspan="6" class="text-center">${EMPTY_TEXT}</td></tr>`;

  const renderPairs = (pairs: Array<{ label: string; value: string }>) =>
    pairs
      .map(
        (item) => `
			<div class="row">
				<div class="label">${item.label}</div>
				<div class="value">${item.value}</div>
			</div>
		`,
      )
      .join("");

  const htmlContent = `
<!doctype html>
<html lang="vi">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Hồ sơ nhân sự - ${formatText(employee.name)}</title>
		<style>
			@page {
				size: A4;
				margin: 12mm;
			}

			body {
				font-family: "Segoe UI", Arial, sans-serif;
				color: #111827;
				font-size: 12px;
				margin: 0;
			}

			.container {
				max-width: 190mm;
				margin: 0 auto;
			}

			.title {
				text-align: center;
				font-size: 20px;
				font-weight: 700;
				margin-bottom: 12px;
				text-transform: uppercase;
			}

			.section-title {
				margin-top: 14px;
				background: #f3f4f6;
				padding: 6px 8px;
				font-weight: 700;
			}

			.sub-title {
				margin-top: 10px;
				margin-bottom: 4px;
				font-weight: 600;
			}

			.grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 0 20px;
			}

			.row {
				display: grid;
				grid-template-columns: 130px 1fr;
				padding: 3px 0;
				border-bottom: 1px dashed #e5e7eb;
			}

			.label {
				color: #6b7280;
			}

			.value {
				font-weight: 500;
			}

			table {
				width: 100%;
				border-collapse: collapse;
			}

			th, td {
				border: 1px solid #d1d5db;
				padding: 6px;
			}

			th {
				background: #f9fafb;
				text-align: left;
			}

			.text-right {
				text-align: right;
			}

			.text-center {
				text-align: center;
			}
		</style>
		<script>
			window.onload = function () {
				setTimeout(function () {
					window.focus();
					window.print();
				}, 120);
			};
		</script>
	</head>
	<body>
		<div class="container">
			<div class="title">Hồ sơ nhân sự</div>

			<div class="section-title">Thông tin cơ bản</div>
			<div class="sub-title">Thông tin cá nhân</div>
			<div class="grid">
				<div>
					${renderPairs([
            { label: "Mã nhân sự", value: formatText(employee.code) },
            { label: "Tên nhân sự", value: formatText(employee.name) },
            {
              label: "Giới tính",
              value: employee.gender ? genderMap[employee.gender] : EMPTY_TEXT,
            },
            { label: "Ngày sinh", value: formatDate(employee.dob) },
          ])}
				</div>
				<div>
					${renderPairs([
            {
              label: "Tình trạng hôn nhân",
              value: employee.maritalStatus ? maritalStatusMap[employee.maritalStatus] : EMPTY_TEXT,
            },
            { label: "Dân tộc", value: formatText(employee.ethnicity) },
            { label: "Tôn giáo", value: formatText(employee.religion) },
            { label: "Mã số thuế", value: formatText(employee.taxCode) },
          ])}
				</div>
			</div>

			<div class="sub-title">CCCD/ Hộ chiếu</div>
			${renderPairs([
        { label: "Số giấy tờ", value: formatText(employee.identification?.identityCode) },
        { label: "Ngày cấp", value: formatDate(employee.identification?.issuedDate) },
        { label: "Nơi cấp", value: formatText(employee.identification?.issuedPlace) },
        { label: "Ngày hết hạn", value: formatDate(employee.identification?.expiredDate) },
      ])}

			<div class="section-title">Thông tin liên hệ</div>
			${renderPairs([
        { label: "Số điện thoại", value: formatText(employee.phone) },
        { label: "Email", value: formatText(employee.email) },
        {
          label: "Địa chỉ thường trú",
          value: formatText(getFullAddress(employee.permanentAddress)),
        },
        { label: "Nơi ở hiện tại", value: formatText(getFullAddress(employee.currentAddress)) },
      ])}

			<div class="section-title">Thông tin công việc</div>
			<div class="grid">
				<div>
					${renderPairs([
            {
              label: "Đơn vị công tác",
              value: formatText(employee.workingOrganization?.name),
            },
            { label: "Vị trí công việc", value: formatText(employee.jobPosition?.name) },
            { label: "Lương cơ bản", value: formatMoneyValue(employee.baseSalary) },
            {
              label: "Trạng thái làm việc",
              value: employee.workingStatus ? workingStatusMap[employee.workingStatus] : EMPTY_TEXT,
            },
            {
              label: "Trạng thái nhân sự",
              value: employee.employeeStatus
                ? employeeStatusMap[employee.employeeStatus]
                : EMPTY_TEXT,
            },
          ])}
				</div>
				<div>
					${renderPairs([
            { label: "Ngày thử việc", value: formatDate(employee.trialDate) },
            { label: "Ngày chính thức", value: formatDate(employee.officialDate) },
            {
              label: "Số thẻ BHXH",
              value: formatText((employee.insuranceInfo as any)?.insurance_number),
            },
            { label: "Lương đóng BHXH", value: formatMoneyValue(employee.insuranceInfo?.salary) },
            {
              label: "Tỷ lệ BHXH",
              value:
                employee.insuranceInfo?.rate === undefined || employee.insuranceInfo?.rate === null
                  ? EMPTY_TEXT
                  : `${employee.insuranceInfo.rate}%`,
            },
          ])}
				</div>
			</div>

			<div class="sub-title">Danh sách hợp đồng</div>
			<table>
				<thead>
					<tr>
						<th class="text-center" style="width: 40px">STT</th>
						<th>Loại hợp đồng</th>
						<th>Số hợp đồng</th>
						<th class="text-right" style="width: 120px">Lương</th>
						<th class="text-center" style="width: 110px">Ngày bắt đầu</th>
						<th class="text-center" style="width: 110px">Ngày kết thúc</th>
					</tr>
				</thead>
				<tbody>
					${contractRows}
				</tbody>
			</table>
		</div>
	</body>
</html>
`;

  return htmlContent;
};

export const handlePrintEmployee = (employee: Employee) => {
  if (!employee) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(getEmployeeHtmlContent(employee));
  printWindow.document.close();
};
