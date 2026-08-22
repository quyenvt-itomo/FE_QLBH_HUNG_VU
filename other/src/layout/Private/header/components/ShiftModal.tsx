import React, { useState } from "react";
import { Input, Modal, Form, Checkbox, Card, Row, Col, Statistic, Progress, Button } from "antd";
import { AddUpdateModalProps } from "../../../../models/base/interface";
import SubmitButton from "../../../../components/button/SubmitButton";
import { CASH_KEYS, CHECKLIST_KEY, checklistKeyMap } from "../../../../constants/enum";
import { randomId } from "../../../../utils/common";
import Label from "../../../../components/display/Label";
import { InputQuantity } from "../../../../components/input";
import { useClientData } from "../../../../hooks/core/useClientData";
import {
  CloseShiftPayload,
  IShift,
  OpenShiftPayload,
  ShiftSummary,
} from "../../../../models/store/shift";
import { formatMoney, formatQuantity } from "../../../../utils/formatNumber";
import { EqualsIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { formatDateTimeDDMMYYYY } from "../../../../utils/dateUtils";
import {
  DollarOutlined,
  ShoppingOutlined,
  RollbackOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";

interface Props extends AddUpdateModalProps<IShift> {
  shiftSummary?: ShiftSummary | null;
  onOpenShift?: (data: OpenShiftPayload) => void;
  onCloseShift?: (data: CloseShiftPayload) => void;
  onSetPrinting: (isPrinting: boolean) => void;
}

export const ShiftModal: React.FC<Props> = ({
  open,
  loading,
  errors,
  editData,
  shiftSummary,
  onOpenShift,
  onCloseShift,
  onSetPrinting,
  onClose,
}) => {
  if (editData) {
    return (
      <CloseShiftModal
        open={open}
        loading={loading}
        errors={errors}
        currentShift={editData}
        shiftSummary={shiftSummary}
        onCloseShift={onCloseShift}
        onSetPrinting={onSetPrinting}
        onClose={onClose}
      />
    );
  }

  return (
    <OpenShiftModal
      open={open}
      loading={loading}
      errors={errors}
      onOpenShift={onOpenShift}
      onClose={onClose}
    />
  );
};

const OpenShiftModal: React.FC<{
  open: boolean;
  loading?: boolean;
  errors: any;
  onOpenShift?: (data: OpenShiftPayload) => void;
  onClose: () => void;
}> = ({ open, loading, onOpenShift, onClose }) => {
  const [form] = Form.useForm<OpenShiftPayload>();
  const [timeString, setTimeString] = useState("");
  const { info } = useClientData();
  const openingCashSnapshot = Form.useWatch("openingCashSnapshot", form);

  function caculateTotalCash(openingCashSnapshot: Record<string, number> | null) {
    if (!openingCashSnapshot) return 0;
    return CASH_KEYS.reduce((total, key) => {
      const quantity = openingCashSnapshot[key] || 0;
      return total + quantity * Number(key);
    }, 0);
  }

  const totalCash = caculateTotalCash(openingCashSnapshot);

  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  const handleFinish = async (data: OpenShiftPayload) => {
    try {
      onOpenShift?.({
        ...data,
        openingCash: totalCash,
      });
    } catch (error) {
      console.error("Error adding sell order:", error);
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      width={1080}
      className="full-screen-modal"
      onCancel={handleCancel}
      afterOpenChange={(open) => {
        if (!open) return;

        setInterval(() => {
          const now = new Date();
          const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          };
          const formattedTime = now.toLocaleDateString("vi-VN", options).replace(",", " -");
          setTimeString(formattedTime);
        }, 1000);
      }}
      classNames={{
        content: "!p-0 overflow-hidden",
      }}
    >
      <div className="bg-gradient-to-r from-[#1A73E8] to-[#4285F4] px-6 py-3 text-white flex-shrink-0">
        <h1 className="text-xl font-bold text-white mb-1">Bắt đầu ca làm việc</h1>
        <span className="text-base opacity-90">Xin chào, {info?.name}</span>
        <div className="flex items-center gap-2 mt-1 opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-clock"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{timeString}</span>
        </div>
      </div>
      <Form
        layout="vertical"
        className="flex flex-col p-6  h-[calc(100%-86px)]"
        form={form}
        onFinish={handleFinish}
        initialValues={{
          openingCash: 0,
          openingCashSnapshot: {
            "500000": 0,
            "200000": 0,
            "100000": 0,
            "50000": 0,
            "20000": 0,
            "10000": 0,
            "5000": 0,
            "2000": 0,
            "1000": 0,
          },
          openingChecklist: {
            [CHECKLIST_KEY[0]]: false,
            [CHECKLIST_KEY[1]]: false,
            [CHECKLIST_KEY[2]]: false,
            [CHECKLIST_KEY[3]]: false,
          },
        }}
      >
        <div className="flex gap-12">
          <div className="flex flex-col w-[520px]">
            <h2 className="text-base font-semibold mb-2">Kiểm kê tiền đầu ca</h2>
            <div className="bg-[#F8F9FA] rounded-[16px] p-4 mb-4 flex flex-col">
              <table>
                <colgroup>
                  <col style={{ width: 160 }} />
                  <col style={{ width: 24 }} />
                  <col style={{ width: 160 }} />
                  <col style={{ width: 24 }} />
                  <col />
                </colgroup>
                <tbody>
                  {CASH_KEYS.map((key) => (
                    <tr key={key}>
                      <td className="py-2 px-4">{formatMoney(Number(key))} đ</td>
                      <td>
                        <XMarkIcon className="h-3" />
                      </td>
                      <td className="py-2 px-4">
                        <Form.Item
                          name={["openingCashSnapshot", key]}
                          noStyle
                          rules={[
                            {
                              pattern: /^\d+$/,
                              message: "Vui lòng nhập số nguyên dương hoặc bằng 0",
                            },
                          ]}
                        >
                          <InputQuantity min={0} placeholder="0" />
                        </Form.Item>
                      </td>
                      <td>
                        <EqualsIcon className="h-3" />
                      </td>
                      <td className="py-2 px-4 text-right">
                        {formatMoney((openingCashSnapshot?.[key] || 0) * Number(key)) || 0} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 pt-4 border-t-2 border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">TỔNG:</span>
                  <span className="text-2xl font-semibold text-[#1A73E8]">
                    {formatMoney(totalCash) || 0} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            <h2 className="text-base font-semibold mb-2">Checklist đầu ca</h2>
            {CHECKLIST_KEY.map((key) => (
              <Form.Item key={key} name={["openingChecklist", key]} valuePropName="checked" noStyle>
                <Checkbox className="flex items-center gap-3 px-4 py-2 mb-4 rounded-xl bg-[#F8F9FA] hover:bg-[#E5E7EB] cursor-pointer transition-all">
                  {checklistKeyMap[key]}
                </Checkbox>
              </Form.Item>
            ))}

            <Form.Item name="note" className="mt-6" label={<Label title="Ghi chú (nếu có)" bold />}>
              <Input.TextArea
                placeholder="Nhập ghi chú"
                className="!rounded-xl custom-input"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex w-full justify-center mt-4">
          <SubmitButton submitText="Bắt đầu ca" loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

const CloseShiftModal: React.FC<{
  open: boolean;
  loading?: boolean;
  errors: any;
  currentShift: IShift;
  shiftSummary?: ShiftSummary | null;
  onCloseShift?: (data: CloseShiftPayload) => void;
  onSetPrinting: (isPrinting: boolean) => void;
  onClose: () => void;
}> = ({ open, loading, currentShift, onCloseShift, onSetPrinting, onClose }) => {
  const [form] = Form.useForm<CloseShiftPayload>();
  const [timeString, setTimeString] = useState("");
  const { info } = useClientData();
  const closingCashSnapshot = Form.useWatch("closingCashSnapshot", form);

  function caculateTotalCash(closingCashSnapshot: Record<string, number> | null) {
    if (!closingCashSnapshot) return 0;
    return CASH_KEYS.reduce((total, key) => {
      const quantity = closingCashSnapshot[key] || 0;
      return total + quantity * Number(key);
    }, 0);
  }

  const totalCash = caculateTotalCash(closingCashSnapshot);

  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  const handleSaveAndPrint = async () => {
    onSetPrinting(true);
    form.submit();
  };

  const handleFinish = async (data: CloseShiftPayload) => {
    try {
      onCloseShift?.({
        ...data,
        closingCash: totalCash,
      });
    } catch (error) {
      console.error("Error adding sell order:", error);
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      width={1080}
      onCancel={handleCancel}
      className="full-screen-modal"
      afterOpenChange={(open) => {
        if (!open) return;

        setInterval(() => {
          const now = new Date();
          const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          };
          const formattedTime = now.toLocaleDateString("vi-VN", options).replace(",", " -");
          setTimeString(formattedTime);
        }, 1000);
      }}
      classNames={{
        content: "!p-0 overflow-hidden",
      }}
    >
      <div className="bg-gradient-to-r from-[#e8b81a] to-[#d4a60e] px-6 py-3 text-white flex-shrink-0">
        <h1 className="text-xl font-bold text-white mb-1">Kết thúc ca làm việc</h1>
        <p className="text-white/90">
          Tổng kết và đóng ca - {info?.name} | Ca làm việc:{" "}
          <span className="font-mono text-base">{currentShift.code}</span> -{" "}
          {formatDateTimeDDMMYYYY(currentShift.startAt)}
        </p>

        <span>{timeString}</span>
      </div>
      <Form
        layout="vertical"
        className="flex flex-col p-6 h-[calc(100%-72px)]"
        form={form}
        onFinish={handleFinish}
        initialValues={{
          closingCash: 0,
          closingCashSnapshot: {
            "500000": 0,
            "200000": 0,
            "100000": 0,
            "50000": 0,
            "20000": 0,
            "10000": 0,
            "5000": 0,
            "2000": 0,
            "1000": 0,
          },
          closingChecklist: {
            [CHECKLIST_KEY[0]]: false,
            [CHECKLIST_KEY[1]]: false,
            [CHECKLIST_KEY[2]]: false,
            [CHECKLIST_KEY[3]]: false,
          },
          note: currentShift.note,
        }}
      >
        <div className="h-[calc(100%-48px)] overflow-y-auto flex flex-col px-2">
          <div className="flex gap-12">
            <div className="flex flex-col w-[520px]">
              <h2 className="text-base font-semibold mb-2">Kiểm kê tiền cuối ca</h2>
              <div className="bg-[#F8F9FA] rounded-[16px] p-4 mb-4 flex flex-col">
                <table>
                  <colgroup>
                    <col style={{ width: 160 }} />
                    <col style={{ width: 24 }} />
                    <col style={{ width: 160 }} />
                    <col style={{ width: 24 }} />
                    <col />
                  </colgroup>
                  <tbody>
                    {CASH_KEYS.map((key) => (
                      <tr key={key}>
                        <td className="py-2 px-4">{formatMoney(Number(key))} đ</td>
                        <td>
                          <XMarkIcon className="h-3" />
                        </td>
                        <td className="py-2 px-4">
                          <Form.Item
                            name={["closingCashSnapshot", key]}
                            noStyle
                            rules={[
                              {
                                pattern: /^\d+$/,
                                message: "Vui lòng nhập số nguyên dương hoặc bằng 0",
                              },
                            ]}
                          >
                            <InputQuantity min={0} placeholder="0" />
                          </Form.Item>
                        </td>
                        <td>
                          <EqualsIcon className="h-3" />
                        </td>
                        <td className="py-2 px-4 text-right">
                          {formatMoney((closingCashSnapshot?.[key] || 0) * Number(key)) || 0} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6 pt-4 border-t-2 border-[#E5E7EB]">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">TỔNG:</span>
                    <span className="text-2xl font-semibold text-[#1A73E8]">
                      {formatMoney(totalCash) || 0} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-grow">
              <h2 className="text-base font-semibold mb-2">Checklist cuối ca</h2>
              {CHECKLIST_KEY.map((key) => (
                <Form.Item
                  key={key}
                  name={["closingChecklist", key]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox className="flex items-center gap-3 px-4 py-2 mb-4 rounded-xl bg-[#F8F9FA] hover:bg-[#E5E7EB] cursor-pointer transition-all">
                    {checklistKeyMap[key]}
                  </Checkbox>
                </Form.Item>
              ))}

              <Form.Item
                name="note"
                className="mt-6"
                label={<Label title="Ghi chú (nếu có)" bold />}
              >
                <Input.TextArea
                  placeholder="Nhập ghi chú"
                  className="!rounded-xl custom-input"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center mt-4 gap-3">
          <SubmitButton submitText="Kết thúc ca" loading={loading} onCancel={handleCancel} />
          <Button
            type="primary"
            htmlType="button"
            loading={loading}
            className=" h-8 rounded"
            onClick={handleSaveAndPrint}
          >
            <Icon icon="material-symbols-light:print-outline-rounded" width="24" height="24" />
            Kết thúc ca & In
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
