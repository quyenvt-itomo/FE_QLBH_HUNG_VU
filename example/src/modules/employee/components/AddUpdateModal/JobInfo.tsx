import { AutoComplete, Button, Form, Input } from "antd";
import { AddUpdateModalPartialProps } from ".";
import Label from "@/shared/components/display/Label";
import { CLASSNAME } from "@/shared/constants/ui";
import { PartialPanel } from "./PartialComponent";
import { OrganizationSelect } from "@/modules/organization";
import { JobPositionSelect } from "@/modules/jobPosititon";
import { DatePickerCustom, InputMoney, InputPercentage } from "@/shared/components/input";
import {
  EmployeeStatus,
  employeeStatusMap,
  WorkingStatusEnum,
  workingStatusMap,
  EmployeeContractTypeEnum,
  employeeContractTypeOptions,
} from "../../employee.enum";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { bankOptions } from "@/shared/constants/option/bank";
import { removeVietnameseTones } from "@/shared/utils/search.util";
import { PlusOutlined } from "@ant-design/icons";
import { CustomSelect } from "@/shared/components/select/CustomSelect";
import { randomId } from "@/shared/utils/common.util";
import { EmployeeContractUpload } from "@/shared/components/upload/EmployeeContractUpload";
import { getMainFile } from "@/shared/utils/file.util";
import { formatMoney } from "@/shared/utils/number.util";
import { OrganizationTypeEnum } from "@/modules/organization";

const Contract: React.FC<AddUpdateModalPartialProps> = ({ form, id }) => {
  const contracts = Form.useWatch("contracts", form) || [];

  return (
    <PartialPanel id="job-contracts" title="Thông tin hợp đồng" className="!my-2">
      <Form.List name="contracts">
        {(fields, { add, remove }) => (
          <div className="flex flex-col border rounded overflow-hidden col-span-2">
            <div className="flex flex-col h-32 w-full overflow-auto">
              <table className="min-w-full w-fit table-fixed border-collapse">
                <colgroup>
                  <col style={{ width: 40 }} />
                  <col style={{ width: 120 }} />
                  <col style={{ minWidth: 180 }} />
                  <col style={{ width: 120 }} />
                  <col style={{ width: 120 }} />
                  <col style={{ width: 120 }} />
                  <col style={{ width: 150 }} />
                  <col style={{ width: 50 }} />
                </colgroup>
                <thead>
                  <tr className="sticky top-0 bg-gray-50 z-10">
                    <th className="px-2 font-normal border-r">STT</th>
                    <th className="px-2 font-normal border-r">Loại hợp đồng</th>
                    <th className="px-2 font-normal border-r">Số hợp đồng</th>
                    <th className="px-2 font-normal border-r">Lương</th>
                    <th className="px-2 font-normal border-r">Ngày bắt đầu</th>
                    <th className="px-2 font-normal border-r">Ngày kết thúc</th>
                    <th className="px-2 font-normal border-r">Tài liệu đính kèm</th>
                    <th className="px-2 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(({ key, name, ...restField }) => {
                    const { id, tempId, document } = contracts[name] || {};
                    return (
                      <tr key={key} className={fields.length - 1 === name ? "border-b" : ""}>
                        <td className="text-center border-t border-r">{name + 1}</td>
                        <td className="border-t border-r">
                          <Form.Item
                            {...restField}
                            name={[name, "type"]}
                            initialValue={EmployeeContractTypeEnum.OFFICIAL}
                            noStyle
                          >
                            <CustomSelect
                              options={employeeContractTypeOptions}
                              variant="borderless"
                              className="!h-7"
                            />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "contractNumber"]} noStyle>
                            <Input
                              className="!h-7"
                              placeholder="Nhập số hợp đồng"
                              variant="borderless"
                            />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "salary"]} noStyle>
                            <InputMoney
                              className="!h-7"
                              placeholder="Nhập lương theo hợp đồng"
                              variant="borderless"
                            />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "startDate"]} noStyle>
                            <DatePickerCustom
                              className="!h-7"
                              onlyDate
                              placeholder="Ngày bắt đầu"
                              variant="borderless"
                            />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "endDate"]} noStyle>
                            <DatePickerCustom
                              className="!h-7"
                              onlyDate
                              placeholder="Ngày kết thúc"
                              variant="borderless"
                            />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <EmployeeContractUpload
                            defaultFile={getMainFile(document)}
                            oId={(id || tempId) ?? undefined}
                            onMoveToTrash={(file) => {
                              const trashFileIds: string[] =
                                form.getFieldValue("__trashFileIds") || [];
                              if (trashFileIds.includes(file.id)) return;
                              form.setFieldValue("__trashFileIds", [...trashFileIds, file.id]);
                            }}
                          />
                        </td>
                        <td className="border-t action-sticky">
                          <Button
                            htmlType="button"
                            type="text"
                            className="h-7"
                            danger
                            onClick={() => remove(name)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {fields.length === 0 && (
                    <tr>
                      <td colSpan={8} className="border-t">
                        <div className="flex items-center justify-center h-[98px]">
                          <span className="text-gray-400">Chưa có hợp đồng nào</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-2 py-1 border-t">
              <Button
                htmlType="button"
                type="text"
                onClick={() =>
                  add({
                    type: EmployeeContractTypeEnum.OFFICIAL,
                    tempId: randomId(),
                  })
                }
                block
                icon={<PlusOutlined />}
                className="text-blue-500 hover:!bg-blue-50 hover:!text-blue-700 !w-fit h-6"
              >
                Thêm hợp đồng
              </Button>
            </div>
          </div>
        )}
      </Form.List>
    </PartialPanel>
  );
};

