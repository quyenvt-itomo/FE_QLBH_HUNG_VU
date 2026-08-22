import React, { useEffect, useState } from "react";
import { Modal, Tabs, Tag } from "antd";
import { PaymentTerm } from "../paymentTerm.model";
import { DetailModalProps } from "@/shared/interfaces/common";
import { InfoField } from "@/shared/components/display/InfoField";
import { formatMoney } from "@/shared/utils/number.util";

const InfoTab: React.FC<{ data: PaymentTerm }> = ({ data }) => (
  <div className="pt-4">
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-xl font-bold">
          {data.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{data.name}</h3>
          <Tag color="blue" className="font-mono text-xs">
            {data.code}
          </Tag>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <InfoField label="Mã">
          <span className="font-mono text-blue-600">{data.code}</span>
        </InfoField>
        <InfoField label="Tỷ lệ cọc">
          {data.depositRate != null ? `${data.depositRate}%` : null}
        </InfoField>
        <InfoField label="Ngày nợ tối đa">{data.maxDebtDays ?? null}</InfoField>
        <InfoField label="Nợ tối đa">
          {data.maxDebtAmount != null ? formatMoney(data.maxDebtAmount) : null}
        </InfoField>
        <InfoField label="Ghi chú" fullWidth>
          {data.note}
        </InfoField>
      </div>
    </div>
  </div>
);

export const PaymentTermDetailModal: React.FC<DetailModalProps<PaymentTerm>> = ({
  open,
  data,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("info");
  useEffect(() => {
    if (open) setActiveTab("info");
  }, [open]);
  if (!data) return null;
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">{data.name}</span>
          <span className="font-mono text-sm text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
            {data.code}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      width={700}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[{ key: "info", label: "Thông tin" }]}
      />
      <InfoTab data={data} />
    </Modal>
  );
};
