import { useMemo, useRef } from "react";
import { Button, Modal, Spin } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { Employee } from "../employee.model";
import { UserImage } from "@/shared";
import { getMainFile } from "@/shared/utils/file.util";
import { AnchorInfo } from "./AddUpdateModal/Anchor";
import { PartialPanel, PartialTitle } from "./AddUpdateModal/PartialComponent";
import {
  Gender,
  genderMap,
  maritalStatusMap,
  MaritalStatusEnum,
  IdentificationType,
} from "@/shared/constants/enum";
import { employeeContractTypeMap, employeeStatusMap, workingStatusMap } from "../employee.enum";
import { formatDateDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { getFullAddress } from "@/shared/utils/common.util";
import { handlePrintEmployee } from "@/shared/utils/html/employee";
import { PrinterOutlined } from "@ant-design/icons";
import "./AddUpdateModal/index.css";
import { buildFileUrl } from "@/shared/utils/url.util";

interface EmployeeDetailModalProps extends Omit<DetailModalProps<Employee>, "data"> {
  data?: Employee;
  onOpenUpdate?: (employee: Employee) => void;
}

const EMPTY_TEXT = "--";

const identifyTypeMap: Record<IdentificationType, string> = {
  [IdentificationType.CCCD]: "CCCD",
  [IdentificationType.CMND]: "CMND",
  [IdentificationType.HC]: "Hộ chiếu",
};

const DisplayRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
  const showValue = value ?? EMPTY_TEXT;

  return (
    <div className="grid grid-cols-[160px_1fr] gap-2 py-1 border-b border-dashed border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="font-normal break-words">{showValue}</span>
    </div>
  );
};

const formatText = (value?: string | null) => value || EMPTY_TEXT;

const formatDate = (value?: string | Date | null) => {
  if (!value) return EMPTY_TEXT;
  return formatDateDDMMYYYY(String(value)) || EMPTY_TEXT;
};

const formatMoneyValue = (value?: number | null) => formatMoney(value, null) || EMPTY_TEXT;

