import React from "react";
import { Button, Descriptions, Modal, Tag } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { IncomeExpense, IncomeExpenseTypeEnum, incomeExpenseTypeMap } from "../incomeExpense.model";

export const IncomeExpenseDetailModal: React.FC<DetailModalProps<IncomeExpense>> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;
  const isIncome = data.type === IncomeExpenseTypeEnum.INCOME;
  return <Modal open={open} centered destroyOnClose footer={null} title={`Chi tiết ${isIncome ? "phiếu thu" : "phiếu chi"} ${data.code || ""}`} onCancel={onClose}>
    <Descriptions bordered size="small" column={1}>
      <Descriptions.Item label="Loại"><Tag color={isIncome ? "success" : "error"}>{incomeExpenseTypeMap[data.type] || data.type}</Tag></Descriptions.Item>
      <Descriptions.Item label="Thời gian">{formatDateTimeDDMMYYYY(data.occurredAt)}</Descriptions.Item>
      <Descriptions.Item label="Số tiền"><span className={isIncome ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>{formatMoney(data.amount)}</span></Descriptions.Item>
      <Descriptions.Item label="Quỹ">{data.fund?.name || data.fundSnapshot?.name || "—"}</Descriptions.Item>
      <Descriptions.Item label={isIncome ? "Danh mục thu" : "Danh mục chi"}>{data.category?.name || data.categorySnapshot?.name || "—"}</Descriptions.Item>
      <Descriptions.Item label="Đối tác">{data.partner?.name || data.partnerSnapshot?.name || "—"}</Descriptions.Item>
      <Descriptions.Item label="Nội dung">{data.description || "—"}</Descriptions.Item>
      <Descriptions.Item label="Ghi chú">{data.note || "—"}</Descriptions.Item>
    </Descriptions>
    <div className="mt-4 flex justify-end gap-2"><Button onClick={onClose}>Đóng</Button>{onOpenUpdate && <Button type="primary" onClick={() => onOpenUpdate(data)}>Chỉnh sửa</Button>}</div>
  </Modal>;
};
