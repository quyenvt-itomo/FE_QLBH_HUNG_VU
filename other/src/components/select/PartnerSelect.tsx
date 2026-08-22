import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { IPartner } from "../../models/partner";
import { PartnerTypeEnum, partnerTypeMap } from "../../constants/enum";
import { usePartnerData } from "../../hooks/partner/usePartnerData";
import { stringToAcronym } from "../../utils/common";

interface Props extends SelectProps<IPartner> {
  type?: PartnerTypeEnum;
  showPayableBalance?: boolean;
  showReceivableBalance?: boolean;
}

const PartnerSelect: React.FC<Props> = ({
  value,
  defaultData,
  type,
  offsetAt,
  showPayableBalance,
  showReceivableBalance,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listPartner, setListPartner] = useState<IPartner[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));
  const text = (type ? partnerTypeMap[type] : "Đối tác").toLowerCase();

  const { partners, loading, pagination } = usePartnerData({
    keyword,
    page,
    size: 10,
    isLockHook,
    type,
    offsetAt,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListPartner(partners);
      return;
    }

    setListPartner((prevList) => {
      const newValues = new Set(partners.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...partners];
    });
  }, [partners, pagination]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listPartner.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListPartner([defaultData, ...listPartner]);
  }, [defaultData, listPartner]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listPartner.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listPartner.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<IPartner>[] = [
    { label: `Tên ${stringToAcronym(text)}`, dataIndex: "name", className: "w-32" },
    { label: `Mã ${stringToAcronym(text)}`, dataIndex: "code", className: "w-28" },
  ];

  if (!type) {
    columns.push({
      label: "Loại",
      dataIndex: "type",
      className: "w-20",
      dataType: "enum",
      render: (value) => stringToAcronym(partnerTypeMap[value.type] || ""),
    });
  }

  if (showReceivableBalance) {
    columns.push({
      label: "Công nợ phải thu",
      dataIndex: "receivableDebtAmount",
      className: "w-36",
      dataType: "number",
    });
  }

  if (showPayableBalance) {
    columns.push({
      label: "Công nợ phải trả",
      dataIndex: "payableDebtAmount",
      className: "w-36",
      dataType: "number",
    });
  }

  return (
    <SmartSelect<IPartner>
      dataSource={listPartner}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder={`Chọn ${text}`}
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

export default PartnerSelect;
