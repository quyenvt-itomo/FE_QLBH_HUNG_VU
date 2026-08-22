import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import useDebounce from "../../hooks/core/useDebounce";
import { IPartner } from "../../models/partner";
import { usePartnerData } from "../../hooks/partner/usePartnerData";
import { PartnerTypeEnum } from "../../constants/enum";

export const PartnerSelect: React.FC<MultipleSelectProps<IPartner>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listPartner, setListPartner] = useState<IPartner[]>([]);
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
  });

  useEffect(() => {
    if (partners.length === 0) return;

    setListPartner((prevList) => {
      const newValues = new Set(partners.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...partners];
    });
  }, [partners]);

  useEffect(() => {
    if (!defaultData?.length) return;

    const newItems = defaultData.filter((d) => !listPartner.some((p) => p.id === d.id));
    if (newItems.length > 0) {
      setListPartner((prev) => [...newItems, ...prev]);
    }
  }, [defaultData, listPartner]);

  useEffect(() => {
    setListPartner([]);
  }, [keyword]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listPartner.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = listPartner.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<IPartner>[] = [
    { label: "Tên đối tác", dataIndex: "name", className: "w-48" },
    { label: "Mã đối tác", dataIndex: "code", className: "w-20" },
  ];

  return (
    <SmartMultipleSelect<IPartner>
      dataSource={listPartner}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn đối tác"
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
