import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { Partner } from "../partner.model";
import { getFullAddress } from "@/shared/utils/common.util";
import { ColumnsConfigType } from "@/shared/components/table/handleColumnSelector";
import { PartnerTypeTag } from "./Tag";

export const PartnerTable: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const columns: ColumnsConfigType<Partner> = useMemo(
    () => [
      {
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: 100,
        fixed: "left",
        render: (v: string, record: Partner) => (
          <span
            className="cursor-pointer text-blue-600 hover:underline font-mono"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail?.(record);
            }}
          >
            {v}
          </span>
        ),
      },
      {
        title: "Tên đối tác",
        dataIndex: "name",
        key: "name",
        width: 200,
      },
      {
        title: "Loại",
        dataIndex: "types",
        key: "types",
        width: 100,
        render: (types: Partner["types"]) => (
          <div className="flex gap-1">
            {types?.map((t) => (
              <PartnerTypeTag key={t} value={t} variant="solid" />
            ))}
          </div>
        ),
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        width: 130,
        align: "center",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 220,
      },
      {
        title: "Link Zalo",
        dataIndex: "zaloLink",
        key: "zaloLink",
        width: 150,
      },
      {
        title: "Mã số thuế",
        dataIndex: "taxCode",
        key: "taxCode",
        width: 130,
      },
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
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 200,
      },
    ],
    [],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName="đối tác"
      tableKey="partner-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