const Allowance: React.FC<AddUpdateModalPartialProps> = ({ form, id }) => {
  const allowances = Form.useWatch("allowances", form) || [];
  const totalAllowance = allowances.reduce(
    (total, allowance) => total + (allowance.amount || 0),
    0,
  );
  return (
    <PartialPanel id="job-allowances" title="Các khoản phụ cấp" className="!my-2">
      <Form.List name="allowances">
        {(fields, { add, remove }) => (
          <div className="flex flex-col border rounded overflow-hidden col-span-2">
            <div className="flex flex-col h-24 w-full overflow-auto">
              <table className="min-w-full w-fit table-fixed border-collapse">
                <colgroup>
                  <col style={{ width: 40 }} />
                  <col style={{ width: 250 }} />
                  <col style={{ width: 250 }} />
                  <col />
                  <col style={{ width: 50 }} />
                </colgroup>
                <thead>
                  <tr className="sticky top-0 bg-gray-50 z-10">
                    <th className="px-2 font-normal border-r">STT</th>
                    <th className="px-2 font-normal border-r">Tên khoản phụ cấp / Ngày</th>
                    <th className="px-2 font-normal border-r">Số tiền</th>
                    <th className="px-2 font-normal border-r">Ghi chú</th>
                    <th className="px-2 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(({ key, name, ...restField }) => {
                    return (
                      <tr key={key} className={fields.length - 1 === name ? "border-b" : ""}>
                        <td className="text-center border-t border-r">{name + 1}</td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "name"]} noStyle>
                            <Input
                              className="!h-7"
                              placeholder="Nhập tên khoản phụ cấp"
                              variant="borderless"
                            />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "amount"]} noStyle>
                            <InputMoney className="!h-7" variant="borderless" />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "note"]} noStyle>
                            <Input className="!h-7" variant="borderless" />
                          </Form.Item>
                        </td>
                        <td className="border-t action-sticky">
                          <Button
                            htmlType="button"
                            type="text"
                            className="h-7"
                            danger
                            onClick={() => remove(name)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {fields.length === 0 && (
                    <tr>
                      <td colSpan={5} className="border-t">
                        <div className="flex items-center justify-center h-16">
                          <span className="text-gray-400">Chưa có khoản phụ cấp nào</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="py-1 border-t flex items-center">
              <div className="px-2 w-[290px]">
                <Button
                  htmlType="button"
                  type="text"
                  onClick={() =>
                    add({
                      type: EmployeeContractTypeEnum.OFFICIAL,
                      tempId: randomId(),
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                  className="text-blue-500 hover:!bg-blue-50 hover:!text-blue-700 !w-fit h-6"
                >
                  Thêm phụ cấp
                </Button>
              </div>
              <div className="w-[250px] flex items-center justify-end gap-3 pr-3 text-blue-500">
                <span>Tổng phụ cấp/ngày: </span>
                <span className="font-semibold">{formatMoney(totalAllowance)}</span>
              </div>
            </div>
          </div>
        )}
      </Form.List>
    </PartialPanel>
  );
};

const Deduction: React.FC<AddUpdateModalPartialProps> = ({ form, id }) => {
  const deductions = Form.useWatch("deductions", form) || [];
  const totalDeduction = deductions.reduce(
    (total, deduction) => total + (deduction.amount || 0),
    0,
  );
  return (
    <PartialPanel id="job-deductions" title="Các khoản khấu trừ" className="!my-2">
      <Form.List name="deductions">
        {(fields, { add, remove }) => (
          <div className="flex flex-col border rounded overflow-hidden col-span-2">
            <div className="flex flex-col h-24 w-full overflow-auto">
              <table className="min-w-full w-fit table-fixed border-collapse">
                <colgroup>
                  <col style={{ width: 40 }} />
                  <col style={{ width: 250 }} />
                  <col style={{ width: 250 }} />
                  <col />
                  <col style={{ width: 50 }} />
                </colgroup>
                <thead>
                  <tr className="sticky top-0 bg-gray-50 z-10">
                    <th className="px-2 font-normal border-r">STT</th>
                    <th className="px-2 font-normal border-r">Tên khoản khấu trừ / Ngày</th>
                    <th className="px-2 font-normal border-r">Số tiền</th>
                    <th className="px-2 font-normal border-r">Ghi chú</th>
                    <th className="px-2 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(({ key, name, ...restField }) => {
                    return (
                      <tr key={key} className={fields.length - 1 === name ? "border-b" : ""}>
                        <td className="text-center border-t border-r">{name + 1}</td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "name"]} noStyle>
                            <Input
                              className="!h-7"
                              placeholder="Nhập tên khoản khấu trừ"
                              variant="borderless"
                            />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "amount"]} noStyle>
                            <InputMoney className="!h-7" variant="borderless" />
                          </Form.Item>
                        </td>
                        <td className="border-t border-r">
                          <Form.Item {...restField} name={[name, "note"]} noStyle>
                            <Input className="!h-7" variant="borderless" />
                          </Form.Item>
                        </td>
                        <td className="border-t action-sticky">
                          <Button
                            htmlType="button"
                            type="text"
                            className="h-7"
                            danger
                            onClick={() => remove(name)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {fields.length === 0 && (
                    <tr>
                      <td colSpan={5} className="border-t">
                        <div className="flex items-center justify-center h-16">
                          <span className="text-gray-400">Chưa có khoản khấu trừ nào</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="py-1 border-t flex items-center">
              <div className="px-2 w-[290px]">
                <Button
                  htmlType="button"
                  type="text"
                  onClick={() =>
                    add({
                      type: EmployeeContractTypeEnum.OFFICIAL,
                      tempId: randomId(),
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                  className="text-red-500 hover:!bg-red-50 hover:!text-red-700 !w-fit h-6"
                >
                  Thêm khấu trừ
                </Button>
              </div>
              <div className="flex gap-3 items-center justify-end pr-3 text-red-500 w-[250px]">
                <span>Tổng khấu trừ/ngày: </span>
                <span className="font-semibold">{formatMoney(totalDeduction)}</span>
              </div>
            </div>
          </div>
        )}
      </Form.List>
    </PartialPanel>
  );
};

export const JobInfo: React.FC<AddUpdateModalPartialProps> = ({ form, id }) => {
  const workingOrganization = Form.useWatch("workingOrganization", form);
  const jobPosition = Form.useWatch("jobPosition", form);

  return (
    <>
      <div
        id="job-info"
        className="flex justify-center items-center w-full h-9 font-semibold bg-gray-200"
      >
        Thông tin công việc
      </div>
      <PartialPanel id="job-general" title="Thông tin chung">
        <Form.Item name="workingOrganizationId" label={<Label title="Đơn vị công tác" />}>
          <OrganizationSelect
            defaultData={workingOrganization}
            onChangeData={(val) => form.setFieldValue("workingOrganization", val)}
            query={{
              types: [OrganizationTypeEnum.DEPARTMENT, OrganizationTypeEnum.FACTORY],
            }}
          />
        </Form.Item>
        <Form.Item name="workingOrganization" hidden />
        <Form.Item name="jobPositionId" label={<Label title="Vị trí công việc" />}>
          <JobPositionSelect
            defaultData={jobPosition}
            onChangeData={(val) => form.setFieldValue("jobPosition", val)}
          />
        </Form.Item>
        <Form.Item name="jobPosition" hidden />
        <Form.Item name="baseSalary" label={<Label title="Lương CB / (ngày | 8h)" />}>
          <InputMoney placeholder="Lương cơ bản theo ca" notRightAlign />
        </Form.Item>
        <Form.Item name={["jobPosition", "jobTitle", "name"]} label={<Label title="Chức danh" />}>
          <Input disabled className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item
          name="workingStatus"
          label={<Label title="Trạng thái làm việc" />}
          initialValue={WorkingStatusEnum.WORKING}
        >
          <CustomSelect
            options={Object.values(WorkingStatusEnum).map((workingStatus) => ({
              label: workingStatusMap[workingStatus],
              value: workingStatus,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="employeeStatus"
          label={<Label title="Trạng thái nhân sự" />}
          initialValue={EmployeeStatus.WORKING}
        >
          <CustomSelect
            options={Object.values(EmployeeStatus).map((employeeStatus) => ({
              label: employeeStatusMap[employeeStatus],
              value: employeeStatus,
            }))}
          />
        </Form.Item>
        <Form.Item name="trialDate" label={<Label title="Ngày thử việc" />}>
          <DatePickerCustom onlyDate />
        </Form.Item>
        <Form.Item name="officialDate" label={<Label title="Ngày chính thức" />}>
          <DatePickerCustom onlyDate />
        </Form.Item>
      </PartialPanel>

      <Contract form={form} id={id} />

      <Allowance form={form} id={id} />

      <Deduction form={form} id={id} />

      <PartialPanel id="job-bank-account" title="Tài khoản ngân hàng">
        <Form.Item name={["bankAccount", "bankName"]} label={<Label title="Ngân hàng" />}>
          <AutoComplete
            allowClear
            placeholder="Chọn/Nhập ngân hàng"
            options={bankOptions}
            className={CLASSNAME.inputHeight}
            suffixIcon={<ChevronDownIcon className="h-3.5" />}
            filterOption={(input, option) =>
              removeVietnameseTones(option?.label as string).includes(removeVietnameseTones(input))
            }
          />
        </Form.Item>
        <Form.Item name={["bankAccount", "accountNumber"]} label={<Label title="Số tài khoản" />}>
          <Input className={CLASSNAME.inputHeight} placeholder="Nhập số tài khoản" />
        </Form.Item>
        <Form.Item name={["bankAccount", "accountHolder"]} label={<Label title="Chủ tài khoản" />}>
          <Input className={CLASSNAME.inputHeight} placeholder="Nhập tên chủ tài khoản" />
        </Form.Item>
        <Form.Item name={["bankAccount", "branch"]} label={<Label title="Chi nhánh ngân hàng" />}>
          <Input className={CLASSNAME.inputHeight} placeholder="Nhập chi nhánh mở tài khoản" />
        </Form.Item>
      </PartialPanel>

      <PartialPanel id="job-insurance" title="Bảo hiểm xã hội">
        <Form.Item
          name={["insuranceInfo", "insurance_number"]}
          label={<Label title="Số thẻ BHXH" />}
        >
          <Input className="h-9 w-full" />
        </Form.Item>
        <Form.Item name={["insuranceInfo", "salary"]} label={<Label title="Lương đóng BHXH" />}>
          <InputMoney notRightAlign />
        </Form.Item>
        <Form.Item name={["insuranceInfo", "rate"]} label={<Label title="Tỷ lệ đóng BHXH (%)" />}>
          <InputPercentage notRightAlign />
        </Form.Item>
        <Form.Item name={["insuranceInfo", "startDate"]} label={<Label title="Ngày tham gia" />}>
          <DatePickerCustom onlyDate />
        </Form.Item>
      </PartialPanel>
    </>
  );
};
