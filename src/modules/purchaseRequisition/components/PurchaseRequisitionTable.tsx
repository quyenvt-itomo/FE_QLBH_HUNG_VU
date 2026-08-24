import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { PurchaseRequisition } from "../purchaseRequisition.model";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { ApproveStatusTag } from "@/shared";
import { ColumnsConfigType } from "@/shared";
import { File } from "@/shared/interfaces/file";
import { MediaDropdown } from "@/shared";
import { EntityInfo } from "@/shared";

export const PurchaseRequisitionTable: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const cols: ColumnsConfigType<PurchaseRequisition> = useMemo(
    () => [
      {
        title: "Số phiếu",
        key: "code",
        width: 120,
        fixed: "left",
        render: (record: PurchaseRequisition) => (
          <EntityInfo
            title={record.code}
            subTitle={formatDateTimeDDMMYYYY(record.createdAt)}
            onClick={onViewDetail ? () => onViewDetail(record) : undefined}
          />
        ),
      },
      {
        title: "Mua theo đơn hàng",
        dataIndex: ["order", "code"],
        key: "orderCode",
        width: 150,
      },
      {
        title: "Mua theo LSX",
        dataIndex: ["production", "code"],
        key: "productionCode",
        width: 150,
      },
      {
        title: "Người đề nghị",
        dataIndex: ["requester", "name"],
        key: "requesterName",
        width: 120,
      },
      {
        title: "Mã nhân sự",
        dataIndex: ["requester", "code"],
        key: "requesterCode",
        width: 120,
      },
      {
        title: "Số điện thoại",
        dataIndex: ["requester", "phone"],
        key: "requesterPhone",
        width: 120,
      },
      {
        title: "Phòng ban đề nghị",
        dataIndex: ["department", "name"],
        key: "departmentName",
        width: 150,
      },
      {
        title: "Tài liệu",
        dataIndex: "document",
        key: "document",
        width: 120,
        align: "center",
        render: (value: File[]) => <MediaDropdown files={value} />,
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 200,
      },
      {
        title: "Trạng thái",
        dataIndex: "approveStatus",
        key: "approveStatus",
        align: "center",
        fixed: "right",
        width: 80,
        render: (value: PurchaseRequisition["approveStatus"]) => <ApproveStatusTag value={value} />,
      },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig
      columns={cols}
      itemName="phiếu"
      tableKey="purchase-requisition-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
