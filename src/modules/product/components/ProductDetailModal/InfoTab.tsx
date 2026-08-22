import React from "react";
import { Tag } from "antd";
import { InfoField } from "@/shared/components/display/InfoField";
import { Product } from "../../product.model";
import { formatMoney } from "@/shared/utils/number.util";
import { ProductTypeTag } from "../Tag";
import { CubeIcon } from "@heroicons/react/24/solid";

const SummaryCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export const InfoTab: React.FC<{ data: Product }> = ({ data }) => (
  <div className="flex flex-col lg:flex-row gap-6 pt-2">
    <div className="flex-1">
      <div className="flex flex-col bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-xl font-bold">
            <CubeIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{data.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Tag color="blue" className="font-mono text-xs">
                {data.code}
              </Tag>
              <ProductTypeTag value={data.type} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <InfoField label="Mã hàng hóa">
            <span className="font-mono text-blue-600">{data.code}</span>
          </InfoField>
          <InfoField label="Đơn vị tính">{data.baseUnit?.name}</InfoField>
          <InfoField label="Giá">{formatMoney(data.price)}</InfoField>
          <InfoField label="%VAT">{data.taxRate != null ? `${data.taxRate}%` : null}</InfoField>
          <InfoField label="Công khai">
            <Tag color={data.isPublic ? "blue" : "default"}>{data.isPublic ? "Có" : "Không"}</Tag>
          </InfoField>
          <InfoField label="Nhóm hàng hóa">{data.group?.name}</InfoField>
          <InfoField label="Ghi chú" fullWidth>
            {data.note}
          </InfoField>
        </div>

        {data.extraUnits && data.extraUnits.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Đơn vị quy đổi</h4>
            <div className="flex flex-col gap-2">
              {data.extraUnits.map((eu, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-sm">{eu.unit?.name || eu.unitId}</span>
                  <span className="text-gray-400">
                    1 {eu.unit?.name} = {eu.conversionRate} {data.baseUnit?.name}
                  </span>
                  {eu.pricePerUnit != null && (
                    <span className="text-sm text-gray-600">
                      Giá: {formatMoney(eu.pricePerUnit)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
