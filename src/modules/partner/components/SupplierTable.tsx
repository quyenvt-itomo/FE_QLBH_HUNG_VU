import React, { useMemo } from "react";
import { ColumnsConfigType, ObjectTableProps, TableColumnConfig } from "@/shared/components";
import { getFullAddress } from "@/shared/utils/common.util";
import { Partner } from "../partner.model";
import { formatMoney } from "@/shared/utils";

export const SupplierTable: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const columns: ColumnsConfigType<Partner> = useMemo(
    () => [
      {
        title: "Mã nhà cung cấp",
        dataIndex: "code",
        key: "code",
        width: 150,
        fixed: "left",
        render: (value: string, record: Partner) => (
          <span
            className="cursor-pointer font-mono text-blue-600 hover:underline"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetail?.(record);
            }}
          >
            {value}
          </span>
        ),
      },
      { title: "Tên nhà cung cấp", dataIndex: "name", key: "name", width: 250 },
      {
        title: "Phân loại",
        dataIndex: "isOrganization",
        key: "isOrganization",
        width: 110,
        render: (value: boolean) => (value ? "Tổ chức" : "Cá nhân"),
      },
      { title: "Mã số thuế", dataIndex: "taxCode", key: "taxCode", width: 150 },
      { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 150, align: "center" },
      { title: "Email", dataIndex: "email", key: "email", width: 220 },
      { title: "Nhóm nhà cung cấp", dataIndex: ["group", "name"], key: "group", width: 180 },
      {
        title: "Nợ hiện tại",
        dataIndex: "currentDebtAmount",
        key: "currentDebtAmount",
        width: 140,
        align: "right",
        render: (value: number) => formatMoney(value),
      },
      {
        title: "Người đại diện",
        dataIndex: ["representative", "name"],
        key: "representativeName",
        width: 180,
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        width: 280,
        render: (address: Partner["address"]) => getFullAddress(address),
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 120,
        render: (value: string) => <span className="truncate block max-w-96">{value}</span>,
      },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName="nhà cung cấp"
      tableKey="supplier-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
