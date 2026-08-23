import React from "react";
import { Modal, Descriptions, Table } from "antd";
import { BillOfMaterial } from "../billOfMaterial.model";
import Title from "@/shared/components/display/Title";
import { formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";

interface Props {
  open: boolean;
  data?: BillOfMaterial;
  onClose: () => void;
  onOpenUpdate?: (r: BillOfMaterial) => void;
}
export const BillOfMaterialDetailModal: React.FC<Props> = ({
  open,
  data,
  onClose,
  onOpenUpdate,
}) => {
  if (!data) return null;
  const lineCols = [
    { title: "NVL", dataIndex: ["materialSnapshot", "name"], key: "name", width: 200 },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "right" as const,
      render: (v: number) => formatQuantity(v),
    },
    {
      title: "% Hao hụt",
      dataIndex: "wastePercent",
      key: "waste",
      width: 80,
      align: "right" as const,
      render: (v: number) => v + "%",
    },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
  ];
  return (
    <Modal
      title={"Chi tiết Định mức NVL"}
      open={open}
      onCancel={onClose}
      footer={
        onOpenUpdate ? (
          <button className="text-blue-500" onClick={() => onOpenUpdate(data)}>
            Chỉnh sửa
          </button>
        ) : null
      }
      width={900}
      destroyOnClose
    >
      <Title content="Thông tin hàng hóa" />
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="Mã SP">
          {resolveByPath(data, ["product", "code"])}
        </Descriptions.Item>
        <Descriptions.Item label="Tên SP">
          {resolveByPath(data, ["product", "name"])}
        </Descriptions.Item>
      </Descriptions>
      <Title content={"Nguyên vật liệu (" + (data.lines?.length || 0) + " dòng)"} />
      <Table
        dataSource={data.lines || []}
        columns={lineCols}
        rowKey="id"
        size="small"
        pagination={false}
      />
    </Modal>
  );
};
