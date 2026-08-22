import React, { useEffect, useState } from "react";
import { Modal, Tabs, Tag } from "antd";
import { Warehouse } from "../warehouse.model";
import { DetailModalProps } from "@/shared/interfaces/common";
import { InfoField } from "@/shared/components/display/InfoField";
import { getFullAddress } from "@/shared/utils/common.util";

const InfoTab: React.FC<{ data: Warehouse }> = ({ data }) => (
  <div className="pt-4">
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800">{data.name}</h3>
        <Tag color="blue" className="font-mono text-xs">
          {data.code}
        </Tag>
      </div>
      <div className="grid grid-cols-2">
        <InfoField label="Mã">
          <span className="font-mono text-blue-600">{data.code}</span>
        </InfoField>
        <InfoField label="SĐT">{data.phone}</InfoField>
        <InfoField label="Địa chỉ" fullWidth>
          {getFullAddress(data.address)}
        </InfoField>
        <InfoField label="Ghi chú" fullWidth>
          {data.note}
        </InfoField>
      </div>
    </div>
  </div>
);

export const WarehouseDetailModal: React.FC<DetailModalProps<Warehouse>> = ({
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
