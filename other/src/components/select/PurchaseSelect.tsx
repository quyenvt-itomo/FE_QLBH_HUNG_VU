import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { IOrder } from "../../models/store/order";
import { usePurchaseData } from "../../hooks/order/usePurchaseData";

const PurchaseSelect: React.FC<SelectProps<IOrder>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listPurchase, setListPurchase] = useState<IOrder[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));

  const { purchases, loading, pagination } = usePurchaseData({
    keyword,
    page,
    size: 10,
    isLockHook,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListPurchase(purchases);
      return;
    }

    setListPurchase((prevList) => {
      const newValues = new Set(purchases.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...purchases];
    });
  }, [purchases, pagination]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listPurchase.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListPurchase([defaultData, ...listPurchase]);
  }, [defaultData, listPurchase]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listPurchase.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listPurchase.find((item) => item.id === id);
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
      label: "Nhà cung cấp",
      dataIndex: "partner",
      className: "w-32",
      childKey: "name",
    },
  ];

  return (
    <SmartSelect<IOrder>
      dataSource={listPurchase}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn đơn nhập hàng"
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

export default PurchaseSelect;
