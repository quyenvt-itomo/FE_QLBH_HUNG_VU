import React, { useMemo } from "react";
import { Button, Modal, Space, Tag } from "antd";
import {
  BarcodeOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { Purchase, OrderStatus, purchaseReturnStatusMap, purchaseStatusMap } from "../purchase.model";
import { getLineProduct, getLineUnit } from "../purchase.util";
import { formatMoney, formatVnd } from "@/shared/utils";
import { getCostPriceByStore } from "@/modules/product/product.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

export interface PurchaseDetailModalProps {
  open: boolean;
  data?: Purchase;
  onClose: () => void;
  onOpenUpdate?: (record: Purchase) => void;
  onDelete?: (record: Purchase) => void;
  onCancel?: (record: Purchase) => void;
  onCopy?: (record: Purchase) => void;
  onExportExcel?: (record: Purchase) => void;
  onPrint?: (record: Purchase) => void;
  onPrintBarcode?: (record: Purchase) => void;
  onComplete?: (record: Purchase) => void;
  isPurchaseReturn?: boolean;
}

const displayValue = (value?: string | null) => value || "—";

const InfoItem: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className,
}) => (
  <div className={`flex min-w-0 items-center gap-3 ${className || ""}`}>
    <span className="w-28 shrink-0 text-sm text-slate-500">{label}:</span>
    <span className="min-w-0 flex-1 truncate text-sm text-slate-900 dark:text-slate-100">
      {children}
    </span>
  </div>
);

const SummaryItem: React.FC<{ label: string; value: React.ReactNode; strong?: boolean }> = ({
  label,
  value,
  strong,
}) => (
  <div className={`flex items-center justify-between gap-4 ${strong ? "font-semibold" : ""}`}>
    <span className="text-slate-600 dark:text-slate-300">{label}</span>
    <span className={strong ? "text-blue-600" : "text-slate-900 dark:text-slate-100"}>{value}</span>
  </div>
);

