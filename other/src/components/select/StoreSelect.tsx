import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { useStoreData } from "../../hooks/useStoreData";
import { IStore } from "../../models/store";

const StoreSelect: React.FC<SelectProps<IStore>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listStore, setListStore] = useState<IStore[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));

  const { stores, loading, pagination } = useStoreData({
    keyword,
    page,
    size: 10,
    isLockHook,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListStore(stores);
      return;
    }

    setListStore((prevList) => {
      const newValues = new Set(stores.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...stores];
    });
  }, [stores, pagination]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listStore.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListStore([defaultData, ...listStore]);
  }, [defaultData, listStore]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listStore.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listStore.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<IStore>[] = [
    { label: "Tên cửa hàng", dataIndex: "name", className: "w-64" },
    { label: "Mã CH", dataIndex: "code", className: "w-20" },
  ];

  return (
    <SmartSelect<IStore>
      dataSource={listStore}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn cửa hàng"
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

export default StoreSelect;
