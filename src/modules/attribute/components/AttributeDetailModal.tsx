import React, { useEffect, useState } from "react";
import { Modal, Tabs, Tag } from "antd";
import { Attribute } from "../attribute.model";
import { attributeTypeMap } from "../attribute.enum";
import { DetailModalProps } from "@/shared/interfaces/common";
import { InfoField } from "@/shared";
import { AttributeTypeTag } from "./Tag";

const InfoTab: React.FC<{ data: Attribute }> = ({ data }) => (
  <div className="pt-4">
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800">{data.name}</h3>
        <AttributeTypeTag value={data.type} />
      </div>
      <div className="grid grid-cols-2">
        <InfoField label="Phạm vi">{data.store?.name || "Dùng chung"}</InfoField>
        <InfoField label="Loại">{attributeTypeMap[data.type]}</InfoField>
        <InfoField label="Ghi chú" fullWidth>
          {data.note}
        </InfoField>
      </div>
    </div>
  </div>
);

export const AttributeDetailModal: React.FC<DetailModalProps<Attribute>> = ({
  open,
  data,
  onClose,
}) => {
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
      <InfoTab data={data} />
    </Modal>
  );
};