export const PurchaseDetailModal: React.FC<PurchaseDetailModalProps> = ({
  open,
  data,
  onClose,
  onOpenUpdate,
  onDelete,
  onCancel,
  onCopy,
  onExportExcel,
  onPrint,
  onPrintBarcode,
  onComplete,
  isPurchaseReturn = false,
}) => {
  const { currentStore } = useGlobalData();
  const lines = isPurchaseReturn ? data?.returnLines || [] : data?.lines || [];
  const products = useMemo(() => {
    const map = new Map<string, any>();
    lines.forEach((line: any) => {
      const product = getLineProduct(line);
      if (product?.id) map.set(product.id, product);
    });
    return Array.from(map.values());
  }, [lines]);

  if (!data) return null;

  const isDraft = data.status === OrderStatus.DRAFT;
  const isCanceled = data.status === OrderStatus.CANCELED;
  const canEdit = !isCanceled && !!onOpenUpdate;
  const canCancel = !isCanceled && !!onCancel;
  const canDelete = isDraft && !!onDelete;
  const totalQuantity = lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0);
  const totalAmount = Number(
    (isPurchaseReturn ? data.returnTotalAmount : data.totalAmount) ??
      lines.reduce(
        (sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0),
        0,
      ),
  );
  const paidAmount = (data.incomeExpenses || []).reduce(
    (sum, item) => sum + Math.max(0, Number(item.amount || 0)),
    0,
  );
  const partner = data.partner || data.partnerSnapshot;
  const storeName = (data as any).store?.name || (data as any).storeSnapshot?.name;
  const completerName = data.completer?.name || data.completerSnapshot?.name;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      width={1080}
      centered
      destroyOnClose
    >
      <div className="flex max-h-[calc(100vh-80px)] flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-900">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-mono text-xl font-semibold text-slate-900 dark:text-white">
              {displayValue(data.code)}
            </span>
            <Tag
              color={
                data.status === OrderStatus.COMPLETED
                  ? "success"
                  : data.status === OrderStatus.CANCELED
                    ? "error"
                    : "default"
              }
              className="m-0"
            >
              {isPurchaseReturn ? purchaseReturnStatusMap[data.status] : purchaseStatusMap[data.status]}
            </Tag>
          </div>
          <div className="shrink-0 text-sm text-slate-600 dark:text-slate-300">
            {storeName
              ? `Chi nhánh ${storeName}`
              : isPurchaseReturn
                ? "Phiếu trả hàng nhập"
                : "Phiếu nhập hàng"}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-3">
            <InfoItem label="Người tạo">{displayValue(data.creatorSnapshot?.name)}</InfoItem>
            <InfoItem label={isPurchaseReturn ? "Người xử lý" : "Người nhập"}>
              {displayValue(completerName)}
            </InfoItem>
            <InfoItem label={isPurchaseReturn ? "Ngày trả hàng" : "Ngày nhập"}>
              {data.occurredAt
                ? formatDateTimeDDMMYYYY(data.occurredAt)
                : formatDateTimeDDMMYYYY(data.orderAt)}
            </InfoItem>
            <InfoItem label="Tên NCC" className="md:col-span-2">
              {displayValue(partner?.name)}
            </InfoItem>
            <InfoItem label="Số hóa đơn">{displayValue(data.invoiceNumber)}</InfoItem>
          </div>

          <div className="mt-5 overflow-x-auto rounded border border-slate-200 dark:border-slate-700">
            <table className={`w-full ${isPurchaseReturn ? "min-w-[1120px]" : "min-w-[960px]"} border-collapse text-sm`}>
              <thead className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                <tr>
                  {isPurchaseReturn && (
                    <th className="px-3 py-2 text-center font-semibold">STT</th>
                  )}
                  <th className="px-3 py-2 text-left font-semibold">Mã hàng</th>
                  <th className="px-3 py-2 text-left font-semibold">Tên hàng</th>
                  {isPurchaseReturn && (
                    <th className="px-3 py-2 text-left font-semibold">ĐVT</th>
                  )}
                  <th className="px-3 py-2 text-right font-semibold">Số lượng</th>
                  {isPurchaseReturn && (
                    <th className="px-3 py-2 text-right font-semibold">Giá nhập</th>
                  )}
                  <th className="px-3 py-2 text-right font-semibold">
                    {isPurchaseReturn ? "Giá trả lại" : "Đơn giá"}
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const product = getLineProduct(line);
                  const unit = getLineUnit(line);
                  const quantity = Number(line.quantity || 0);
                  const unitPrice = Number(line.unitPrice || 0);
                  const currentCostPrice = isPurchaseReturn
                    ? getCostPriceByStore({
                        product,
                        storeId: currentStore?.id,
                        unitId: line.unitId,
                      }) ?? Number(line.costPriceAtTime || 0)
                    : 0;
                  const lineTotal = Number(line.subTotal ?? quantity * unitPrice);

                  return (
                    <tr
                      key={line.id || line.tempId || `${product.id || "line"}-${index}`}
                      className="border-b border-slate-200 last:border-b-0 dark:border-slate-700"
                    >
                      {isPurchaseReturn && (
                        <td className="px-3 py-3 text-center">{index + 1}</td>
                      )}
                      <td className="px-3 py-3 font-mono text-blue-600">
                        {displayValue(product.code)}
                      </td>
                      <td className="px-3 py-3 text-slate-900 dark:text-slate-100">
                        <div>{displayValue(product.name)}</div>
                        {line.note && (
                          <div className="mt-1 text-xs italic text-slate-500">{line.note}</div>
                        )}
                      </td>
                      {isPurchaseReturn && (
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                          {displayValue(unit.name)}
                        </td>
                      )}
                      <td className="px-3 py-3 text-right">{quantity}</td>
                      {isPurchaseReturn && (
                        <td className="px-3 py-3 text-right text-slate-500">
                          {formatMoney(currentCostPrice)}
                        </td>
                      )}
                      <td className="px-3 py-3 text-right">{formatMoney(unitPrice)}</td>
                      <td className="px-3 py-3 text-right font-semibold">
                        {formatMoney(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
                {!lines.length && (
                  <tr>
                    <td colSpan={isPurchaseReturn ? 8 : 5} className="py-10 text-center text-slate-500">
                      Chưa có hàng hóa
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex flex-col justify-end">
              <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Ghi chú
              </div>
              <div className="min-h-28 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {data.note || "—"}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <SummaryItem label={`Số lượng mặt hàng (${lines.length})`} value={totalQuantity} />
              <SummaryItem
                label="Tổng tiền hàng"
                value={formatVnd(isPurchaseReturn ? data.returnGrossAmount : data.grossAmount)}
              />
              <SummaryItem
                label="Giảm giá"
                value={formatVnd(isPurchaseReturn ? data.returnDiscountAmount : data.discountAmount)}
              />
              <SummaryItem
                label={isPurchaseReturn ? "Thuế trả lại" : "VAT"}
                value={formatVnd(isPurchaseReturn ? data.returnTaxAmount : data.taxAmount)}
              />
              <SummaryItem
                label={isPurchaseReturn ? "Tổng tiền trả hàng" : "Cần trả NCC"}
                value={formatVnd(totalAmount)}
                strong
              />
              <SummaryItem
                label={isPurchaseReturn ? "NCC hoàn tiền" : "Tiền đã trả NCC"}
                value={formatVnd(paidAmount)}
              />
              {isPurchaseReturn && (
                <SummaryItem
                  label="Tính vào công nợ"
                  value={formatVnd(Math.max(0, totalAmount - paidAmount))}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 dark:border-slate-700">
          <Space wrap>
            {canCancel && (
              <Button danger icon={<CloseCircleOutlined />} onClick={() => onCancel?.(data)}>
                Hủy
              </Button>
            )}
            {canDelete && (
              <Button danger type="text" icon={<DeleteOutlined />} onClick={() => onDelete?.(data)}>
                Xóa
              </Button>
            )}
            {onCopy && (
              <Button icon={<CopyOutlined />} onClick={() => onCopy(data)}>
                Sao chép
              </Button>
            )}
            {onExportExcel && (
              <Button icon={<FileExcelOutlined />} onClick={() => onExportExcel(data)}>
                Xuất file
              </Button>
            )}
            {onPrint && (
              <Button icon={<PrinterOutlined />} onClick={() => onPrint(data)}>
                In
              </Button>
            )}
            {onPrintBarcode && (
              <Button
                icon={<BarcodeOutlined />}
                disabled={!products.length}
                onClick={() => onPrintBarcode(data)}
              >
                In tem mã
              </Button>
            )}
          </Space>
          <Space>
            {isDraft && onComplete && (
              <Button type="primary" onClick={() => onComplete(data)}>
                {isPurchaseReturn ? "Hoàn thành" : "Nhập kho ngay"}
              </Button>
            )}
            {canEdit && (
              <Button type="primary" icon={<EditOutlined />} onClick={() => onOpenUpdate?.(data)}>
                Mở phiếu
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  );
};
