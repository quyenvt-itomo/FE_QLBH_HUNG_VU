import React, { useMemo } from "react";
import { Modal, Card, Tag, Button, Divider, Table, TableProps, Progress } from "antd";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Purchase } from "../purchase.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney, formatPercentage, formatQuantity } from "@/shared/utils/number.util";
import { ApproveStatus } from "@/shared/constants/enum";
import { getFullAddress, resolveByPath, sortData } from "@/shared/utils/common.util";
import { paymentMethodMap } from "../purchase.model";
import { ShippingPlanByPurchase } from "@/modules/shippingPlan/partials/ShippingPlanByPurchase";
import { CLASSNAME } from "@/shared/constants/ui";
import { checkCanPermission } from "@/shared/utils/permission.util";
import { PurchaseLine } from "@/modules/purchaseLine";
import { ApproveStatusTag } from "@/shared/components";
import { UserIcon } from "@heroicons/react/24/solid";
import { AdditionalInfo } from "@/shared/interfaces/common";
import { DocumentGroup } from "@/shared/components";
import { StockDocumentStatus, useStockDocumentStore } from "@/modules/stockDocument";
import dayjs from "dayjs";
import { DataTable, DataColumn, SummaryConfig } from "@/shared/components";
import { SortOrder } from "@/shared/constants/enum";
import { Icon } from "@iconify/react";

