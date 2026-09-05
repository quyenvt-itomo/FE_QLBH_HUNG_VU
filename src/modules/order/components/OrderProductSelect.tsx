import { AddSelectButton, AppSelect, ProductImage } from "@/shared/components";
import { useAutoResetItem, useGlobalData, useRemoteSelect } from "@/shared/hooks";
import { formatMoney, formatQuantity, getMainFile, getMainImage } from "@/shared/utils";
import { getCostPriceByStore, getDefaultPurchaseUnit } from "@/modules/product";
import { ProductAddUpdateModal } from "@/modules/product/components/ProductAddUpdateModal";
import { Product, ProductQuery } from "@/modules/product/product.model";
import { useProductStore } from "@/modules/product/product.store";
import { OrderType } from "../order.model";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@/shared/icons";
import { Button } from "antd";

interface Props {
  type: OrderType;
  onSelect: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

const isPurchaseType = (type: OrderType) =>
  type === OrderType.PURCHASE || type === OrderType.PURCHASE_RETURN;

export const OrderProductSelect = ({ type, onSelect, placeholder, className }: Props) => {
  const { currentStore } = useGlobalData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useAutoResetItem<string>();
  const [addOpen, setAddOpen] = useState(false);
  const { errors, creating, create, newItem } = useProductStore({ isLocked: true }, () => {
    setAddOpen(false);
  });

  const buildParams = useCallback(
    ({ keyword, page, isLocked }: { keyword: string; page: number; isLocked: boolean }) =>
      ({ keyword, page, size: 10, isLocked }) as ProductQuery,
    [],
  );

  const { finalList, setList, loading, setKeywordTemp, unlock, handlePopupScroll } =
    useRemoteSelect<Product, ProductQuery>({
      queryHook: useProductStore,
      buildParams,
      resetPageDeps: [type, currentStore?.id],
    });

  useEffect(() => {
    if (!newItem) return;

    setList((items) =>
      items.some((item) => item.id === newItem.id) ? items : [newItem, ...items],
    );
    onSelect(newItem);
    setSelectedId(newItem.id);
    requestAnimationFrame(focusSelect);
  }, [newItem, onSelect, setList, setSelectedId]);

  const focusSelect = () => {
    containerRef.current?.querySelector<HTMLInputElement>("input")?.focus();
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isF3 = event.key === "F3";
      const isF = event.key.toLowerCase() === "f";
      const target = event.target as HTMLElement | null;
      const isEditing = Boolean(target?.closest("input, textarea, [contenteditable='true']"));

      if (
        (!isF3 && !isF) ||
        (!isF3 && isEditing) ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      event.preventDefault();
      focusSelect();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const options = useMemo(
    () =>
      finalList.map((product) => {
        const purchase = isPurchaseType(type);
        const purchaseUnit = getDefaultPurchaseUnit(product);
        const price = purchase
          ? getCostPriceByStore({
              product,
              storeId: currentStore?.id,
              unitId: purchaseUnit?.id || product.baseUnitId,
            })
          : product.salePrice;
        const stock = currentStore?.id
          ? product.stockMetadata?.byStore?.[currentStore.id]?.quantity
          : product.stockMetadata?.total?.quantity;

        return {
          value: product.id,
          title: `[${product.code}] ${product.name}`,
          label: (
            <div className="flex min-w-[560px] items-center gap-3 py-1">
              <ProductImage image={getMainFile(product.image)} size={62} shape="square" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-gray-800 max-w-xs text-wrap">
                  {product.name}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-mono text-blue-600">{product.code}</span>
                  <span className="border-l border-gray-300 pl-2">
                    ĐVT: {purchaseUnit?.name || product.baseUnit?.name || "-"}
                  </span>
                </div>
              </div>
              <div className="w-28 text-right text-xs text-gray-500">
                <div className="font-medium text-gray-700">{formatMoney(price)}</div>
                <div>{purchase ? "Giá vốn" : "Giá bán"}</div>
              </div>
              <div className="w-24 text-right text-xs text-gray-500">
                <div className="font-medium text-gray-700">{formatQuantity(stock || 0)}</div>
                <div>Tồn kho</div>
              </div>
            </div>
          ),
        };
      }),
    [currentStore?.id, finalList, type],
  );

  return (
    <div ref={containerRef} className={`flex min-w-0 ${className || ""}`}>
      <AppSelect
        value={selectedId}
        options={options}
        loading={loading}
        prefix={<MagnifyingGlassIcon className="z-10 w-4 h-4 md:w-5 md:h-5 text-[#747E76]" />}
        suffixIcon={null}
        placeholder={
          placeholder ||
          (isPurchaseType(type)
            ? "Tìm mã hoặc tên hàng để nhập (F3)"
            : "Tìm mã hoặc tên hàng để bán (F3)")
        }
        className={`!h-9 min-w-0 flex-1 ${create ? "rounded-e-none" : ""}`}
        popupMatchSelectWidth={false}
        filterOption={false}
        onSearch={setKeywordTemp}
        onPopupScroll={handlePopupScroll}
        onFocus={unlock}
        onChange={(productId) => {
          const product = finalList.find((item) => item.id === productId);
          setSelectedId(productId);
          if (product) {
            onSelect(product);
            requestAnimationFrame(focusSelect);
          }
        }}
      />
      {create && (
        <>
          <Button
            className={`!w-9 h-9 z-0 hover:z-10  manager-btn bg-[#FAFAFA] p-0 translate-x-[-1px] rounded-s-none flex items-center justify-center flex-shrink-0`}
            onClick={() => setAddOpen(true)}
          >
            <PlusIcon className="w-5 h-5" />
          </Button>
          <ProductAddUpdateModal
            open={addOpen}
            errors={errors}
            loading={creating}
            onAdd={create}
            onClose={() => setAddOpen(false)}
          />
        </>
      )}
    </div>
  );
};
