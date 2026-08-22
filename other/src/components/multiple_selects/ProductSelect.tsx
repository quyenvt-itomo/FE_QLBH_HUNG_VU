import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import useDebounce from "../../hooks/core/useDebounce";
import { IProduct } from "../../models/product";
import { useProductData } from "../../hooks/product/useProductData";

export const ProductSelect: React.FC<MultipleSelectProps<IProduct>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => {
    setPage(1);
  });

  const { products, loading, pagination } = useProductData({
    page,
    size: 20,
    keyword,
    isLockHook,
  });

  useEffect(() => {
    if (products.length === 0) return;

    setListProduct((prevList) => {
      const newValues = new Set(products.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...products];
    });
  }, [products]);

  useEffect(() => {
    if (!defaultData?.length) return;

    const newItems = defaultData.filter((d) => !listProduct.some((p) => p.id === d.id));
    if (newItems.length > 0) {
      setListProduct((prev) => [...newItems, ...prev]);
    }
  }, [defaultData, listProduct]);

  useEffect(() => {
    setListProduct([]);
  }, [keyword]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listProduct.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = listProduct.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<IProduct>[] = [
    { label: "Tên hàng", dataIndex: "name", className: "w-48" },
    { label: "Mã hàng", dataIndex: "code", className: "w-32" },
  ];

  return (
    <SmartMultipleSelect<IProduct>
      dataSource={listProduct}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn hàng hóa/sản phẩm"
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        setIsLockHook(false);
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};