export const DetailModal: React.FC<EmployeeDetailModalProps> = ({
  open,
  data,
  loading,
  onOpenUpdate,
  onClose,
}) => {
  const formScrollContainerRef = useRef<HTMLDivElement>(null);

  const contracts = useMemo(() => {
    if (!data?.contracts?.length) return [];

    return [...data.contracts].sort((a, b) => {
      const firstTime = a.startDate ? new Date(a.startDate).getTime() : 0;
      const secondTime = b.startDate ? new Date(b.startDate).getTime() : 0;
      return secondTime - firstTime;
    });
  }, [data?.contracts]);

  const handleOpenUpdate = () => {
    if (!data || !onOpenUpdate) return;
    onOpenUpdate(data);
  };

  const handlePrint = () => {
    if (!data) return;
    handlePrintEmployee(data);
  };

  return (
    <Modal
      title="Chi tiết nhân sự"
      open={open}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      centered
      width="100vw"
      className="fullscreen-modal"
      destroyOnClose
    >
      <div className="employee-info flex flex-col h-full relative">
        {loading && (
          <div className="absolute z-10 h-full w-full top-0 flex items-center justify-center bg-slate-50/50">
            <Spin />
          </div>
        )}

        <div className="flex h-full">
          <div className="flex flex-col h-full gap-4 employee-info">
            <div style={{ width: 100, height: 100 }} className="ml-auto mr-auto select-none">
              <UserImage image={getMainFile(data?.avatar)} size={100} name={data?.name} />
            </div>

            <div className="flex-1 w-full overflow-x-hidden overflow-y-auto">
              <AnchorInfo scrollContainerRef={formScrollContainerRef} />
            </div>
          </div>

          <div
            ref={formScrollContainerRef}
            className="h-full flex-1 overflow-x-hidden overflow-y-auto border-s pl-6 pr-2 scroll-smooth"
          >
            <div className="pb-20">
              <PartialTitle id="basic-info" title="Thông tin cơ bản" />

              <PartialPanel id="personal-info" title="Thông tin cá nhân">
                <DisplayRow label="Mã nhân sự" value={formatText(data?.code)} />
                <DisplayRow label="Tên nhân sự" value={formatText(data?.name)} />
                <DisplayRow
                  label="Giới tính"
                  value={data?.gender ? genderMap[data.gender as Gender] : EMPTY_TEXT}
                />
                <DisplayRow label="Ngày sinh" value={formatDate(data?.dob)} />
                <DisplayRow
                  label="Tình trạng hôn nhân"
                  value={
                    data?.maritalStatus
                      ? maritalStatusMap[data.maritalStatus as MaritalStatusEnum]
                      : EMPTY_TEXT
                  }
                />
                <DisplayRow label="Dân tộc" value={formatText(data?.ethnicity)} />
                <DisplayRow label="Tôn giáo" value={formatText(data?.religion)} />
                <DisplayRow label="Mã số thuế cá nhân" value={formatText(data?.taxCode)} />
              </PartialPanel>

              <PartialPanel id="identity-info" title="CCCD/ Hộ chiếu">
                <DisplayRow
                  label="Loại giấy tờ"
                  value={
                    data?.identification?.type
                      ? identifyTypeMap[data.identification.type as IdentificationType]
                      : EMPTY_TEXT
                  }
                />
                <DisplayRow
                  label="Số giấy tờ"
                  value={formatText(data?.identification?.identityCode)}
                />
                <DisplayRow label="Ngày cấp" value={formatDate(data?.identification?.issuedDate)} />
                <DisplayRow label="Nơi cấp" value={formatText(data?.identification?.issuedPlace)} />
                <DisplayRow
                  label="Ngày hết hạn"
                  value={formatDate(data?.identification?.expiredDate)}
                />
              </PartialPanel>

              <PartialPanel id="education-info" title="Trình độ - Bằng cấp">
                <DisplayRow
                  label="Trình độ văn hóa"
                  value={formatText(data?.education?.educationLevel)}
                />
                <DisplayRow
                  label="Trình độ đào tạo"
                  value={formatText(data?.education?.trainingLevel)}
                />
                <DisplayRow
                  label="Trường tốt nghiệp"
                  value={formatText(data?.education?.institution)}
                />
                <DisplayRow label="Khoa" value={formatText(data?.education?.faculty)} />
                <DisplayRow label="Chuyên ngành" value={formatText(data?.education?.major)} />
                <DisplayRow
                  label="Năm tốt nghiệp"
                  value={formatDate(data?.education?.graduationYear as any)}
                />
              </PartialPanel>

              <PartialTitle id="contact-info" title="Thông tin liên hệ" />

              <PartialPanel id="contact-phone-email" title="Số điện thoại/ Email">
                <DisplayRow label="Số điện thoại" value={formatText(data?.phone)} />
                <DisplayRow label="Email" value={formatText(data?.email)} />
              </PartialPanel>

              <PartialPanel id="contact-permanent-address" title="Địa chỉ thường trú">
                <DisplayRow
                  label="Địa chỉ"
                  value={formatText(getFullAddress(data?.permanentAddress))}
                />
              </PartialPanel>

              <PartialPanel id="contact-current-address" title="Nơi ở hiện tại">
                <DisplayRow
                  label="Địa chỉ"
                  value={formatText(getFullAddress(data?.currentAddress))}
                />
                <DisplayRow
                  label="Là địa chỉ thường trú"
                  value={data?.currentAddress?.isPermanent ? "Có" : "Không"}
                />
              </PartialPanel>

              <PartialPanel id="contact-emergency" title="Liên hệ khẩn cấp">
                <DisplayRow label="Họ và tên" value={formatText(data?.emergencyContact?.name)} />
                <DisplayRow
                  label="Mối quan hệ"
                  value={formatText(data?.emergencyContact?.relationship)}
                />
                <DisplayRow
                  label="Số điện thoại"
                  value={formatText(data?.emergencyContact?.phone)}
                />
                <DisplayRow label="Email" value={formatText(data?.emergencyContact?.email)} />
              </PartialPanel>

              <PartialTitle id="job-info" title="Thông tin công việc" />

              <PartialPanel id="job-general" title="Thông tin chung">
                <DisplayRow
                  label="Đơn vị công tác"
                  value={formatText(data?.workingOrganization?.name)}
                />
                <DisplayRow label="Vị trí công việc" value={formatText(data?.jobPosition?.name)} />
                <DisplayRow label="Lương cơ bản" value={formatMoneyValue(data?.baseSalary)} />
                <DisplayRow
                  label="Trạng thái làm việc"
                  value={data?.workingStatus ? workingStatusMap[data.workingStatus] : EMPTY_TEXT}
                />
                <DisplayRow
                  label="Trạng thái nhân sự"
                  value={data?.employeeStatus ? employeeStatusMap[data.employeeStatus] : EMPTY_TEXT}
                />
                <DisplayRow label="Ngày thử việc" value={formatDate(data?.trialDate)} />
                <DisplayRow label="Ngày chính thức" value={formatDate(data?.officialDate)} />
              </PartialPanel>

              <PartialPanel id="job-contracts" title="Thông tin hợp đồng" className="!my-2">
                {contracts.length === 0 ? (
                  <div className="col-span-2 text-gray-400">{EMPTY_TEXT}</div>
                ) : (
                  <div className="col-span-2 overflow-auto border rounded">
                    <table className="min-w-full table-fixed border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-2 py-1 border font-medium">Loại hợp đồng</th>
                          <th className="px-2 py-1 border font-medium">Số hợp đồng</th>
                          <th className="px-2 py-1 border font-medium">Lương</th>
                          <th className="px-2 py-1 border font-medium">Ngày bắt đầu</th>
                          <th className="px-2 py-1 border font-medium">Ngày kết thúc</th>
                          <th className="px-2 py-1 border font-medium">Tài liệu đính kèm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.map((contract) => (
                          <tr key={contract.id || contract.tempId}>
                            <td className="px-2 py-1 border">
                              {contract.type ? employeeContractTypeMap[contract.type] : EMPTY_TEXT}
                            </td>
                            <td className="px-2 py-1 border">
                              {formatText(contract.contractNumber)}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {formatMoneyValue(contract.salary)}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {formatDate(contract.startDate)}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {formatDate(contract.endDate)}
                            </td>
                            <td className="border text-center">
                              {contract.document?.length ? (
                                <Button
                                  type="link"
                                  onClick={() => {
                                    const mainFile = getMainFile(contract.document);
                                    if (!mainFile) return;
                                    const fullUrl = buildFileUrl(mainFile.url);
                                    window.open(fullUrl, "_blank", "noopener,noreferrer");
                                  }}
                                  className="!h-7"
                                >
                                  Xem tài liệu
                                </Button>
                              ) : (
                                EMPTY_TEXT
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </PartialPanel>

              <PartialPanel id="job-allowances" title="Các khoản phụ cấp">
                {data?.allowances?.length ? (
                  <div className="col-span-2 space-y-1">
                    {data.allowances.map((allowance, index) => (
                      <div key={`${allowance?.name || "allowance"}-${index}`} className="text-sm">
                        {`${index + 1}. ${formatText(allowance?.name)}: ${formatMoneyValue(allowance?.amount || 0)}`}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="col-span-2 text-gray-400">{EMPTY_TEXT}</div>
                )}
              </PartialPanel>

              <PartialPanel id="job-deductions" title="Các khoản khấu trừ">
                {data?.deductions?.length ? (
                  <div className="col-span-2 space-y-1">
                    {data.deductions.map((deduction, index) => (
                      <div key={`${deduction?.name || "deduction"}-${index}`} className="text-sm">
                        {`${index + 1}. ${formatText(deduction?.name)}: ${formatMoneyValue(deduction?.amount || 0)}`}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="col-span-2 text-gray-400">{EMPTY_TEXT}</div>
                )}
              </PartialPanel>

              <PartialPanel id="job-bank-account" title="Tài khoản ngân hàng">
                <DisplayRow label="Ngân hàng" value={formatText(data?.bankAccount?.bankName)} />
                <DisplayRow
                  label="Số tài khoản"
                  value={formatText(data?.bankAccount?.accountNumber)}
                />
                <DisplayRow
                  label="Chủ tài khoản"
                  value={formatText(data?.bankAccount?.accountHolder)}
                />
                <DisplayRow label="Chi nhánh" value={formatText(data?.bankAccount?.branch)} />
              </PartialPanel>

              <PartialPanel id="job-insurance" title="Bảo hiểm xã hội">
                <DisplayRow
                  label="Số thẻ BHXH"
                  value={formatText((data?.insuranceInfo as any)?.insurance_number)}
                />
                <DisplayRow
                  label="Lương đóng BHXH"
                  value={formatMoneyValue(data?.insuranceInfo?.salary)}
                />
                <DisplayRow
                  label="Tỷ lệ đóng BHXH"
                  value={
                    data?.insuranceInfo?.rate === undefined || data?.insuranceInfo?.rate === null
                      ? EMPTY_TEXT
                      : `${data.insuranceInfo.rate}%`
                  }
                />
                <DisplayRow
                  label="Ngày tham gia"
                  value={formatDate(data?.insuranceInfo?.startDate)}
                />
              </PartialPanel>
            </div>
            <div className="flex w-full justify-center mt-auto mb-0 pt-4 action-sticky-bottom gap-2">
              <Button icon={<PrinterOutlined />} onClick={handlePrint} disabled={!data}>
                In hồ sơ
              </Button>
              <Button type="primary" onClick={handleOpenUpdate} disabled={!data || !onOpenUpdate}>
                Chỉnh sửa
              </Button>
              <Button onClick={onClose}>Đóng</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
