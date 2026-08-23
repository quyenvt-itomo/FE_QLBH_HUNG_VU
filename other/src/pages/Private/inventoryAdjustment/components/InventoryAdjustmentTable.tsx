import ProductImage from "../../../../components/image/ProductImage";
import ContentTooltip from "../../../../components/table/ContentTooltip";
import { ColumnsConfigType } from "../../../../components/table/handleColumnSelector";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../components/table/TableColumnConfig";
import { InventoryTransactionType } from "../../../../constants/enum";
import { useClientData } from "../../../../hooks/core/useClientData";
import { IInventoryAdjustmentLine } from "../../../../models/store/inventoryAdjustmentLine";
import { formatDateTimeDDMMYYYY } from "../../../../utils/dateUtils";
import { getMainImage } from "../../../../utils/fileUtil";
import { formatMoney, formatQuantity } from "../../../../utils/formatNumber";

const InventoryAdjustmentTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { currentStore } = useClientData();

  const summaryRow = {
    id: "summary",
    key: "Tổng",
    code: "Tổng",
    totalAdjustmentQty: summaryData?.totalAdjustmentQty,
    totalAdjustmentValue: summaryData?.totalAdjustmentValue,
    isSummary: true,
  };

  const finalDataSource = dataSource?.length ? [summaryRow, ...dataSource] : dataSource;

  const columns: any = [
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 200,
      render: (date: string) => formatDateTimeDDMMYYYY(date),
    },
    {
      title: "Số phiếu",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    !currentStore && {
      title: "Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      width: 200,
    },
    {
      title: "Người thực hiện",
      dataIndex: ["adjustedBy", "name"],
      key: "adjustedByName",
      width: 200,
    },
    {
      title: "SL chênh lệch",
      dataIndex: "totalAdjustmentQty",
      key: "totalAdjustmentQty",
      width: 180,
      align: "right",
      render: (quantity: number) => (
        <span className={`${quantity < 0 ? "text-red-600" : ""}`}>{formatQuantity(quantity)}</span>
      ),
    },
    {
      title: "Giá trị chênh lệch",
      dataIndex: "totalAdjustmentValue",
      key: "totalAdjustmentValue",
      width: 180,
      align: "right",
      render: (value: number) => (
        <span className={`${value < 0 ? "text-red-600" : ""}`}>{formatMoney(value)}</span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 200,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ].filter(Boolean);

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
      title: "Hàng hóa",
      dataIndex: "productVariant",
      key: "productVariant",
      width: 200,
      render: (
        value: IInventoryAdjustmentLine["productVariant"],
        record: IInventoryAdjustmentLine,
      ) => (
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
      dataIndex: ["productVariant", "product", "unit", "name"],
      key: "unitName",
      width: 70,
      align: "center",
    },
    {
      title: "Tồn hệ thống",
      dataIndex: "countedQty",
      key: "countedQty",
      width: 100,
      align: "right",
      render: (value: number) => formatQuantity(value),
    },
    {
      title: "Tồn thực tế",
      dataIndex: "expectedQty",
      key: "expectedQty",
      width: 120,
      align: "right",
      render: (value: number) => formatQuantity(value),
    },
    {
      title: "Chênh lệch",
      dataIndex: "deltaQty",
      key: "deltaQty",
      width: 120,
      align: "right",
      render: (value: number, record: IInventoryAdjustmentLine) => {
        const isIn = record.direction === InventoryTransactionType.IN;
        const finalValue = value * (isIn ? 1 : -1);
        return <span className={!isIn ? "text-red-600" : ""}>{formatQuantity(finalValue)}</span>;
      },
    },
    {
      title: "Giá trị chênh lệch",
      dataIndex: "adjustmentValue",
      key: "adjustmentValue",
      width: 120,
      align: "right",
      render: (value: number, record: IInventoryAdjustmentLine) => {
        const isIn = record.direction === InventoryTransactionType.IN;
        const finalValue = value * (isIn ? 1 : -1);
        return <span className={!isIn ? "text-red-600" : ""}>{formatMoney(finalValue)}</span>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 120,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ];
  const mappedDataSource = finalDataSource.map((row) => ({
    ...row,
    items: row.lines, // map lines -> items
  }));

  return (
    <TableColumnConfig
      columns={columns}
      dataSource={mappedDataSource}
      hasSummary
      itemName={"phiếu"}
      tableKey={currentStore ? "inventory-adjustment-table" : "inventory-adjustment-store-table"}
      detailTableColumns={detailTableColumns}
      detailTableTitle="Chi tiết phiếu kiểm kho"
      pagination={pagination}
      {...rest}
    />
  );
};

export default InventoryAdjustmentTable;
