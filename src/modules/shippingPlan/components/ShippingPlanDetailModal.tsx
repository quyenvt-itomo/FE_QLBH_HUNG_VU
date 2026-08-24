import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { ShippingPlan } from "../shippingPlan.model";
import { resolveByPath } from "@/shared/utils/common.util";
import { formatMoney, formatQuantity, formatPercentage } from "@/shared/utils/number.util";
import { formatDateTime } from "@/shared/utils/date.util";
import { ApproveStatus } from "@/modules/shared/business.model";
import { ApproveStatusTag } from "@/shared";

export const ShippingPlanDetailModal: React.FC<DetailModalProps<ShippingPlan>> = ({
  open,
  data,
  loading,
  onClose,
  onEdit,
}) => {
  if (!data) return null;

  return (
    <Modal
      title="Chi tiết phương án vận chuyển"
      open={open}
      onCancel={onClose}
      centered
      width={720}
      footer={null}
    >
      <Descriptions bordered column={2} size="small" className="mt-4">
        <Descriptions.Item label="Mã phương án" span={1}>
          <span className="font-mono font-semibold">{data.code}</span>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày dự kiến" span={1}>
          {formatDateTime(data.plannedAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Đơn vị vận chuyển" span={2}>
          {resolveByPath(data, ["partner", "name"]) || "—"}
        </Descriptions.Item>

        <Descriptions.Item label="Mã ĐVVC" span={1}>
          {resolveByPath(data, ["partner", "code"]) || "—"}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái" span={1}>
          <ApproveStatusTag value={data.approveStatus} />
        </Descriptions.Item>

        <Descriptions.Item label="Cước VC (chưa VAT)" span={1}>
          {formatMoney(data.unitPrice)}
        </Descriptions.Item>

        <Descriptions.Item label="Số chuyến" span={1}>
          {formatQuantity(data.quantity)}
        </Descriptions.Item>

        <Descriptions.Item label="Tiền cước" span={1}>
          {formatMoney(data.subTotal)}
        </Descriptions.Item>

        <Descriptions.Item label="%VAT" span={1}>
          {formatPercentage(data.taxRate)}
        </Descriptions.Item>

        <Descriptions.Item label="Tổng tiền" span={2}>
          <span className="font-semibold text-primary text-lg">
            {formatMoney(data.totalAmount)}
          </span>
        </Descriptions.Item>

        {data.note && (
          <Descriptions.Item label="Ghi chú" span={2}>
            {data.note}
          </Descriptions.Item>
        )}

        {data.approvedAt && (
          <>
            <Descriptions.Item label="Người duyệt" span={1}>
              {resolveByPath(data, ["approver", "name"]) || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày duyệt" span={1}>
              {formatDateTime(data.approvedAt)}
            </Descriptions.Item>
          </>
        )}

        {data.rejectReason && (
          <Descriptions.Item label="Lý do từ chối" span={2}>
            <span className="text-red-500">{data.rejectReason}</span>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};
