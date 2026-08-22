import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { StockDocument } from "../../stockDocument.model";
import { formatDateDDMMYYYY, formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { ColumnsConfigType } from "@/shared/components/table";
import { StockDocumentStatusTag } from "../../components";
import { EntityInfo } from "@/shared/components/display/EntityInfo";
import { textColorStyle } from "@/shared/constants/ui";

export const Table: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const cols: ColumnsConfigType<StockDocument> = useMemo(
    () => [
      {
        title: "Số phiếu",
        key: "code",
        width: 150,
        fixed: "left",
        className: "font-mono",
        render: (r: StockDocument) => (
          <EntityInfo
            title={r.code}
            subTitle={formatDateDDMMYYYY(r.effectiveDate)}
            onClick={() => onViewDetail?.(r)}
          />
        ),
      },
      {
        title: "Số đơn hàng",
        key: "purchaseOrderCode",
        width: 150,
        render: (r: StockDocument) => resolveByPath(r, ["purchase", "code"], "--"),
      },
      {
        title: "Nhà cung cấp",
        key: "partner",
        width: 120,
        render: (r: StockDocument) => (
          <EntityInfo
            title={resolveByPath(r, ["partner", "name"])}
            subTitle={resolveByPath(r, ["partner", "code"])}
          />
        ),
      },
      {
        title: "Nhóm NCC",
        dataIndex: ["partner", "group", "name"],
        key: "partnerGroup",
        width: 80,
      },
      {
        title: "Đại diện GH",
        dataIndex: ["representative", "name"],
        key: "representative",
        width: 120,
      },
      {
        title: "CMND/CCCD",
        dataIndex: ["representative", "identityCode"],
        key: "idNumber",
        width: 120,
      },
      {
        title: "PA vận chuyển",
        key: "shippingPlanCode",
        width: 120,
        render: (r: StockDocument) => resolveByPath(r, ["shippingPlan", "code"], "--"),
      },
      {
        title: "ĐVVC",
        key: "shippingProvider",
        width: 120,
        render: (r: StockDocument) => (
          <EntityInfo
            title={resolveByPath(r, ["shippingProvider", "name"])}
            subTitle={resolveByPath(r, ["shippingProvider", "code"])}
          />
        ),
      },
      {
        title: "Loại xe",
        dataIndex: "vehicleType",
        key: "vehicleType",
        width: 120,
      },
      {
        title: "Biển số xe",
        dataIndex: "vehiclePlate",
        key: "vehiclePlate",
        width: 120,
      },
      {
        title: "Kho",
        key: "warehouse",
        width: 180,
        render: (r: StockDocument) => resolveByPath(r, ["warehouse", "name"], "--"),
      },
      {
        title: "Thủ kho",
        key: "manager",
        width: 120,
        render: (r: StockDocument) => (
          <EntityInfo title={r?.warehouse?.manager?.name} subTitle={r?.warehouse?.manager?.code} />
        ),
      },
      {
        title: "Ngày NK thực tế",
        dataIndex: "actualImportDate",
        key: "actualImportDate",
        width: 120,
        align: "center",
        render: (val: StockDocument["actualImportDate"]) => formatDateTimeDDMMYYYY(val),
      },
      {
        title: "Số dòng",
        key: "lines",
        width: 80,
        align: "center",
        render: (r: StockDocument) => r.lines?.length || 0,
      },
      {
        title: "Biển số",
        dataIndex: "vehiclePlate",
        key: "vehiclePlate",
        width: 140,
      },
      {
        title: "Tiền chênh lệch",
        dataIndex: "totalVarianceAmount",
        key: "totalVarianceAmount",
        width: 140,
        align: "right",
        fixed: "right",
        render: (value: number) => (
          <span className={textColorStyle(value)}>{formatMoney(value)}</span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 80,
        align: "center",
        fixed: "right",
        render: (val: StockDocument["status"]) => <StockDocumentStatusTag value={val} />,
      },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig
      columns={cols}
      itemName="phiếu nhập mua"
      tableKey="purchase-receipt-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
