import React, { useState } from "react";
import { Modal, Progress, Tag } from "antd";
import { InfoCircleOutlined, LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { InventoryStreamData } from "../inventory.model";
import { formatQuantity } from "@/shared/utils/number.util";

interface Props {
  data?: InventoryStreamData;
}

const InventoryStreamInline: React.FC<Props> = ({ data }) => {
  const [open, setOpen] = useState(false);

  if (!data || data.totalVariants === 0) return null;

  const totalDocs = Object.values(data.byDocumentType).reduce((sum, val) => sum + val, 0);
  const percent = Math.round(
    ((data.totalVariants - data.pendingVariants) / data.totalVariants) * 100,
  );

  const isDone = data.pendingVariants === 0 && data.processingVariants === 0;

  return (
    <>
      {/* 🔹 Inline text */}
      <div className="flex items-center gap-2 text-sm flex-shrink-0">
        {/* icon trạng thái */}
        <span className="flex items-center">
          {isDone ? (
            <CheckCircleOutlined className="text-green-500" />
          ) : (
            <LoadingOutlined className="text-blue-500 animate-spin" />
          )}
        </span>

        {/* text */}
        <span className="text-gray-600">
          {isDone ? (
            <>
              Đã tính xong tồn kho cho <b>{totalDocs}</b> phiếu
            </>
          ) : (
            <>
              Đang tính tồn kho cho <b>{totalDocs}</b> phiếu (<b>{data.totalVariants}</b> mã hàng)
            </>
          )}
        </span>

        {/* info icon */}
        <InfoCircleOutlined
          className="cursor-pointer text-gray-400 hover:text-blue-500"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* 🔹 Modal */}
      <Modal
        title="📦 Tiến trình tính tồn kho"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col gap-4 mt-8">
          {/* progress */}
          <Progress percent={percent} status={isDone ? "success" : "active"} />

          {/* stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-gray-400 text-xs">Tổng</div>
              <div className="font-semibold text-primary">
                {formatQuantity(data.totalVariants) || "0"} mã hàng
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Đang xử lý</div>
              <div>
                <Tag color="processing" className="m-0">
                  {formatQuantity(data.processingVariants) || 0}
                </Tag>
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Chờ</div>
              <div>
                <Tag className="m-0">{formatQuantity(data.pendingVariants) || "0"}</Tag>
              </div>
            </div>
          </div>

          {/* breakdown */}
          <div className="border-t pt-3 text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              <span>🧾 Đơn bán: {data.byDocumentType.saleOrders}</span>
              <span>📥 Đơn nhập: {data.byDocumentType.purchaseOrders}</span>
              <span>↩️ Hoàn bán: {data.byDocumentType.saleReturns}</span>
              <span>↪️ Trả NCC: {data.byDocumentType.purchaseReturns}</span>
              <span>🔁 Chuyển kho: {data.byDocumentType.transferVouchers}</span>
              <span>📊 Kiểm kho: {data.byDocumentType.adjustmentVouchers}</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InventoryStreamInline;
