import ContentTooltip from "../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../hooks/core/useClientData";
import { formatMoney, formatPercentage, formatQuantity } from "../../../../utils/formatNumber";
import ProductImage from "../../../../components/image/ProductImage";
import { getMainImage } from "../../../../utils/fileUtil";
import SquareImageGroup from "../../../../components/image/SquareImageGroup";
import { IProduct } from "../../../../models/product";
import { useEffect, useMemo, useState } from "react";
import { getProductCategoryContent, getVariantOptionContent } from "../../../../utils/common";
import { IAttribute } from "../../../../models/base/attribute";
import { Icon } from "@iconify/react";
import { Checkbox } from "antd";
import { checkAnyModule, checkModule, checkPermission } from "../../../../utils/permissionUtils";

interface Props extends ObjectTableProps {
  selectedIds?: string[];
  onSelectIdsChange?: (ids: string[]) => void;
  onPrintBarcode?: (record: any) => void;
}
const ProductTable: React.FC<Props> = ({
  selectedIds,
  onSelectIdsChange,
  onPrintBarcode,
  dataSource,
  ...rest
}) => {
  const { format, permissions } = useClientData();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!Array.isArray(dataSource)) {
      setData([]);
      return;
    }

    const result = dataSource.map((product: IProduct) => ({
      key: product.id ?? product.tempId,
      ...product,
      barcode: product.hasVariant ? "" : product.variants?.[0]?.barcode,
      costPrice: product.hasVariant ? undefined : product.variants?.[0]?.costPrice,
      price: product.hasVariant ? undefined : product.variants?.[0]?.price,
      children: product.hasVariant
        ? product.variants?.map((variant) => ({
            key: variant.id ?? variant.tempId,
            index: "",
            code: variant.sku,
            isChild: true,
            ...variant,
            name: getVariantOptionContent(variant),
            album: variant.image,
            totalStockQty: variant.stockQty,
            totalStockValue: variant.stockValue,
          }))
        : undefined,
    }));

    setData(result);
  }, [dataSource]);

  // Get only parent items (not children/variants)
  const parentItems = useMemo(() => data.filter((item) => !item.isChild), [data]);

  const columns: any = useMemo(
    () =>
      [
        {
          title: (
            <div className="flex gap-2">
              <Checkbox
                key={"all"}
                checked={
                  parentItems.length > 0 &&
                  parentItems.every((item) => selectedIds?.includes(item.id))
                }
                indeterminate={
                  selectedIds && selectedIds.length > 0 && selectedIds.length < parentItems.length
                }
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectIdsChange?.(e.target.checked ? parentItems.map((item) => item.id) : []);
                }}
              />
              <span>Mã hàng</span>
            </div>
          ),
          dataIndex: "code",
          key: "code",
          width: 150,
          fixed: "left",
          render: (code: string, record: any) => (
            <div className="flex items-center gap-2">
              {!record.isChild && (
                <Checkbox
                  key={record.id || record.tempId || record.key}
                  checked={selectedIds?.includes(record.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (e.target.checked) {
                      onSelectIdsChange?.([...(selectedIds || []), record.id]);
                    } else {
                      onSelectIdsChange?.(selectedIds?.filter((id) => id !== record.id) || []);
                    }
                  }}
                />
              )}
              <span className="truncate">{code}</span>
            </div>
          ),
        },
        {
          title: "Tên hàng hóa/ Quy cách",
          dataIndex: "name",
          key: "name",
          width: 250,
          render: (_: string, record: any) => (
            <div className="flex items-center gap-2">
              <ProductImage size={24} image={getMainImage(record.album || [])} />
              <div className="flex-1 flex flex-col max-w-[300px]" title={record.name}>
                <span className="block truncate">{record?.name}</span>
              </div>
            </div>
          ),
        },
        {
          title: "Danh mục",
          dataIndex: "category",
          key: "category",
          width: 250,
          render: (category: IAttribute) => (
            <ContentTooltip content={getProductCategoryContent(category)} width={250} />
          ),
        },
        {
          title: "Mã vạch",
          dataIndex: "barcode",
          key: "barcode",
          width: 220,
          render: (barcode: string, record: any) => (
            <div className="flex items-center justify-between">
              <span className="truncate">{barcode}</span>
              {barcode && onPrintBarcode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrintBarcode(record);
                  }}
                  className="hover:text-blue-600 transition-colors"
                  title="In mã vạch"
                >
                  <Icon icon="ic:baseline-barcode" width="16" height="16" />
                </button>
              )}
            </div>
          ),
        },
        {
          title: "ĐVT",
          dataIndex: ["unit", "name"],
          key: "unitName",
          width: 80,
          align: "center",
        },
        {
          title: "Ảnh",
          dataIndex: "album",
          key: "album",
          width: 120,
          render: (album: IProduct["album"], record: any) =>
            record.hasVariant !== undefined && <SquareImageGroup images={album} />,
        },
        {
          title: "%VAT",
          dataIndex: "taxRate",
          key: "taxRate",
          width: 120,
          align: "right",
          render: (taxRate: number) => formatPercentage(taxRate, format),
        },
        checkAnyModule(permissions, ["purchaseOrder", "purchaseReturn"]) && {
          title: "Giá vốn",
          dataIndex: "costPrice",
          key: "costPrice",
          width: 120,
          align: "right",
          render: (price: number) => formatMoney(price, format),
        },
        checkAnyModule(permissions, ["saleOrder", "saleReturn"]) && {
          title: "Giá bán",
          dataIndex: "price",
          key: "price",
          width: 120,
          align: "right",
          render: (price: number) => formatMoney(price, format),
        },
        {
          title: "Tồn kho",
          dataIndex: "totalStockQty",
          key: "totalStockQty",
          width: 120,
          align: "right",
          render: (totalStockQty: number) => formatQuantity(totalStockQty, format),
        },

        checkAnyModule(permissions, ["purchaseOrder", "purchaseReturn"]) && {
          title: "Giá trị tồn",
          dataIndex: "totalStockValue",
          key: "totalStockValue",
          width: 120,
          align: "right",
          render: (totalStockValue: number) => formatMoney(totalStockValue, format),
        },
        {
          title: "Mô tả",
          dataIndex: "note",
          key: "note",
          width: 200,
          render: (note: string) => <ContentTooltip content={note} width={200} />,
        },
      ].filter(Boolean),
    [parentItems, selectedIds, format, onSelectIdsChange, onPrintBarcode],
  );

  return (
    <div className="flex flex-col h-full relative">
      <TableColumnConfig
        columns={columns}
        dataSource={data}
        itemName="hàng hóa"
        tableKey="product-table"
        {...rest}
      />
    </div>
  );
};

export default ProductTable;
