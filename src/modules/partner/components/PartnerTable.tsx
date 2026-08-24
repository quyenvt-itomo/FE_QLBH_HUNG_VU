import React, { useMemo } from "react";

import { ObjectTableProps, TableColumnConfig, ColumnsConfigType } from "@/shared";
import { getFullAddress } from "@/shared/utils/common.util";

import { Partner, PartnerType } from "../partner.model";

interface PartnerTableProps extends ObjectTableProps {
  partnerType?: PartnerType;
  itemName?: string;
}

export const PartnerTable: React.FC<PartnerTableProps> = ({
  onViewDetail,
  partnerType,
  itemName = "đối tác",
  ...rest
}) => {
  const columns: ColumnsConfigType<Partner> = useMemo(
    () => [
      {
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: 100,
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
      { title: "Tên đối tác", dataIndex: "name", key: "name", width: 220 },
      { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 140, align: "center" },
      { title: "Email", dataIndex: "email", key: "email", width: 220 },
      { title: "Mã số thuế", dataIndex: "taxCode", key: "taxCode", width: 130 },
      {
        title: "Người đại diện",
        dataIndex: ["representative", "name"],
        key: "representativeName",
        width: 180,
      },
      {
        title: "Địa chỉ",
        dataIndex: "addresses",
        key: "addresses",
        width: 280,
        render: (addresses: Partner["addresses"]) => getFullAddress(addresses?.[0]),
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 220 },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName={itemName}
      tableKey={`partner-${partnerType || "all"}-table`}
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};

