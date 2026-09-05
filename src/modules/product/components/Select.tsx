import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { Product, ProductQuery } from "../product.model";
import { useProductStore, usePublicProductStore } from "../product.store";
import { AddSelect, DropdownColumn } from "@/shared/components";
import { SmartSelect } from "@/shared/components";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { SmartMultipleSelect } from "@/shared/components";
import { useEffect, useMemo, useState } from "react";
import { ProductAddUpdateModal } from "./ProductAddUpdateModal";
import { useGlobalData } from "@/shared/hooks";
import { formatMoney } from "@/shared/utils";
import { Store } from "@/modules/store";

const columns: DropdownColumn<Product>[] = [
  { label: "Tên hàng", dataIndex: "name", className: "w-64" },
  { label: "Mã hàng", dataIndex: "code", className: "w-24" },
  { label: "ĐVT", dataIndex: ["baseUnit", "name"], className: "w-24 text-center" },
];

const getFinalColumns = (config: {
  showCostPrice?: boolean;
  showSalePrice?: boolean;
  showStock?: boolean;
  currentStore?: Store | null;
}) => {
  const { showCostPrice, showSalePrice, showStock, currentStore } = config;
  const finalColumns = [...columns];

  if (showCostPrice) {
    finalColumns.push({
      label: "Giá vốn",
      className: "w-32",
      dataType: "number",
      render: (record) => {
        const costPrice = currentStore
          ? record.storeProducts?.find((sp) => sp.storeId === currentStore.id)?.costPrice
          : record.storeProducts?.[0]?.costPrice;
        return formatMoney(costPrice);
      },
    });
  }
  if (showSalePrice) {
    finalColumns.push({
      label: "Giá bán",
      dataIndex: "salePrice",
      className: "w-32 text-right",
      dataType: "number",
    });
  }

  if (showStock) {
    finalColumns.push({
      label: "Tồn kho",
      dataIndex: "stockQuantity",
      className: "w-20",
      dataType: "number",
    });
  }

  return finalColumns;
};

interface ProductSelectProps extends SelectProps<Product, ProductQuery> {
  showCostPrice?: boolean;
  showSalePrice?: boolean;
  showStock?: boolean;
}

export const ProductSelect: React.FC<ProductSelectProps> = ({
  value,
  defaultData,
  placeholder,
  query,
  showCostPrice,
  showSalePrice,
  showStock,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { currentStore } = useGlobalData();
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Product,
    ProductQuery
  >({
    defaultData,
    queryHook: useProductStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
  });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const finalColumns = useMemo(
    () => getFinalColumns({ showCostPrice, showSalePrice, showStock, currentStore }),
    [showCostPrice, showSalePrice, showStock, currentStore],
  );

  return (
    <SmartSelect<Product>
      dataSource={list}
      columns={finalColumns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={placeholder || "Chọn hàng hóa"}
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        unlock();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};

export const ProductMultipleSelect: React.FC<MultipleSelectProps<Product, ProductQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  hideOptions,
  ...rest
}) => {
  const { finalList, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Product,
    ProductQuery
  >({
    defaultData,
    hideOptions,
    queryHook: useProductStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
    resetPageDeps: [query],
  });

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = finalList.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  return (
    <SmartMultipleSelect<Product>
      dataSource={finalList}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn hàng hóa"
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        unlock();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};

export const ProductAddSelect: React.FC<ProductSelectProps> = ({
  value,
  defaultData,
  query,
  showCostPrice,
  showSalePrice,
  showStock,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const { errors, creating, create, newItem } = useProductStore({ isLocked: true }, () =>
    setOpen(false),
  );
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Product,
    ProductQuery
  >({
    defaultData,
    queryHook: useProductStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      keyword,
      page,
      size: 10,
      isLocked,
      ...query,
    }),
    resetPageDeps: [query],
  });

  useEffect(() => {
    if (!newItem) return;
    onChange?.(newItem.id);
    onChangeData?.(newItem);
  }, [newItem, onChange, onChangeData]);

  const finalColumns = useMemo(
    () => getFinalColumns({ showCostPrice, showSalePrice, showStock }),
    [showCostPrice, showSalePrice, showStock],
  );

  return (
    <AddSelect<Product>
      options={list}
      columns={finalColumns}
      value={value}
      loading={loading}
      onSearch={setKeywordTemp}
      onPopupScroll={handlePopupScroll}
      onChange={(id) => {
        onChange?.(id);
        onChangeData?.(list.find((item) => item.id === id));
      }}
      onFocus={(event) => {
        unlock();
        onFocus?.(event);
      }}
      placeholder="Chọn hàng hóa"
      disabled={rest.disabled}
      showAddButton={!!create}
      modal={
        <ProductAddUpdateModal
          open={open}
          errors={errors}
          loading={creating}
          onAdd={create}
          onClose={() => setOpen(false)}
        />
      }
      onOpen={() => setOpen(true)}
      {...rest}
    />
  );
};

/**
 * Public product multiple select — không cần auth, dùng cho trang public (khách hàng bên ngoài)
 */
export const PublicProductMultipleSelect: React.FC<MultipleSelectProps<Product, ProductQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  hideOptions,
  ...rest
}) => {
  const { finalList, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Product,
    ProductQuery
  >({
    defaultData,
    hideOptions,
    queryHook: usePublicProductStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
    resetPageDeps: [query],
  });

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = finalList.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  return (
    <SmartMultipleSelect<Product>
      dataSource={finalList}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn hàng hóa"
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        unlock();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};
