import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { Product, ProductQuery, productTypeMap } from "../product.model";
import { useProductStore, usePublicProductStore } from "../product.store";
import { DropdownColumn } from "@/shared";
import { SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { SmartMultipleSelect } from "@/shared";
import { ProductTypeTag } from "./Tag";

const columns: DropdownColumn<Product>[] = [
  { label: "Tên hàng", dataIndex: "name", className: "w-64" },
  { label: "Mã hàng", dataIndex: "code", className: "w-24" },
  { label: "ĐVT", dataIndex: ["baseUnit", "name"], className: "w-24 text-center" },
  {
    label: "Loại",
    dataIndex: "type",
    className: "w-28 text-center",
    render: (record) => <ProductTypeTag value={record.type} size="sm" />,
  },
];

export const ProductSelect: React.FC<SelectProps<Product, ProductQuery>> = ({
  value,
  defaultData,
  placeholder,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
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

  return (
    <SmartSelect<Product>
      dataSource={list}
      columns={columns}
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
