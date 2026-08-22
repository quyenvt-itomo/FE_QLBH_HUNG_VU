import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import useDebounce from "../../hooks/core/useDebounce";
import { IPartner } from "../../models/partner";
import { usePartnerData } from "../../hooks/partner/usePartnerData";
import { PartnerTypeEnum } from "../../constants/enum";
import { filterPartnersByType } from "../../utils/common";

export const ShipperSelect: React.FC<MultipleSelectProps<IPartner>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listShipper, setListShipper] = useState<IPartner[]>([]);
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
    type: PartnerTypeEnum.SHIPPER,
  });

  useEffect(() => {
    const filterData = filterPartnersByType(partners, PartnerTypeEnum.SHIPPER);
    if (filterData.length === 0) return;

    setListShipper((prevList) => {
      const newValues = new Set(filterData.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...filterData];
    });
  }, [partners]);

  useEffect(() => {
    if (!defaultData?.length) return;

    const newItems = defaultData.filter((d) => !listShipper.some((p) => p.id === d.id));
    if (newItems.length > 0) {
      setListShipper((prev) => [...newItems, ...prev]);
    }
  }, [defaultData, listShipper]);

  useEffect(() => {
    setListShipper([]);
  }, [keyword]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listShipper.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = listShipper.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<IPartner>[] = [
    { label: "Tên ĐVVC", dataIndex: "name", className: "w-48" },
    { label: "Mã ĐVVC", dataIndex: "code", className: "w-20" },
  ];

  return (
    <SmartMultipleSelect<IPartner>
      dataSource={listShipper}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn đơn vị vận chuyển"
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
