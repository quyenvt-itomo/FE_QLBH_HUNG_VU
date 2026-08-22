import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { Invoice } from "../invoice.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { ColumnsConfigType } from "@/shared/components/table";
import { InvoiceSourceTypeTag, InvoiceStatusTag } from "./Tag";
import { EntityInfo } from "@/shared/components/display/EntityInfo";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Invoice) => void;
}
export const InvoiceTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: ColumnsConfigType<Invoice> = useMemo(
    () => [
      { title: "Số HĐ", dataIndex: "invoiceNumber", key: "inv", width: 130 },
      {
        title: "Ngày HĐ",
        dataIndex: "invoiceDate",
        key: "date",
        width: 110,
        align: "center",
        render: (v: string) => (v ? formatDate(v) : "--"),
      },
      {
        title: "Đối tác",
        key: "partnerName",
        width: 200,
        render: (record: Invoice) => resolveByPath(record, ["partner", "name"]) || "--",
      },
      {
        title: "Mã đối tác",
        key: "partnerCode",
        width: 80,
        render: (record: Invoice) => resolveByPath(record, ["partner", "code"]) || "--",
      },
      {
        title: "Nhóm đối tác",
        dataIndex: ["partner", "group", "name"],
        key: "partnerGroup",
        width: 80,
      },
      {
        title: "Tiền hàng",
        dataIndex: "subTotal",
        key: "subTotal",
        width: 120,
        align: "right",
        render: (v: number) => (v ? formatMoney(v) : "--"),
      },
      {
        title: "Tiền VAT",
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 90,
        align: "right",
        render: (v: number) => (v ? formatMoney(v) : "--"),
      },
      {
        title: "Tổng tiền",
        dataIndex: "totalAmount",
        key: "total",
        width: 130,
        align: "right",
        fixed: "right",
        render: (v: number) => (v ? formatMoney(v) : "--"),
      },
      {
        title: "Loại CT",
        dataIndex: "sourceType",
        key: "documentType",
        align: "center",
        width: 100,
        render: (val: Invoice["sourceType"]) => (
          <InvoiceSourceTypeTag value={val} variant="solid" />
        ),
      },
      {
        title: "Chứng từ",
        key: "reference",
        width: 150,
        render: (record: Invoice) => (
          <EntityInfo
            title={record.referenceNumber}
            subTitle={record.referenceDate ? formatDate(record.referenceDate) : "--"}
          />
        ),
      },
      {
        title: "Đã thanh toán",
        dataIndex: "totalPaidAmount",
        key: "totalPaidAmount",
        width: 120,
        align: "right",
        render: (v: number) => (v ? formatMoney(v) : "--"),
      },
      {
        title: "Còn lại",
        dataIndex: "totalRemainingAmount",
        key: "totalRemainingAmount",
        width: 90,
        align: "right",
        render: (v: number) => (v ? formatMoney(v) : "--"),
      },

      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 200,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        fixed: "right",
        width: 80,
        render: (v: Invoice["status"]) => <InvoiceStatusTag value={v} />,
      },
    ],
    [],
  );
  return <TableColumnConfig columns={cols} itemName="Hóa đơn" tableKey="invoice-table" {...rest} />;
};
