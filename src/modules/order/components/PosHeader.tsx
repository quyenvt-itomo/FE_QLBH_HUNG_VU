import { Button, Dropdown } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import type { Product } from "@/modules/product/product.model";
import { OrderProductSelect } from "./OrderProductSelect";
import { OrderType } from "../order.model";
import type { CachedOrder, PosOrderType } from "@/shared/stores/orderCache.slice";

interface Props {
  type: PosOrderType;
  caches: CachedOrder[];
  activeOrder?: CachedOrder;
  currentStoreName: string;
  userName?: string | null;
  showProductSearch: boolean;
  productPlaceholder?: string;
  onProductSelect: (product: Product) => void;
  onAddCache: () => void;
  onSelectCache: (cache: CachedOrder) => void;
  onRemoveCache: (cache: CachedOrder) => void;
  actions: ReactNode;
}

export const PosHeader = ({
  type,
  caches,
  activeOrder,
  currentStoreName,
  userName,
  showProductSearch,
  productPlaceholder,
  onProductSelect,
  onAddCache,
  onSelectCache,
  onRemoveCache,
  actions,
}: Props) => (
  <header className="flex h-14 shrink-0 items-center gap-3 bg-[#062d1d] pr-4 pl-2 text-white">
    {showProductSearch && (
      <OrderProductSelect
        type={type as OrderType}
        placeholder={productPlaceholder}
        onSelect={onProductSelect}
        className="w-[360px]"
      />
    )}
    <div className="min-w-0 overflow-x-scroll overflow-y-hidden scrollbar-dark pt-1.5">
      <div className="flex min-w-0 w-fit items-center gap-2 pr-2">
        {caches.map((cache) => {
          const isActive = cache.id === activeOrder?.id;

          return (
            <div
              key={cache.id}
              className={`flex shrink-0 items-center rounded-md pr-1 ${
                isActive ? "bg-white text-[#062d1d]" : "text-white hover:bg-white/10"
              }`}
            >
              <button
                type="button"
                className={`flex h-8 shrink-0 cursor-pointer items-center rounded-s-md bg-transparent px-2 pr-1 ${
                  isActive ? "font-semibold" : ""
                }`}
                onClick={() => onSelectCache(cache)}
              >
                {cache.label}
              </button>
              <Button
                type="text"
                size="small"
                danger
                title={`Đóng ${cache.label}`}
                aria-label={`Đóng ${cache.label}`}
                className={`${isActive ? "!text-red-500" : "!text-white/70 hover:!text-red-400  hover:!bg-white/10"} rounded-full h-5 w-5 p-0`}
                onClick={() => onRemoveCache(cache)}
              >
                <XMarkIcon className="h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
    <Button
      type="text"
      className="!text-white hover:!bg-white/10 p-0 h-8 w-8 shrink-0"
      aria-label="Tạo hóa đơn mới"
      title="Tạo hóa đơn mới"
      onClick={onAddCache}
    >
      <PlusOutlined />
    </Button>
    <div className="ml-auto flex shrink-0 flex-col items-end text-right leading-tight">
      <span className="text-xs text-white/70">{currentStoreName}</span>
      <span className="text-xs font-medium text-white">{userName}</span>
    </div>
    {actions}
  </header>
);
