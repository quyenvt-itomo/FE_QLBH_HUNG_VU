import React from "react";
import { Tag } from "antd";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { QuotationRequest } from "../quotationRequest.model";
import { formatDateTime, formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { getFullAddress, resolveByPath } from "@/shared/utils/common.util";
import {
  ApproveStatus,
  approvedStatusMap,
  approvedStatusColorMap,
} from "../../shared/business.model";
import { ApproveStatusTag } from "@/shared/components/display/Tag";
import { EntityInfo } from "@/shared/components/display/EntityInfo";
import { MediaDropdown } from "@/shared/components/dropdown";
import { File } from "@/shared/interfaces/file";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: QuotationRequest) => void;
  onExportExcel?: (r: QuotationRequest) => void;
}

export const QuotationRequestTable: React.FC<Props> = ({
  onViewDetail,
  onExportExcel,
  ...rest
}) => {
  const cols: any = [
    {
      title: "Mã",
      key: "code",
      width: 130,
      className: "code-column font-mono",
      fixed: "left" as const,
      render: (r: QuotationRequest) => (
        <EntityInfo
          title={r.code}
          subTitle={formatDateTimeDDMMYYYY(r.timeAt)}
          onClick={onViewDetail ? () => onViewDetail(r) : undefined}
        />
      ),
    },

    {
      title: "Khách hàng",
      key: "customerName",
      width: 200,
      render: (record: QuotationRequest) => resolveByPath(record, ["customer", "name"]) || "--",
    },
    {
      title: "Mã KH",
      key: "customerCode",
      width: 150,
      render: (record: QuotationRequest) => resolveByPath(record, ["customer", "code"]) || "--",
    },
    {
      title: "Mã số thuế",
      key: "customerTaxCode",
      width: 150,
      render: (record: QuotationRequest) => resolveByPath(record, ["customer", "taxCode"]) || "--",
    },
    {
      title: "Địa chỉ",
      key: "customerAddress",
      width: 200,
      render: (record: QuotationRequest) => {
        const address = resolveByPath(record, ["customer", "address"]);
        return getFullAddress(address);
      },
    },
    {
      title: "Người đề nghị",
      key: "requesterName",
      width: 200,
      render: (record: QuotationRequest) => (
        <EntityInfo
          title={resolveByPath(record, ["requester", "name"])}
          subTitle={resolveByPath(record, ["requester", "phone"])}
        />
      ),
    },
    {
      title: "Tài liệu đề nghị",
      dataIndex: "document",
      key: "document",
      width: 120,
      align: "center",
      render: (value: File[]) => <MediaDropdown files={value} />,
    },
    {
      title: "Tài liệu khác",
      dataIndex: "attachment",
      key: "attachment",
      width: 120,
      align: "center",
      render: (value: File[]) => <MediaDropdown files={value} />,
    },
    {
      title: "Người phụ trách",
      key: "staffName",
      width: 200,
      render: (record: QuotationRequest) => (
        <EntityInfo
          title={resolveByPath(record, ["staff", "name"])}
          subTitle={resolveByPath(record, ["staff", "code"])}
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 150,
      render: (v: string) => v || "--",
    },
    {
      title: "Trạng thái",
      dataIndex: "approveStatus",
      key: "approveStatus",
      width: 80,
      align: "center",
      fixed: "right",
      render: (v: ApproveStatus) => <ApproveStatusTag value={v} />,
    },
  ];

  return (
    <TableColumnConfig
      columns={cols}
      itemName="đề nghị"
      tableKey="quotation-request-table"
      onExportExcel={onExportExcel}
      {...rest}
    />
  );
};
