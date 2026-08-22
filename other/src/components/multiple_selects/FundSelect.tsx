import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import useDebounce from "../../hooks/core/useDebounce";
import { IFund } from "../../models/fund";
import { useFundData } from "../../hooks/fund/useFundData";
import { fundTypeMap } from "../../constants/enum";
import { useClientData } from "../../hooks/core/useClientData";

export const FundSelect: React.FC<MultipleSelectProps<IFund>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listFund, setListFund] = useState<IFund[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => {
    setPage(1);
  });

  const { funds, loading, pagination } = useFundData({
    page,
    size: 9999,
    keyword,
    isLockHook,
  });
  const { currentStore } = useClientData();

  useEffect(() => {
    if (funds.length === 0) return;

    setListFund((prevList) => {
      const newValues = new Set(funds.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...funds];
    });
  }, [funds]);

  useEffect(() => {
    if (!defaultData?.length) return;

    const newItems = defaultData.filter((d) => !listFund.some((p) => p.id === d.id));
    if (newItems.length > 0) {
      setListFund((prev) => [...newItems, ...prev]);
    }
  }, [defaultData, listFund]);

  useEffect(() => {
    setListFund([]);
  }, [keyword]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listFund.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = listFund.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<IFund>[] = [
    { label: "Tên quỹ", dataIndex: "name", className: "w-48" },
    { label: "Mã quỹ", dataIndex: "code", className: "w-20" },
    {
      label: "Loại",
      dataIndex: "type",
      className: "w-20",
      render: (item) => fundTypeMap[item.type],
      dataType: "enum",
    },
  ];

  if (!currentStore) {
    columns.push({
      label: "Cửa hàng",
      dataIndex: "store",
      className: "w-32",
      childKey: "name",
    });
  }

  return (
    <SmartMultipleSelect<IFund>
      dataSource={listFund}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn quỹ"
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
