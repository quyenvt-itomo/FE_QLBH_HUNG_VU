import React, { useMemo } from "react";
import {
  TableColumnConfig,
  ObjectTableProps,
  ProductImage,
  ColumnsConfigType,
  TableBooleanCell,
} from "@/shared/components";
import { Product } from "../product.model";
import { formatMoney } from "@/shared/utils/number.util";
import { getMainFile } from "@/shared/utils";
import { useGlobalData } from "@/shared/hooks";
import { getCostPriceMap } from "../product.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Product) => void;
}

export const ProductTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const { currentStore } = useGlobalData();
  const columns = useMemo(
    (): ColumnsConfigType<Product> => [
      {
        title: "Ảnh",
        key: "image",
        width: 40,
        align: "center",
        render: (r: Product) => (
          <ProductImage image={getMainFile(r.image)} size={28} shape="square" />
        ),
      },
      {
        title: "Mã hàng",
        dataIndex: "code",
        key: "code",
        width: 130,
        className: "code-column font-mono",
        render: (v: string, r: Product) => (
          <span
            className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail?.(r);
            }}
          >
            {v}
          </span>
        ),
      },
      {
        title: "Mã vạch",
        dataIndex: "barcode",
        key: "barcode",
        width: 130,
        hidden: true,
      },
      {
        title: "Tên hàng",
        key: "name",
        width: 230,
        render: (r: Product) => <div className="flex w-52 text-wrap">{r.name}</div>,
      },
      {
        title: "ĐVT",
        dataIndex: ["baseUnit", "name"],
        key: "baseUnit",
        align: "center",
        width: 80,
      },
      {
        title: "Nhóm hàng",
        dataIndex: ["group", "name"],
        key: "group",
        width: 120,
      },
      {
        title: "Giá bán",
        dataIndex: "salePrice",
        key: "salePrice",
        width: 130,
        align: "right",
        render: (v: number) => formatMoney(v),
      },
      {
        title: "Giá vốn",
        dataIndex: "storeProducts",
        key: "costPrice",
        width: 130,
        align: "right",
        render: (storeProducts: Product["storeProducts"], record: Product) => {
          if (!storeProducts || storeProducts.length === 0) return "";
          if (currentStore) {
            const storeProduct = storeProducts.find((sp) => sp.storeId === currentStore.id);
            return formatMoney(storeProduct?.costPrice);
          }

          const costPriceMap = getCostPriceMap(record);

          return (
            <div className="flex flex-col items-end">
              {Object.entries(costPriceMap).map(([costPrice, storeNames]) => (
                <span key={costPrice} title={storeNames.join(", ")}>
                  {costPrice}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        title: "Thương hiệu",
        dataIndex: ["brand", "name"],
        key: "brandName",
        width: 120,
        hidden: true,
      },
      {
        title: "Tồn kho",
        dataIndex: "stockQuantity",
        key: "stockQuantity",
        width: 100,
        align: "right",
        render: (v: number) => formatMoney(v),
      },
      {
        title: "Vị trí",
        dataIndex: "storeProducts",
        key: "locations",
        width: 200,
        hidden: true,
        render: (storeProducts: Product["storeProducts"]) => {
          if (!storeProducts || storeProducts.length === 0) return "";

          if (currentStore) {
            const storeProduct = storeProducts.find((sp) => sp.storeId === currentStore.id);
            const locationNames = storeProduct?.locations
              ?.map((l) => l.location?.name)
              .filter(Boolean);
            return locationNames?.join(", ") || "";
          }
          return (
            <div className="flex flex-col items-start">
              {storeProducts.map((sp) => {
                const locationNames = sp.locations?.map((l) => l.location?.name).filter(Boolean);
                return (
                  <span key={sp.storeId} title={sp.store?.name}>
                    {locationNames?.join(", ")}
                  </span>
                );
              })}
            </div>
          );
        },
      },
      {
        title: "Đang bán",
        dataIndex: "storeProducts",
        key: "isSelling",
        width: 120,
        align: "center",
        render: (storeProducts: Product["storeProducts"]) => {
          if (!storeProducts || storeProducts.length === 0) return "";
          if (currentStore) {
            const storeProduct = storeProducts.find((sp) => sp.storeId === currentStore.id);
            return <TableBooleanCell value={storeProduct?.isSelling} />;
          }

          const sellingStore = storeProducts
            .filter((sp) => sp.isSelling)
            .map((sp) => sp.store?.name)
            .filter(Boolean);

          return (
            <div className="flex flex-col">
              <span className="text-gray-400 text-start text-wrap">
                {sellingStore.length > 0 ? sellingStore.join(", ") : "Không CH nào đang bán"}
              </span>
            </div>
          );
        },
      },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName="hàng hóa"
      tableKey="product-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
