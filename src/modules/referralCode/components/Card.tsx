import React from "react";
import { Tag, Button, App, Tooltip } from "antd";
import { CloseOutlined, CopyOutlined } from "@ant-design/icons";
import { ReferralCode } from "../referralCode.model";
import { formatDate } from "@/shared/utils/date.util";
import { handleCopy } from "@/shared/utils/common.util";
import { TruckIcon, UserIcon } from "@heroicons/react/24/solid";
import { AppCardProps } from "@/shared/interfaces/common";

/** Card hiển thị gọn: mã, người tạo, NCC, thời gian tạo. Click để mở Detail. */
export const ReferralCodeCardBase: React.FC<AppCardProps<ReferralCode>> = ({ item, onClick }) => {
  const staff = item.staff || item.staffSnapshot;
  const partner = item.partner || item.partnerSnapshot;
  const isLock = item.isLock;
  const { message } = App.useApp();

  return (
    <div
      onClick={() => onClick?.(item)}
      className={`
        flex flex-col gap-1 px-3 py-2 rounded-lg border cursor-pointer text-sm
        transition-all duration-200 hover:shadow-sm hover:border-blue-300 group
        bg-white border-gray-200 relative
        dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-blue-700
        ${item.isUsed ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        {/* Thời gian tạo */}
        <span className="text-gray-400 dark:text-gray-500 text-2xs w-24 shrink-0">
          {item.createdAt ? formatDate(item.createdAt) : "--"}
        </span>

        {/* Tag trạng thái */}
        <Tag color={item.isUsed ? "green" : "orange"} className="m-0 shrink-0">
          {item.isUsed ? "Đã dùng" : "Chưa dùng"}
        </Tag>
      </div>

      <div className="flex items-center gap-2">
        {/* Mã code */}
        <code className="text-blue-700 dark:text-blue-300 font-mono font-bold shrink-0 truncate">
          {item.code}
        </code>
        {!isLock && (
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(item.code, message);
            }}
            className="shrink-0"
          />
        )}
      </div>

      {/* Người tạo */}
      <div className="flex items-center gap-1">
        <UserIcon className="h-3 w-3 text-gray-400 dark:text-gray-500 shrink-0" />
        <span className="text-gray-600 dark:text-gray-400 text-xs w-28 shrink-0 truncate">
          {staff?.name || "--"}
        </span>
      </div>

      {/* NCC / Đối tác */}
      {partner && (
        <div className="flex items-center gap-1">
          <TruckIcon className="h-3 w-3 text-gray-400 dark:text-gray-500 shrink-0" />
          <span className="text-gray-500 dark:text-gray-500 text-xs flex-1 truncate">
            {partner.name}
          </span>
        </div>
      )}

      {isLock && (
        <div className="flex items-center justify-center h-full w-full absolute top-0 left-0 bg-white/20 dark:bg-neutral-900/20">
          <div className="text-red-500 font-bold border-red-500 border-2 px-2 py-1 rotate-12 flex items-center justify-center">
            Đã khóa
          </div>
        </div>
      )}
    </div>
  );
};

/** Card hiển thị gọn: mã, người tạo, NCC, thời gian tạo. Click để mở Detail. */
export const ReferralCodeCardPublic: React.FC<AppCardProps<ReferralCode>> = ({
  item,
  onDelete,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <code className="text-blue-700 font-mono text-sm font-bold">{item.code}</code>
          <Tooltip title="Sao chép">
            <Button type="text" size="small" onClick={() => handleCopy(item.code)}>
              <CopyOutlined />
            </Button>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-500 text-xs italic">
            Hết hạn: {item.expiresAt ? formatDate(item.expiresAt) : "--"}
          </span>
          <Tag color={item.isUsed ? "orange" : "green"}>
            {item.isUsed ? "Đã sử dụng" : "Chưa sử dụng"}
          </Tag>
          <Button type="text" size="small" danger onClick={() => onDelete?.(item)}>
            <CloseOutlined />
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-600 space-y-0.5">
        <div className="flex gap-3 flex-wrap items-center">
          {item.staffSnapshot && (
            <span>
              Người giới thiệu: <b>{item.staffSnapshot.name}</b>
            </span>
          )}
          {item.staffSnapshot?.phone && <span>SĐT: {item.staffSnapshot.phone}</span>}
        </div>
      </div>
    </div>
  );
};
