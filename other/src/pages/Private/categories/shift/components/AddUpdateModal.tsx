import React, { useEffect, useState } from "react";
import { Input, Modal, Form, App, Checkbox, Collapse } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { IShift } from "../../../../../models/store/shift";
import { randomId } from "../../../../../utils/common";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import Label from "../../../../../components/display/Label";
import SubmitButton from "../../../../../components/button/SubmitButton";
import dayjs from "dayjs";
import { DatePickerCustom, InputMoney, InputQuantity } from "../../../../../components/input";
import UserSelect from "../../../../../components/select/UserSelect";
import {
  CASH_KEYS,
  CHECKLIST_KEY,
  checklistKeyMap,
  ShiftStatusEnum,
} from "../../../../../constants/enum";
import { formatMoney } from "../../../../../utils/formatNumber";
import { EqualsIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const AddUpdateShiftModal: React.FC<AddUpdateModalProps<IShift>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<IShift & { userId?: string }>();
  const id = editData?.id || randomId();
  const isClosed = editData?.status === ShiftStatusEnum.CLOSED;

  // State quản lý collapse - mặc định mở khi thêm mới, đóng khi sửa
  const [activeKeys, setActiveKeys] = useState<string[]>(() =>
    !editData ? ["opening-detail", "closing-detail"] : [],
  );

  const openingCashSnapshot = Form.useWatch("openingCashSnapshot", form);
  const closingCashSnapshot = Form.useWatch("closingCashSnapshot", form);

  function calculateTotalCash(cashSnapshot: Record<string, number> | null) {
    if (!cashSnapshot) return 0;
    return CASH_KEYS.reduce((total, key) => {
      const quantity = cashSnapshot[key] || 0;
      return total + quantity * Number(key);
    }, 0);
  }

  const totalOpeningCash = calculateTotalCash(openingCashSnapshot);
  const totalClosingCash = calculateTotalCash(closingCashSnapshot);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IShift & { userId?: string }>["onFinish"] = async (
    values: IShift & { userId?: string },
  ) => {
    const formattedData = formatFormData({
      ...values,
      id,
      tempId: id,
      openingCash: totalOpeningCash,
      ...(isClosed && { closingCash: totalClosingCash }),
    });

    if (editData) {
      onEdit?.(formattedData);
    } else {
      onAdd?.(formattedData);
    }
  };

  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  return (
    <Modal
      title={editData ? "Chỉnh sửa thông tin ca làm việc" : "Mở ca làm việc"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={isClosed ? 1080 : 1080}
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        if (!editData) {
          setFormCode({ form, type: "shift", field: "code" });
          form.setFieldsValue({
            openingCashSnapshot: CASH_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
            openingChecklist: CHECKLIST_KEY.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
          });
          return;
        }
        const formattedData: any = parseFormDataDates(editData);
        form.setFieldsValue({
          ...formattedData,
          openingCashSnapshot:
            editData.openingCashSnapshot ||
            CASH_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
          openingChecklist:
            editData.openingChecklist ||
            CHECKLIST_KEY.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
          ...(isClosed && {
            closingCashSnapshot:
              editData.closingCashSnapshot ||
              CASH_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
            closingChecklist:
              editData.closingChecklist ||
              CHECKLIST_KEY.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
          }),
        });
      }}
      destroyOnClose
    >
      <Form
        layout="vertical"
        autoComplete="off"
        className="flex flex-col mt-4 pt-4"
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          message.error("Vui lòng kiểm tra lại thông tin");
        }}
        initialValues={{ startAt: dayjs() }}
      >
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto scrollbar-hide px-1">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="code"
              label={<Label title="Mã ca làm việc" required />}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã ca làm việc",
                },
              ]}
            >
              <Input placeholder="Nhập mã ca làm việc" />
            </Form.Item>

            <Form.Item
              name="startAt"
              label={<Label title="Thời gian bắt đầu" required />}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời gian bắt đầu",
                },
              ]}
            >
              <DatePickerCustom
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn thời gian bắt đầu"
              />
            </Form.Item>
          </div>

          {!editData && (
            <Form.Item
              name="userId"
              label={<Label title="Nhân viên phụ trách" required />}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn nhân viên phụ trách",
                },
              ]}
            >
              <UserSelect placeholder="Chọn nhân viên phụ trách" />
            </Form.Item>
          )}

          {editData && editData.createdBySnapshot && (
            <Form.Item label={<Label title="Nhân viên phụ trách" />}>
              <Input
                value={`${editData.createdBySnapshot.name} (${editData.createdBySnapshot.code})`}
                disabled
              />
            </Form.Item>
          )}

          {/* Kiểm kê tiền đầu ca và Checklist đầu ca */}
          <div className="flex gap-6">
            <div className="flex flex-col flex-1">
              <h3 className="text-base font-semibold mb-2">Kiểm kê tiền đầu ca</h3>

              {/* Collapse chỉ chứa bảng chi tiết */}
              <Collapse
                activeKey={activeKeys}
                onChange={(keys) => setActiveKeys(keys as string[])}
                className="bg-white border-none"
                items={[
                  {
                    key: "opening-detail",
                    label: <span className="text-sm font-medium">Chi tiết kiểm tiền</span>,
                    children: (
                      <div className="bg-[#F8F9FA] rounded-lg p-4">
                        <table className="w-full">
                          <colgroup>
                            <col style={{ width: "35%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "32%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "17%" }} />
                          </colgroup>
                          <tbody>
                            {CASH_KEYS.map((key) => (
                              <tr key={key}>
                                <td className="py-1 px-2 text-sm">
                                  {formatMoney(Number(key)) || 0} đ
                                </td>
                                <td className="text-center">
                                  <XMarkIcon className="h-3 inline" />
                                </td>
                                <td className="py-1 px-2">
                                  <Form.Item
                                    name={["openingCashSnapshot", key]}
                                    noStyle
                                    rules={[
                                      {
                                        pattern: /^\d+$/,
                                        message: "Nhập số nguyên",
                                      },
                                    ]}
                                  >
                                    <InputQuantity min={0} placeholder="0" />
                                  </Form.Item>
                                </td>
                                <td className="text-center">
                                  <EqualsIcon className="h-3 inline" />
                                </td>
                                <td className="py-1 px-2 text-right text-sm">
                                  {formatMoney(
                                    (Number(openingCashSnapshot?.[key]) || 0) * Number(key),
                                  )}
                                  đ
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ),
                  },
                ]}
              />
              {/* TỔNG - luôn hiển thị */}
              <div className="bg-[#F8F9FA] rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">TỔNG:</span>
                  <span className="text-lg font-semibold text-[#1A73E8]">
                    {formatMoney(totalOpeningCash) || 0} đ
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1">
              <h3 className="text-base font-semibold mb-2">Checklist đầu ca</h3>
              <div className="space-y-2">
                {CHECKLIST_KEY.map((key) => (
                  <Form.Item
                    key={key}
                    name={["openingChecklist", key]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F8F9FA] hover:bg-[#E5E7EB] cursor-pointer transition-all">
                      <span className="text-sm">{checklistKeyMap[key]}</span>
                    </Checkbox>
                  </Form.Item>
                ))}
              </div>
            </div>
          </div>

          {/* Kiểm kê tiền cuối ca và Checklist cuối ca - chỉ hiển thị khi sửa ca đã đóng */}
          {isClosed && (
            <>
              <div className="border-t-2 border-gray-200 my-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item label={<Label title="Tiền mặt dự kiến" />}>
                  <InputMoney notRightAlign value={editData.expectedCash || 0} disabled />
                </Form.Item>
                <Form.Item
                  name="endAt"
                  label={<Label title="Thời gian kết thúc" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thời gian kết thúc",
                    },
                  ]}
                >
                  <DatePickerCustom
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    placeholder="Chọn thời gian kết thúc"
                  />
                </Form.Item>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-semibold mb-2">Kiểm kê tiền cuối ca</h3>

                  {/* Collapse chỉ chứa bảng chi tiết */}
                  <Collapse
                    activeKey={activeKeys}
                    onChange={(keys) => setActiveKeys(keys as string[])}
                    className="bg-white border-none"
                    items={[
                      {
                        key: "closing-detail",
                        label: <span className="text-sm font-medium">Chi tiết kiểm tiền</span>,
                        children: (
                          <div className="bg-[#FFF9E6] rounded-lg p-4">
                            <table className="w-full">
                              <colgroup>
                                <col style={{ width: "35%" }} />
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "32%" }} />
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "17%" }} />
                              </colgroup>
                              <tbody>
                                {CASH_KEYS.map((key) => (
                                  <tr key={key}>
                                    <td className="py-1 px-2 text-sm">
                                      {formatMoney(Number(key)) || 0} đ
                                    </td>
                                    <td className="text-center">
                                      <XMarkIcon className="h-3 inline" />
                                    </td>
                                    <td className="py-1 px-2">
                                      <Form.Item
                                        name={["closingCashSnapshot", key]}
                                        noStyle
                                        rules={[
                                          {
                                            pattern: /^\d+$/,
                                            message: "Nhập số nguyên",
                                          },
                                        ]}
                                      >
                                        <InputQuantity min={0} placeholder="0" />
                                      </Form.Item>
                                    </td>
                                    <td className="text-center">
                                      <EqualsIcon className="h-3 inline" />
                                    </td>
                                    <td className="py-1 px-2 text-right text-sm">
                                      {formatMoney(
                                        (Number(closingCashSnapshot?.[key]) || 0) * Number(key),
                                      ) || 0}
                                      đ
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ),
                      },
                    ]}
                  />

                  {/* TỔNG - luôn hiển thị */}
                  <div className="bg-[#FFF9E6] rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">TỔNG:</span>
                      <span className="text-lg font-semibold text-[#F59E0B]">
                        {formatMoney(totalClosingCash) || 0} đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-semibold mb-2">Checklist cuối ca</h3>
                  <div className="space-y-2">
                    {CHECKLIST_KEY.map((key) => (
                      <Form.Item
                        key={key}
                        name={["closingChecklist", key]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFF9E6] hover:bg-[#FFF3CD] cursor-pointer transition-all">
                          <span className="text-sm">{checklistKeyMap[key]}</span>
                        </Checkbox>
                      </Form.Item>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <Form.Item name="note" label={<Label title="Ghi chú" />}>
            <Input.TextArea
              placeholder="Nhập ghi chú"
              autoSize={{ minRows: 2, maxRows: 4 }}
              count={{
                max: 250,
                show: true,
              }}
            />
          </Form.Item>
        </div>

        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
