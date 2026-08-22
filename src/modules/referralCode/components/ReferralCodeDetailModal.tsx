import React from "react";
import { Modal, Descriptions, Table, Tag, TableProps } from "antd";
import { ReferralCode } from "../referralCode.model";
import { formatDate } from "@/shared/utils/date.util";
import { resolveByPath } from "@/shared/utils/common.util";

interface Props {
  open: boolean;
  data?: ReferralCode;
  onClose: () => void;
}

export const ReferralCodeDetailModal: React.FC<Props> = ({ open, data, onClose }) => {
  if (!data) return null;

  const lineColumns: TableProps["columns"] = [
    { title: "Mã SP", dataIndex: "productCode", key: "pCode", width: 100 },
    { title: "Tên sản phẩm", dataIndex: "productName", key: "pName" },
    { title: "ĐVT", dataIndex: "unitName", key: "unit", width: 100, align: "center" },
    { title: "Số lượng", dataIndex: "quantity", key: "qty", width: 120, align: "right" },
  ];

  return (
    <Modal
      title="Chi tiết mã giới thiệu"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      destroyOnClose
    >
      <div className="flex flex-col relative">
        {/* Thông tin chung */}
        <Descriptions column={2} size="small" bordered className="mb-4">
          <Descriptions.Item label="Mã code" span={2}>
            <code className="text-blue-700 font-mono text-sm">{data.code}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            {resolveByPath(data, ["staff", "name"])}
          </Descriptions.Item>
          <Descriptions.Item label="Tạo lúc">
            {data.createdAt ? formatDate(data.createdAt) : "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Hết hạn">
            {data.expiresAt ? formatDate(data.expiresAt) : "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={data.isUsed ? "green" : "orange"}>
              {data.isUsed ? "Đã dùng" : "Chưa dùng"}
            </Tag>
          </Descriptions.Item>
          {data.isUsed && (
            <Descriptions.Item label="Dùng lúc">
              {data.usedAt ? formatDate(data.usedAt) : "--"}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Đối tác" span={2}>
            {data.partnerSnapshot ? (
              <span>
                {data.partnerSnapshot.name}
                {data.partnerSnapshot.taxCode ? ` (${data.partnerSnapshot.taxCode})` : ""}
              </span>
            ) : (
              "Chưa gán"
            )}
          </Descriptions.Item>
        </Descriptions>

        {/* Danh sách sản phẩm trong mã */}
        {data.linesSnapshot && data.linesSnapshot.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Sản phẩm trong mã</h4>
            <Table
              dataSource={data.linesSnapshot}
              columns={lineColumns}
              rowKey="productId"
              size="small"
              pagination={false}
            />
          </div>
        )}

        {data.isLock && (
          <div className="flex items-center justify-center h-full w-full absolute top-0 left-0 bg-white/40 dark:bg-neutral-900/40">
            <div className="text-red-500 font-bold text-lg border-red-500 border-2 px-3 py-1 rotate-12 flex items-center justify-center">
              Đã khóa
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
