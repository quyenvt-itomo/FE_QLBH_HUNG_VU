import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { ColumnsConfigType } from "@/shared";
import { getFullAddress } from "@/shared/utils/common.util";
import { Partner, PartnerType } from "../partner.model";
import { PartnerTypeTag } from "./Tag";

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
  const columns: ColumnsConfigType<Partner> = useMemo(() => {
    const baseColumns: ColumnsConfigType<Partner> = [
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
      { title: "Tên đối tác", dataIndex: "name", key: "name", width: 200 },
      {
        title: "Loại",
        dataIndex: "types",
        key: "types",
        width: 100,
        render: (types: Partner["types"]) => (
          <div className="flex gap-1">
            {types?.map((type) => <PartnerTypeTag key={type} value={type} variant="solid" />)}
          </div>
        ),
      },
      { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 130, align: "center" },
      { title: "Email", dataIndex: "email", key: "email", width: 220 },
      { title: "Link Zalo", dataIndex: "zaloLink", key: "zaloLink", width: 150 },
      { title: "Mã số thuế", dataIndex: "taxCode", key: "taxCode", width: 130 },
      {
        title: "Người đại diện",
        dataIndex: ["representative", "name"],
        key: "representativeName",
        width: 160,
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        width: 280,
        render: (address: any) => getFullAddress(address),
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 200 },
    ];

    // The business page already fixes the partner type; showing the type column
    // there only duplicates information and makes the table wider.
    return partnerType ? baseColumns.filter((column) => column.key !== "types") : baseColumns;
  }, [onViewDetail, partnerType]);

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