interface Props {
  open: boolean;
  data?: Purchase;
  onClose: () => void;
  onOpenUpdate?: (r: Purchase) => void;
  onAddShippingPlan?: () => void;
  onExportExcel?: (r: Purchase) => void;
}
type LineData = PurchaseLine & {
  // dòng mở rộng: key = id phiếu nhập kho, value = billingQuantity
  [key: string]: unknown;
};
export const PurchaseDetailModal: React.FC<Props> = ({
  open,
  data,
  onClose,
  onOpenUpdate,
  onAddShippingPlan,
  onExportExcel,
}) => {
  // Memo hóa params để queryKey ổn định (tránh refetch mỗi render → infinite loop)
  const { data: stockDocuments } = useStockDocumentStore({
    page: 1,
    size: 999,
    sortBy: "actualImportDate",
    sortOrder: SortOrder.ASC,
    purchaseId: data?.id,
    status: StockDocumentStatus.COMPLETED,
    isLocked: !data || data.approveStatus !== ApproveStatus.APPROVED,
  });

  // nếu đã phê duyệt thì thêm cột "Đã giao" (deliveredQuantity) + các cột động theo số phiếu,
  // đồng thời nạp ma trận billingQuantity cho từng dòng theo từng phiếu nhập kho
  const { moreColumns, lineData, summary } = useMemo(() => {
    if (!data || data.approveStatus !== ApproveStatus.APPROVED) {
      return {
        moreColumns: [] as DataColumn<LineData>[],
        lineData: (data?.lines ? [...data.lines] : []) as LineData[],
        summary: { summaryColKey: "product" } as SummaryConfig,
      };
    }

    const docs = stockDocuments || [];

    // Cột động: title = "DD/MM - mã phiếu", dataIndex = id phiếu
    const dynamicCols: DataColumn<LineData>[] = docs.map((sd) => {
      const importDate = sd.actualImportDate || sd.effectiveDate;
      return {
        title: (
          <div className="flex flex-col items-center">
            <span className="font-mono text-2xs">{sd.code}</span>
            <span className="text-2xs text-gray-500">{dayjs(importDate).format("DD/MM")}</span>
          </div>
        ),
        dataIndex: sd.id,
        key: sd.id,
        width: 110,
        align: "right",
        render: ({ value }) => formatQuantity(value),
      };
    });

    const finalMoreColumns: DataColumn<LineData>[] = [
      {
        title: "Đã giao",
        dataIndex: "deliveredQuantity",
        key: "deliveredQuantity",
        width: 100,
        align: "right",
        className: "yellow-column",
        render: ({ value }) => <span className="font-medium">{formatQuantity(value)}</span>,
      },
      {
        title: "HH thực tế",
        dataIndex: "actualCommissionAmount",
        key: "actualCommissionAmount",
        width: 100,
        align: "right",
        render: ({ value }) => <span className="font-medium">{formatQuantity(value)}</span>,
      },
      ...dynamicCols,
      {
        title: "Tiến độ giao",
        key: "deliveredRate",
        width: 120,
        align: "center",
        className: "yellow-column",
        fixed: "right",
        render: ({ record }) => (
          <Progress
            percent={record.quantity ? (record.deliveredQuantity / record.quantity) * 100 : 0}
            size="small"
            showInfo={false}
          />
        ),
      },
    ];

    // Ma trận: mỗi dòng đơn mua ↔ từng phiếu nhập kho (billingQuantity theo purchaseLineId)
    const matrixLines: LineData[] = (data.lines || []).map((pl) => {
      const enriched: LineData = { ...pl };
      for (const sd of docs) {
        const sdl = sd.lines?.find((l) => l.purchaseLineId === pl.id);
        if (sdl != null) {
          enriched[sd.id] = sdl.billingQuantity ?? undefined;
        }
      }
      return enriched;
    });

    const summaryConfig: SummaryConfig = {
      summaryColKey: "product",
      quantity: formatQuantity(matrixLines.reduce((s, l) => s + (Number(l.quantity) || 0), 0)),
      deliveredQuantity: formatQuantity(
        matrixLines.reduce((s, l) => s + (Number(l.deliveredQuantity) || 0), 0),
      ),
      subTotal: formatMoney(data.subTotal),
      taxAmount: formatMoney(data.taxAmount),
      grossAmount: formatMoney(data.totalAmount),
      commissionAmount: formatMoney(data.totalCommissionAmount),
    };
    // Tổng billingQuantity cho từng cột phiếu nhập kho
    for (const sd of docs) {
      const total = matrixLines.reduce((s, l) => s + (Number((l as any)[sd.id]) || 0), 0);
      summaryConfig[sd.id] = total ? formatQuantity(total) : "";
    }

    return { moreColumns: finalMoreColumns, lineData: matrixLines, summary: summaryConfig };
  }, [data, stockDocuments]);

  const dataColumns = useMemo(
    (): DataColumn<LineData>[] => [
      {
        title: "STT",
        key: "index",
        width: 50,
        align: "center",
        render: ({ index }) => <span className="text-gray-700">{index + 1}</span>,
      },
      {
        title: "Hàng hóa",
        key: "product",
        width: 220,
        fixed: "left",
        render: ({ record }) => record?.product?.name || record?.productSnapshot?.name || "—",
      },
      {
        title: "Mã hàng",
        key: "productCode",
        width: 100,
        fixed: "left",
        render: ({ record }) => record?.product?.code || record?.productSnapshot?.code || "—",
      },
      {
        title: "ĐVT",
        key: "unit",
        width: 80,
        align: "center",
        render: ({ record }) => record?.unit?.name || record?.unitSnapshot?.name || "—",
      },
      {
        title: "SL",
        dataIndex: "quantity",
        key: "quantity",
        width: 80,
        align: "right",
        render: ({ value }) => <span className="font-medium">{formatQuantity(value)}</span>,
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: 130,
        align: "right",
        render: ({ value }) => formatMoney(value),
      },
      {
        title: "Thành tiền",
        dataIndex: "subTotal",
        key: "subTotal",
        width: 140,
        align: "right",
        render: ({ value }) => formatMoney(value),
      },
      {
        title: "%VAT",
        dataIndex: "taxRate",
        key: "taxRate",
        width: 65,
        align: "right",
        render: ({ value }) => formatPercentage(value),
      },
      {
        title: "Tiền VAT",
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 120,
        align: "right",
        render: ({ value }) => formatMoney(value),
      },
      {
        title: "Tổng tiền",
        dataIndex: "grossAmount",
        key: "grossAmount",
        width: 130,
        align: "right",
        className: "font-medium text-blue-700",
        render: ({ value }) => formatMoney(value),
      },
      {
        title: "%HH",
        dataIndex: "commissionRate",
        key: "comm",
        width: 65,
        align: "right",
        className: "yellow-column",
        render: ({ value }) => formatPercentage(value),
      },
      {
        title: "Tiền HH",
        dataIndex: "commissionAmount",
        key: "commAmt",
        width: 120,
        align: "right",
        className: "yellow-column",
        render: ({ value }) => formatMoney(value),
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 100,
        render: ({ value }) => value || "—",
      },
      ...(moreColumns || []),
    ],
    [moreColumns],
  );

  const additionalColumns = useMemo(
    (): TableProps<AdditionalInfo>["columns"] => [
      {
        title: "STT",
        key: "index",
        width: 50,
        align: "center",
        render: (v, r, i) => <span className="text-gray-700">{i + 1}</span>,
      },
      {
        title: "Hạng mục",
        dataIndex: "label",
        key: "label",
        width: 220,
        ellipsis: true,
      },
      {
        title: "Nội dung",
        dataIndex: "value",
        key: "value",
        ellipsis: true,
      },
    ],
    [],
  );

  if (!data) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 h-6">
          <span className="text-gray-800">Chi tiết đơn mua hàng</span>
          <ApproveStatusTag value={data.approveStatus} size="lg" />

          {data.isCompleted && <Tag color="blue">Đã hoàn thành</Tag>}

          {onExportExcel && (
            <Button
              type="primary"
              onClick={() => onExportExcel(data)}
              className="bg-green-600 hover:!bg-green-500"
            >
              <Icon icon={"mdi:file-excel-outline"} className="h-4" />
              Xuất Excel
            </Button>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      centered
      destroyOnClose
      maskClosable={false}
      width={"100vw"}
      className="fullscreen-modal"
      footer={
        onOpenUpdate && !data.isCompleted && data.approveStatus !== ApproveStatus.APPROVED ? (
          <div className="flex justify-end">
            <Button type="primary" icon={<EditOutlined />} onClick={() => onOpenUpdate(data)}>
              Chỉnh sửa
            </Button>
          </div>
        ) : null
      }
    >
      <div className="space-y-4 flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-hide px-2 py-1">
        {/* Header */}
        <div className="flex items-center justify-between h-fit flex-shrink-0 bg-gradient-to-r from-[#113a72] to-[#1466d8] rounded-md px-5 py-3 text-white shadow-lg border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-gray-300">Mã đơn</span>
              <div className="font-mono font-semibold">{data.code}</div>
            </div>
            <Divider type="vertical" className="h-8 border-gray-400" />
            <div>
              <span className="text-xs text-gray-300">Ngày đơn hàng</span>
              <div className="text-gray-100">{formatDate(data.orderedAt) || "—"}</div>
            </div>
            <Divider type="vertical" className="h-8 border-gray-400" />
            <div>
              <span className="text-xs text-gray-300">Phương thức thanh toán</span>
              <div className="text-gray-100">
                {data.paymentMethod ? paymentMethodMap[data.paymentMethod] : "—"}
              </div>
            </div>
            <Divider type="vertical" className="h-8 border-gray-400" />
            <div>
              <span className="text-xs text-gray-300">Nhân viên mua hàng</span>
              <div className="text-gray-100 flex items-center gap-1">
                <UserIcon className="h-4" />
                {resolveByPath(data, ["staff", "name"], "—")}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-300">Tổng giá trị</span>
            <div className="text-lg font-semibold">{formatMoney(data.totalAmount)}</div>
          </div>
        </div>

        {/* Reject reason */}
        {data.rejectReason && (
          <Card
            size="small"
            className="border-red-200 bg-red-50"
            styles={{ body: { padding: "10px 14px" } }}
          >
            <div className="flex items-start gap-2">
              <CloseCircleOutlined className="text-red-500 mt-0.5" />
              <div>
                <span className="text-red-600 font-medium text-sm">Lý do từ chối: </span>
                <span className="text-red-600 text-sm">{data.rejectReason}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-6">
          <Card
            title={
              <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Thông tin nhà cung cấp
              </span>
            }
            size="small"
            className="shadow-sm"
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Tên NCC</span>
                <span className="text-gray-800 font-medium text-sm">
                  {resolveByPath(data, ["supplier", "name"], "—")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">MST</span>
                <span className="text-gray-800 font-mono text-sm">
                  {resolveByPath(data, ["supplier", "taxCode"], "—")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Địa chỉ</span>
                <span className="text-gray-800 text-sm">
                  {getFullAddress(resolveByPath(data, ["supplier", "address"])) || "—"}
                </span>
              </div>
            </div>
          </Card>
          <Card
            title={
              <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Thông tin người liên hệ
              </span>
            }
            size="small"
            className="shadow-sm"
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Tên người liên hệ</span>
                <span className="text-gray-800 font-medium text-sm">
                  {resolveByPath(data, ["seller", "name"], "—")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">SĐT</span>
                <span className="text-gray-800 font-mono text-sm">
                  {resolveByPath(data, ["seller", "phone"], "—")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Email</span>
                <span className="text-gray-800 text-sm">
                  {resolveByPath(data, ["seller", "email"], "—")}
                </span>
              </div>
            </div>
          </Card>

          <Card
            title={
              <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Thông tin tài chính
              </span>
            }
            size="small"
            className="shadow-sm"
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Tiền hàng</span>
                <span className="text-gray-800 text-sm">{formatMoney(data.subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Thuế</span>
                <span className="text-gray-800 text-sm">{formatMoney(data.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Hoa hồng cho người bán</span>
                <span className="text-orange-600 text-sm font-medium">
                  {formatMoney(data.totalCommissionAmount)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Products table */}
        <Card
          title={
            <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
              Hàng hóa
            </span>
          }
          size="small"
          styles={{
            header: { borderBottom: "1px solid #f0f0f0" },
            body: { padding: 0, paddingTop: 1 },
          }}
        >
          <div className="flex flex-col h-fit w-full">
            <DataTable
              columns={dataColumns}
              dataSource={sortData([...lineData])}
              rowKey="id"
              size="small"
              summary={summary}
            />
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          {/* Additional */}
          <Card
            title={
              <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Thông tin bổ sung
              </span>
            }
            size="small"
            className="col-span-2"
            styles={{
              header: { borderBottom: "1px solid #f0f0f0" },
              body: { padding: 0, paddingTop: 1 },
            }}
          >
            <div className="flex">
              <Table
                columns={additionalColumns}
                dataSource={sortData([...data.additionalInfo])}
                rowKey="label"
                pagination={false}
                size="small"
                className={CLASSNAME.detailTable}
                scroll={{ x: "max-content", y: "max-content" }}
              />
            </div>
          </Card>
          <Card
            title={
              <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Tài liệu đính kèm
              </span>
            }
            size="small"
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <DocumentGroup files={data.document} />
          </Card>
        </div>

        {/* Shipping Plan */}
        {!!data && (
          <ShippingPlanByPurchase
            purchase={data}
            canCreate={checkCanPermission(data, "createShippingPlan")}
            onAdd={onAddShippingPlan}
          />
        )}
      </div>
    </Modal>
  );
};
