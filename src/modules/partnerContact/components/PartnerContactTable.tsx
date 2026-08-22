import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { ColumnsConfigType } from "@/shared/components/table/handleColumnSelector";
import { PartnerContact } from "../partnerContact.model";
import { Partner } from "@/modules/partner/partner.model";
import { PartnerTypeTag } from "@/modules/partner/components";

export const PartnerContactTable: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const columns: ColumnsConfigType<PartnerContact> = useMemo(
    () => [
      {
        title: "Tên người liên hệ",
        dataIndex: "name",
        key: "name",
        width: 200,
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
        title: "Chức danh",
        dataIndex: "position",
        key: "position",
        width: 130,
      },
      {
        title: "Đối tác",
        dataIndex: ["partner", "name"],
        key: "partnerName",
        width: 160,
      },
      {
        title: "Loại",
        dataIndex: ["partner", "types"],
        key: "partnerTypes",
        width: 100,
        render: (types: Partner["types"]) => (
          <div className="flex gap-1">
            {types?.map((t) => (
              <PartnerTypeTag key={t} value={t} size="sm" />
            ))}
          </div>
        ),
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
      itemName="người liên hệ"
      tableKey="partner-contact-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
