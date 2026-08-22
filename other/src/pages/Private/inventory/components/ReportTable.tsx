import ProductImage from "../../../../components/image/ProductImage";
import ContentTooltip from "../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../components/table/TableColumnConfig";
import { CSS } from "../../../../constants/UI";
import { useClientData } from "../../../../hooks/core/useClientData";
import { IAttribute } from "../../../../models/base/attribute";
import { IInventoryReport } from "../../../../models/store/inventory";
import { getProductCategoryContent, getVariantOptionContent } from "../../../../utils/common";
import { getMainImage } from "../../../../utils/fileUtil";
import { formatQuantity, formatMoney } from "../../../../utils/formatNumber";

interface DataType extends Partial<IInventoryReport> {
  children?: Partial<DataType>[];
  index?: string;
  key: string;
}

const ReportTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format } = useClientData();

  const summaryRow = {
    id: "summary",
    code: "Tổng",
    openingQty: summaryData?.openingQty || 0,
    openingAmount: summaryData?.openingAmount || 0,
    increaseQty: summaryData?.increaseQty || 0,
    increaseAmount: summaryData?.increaseAmount || 0,
    decreaseQty: summaryData?.decreaseQty || 0,
    decreaseAmount: summaryData?.decreaseAmount || 0,
    closingQty: summaryData?.closingQty || 0,
    closingAmount: summaryData?.closingAmount || 0,
    isSummary: true,
  };

  const formatData = (dataSource: IInventoryReport[]) => {
    const formattedData: DataType[] = [];

    dataSource.forEach((item) => {
      const children: Partial<DataType>[] = [];
      if (item.hasVariant) {
        item.variants?.forEach((variant) => {
          children.push({
            code: variant.sku || "",
            name: getVariantOptionContent(variant),
            album: variant.image,
            closingAmount: variant.closingAmount,
            closingQty: variant.closingQty,
            decreaseAmount: variant.decreaseAmount,
            decreaseQty: variant.decreaseQty,
            increaseAmount: variant.increaseAmount,
            increaseQty: variant.increaseQty,
            openingAmount: variant.openingAmount,
            openingQty: variant.openingQty,
            index: "",
            key: variant.id,
            id: item.id,
          });
        });
      }

      formattedData.push({
        ...item,
        key: item.id,
        children: children.length > 0 ? children : undefined,
      });
    });

    return formattedData;
  };

  const formattedData = formatData(dataSource);

  const finalDataSource = dataSource?.length ? [summaryRow, ...formattedData] : formattedData;

  const columns: any = [
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",
      width: 100,
      onHeaderCell: () => {
        const headerStyle = CSS.center_column.onHeaderCell().style;
        return {
          style: {
            ...headerStyle,
            borderLeftWidth: 0.5,
          },
        };
      },
    },
    {
      title: "Tên hàng hóa/ Quy cách",
      dataIndex: "name",
      key: "name",
      width: 250,
      ...CSS.center_column,
      render: (name: string, record: any) =>
        name ? (
          <div className="flex items-center gap-2">
            <ProductImage size={24} image={getMainImage(record.album || [])} />
            <div className="flex-1 flex flex-col">
              <span className="block truncate">{name}</span>
            </div>
          </div>
        ) : (
          <></>
        ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 250,
      ...CSS.center_column,
      render: (category: IAttribute) => (
        <ContentTooltip content={getProductCategoryContent(category)} width={250} />
      ),
    },
    {
      title: "ĐVT",
      dataIndex: ["unit", "name"],
      key: "unitName",
      width: 70,
      align: "center",
      ...CSS.center_column,
    },
    {
      title: "Tồn đầu kỳ",
      dataIndex: "opening",
      key: "opening",
      width: 150,
      ...CSS.center_column,
      children: [
        {
          title: "Số lượng",
          dataIndex: "openingQty",
          key: "openingQty",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number) => formatQuantity(value, format),
        },
        {
          title: "Giá trị",
          dataIndex: "openingAmount",
          key: "openingAmount",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number) => formatMoney(value, format),
        },
      ],
    },
    {
      title: "Nhập trong kỳ",
      dataIndex: "increase",
      key: "increase",
      ...CSS.center_column,
      children: [
        {
          title: "Số lượng",
          dataIndex: "increaseQty",
          key: "increaseQty",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number) => formatQuantity(value),
        },
        {
          title: "Giá trị",
          dataIndex: "increaseAmount",
          key: "increaseAmount",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number) => formatMoney(value, format),
        },
      ],
    },
    {
      title: "Xuất trong kỳ",
      dataIndex: "decrease",
      key: "decrease",
      ...CSS.center_column,
      children: [
        {
          title: "Số lượng",
          dataIndex: "decreaseQty",
          key: "decreaseQty",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number) => formatQuantity(value),
        },
        {
          title: "Giá trị",
          dataIndex: "decreaseAmount",
          key: "decreaseAmount",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number) => formatMoney(value, format),
        },
      ],
    },
    {
      title: "Tồn cuối kỳ",
      dataIndex: "closing",
      key: "closing",
      ...CSS.center_column,
      children: [
        {
          title: "Số lượng",
          dataIndex: "closingQty",
          key: "closingQty",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number) => formatQuantity(value),
        },
        {
          title: "Giá trị",
          dataIndex: "closingAmount",
          key: "closingAmount",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number) => formatMoney(value, format),
        },
      ],
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      itemName={"sản phẩm"}
      tableKey="inventory-report-table"
      pagination={pagination}
      hasSummary
      className="double-floor"
      {...rest}
    />
  );
};

export default ReportTable;
