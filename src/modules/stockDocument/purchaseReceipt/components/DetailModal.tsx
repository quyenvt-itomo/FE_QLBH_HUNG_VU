import React from "react";
import { Modal, Tag } from "antd";
import {
  StockDocument,
  StockDocumentStatus,
  StockDocumentType,
  stockDocumentStatusMap,
} from "../../stockDocument.model";
import { formatDate, formatDateDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney, formatPercentage, formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { StockDocumentLine } from "@/modules/stockDocumentLine";
import { StockDocumentCalculationUtil } from "../../stockDocument.util";
import { textColorStyle } from "@/shared/constants/ui";
import { DataTable, DataColumn } from "@/shared/components/display/DataTable";

interface Props {
  open: boolean;
  data?: StockDocument;
  onClose: () => void;
  onOpenUpdate?: (r: StockDocument) => void;
}

const calc = new StockDocumentCalculationUtil();

export const DetailModal: React.FC<Props> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;

  const isImported = data.status === StockDocumentStatus.COMPLETED;
  const statusColor =
    data.status === "completed" ? "green" : data.status === "exported" ? "blue" : "orange";

  const lineCols: DataColumn<StockDocumentLine>[] = [
    { title: "STT", width: 50, align: "center", render: ({ index }) => index + 1 },
    {
      title: "Hàng hóa",
      key: "productName",
      width: 240,
      fixed: "left",
      render: ({ record }) => (
        <span className="font-medium">{resolveByPath(record, ["product", "name"], "--")}</span>
      ),
    },
    {
      title: "Mã hàng",
      key: "productCode",
      width: 120,
      fixed: "left",
      render: ({ record }) => (
        <span className="font-medium">{resolveByPath(record, ["product", "code"], "--")}</span>
      ),
    },
    {
      title: "ĐVT",
      key: "unit",
      width: 120,
      align: "center",
      render: ({ record }) => resolveByPath(record, ["unit", "name"], "--"),
    },
    {
      title: "Số lượng",
      key: "quantity",
      children: [
        {
          title: "Chứng từ",
          dataIndex: "billingQuantity",
          width: 100,
          align: "right",
          render: ({ value }) => formatQuantity(value || 0),
        },
        {
          title: "Thực nhập",
          dataIndex: "stockQuantity",
          width: 100,
          align: "right",
          render: ({ value }) => (isImported ? formatQuantity(value || 0) : ""),
        },
      ],
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      width: 110,
      align: "right",
      render: ({ record }) => formatMoney(record?.purchaseLine?.unitPrice),
    },
    {
      title: "Thành tiền",
      key: "subTotal",
      width: 110,
      align: "right",
      render: ({ record }) => formatMoney(calc.calculateSubTotal(record)),
    },
    {
      title: "VAT",
      children: [
        {
          title: "%",
          key: "taxRate",
          width: 50,
          align: "right",
          render: ({ record }) => formatPercentage(record?.purchaseLine?.taxRate),
        },
        {
          title: "Thành tiền",
          key: "taxAmount",
          width: 100,
          align: "right",
          render: ({ record }) => formatMoney(calc.calculateTaxAmount(record)),
        },
      ],
    },
    {
      title: "Tổng tiền",
      key: "grossAmount",
      width: 110,
      align: "right",
      render: ({ record }) => formatMoney(calc.calculateGrossAmount(record)),
    },
    { title: "Ghi chú", dataIndex: "note", width: 150, render: ({ value }) => value || "--" },
    {
      title: "Chênh lệch",
      key: "variance",
      children: [
        {
          title: "Chênh lệch",
          dataIndex: "varianceQuantity",
          width: 90,
          align: "right",
          render: ({ value }) => {
            if (!isImported) return "";
            return <span className={textColorStyle(value)}>{formatQuantity(value || 0)}</span>;
          },
        },
        {
          title: "Tiền chênh lệch",
          dataIndex: "varianceAmount",
          width: 110,
          align: "right",
          render: ({ value }) => {
            if (!isImported) return "";
            return <span className={textColorStyle(value)}>{formatMoney(value || 0)}</span>;
          },
        },
      ],
    },
  ];

  const total = calc.calculateTotalForArray(data.lines || [], StockDocumentType.PURCHASE_RECEIPT);

  return (
    <Modal
      title="Chi tiết phiếu nhập mua"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      maskClosable={false}
      width="100vw"
      className="fullscreen-modal"
    >
      <div className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Đơn mua hàng</div>
            <div className="font-semibold text-blue-700">
              {resolveByPath(data, ["purchase", "code"], "--")}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {resolveByPath(data, ["partner", "name"], "--")}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Phương án vận chuyển
            </div>
            <div className="font-semibold text-green-700">
              {resolveByPath(data, ["shippingPlan", "code"], "--")}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {resolveByPath(data, ["shippingProvider", "name"], "--")}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Số phiếu</div>
            <div className="font-semibold text-purple-700">{data.code || "--"}</div>
            <div className="flex items-center gap-2 mt-1">
              <Tag color={statusColor}>{stockDocumentStatusMap[data.status] || data.status}</Tag>
              <span className="text-sm text-gray-500">
                Ngày dự kiến: {data.effectiveDate ? formatDate(data.effectiveDate) : "--"}
              </span>
              {isImported && (
                <span className="text-sm text-gray-500 ml-auto mr-0">
                  Ngày thực nhập:{" "}
                  {data.actualImportDate ? formatDateDDMMYYYY(data.actualImportDate) : "--"}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-400 mb-0.5">Kho nhập</div>
            <div className="text-sm font-medium">{data?.warehouse?.name || "--"}</div>
            <div className="text-xs text-gray-400">
              Thủ kho: {data?.warehouse?.manager?.name || "--"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-400 mb-0.5">Đại diện giao hàng</div>
            <div className="text-sm font-medium">{data?.representative?.name || "--"}</div>
            <div className="text-xs text-gray-400">
              CMND/CCCD: {data?.representative?.identityCode || "--"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-400 mb-0.5">Phương tiện</div>
            <div className="text-sm font-medium">{data?.vehicleType || "--"}</div>
            <div className="text-xs text-gray-400">Biển số: {data?.vehiclePlate || "--"}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-400 mb-0.5">Ghi chú</div>
            <div className="text-sm">{data?.note || "--"}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <h4 className="mb-2 text-lg font-semibold">Danh sách hàng hóa</h4>
          <DataTable
            dataSource={data.lines || []}
            columns={lineCols}
            rowKey="id"
            size="small"
            summary={{
              summaryColKey: "productName",
              billingQuantity: formatQuantity(total.totalBillingQuantity),
              stockQuantity: isImported ? formatQuantity(total.totalStockQuantity) : "",
              subTotal: formatMoney(total.totalSubTotal),
              taxAmount: formatMoney(total.totalTaxAmount),
              grossAmount: formatMoney(total.totalGrossAmount),
              varianceQuantity: isImported ? (
                <span className={textColorStyle(total.totalVarianceQuantity)}>
                  {formatQuantity(total.totalVarianceQuantity)}
                </span>
              ) : (
                ""
              ),
              varianceAmount: isImported ? (
                <span className={textColorStyle(total.totalVarianceAmount)}>
                  {formatMoney(total.totalVarianceAmount)}
                </span>
              ) : (
                ""
              ),
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
