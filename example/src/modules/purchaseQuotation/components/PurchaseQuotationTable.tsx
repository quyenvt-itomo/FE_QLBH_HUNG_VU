import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { PurchaseQuotation } from "../purchaseQuotation.model";
import { formatDate, formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { ColumnsConfigType } from "@/shared/components/table";
import { getFullAddress, resolveByPath } from "@/shared/utils/common.util";
import { formatMoney } from "@/shared/utils/number.util";
import { ApproveStatusTag } from "@/shared/components/display/Tag";
import { MediaDropdown } from "@/shared/components/dropdown";
import { File } from "@/shared/interfaces/file";
import { EntityInfo } from "@/shared/components/display/EntityInfo";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: PurchaseQuotation) => void;
}
export const PurchaseQuotationTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: ColumnsConfigType<PurchaseQuotation> = useMemo(
    () => [
      {
        title: "Số phiếu",
        key: "code",
        width: 140,
        className: "code-column font-mono",
        fixed: "left",
        render: (record: PurchaseQuotation) => (
          <EntityInfo
            title={record.code}
            subTitle={formatDateTimeDDMMYYYY(record.timeAt)}
            onClick={onViewDetail ? () => onViewDetail(record) : undefined}
          />
        ),
      },
      {
        title: "Nhà cung cấp",
        key: "supplierName",
        width: 200,
        render: (record: PurchaseQuotation) => resolveByPath(record, ["supplier", "name"]) || "--",
      },
      {
        title: "Mã NCC",
        key: "supplierCode",
        width: 150,
        render: (record: PurchaseQuotation) => resolveByPath(record, ["supplier", "code"]) || "--",
      },
      {
        title: "Mã số thuế",
        key: "supplierTaxCode",
        width: 150,
        render: (record: PurchaseQuotation) =>
          resolveByPath(record, ["supplier", "taxCode"]) || "--",
      },
      {
        title: "Địa chỉ",
        key: "supplierAddress",
        width: 200,
        render: (record: PurchaseQuotation) => {
          const address = resolveByPath(record, ["supplier", "address"]);
          return getFullAddress(address);
        },
      },
      {
        title: "Người báo giá",
        key: "quoterName",
        width: 200,
        render: (record: PurchaseQuotation) => (
          <EntityInfo
            title={resolveByPath(record, ["quoter", "name"])}
            subTitle={resolveByPath(record, ["quoter", "phone"])}
          />
        ),
      },
      {
        title: "Tài liệu BG",
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
        title: "Tiền hàng",
        dataIndex: "subTotal",
        key: "subTotal",
        width: 130,
        align: "right",
        render: (v: number) => formatMoney(v),
      },
      {
        title: "Tiền VAT",
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 130,
        align: "right",
        render: (v: number) => formatMoney(v),
      },
      {
        title: "Tổng tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 130,
        align: "right",
        fixed: "right",
        className: "font-medium",
        render: (v: number) => formatMoney(v),
      },
      {
        title: "Người phụ trách",
        key: "staffName",
        width: 200,
        render: (record: PurchaseQuotation) => (
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
        render: (val: PurchaseQuotation["approveStatus"]) => <ApproveStatusTag value={val} />,
      },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={cols}
      itemName="phiếu"
      tableKey="purchase-quotation-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
