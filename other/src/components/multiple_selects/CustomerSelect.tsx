import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import useDebounce from "../../hooks/core/useDebounce";
import { IPartner } from "../../models/partner";
import { usePartnerData } from "../../hooks/partner/usePartnerData";
import { PartnerTypeEnum } from "../../constants/enum";
import { filterPartnersByType } from "../../utils/common";

export const CustomerSelect: React.FC<MultipleSelectProps<IPartner>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listCustomer, setListCustomer] = useState<IPartner[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => {
    setPage(1);
  });

  const { partners, loading, pagination } = usePartnerData({
    page,
    size: 20,
    keyword,
    isLockHook,
    type: PartnerTypeEnum.CUSTOMER,
  });

  useEffect(() => {
    const filterData = filterPartnersByType(partners, PartnerTypeEnum.CUSTOMER);
    if (filterData.length === 0) return;

    setListCustomer((prevList) => {
      const newValues = new Set(filterData.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...filterData];
    });
  }, [partners]);

  useEffect(() => {
    if (!defaultData?.length) return;

    const newItems = defaultData.filter((d) => !listCustomer.some((p) => p.id === d.id));
    if (newItems.length > 0) {
      setListCustomer((prev) => [...newItems, ...prev]);
    }
  }, [defaultData, listCustomer]);

  useEffect(() => {
    setListCustomer([]);
  }, [keyword]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listCustomer.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = listCustomer.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<IPartner>[] = [
    { label: "Tên KH", dataIndex: "name", className: "w-48" },
    { label: "Mã KH", dataIndex: "code", className: "w-20" },
  ];

  return (
    <SmartMultipleSelect<IPartner>
      dataSource={listCustomer}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn khách hàng"
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
