import React from "react";
import { Empty, Tag } from "antd";
import { Product } from "../../product.model";
import { formatMoney } from "@/shared/utils/number.util";

export const StoreBranchesTab: React.FC<{ data: Product }> = ({ data }) => {
  const storeProducts = data.storeProducts || [];

  if (!storeProducts.length) {
    return <Empty className="py-10" description="Chưa cấu hình chi nhánh kinh doanh" />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
      {storeProducts.map((item) => (
        <div key={item.id || item.storeId} className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-800">
                {item.store?.name || item.storeId}
              </h3>
              {item.store?.code && <p className="text-xs text-gray-400">{item.store.code}</p>}
            </div>
            <Tag color={item.isSelling ? "green" : "default"}>
              {item.isSelling ? "Đang bán" : "Ngừng bán"}
            </Tag>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-gray-400">Giá vốn</div>
              <div className="font-medium text-gray-700">{formatMoney(item.costPrice)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Vị trí</div>
              <div className="font-medium text-gray-700">
                {item.locations?.map((location) => location.location?.name).filter(Boolean).join(", ") ||
                  "Chưa thiết lập"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
