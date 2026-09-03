import React, { useMemo } from "react";
import { ColumnsConfigType, ObjectTableProps, TableColumnConfig } from "@/shared/components";
import { getFullAddress } from "@/shared/utils/common.util";
import { Partner } from "../partner.model";
import { formatMoney } from "@/shared/utils";
import { formatDateDDMMYYYY } from "@/shared/utils/date.util";

export const CustomerTable: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const columns = useMemo(
    (): ColumnsConfigType<Partner> => [
      {
        title: "Mã khách hàng",
        dataIndex: "code",
        key: "code",
        width: 130,
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
      { title: "Tên khách hàng", dataIndex: "name", key: "name", width: 230 },
      {
        title: "Phân loại",
        dataIndex: "isOrganization",
        key: "isOrganization",
        width: 110,
        hidden: true,
        render: (value: boolean) => (value ? "Tổ chức" : "Cá nhân"),
      },
      { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 140, align: "center" },
      { title: "Mã số thuế", dataIndex: "taxCode", key: "taxCode", width: 140 },
      { title: "CMND/CCCD", dataIndex: "identityCode", key: "identityCode", width: 140 },
      { title: "Email", dataIndex: "email", key: "email", width: 220, hidden: true },
      { title: "Nhóm khách hàng", dataIndex: ["group", "name"], key: "group", width: 170 },
      {
        title: "Nợ hiện tại",
        dataIndex: "receivableDebtAmount",
        key: "receivableDebtAmount",
        width: 140,
        align: "right",
        render: (value: number) => formatMoney(value),
      },
      {
        title: "Ngày giao dịch cuối",
        dataIndex: "lastTransactionAt",
        key: "lastTransactionAt",
        width: 150,
        render: (value: string | null) => (value ? formatDateDDMMYYYY(value) : "--"),
      },
      {
        title: "Người đại diện",
        dataIndex: ["representative", "name"],
        key: "representativeName",
        width: 180,
        hidden: true,
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        width: 280,
        hidden: true,
        render: (address: Partner["address"]) => getFullAddress(address),
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 220, hidden: true },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName="khách hàng"
      tableKey="customer-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
