import React, { useEffect, useState } from "react";
import { Modal, Tabs, Tag } from "antd";
import { Role } from "../role.model";
import { DetailModalProps } from "@/shared/interfaces/common";
import { InfoField } from "@/shared/components";

const InfoTab: React.FC<{ data: Role }> = ({ data }) => (
  <div className="pt-4">
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800">{data.name}</h3>
        <Tag color="blue">{data.userCount ?? 0} users</Tag>
      </div>
      <div className="grid grid-cols-2">
        <InfoField label="Số người dùng">{data.userCount ?? 0}</InfoField>
        <InfoField label="Ghi chú" fullWidth>
          {data.note}
        </InfoField>
      </div>
    </div>
  </div>
);

export const RoleDetailModal: React.FC<DetailModalProps<Role>> = ({ open, data, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  useEffect(() => {
    if (open) setActiveTab("info");
  }, [open]);
  if (!data) return null;
  return (
    <Modal
      title={<span className="text-lg font-bold">{data.name}</span>}
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
