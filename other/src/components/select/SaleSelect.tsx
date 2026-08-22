import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { IOrder } from "../../models/store/order";
import { useSaleData } from "../../hooks/order/useSaleData";

interface Props extends SelectProps<IOrder> {
  startAt?: string;
  endAt?: string;
}

const SaleSelect: React.FC<Props> = ({
  value,
  defaultData,
  startAt,
  endAt,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listSale, setListSale] = useState<IOrder[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));

  const { sales, loading, pagination } = useSaleData({
    keyword,
    page,
    size: 10,
    isLockHook,
    startAt,
    endAt,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListSale(sales);
      return;
    }

    setListSale((prevList) => {
      const newValues = new Set(sales.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...sales];
    });
  }, [sales, pagination]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listSale.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListSale([defaultData, ...listSale]);
  }, [defaultData, listSale]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listSale.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listSale.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<IOrder>[] = [
    { label: "Mã đơn", dataIndex: "code", className: "w-28" },
    {
      label: "Ngày",
      dataIndex: "orderAt",
      className: "w-24",
      dataType: "date",
    },
    {
      label: "Khách hàng",
      dataIndex: "partner",
      className: "w-32",
      childKey: "name",
    },
  ];

  return (
    <SmartSelect<IOrder>
      dataSource={listSale}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn đơn bán hàng"
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

export default SaleSelect;
