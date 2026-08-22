import React, { useEffect, useState } from "react";
import { Modal, Tabs } from "antd";
import { Service, serviceTypeMap } from "../../service.model";
import { ServiceTypeTag } from "../Tag";
import { DetailModalProps } from "@/shared/interfaces/common";
import { InfoField } from "@/shared/components/display/InfoField";
import { formatMoney } from "@/shared/utils/number.util";

const InfoTab: React.FC<{ data: Service }> = ({ data }) => (
  <div className="pt-4">
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-xl font-bold">
          {data.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{data.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {data.code}
            </span>
            <ServiceTypeTag value={data.type} size="sm" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <InfoField label="Mã dịch vụ">
          <span className="font-mono text-blue-600">{data.code}</span>
        </InfoField>
        <InfoField label="%VAT">{data.taxRate != null ? `${data.taxRate}%` : null}</InfoField>
        <InfoField label="Ghi chú" fullWidth>
          {data.note}
        </InfoField>
      </div>
      {data.units && data.units.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Đơn vị tính</h4>
          <div className="flex flex-col gap-2">
            {data.units.map((u, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 text-sm">
                <span className="font-medium w-20">{u.unit?.name || u.unitId}</span>
                <span className="text-gray-500">
                  Giá đầu vào: <b>{formatMoney(u.costPrice)}</b>
                </span>
                <span className="text-gray-500">
                  Giá đầu ra: <b>{formatMoney(u.unitPrice)}</b>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export const ServiceDetailModal: React.FC<DetailModalProps<Service>> = ({
  open,
  data,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("info");
  useEffect(() => {
    if (open) setActiveTab("info");
  }, [open]);
  if (!data) return null;

  const contentMap: Record<string, React.ReactNode> = { info: <InfoTab data={data} /> };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-800">{data.name}</span>
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
      width={520}
    >
      <div className="flex flex-col min-h-[50vh] gap-4">
        <InfoTab data={data} />
      </div>
    </Modal>
  );
};
