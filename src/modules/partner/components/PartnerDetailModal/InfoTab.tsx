import React from "react";
import {
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  BankOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  LinkOutlined,
  CreditCardOutlined,
  ContactsOutlined,
  BranchesOutlined,
  FileTextOutlined,
  PercentageOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Partner, partnerTypeMap } from "../../partner.model";
import { PartnerTypeTag } from "../../components/Tag";
import { getFullAddress } from "@/shared/utils/common.util";
import { formatMoney } from "@/shared/utils/number.util";
import { InfoField } from "@/shared";

// ──── Helpers ────

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

// ──── Main ────
export const InfoTab: React.FC<{ data: Partner }> = ({ data }) => (
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Left: Partner Info Card */}
    <div className="flex-1">
      <div className="flex flex-col w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 text-xl font-bold">
            {data.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{data.name}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                {data.code}
              </span>
              {data.types?.map((t) => (
                <PartnerTypeTag key={t} value={t} size="sm" />
              ))}
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="grid grid-cols-2">
          <InfoField icon={<BranchesOutlined />} label="Nhóm đối tác">
            {data.group?.name}
          </InfoField>
          <InfoField icon={<BankOutlined />} label="Mã số thuế">
            {data.taxCode}
          </InfoField>
          <InfoField icon={<PhoneOutlined />} label="Số điện thoại">
            {data.phone ? (
              <a href={`tel:${data.phone}`} className="text-blue-600 hover:underline">
                {data.phone}
              </a>
            ) : null}
          </InfoField>
          <InfoField icon={<MailOutlined />} label="Email">
            {data.email ? (
              <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
                {data.email}
              </a>
            ) : null}
          </InfoField>
          <InfoField icon={<LinkOutlined />} label="Zalo">
            {data.zaloLink ? (
              <a
                href={data.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate block"
              >
                {data.zaloLink}
              </a>
            ) : null}
          </InfoField>
          <InfoField icon={<TeamOutlined />} label="Nhân viên phụ trách">
            {data.staff ? (
              <>
                {data.staff.name}
                {data.staff.code && <span className="text-gray-400 ml-1">({data.staff.code})</span>}
              </>
            ) : null}
          </InfoField>
          <InfoField icon={<HomeOutlined />} label="Địa chỉ" fullWidth>
            {getFullAddress(data.address) || null}
          </InfoField>
          <InfoField icon={<FileTextOutlined />} label="Ghi chú" fullWidth>
            {data.note}
          </InfoField>
        </div>

        {/* Representative */}
        {data.representative && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Người đại diện
            </h4>
            <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <UserOutlined className="text-gray-400" />
                <span className="font-medium text-sm">{data.representative.name}</span>
                {data.representative.position && (
                  <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {data.representative.position}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {data.representative.phone && (
                  <span>
                    <PhoneOutlined className="mr-1" />
                    {data.representative.phone}
                  </span>
                )}
                {data.representative.email && (
                  <span>
                    <MailOutlined className="mr-1" />
                    {data.representative.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Term */}
        {data.paymentTerm && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Điều khoản thanh toán
            </h4>
            <div className="flex flex-wrap gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarOutlined className="text-gray-400" />
                <span className="text-gray-500">Nợ tối đa:</span>
                <span className="font-medium">
                  {formatMoney(data.paymentTerm.maxDebtAmount) || "—"} VNĐ
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ClockCircleOutlined className="text-gray-400" />
                <span className="text-gray-500">Ngày nợ tối đa:</span>
                <span className="font-medium">{data.paymentTerm.maxDebtDays ?? "—"} ngày</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Tỷ lệ cọc (%):</span>
                <span className="font-medium">
                  {data.paymentTerm.depositRate != null ? `${data.paymentTerm.depositRate}%` : "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Right: Summary */}
    <div className="lg:w-72 flex-shrink-0 flex flex-col gap-3">
      <SummaryCard
        icon={<CreditCardOutlined style={{ fontSize: 20 }} />}
        label="Tài khoản ngân hàng"
        value={data.banks?.length ?? 0}
        color="#3b82f6"
      />
      <SummaryCard
        icon={<ContactsOutlined style={{ fontSize: 20 }} />}
        label="Người liên hệ"
        value={data.contacts?.length ?? 0}
        color="#10b981"
      />
    </div>
  </div>
);
