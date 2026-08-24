import React from "react";
import { Modal, Descriptions, Row, Col, Table, TableProps } from "antd";
import { ReferralCodeList } from "@/modules/referralCode";
import { PurchaseRequisition } from "../purchaseRequisition.model";
import { formatDate, formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { DocumentGroup } from "@/shared";
import { resolveByPath } from "@/shared/utils/common.util";
import { ProductTypeTag } from "@/modules/product";
import { formatQuantity } from "@/shared/utils/number.util";
import { ApproveStatusTag } from "@/shared";

interface Props {
  open: boolean;
  data?: PurchaseRequisition;
  onClose: () => void;
  onOpenUpdate?: (r: PurchaseRequisition) => void;
}

export const PurchaseRequisitionDetailModal: React.FC<Props> = ({
  open,
  data,
  onClose,
  onOpenUpdate,
}) => {
  if (!data) return null;

  const info = [
    { label: "S? phi?u", value: data.code ?? "--" },
    { label: "Ngày ð? ngh?", value: formatDateTimeDDMMYYYY(data.timeAt) },
    { label: "B? ph?n", value: resolveByPath(data, ["department", "name"]) ?? "--" },
    { label: "Ngý?i ð? ngh?", value: resolveByPath(data, ["requester", "name"]) },
    { label: "Tr?ng thái", value: <ApproveStatusTag value={data.approveStatus} /> },
    { label: "Ngý?i phê duy?t", value: resolveByPath(data, ["approver", "name"]) },
    { label: "Ngày phê duy?t", value: data.approvedAt ? formatDate(data.approvedAt) : "--" },
    { label: "Ghi chú", value: data.note ?? "--" },
  ];

  const columns: TableProps["columns"] = [
    {
      title: "STT",
      dataIndex: "__idx",
      key: "index",
      width: 40,
      align: "center",
      render: (_, __, index) => String(index + 1),
    },
    {
      title: "M? hàng hóa",
      dataIndex: ["product", "code"],
      key: "productCode",
      width: 150,
      fixed: "left",
    },
    {
      title: "Tên hàng hóa",
      dataIndex: ["product", "name"],
      key: "productName",
      width: 280,
    },
    {
      title: "Lo?i",
      dataIndex: ["product", "type"],
      key: "productType",
      width: 120,
      align: "center",
      render: (val) => <ProductTypeTag value={val} />,
    },
    {
      title: "ÐVT",
      dataIndex: ["unit", "name"],
      key: "unit",
      width: 100,
      align: "center",
    },
    {
      title: "S? lý?ng",
      dataIndex: "quantity",
      key: "quantity",
      width: 180,
      align: "right",
      render: (val) => formatQuantity(val),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  return (
    <Modal
      title={"Chi ti?t phi?u ð? ngh? mua v?t tý"}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      maskClosable={false}
      width="100vw"
      className="fullscreen-modal"
    >
      <div className="flex h-full">
        {/* Main content */}
        <div className="flex flex-col flex-1 gap-4 h-full overflow-y-auto scrollbar-hide">
          <Descriptions column={2} size="small" bordered>
            {info.map((i, idx) => (
              <Descriptions.Item
                key={idx}
                label={i.label}
                styles={{
                  label: { width: 140 },
                }}
                span={1}
              >
                {i.value}
              </Descriptions.Item>
            ))}
          </Descriptions>

          <div className="flex flex-col">
            <h4 className="mb-2">Chi ti?t hàng</h4>
            <Table
              pagination={false}
              dataSource={data.lines || []}
              columns={columns as any}
              rowKey={(r: any) => r.id || `${r.productId}-${r.unitId}-${r.quantity}`}
              size="small"
            />
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-2 pb-2 ">
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              T?p ðính kèm
            </h4>
            <DocumentGroup files={data.document} />
          </div>
        </div>

        {/* Ph?n m? gi?i thi?u - partial t? x? l? toàn b? logic */}
        <div className="w-96 shrink-0 ml-4 border-l pl-4 h-full overflow-y-auto scrollbar-hide">
          <ReferralCodeList purchaseRequisition={data} />
        </div>
      </div>
    </Modal>
  );
};
