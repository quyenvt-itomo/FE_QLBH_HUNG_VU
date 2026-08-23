import ProductImage from "../../../../../components/image/ProductImage";
import ContentTooltip from "../../../../../components/table/ContentTooltip";
import { ColumnsConfigType } from "../../../../../components/table/handleColumnSelector";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { IOrder } from "../../../../../models/store/order";
import { IOrderLine } from "../../../../../models/store/orderLine";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import { getMainImage } from "../../../../../utils/fileUtil";
import { formatMoney, formatPercentage, formatQuantity } from "../../../../../utils/formatNumber";

const PurchaseReturnTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format, currentStore } = useClientData();

  const summaryRow = {
    id: "summary",
    code: "Tổng",
    grossAmount: summaryData?.totalGrossAmount || 0,
    lineDiscountAmount: summaryData?.totalLineDiscountAmount || 0,
    orderDiscountAmount: summaryData?.totalOrderDiscountAmount || 0,
    netAmount: summaryData?.totalNetAmount || 0,
    taxAmount: summaryData?.totalTaxAmount || 0,
    totalAmount: summaryData?.totalAmount || 0,

    isSummary: true,
  };

  const columns: any = [
    {
      title: "Ngày",
      dataIndex: "orderAt",
      key: "orderAt",
      width: 120,
      align: "center",
      render: (value: IOrder["orderAt"]) => formatDateTimeDDMMYYYY(value),
    },
    {
      title: "Mã đơn",
      dataIndex: "code",
      key: "code",
      width: 120,
      align: "center",
    },
    {
      title: "Trả theo đơn",
      dataIndex: ["refOrder", "code"],
      key: "refOrderCode",
      width: 120,
      align: "center",
    },
    {
      title: "Mã NCC",
      dataIndex: ["partnerSnapshot", "code"],
      key: "partnerSnapshotCode",
      width: 100,
      align: "center",
    },
    {
      title: "Tên NCC",
      dataIndex: ["partnerSnapshot", "name"],
      key: "partnerSnapshotName",
      width: 200,
    },
    {
      title: "SĐT NCC",
      dataIndex: ["partnerSnapshot", "phone"],
      key: "partnerSnapshotPhone",
      width: 120,
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "grossAmount",
      key: "grossAmount",
      width: 150,
      align: "right",
      render: (value: number) => (value ? formatMoney(value, format) : "--"),
    },
    {
      title: "Giảm giá SP", // tổng
      dataIndex: "lineDiscountAmount",
      key: "lineDiscountAmount",
      width: 120,
      align: "right",
      render: (value: number) => (value ? formatMoney(value, format) : "--"),
    },
    {
      title: "Giảm giá ĐH",
      dataIndex: "orderDiscountAmount",
      key: "orderDiscountAmount",
      width: 120,
      align: "right",
      render: (value: number) => (value ? formatMoney(value, format) : "--"),
    },
    {
      title: "Tổng sau giảm",
      dataIndex: "netAmount",
      key: "netAmount",
      width: 150,
      align: "right",
      render: (value: number) => (value ? formatMoney(value, format) : "--"),
    },
    {
      title: "VAT",
      dataIndex: "taxAmount",
      key: "taxAmount",
      width: 100,
      align: "right",
      render: (value: number) => (value ? formatMoney(value, format) : "--"),
    },
    {
      title: "Phí VC",
      dataIndex: "shippingFee",
      key: "shippingFee",
      width: 100,
      align: "right",
      render: (value: number, record: IOrder) =>
        !value ? (
          ""
        ) : record.isFreeShipping ? (
          <span className="line-through text-gray-400">{formatMoney(value, format)}</span>
        ) : (
          formatMoney(value, format)
        ),
    },
    {
      title: "Tổng đơn hàng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      align: "right",
      render: (value: number) => (value ? formatMoney(value, format) : "--"),
    },
    {
      title: "ĐVVC",
      dataIndex: ["shipperSnapshot", "name"],
      key: "shipperSnapshotName",
      width: 120,
    },
    {
      title: "NV phụ trách",
      dataIndex: ["employeeSnapshot", "name"],
      key: "employeeSnapshotName",
      width: 120,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 120,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ];

  if (!currentStore) {
    columns?.push({
      title: "Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      fixed: "right",
      width: 150,
    });
  }

  const detailTableColumns: ColumnsConfigType = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Sản phẩm",
      dataIndex: "productVariantSnapshot",
      key: "productVariantSnapshot",
      width: 200,
      render: (value: IOrderLine["productVariantSnapshot"], record: IOrderLine) => (
        <div className="flex items-center gap-2">
          <ProductImage size={24} image={getMainImage(record?.productVariant?.image)} />
          <div className="flex-1 flex flex-col">
            <span className="block truncate">{value?.product?.name}</span>
            <span className="text-gray-400 text-xs">{value?.product?.code}</span>
          </div>
        </div>
      ),
    },
    {
      title: "ĐVT",
      dataIndex: ["productVariantSnapshot", "product", "unit", "name"],
      key: "unitName",
      width: 70,
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "right",
      render: (value: number) => formatQuantity(value, format),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 120,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "subTotal",
      key: "subTotal",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Giảm giá SP",
      dataIndex: "discountAmount",
      key: "discountAmount",
      width: 120,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Giảm giá ĐH",
      dataIndex: "orderDiscountAmount",
      key: "orderDiscountAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Thành tiền",
      dataIndex: "netAmount",
      key: "netAmount",
      width: 120,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "%VAT",
      dataIndex: "taxRate",
      key: "taxRate",
      width: 80,
      align: "right",
      render: (value: number) => formatPercentage(value, format),
    },
    {
      title: "Tiền VAT",
      dataIndex: "taxAmount",
      key: "taxAmount",
      width: 120,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 120,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ];
  const mappedDataSource = dataSource.map((row) => ({
    ...row,
    items: row.lines, // map lines -> items
  }));

  const finalDataSource = mappedDataSource?.length
    ? [summaryRow, ...mappedDataSource]
    : mappedDataSource;

  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      itemName={"đơn trả hàng NCC"}
      tableKey={`purchase-return-order-table${currentStore ? "-store" : ""}`}
      hasSummary
      pagination={pagination}
      detailTableColumns={detailTableColumns}
      detailTableTitle="Chi tiết đơn trả hàng"
      {...rest}
    />
  );
};

export default PurchaseReturnTable;
