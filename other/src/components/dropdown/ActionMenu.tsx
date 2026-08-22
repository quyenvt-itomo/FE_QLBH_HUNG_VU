import React from "react";
import { Dropdown, Button } from "antd";
import {
  ChartPieIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  InboxStackIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface DropdownActionProps {
  onCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  onViewDetails?: () => void;
  onCancel?: () => void;
  onRestore?: () => void;
  onExportExcel?: () => void;
  onPrint?: () => void;
  onViewReport?: () => void;
  onViewInventory?: () => void;
  type?: "vertical" | "horizontal";
  isSelected?: boolean;
}

const DropdownAction: React.FC<DropdownActionProps> = ({
  onCopy,
  onEdit,
  onDelete,
  onSetDefault,
  onViewDetails,
  onCancel,
  onRestore,
  onExportExcel,
  onPrint,
  onViewReport,
  onViewInventory,
  type = "vertical",
  isSelected = false,
}) => {
  const items = [
    onCopy && {
      label: "Sao chép",
      key: "copy",
      icon: <DocumentDuplicateIcon className="w-7 h-7 text-white bg-yellow-500 rounded-md p-1" />,
      onClick: onCopy, // Assign the onCopy function
    },
    onSetDefault && {
      label: "Đặt làm mặc định",
      key: "setDefault",
      icon: <CheckIcon className="w-7 h-7 text-white bg-yellow-500 rounded-md p-1" />,
      onClick: onSetDefault, // Assign the onSetDefault function
    },
    onViewDetails && {
      label: "Xem chi tiết",
      key: "viewDetails",
      icon: <DocumentDuplicateIcon className="w-7 h-7 text-white bg-green-500 rounded-md p-1" />,
      onClick: onViewDetails, // Assign the onViewDetails function
    },
    onExportExcel && {
      label: "Xuất Excel",
      key: "exportExcel",
      icon: <DocumentDuplicateIcon className="w-7 h-7 text-white bg-green-500 rounded-md p-1" />,
      onClick: onExportExcel, // Assign the onExportExcel function
    },
    onPrint && {
      label: "In PDF",
      key: "print",
      icon: <DocumentDuplicateIcon className="w-7 h-7 text-white bg-blue-500 rounded-md p-1" />,
      onClick: onPrint, // Assign the onPrint function
    },
    onViewReport && {
      label: "Xem báo cáo",
      key: "viewReport",
      icon: <ChartPieIcon className="w-7 h-7 text-white bg-amber-500 rounded-md p-1" />,
      onClick: onViewReport, // Assign the onViewReport function
    },
    onViewInventory && {
      label: "Xem tồn kho",
      key: "viewInventory",
      icon: <InboxStackIcon className="w-7 h-7 text-white bg-purple-500 rounded-md p-1" />,
      onClick: onViewInventory, // Assign the onViewInventory function
    },
    onEdit && {
      label: "Chỉnh sửa",
      key: "edit",
      icon: <PencilSquareIcon className="w-7 h-7 text-white bg-blue-500 rounded-md p-1" />,
      onClick: onEdit, // Assign the onEdit function
    },
    onCancel && {
      label: "Hủy",
      key: "cancel",
      icon: <XMarkIcon className="w-7 h-7 text-white bg-red-500 rounded-md p-1" />,
      onClick: onCancel, // Assign the onCancel function
    },
    onRestore && {
      label: "Khôi phục",
      key: "restore",
      icon: <CheckIcon className="w-7 h-7 text-white bg-green-500 rounded-md p-1" />,
      onClick: onRestore, // Assign the onRestore function
    },
    onDelete && {
      label: "Xóa",
      key: "delete",
      icon: <TrashIcon className="w-7 h-7 text-white bg-red-500 rounded-md p-1" />,
      onClick: onDelete, // Assign the onDelete function
    },
  ].filter((item) => item !== undefined);

  if (items.length === 0) return null;

  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow trigger={["hover"]}>
      <Button className="border-0 bg-transparent shadow-none">
        {type === "vertical" ? (
          <EllipsisVerticalIcon className={isSelected ? "w-5 h-5 text-white" : "w-5 h-5"} />
        ) : (
          <EllipsisHorizontalIcon className={isSelected ? "w-5 h-5 text-white" : "w-5 h-5"} />
        )}
      </Button>
    </Dropdown>
  );
};

export default DropdownAction;
