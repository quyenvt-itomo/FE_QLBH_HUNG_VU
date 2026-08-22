import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { IFund } from "../../models/fund";
import { useFundData } from "../../hooks/fund/useFundData";
import { fundTypeMap } from "../../constants/enum";
import { StarIcon } from "@heroicons/react/24/outline";
import { useClientData } from "../../hooks/core/useClientData";

interface Props extends SelectProps<IFund> {
  showBalance?: boolean;
}
const FundSelect: React.FC<Props> = ({
  value,
  defaultData,
  showBalance = true,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listFund, setListFund] = useState<IFund[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));
  const { currentStore } = useClientData();

  const { funds, loading, pagination } = useFundData({
    keyword,
    page,
    size: 9999,
    isLockHook,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListFund(funds);
      return;
    }

    setListFund((prevList) => {
      const newValues = new Set(funds.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...funds];
    });
  }, [funds, pagination]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listFund.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListFund([defaultData, ...listFund]);
  }, [defaultData, listFund]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listFund.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listFund.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<IFund>[] = [
    { label: "Tên quỹ", dataIndex: "name", className: "w-52" },
    {
      label: "Mã quỹ",
      dataIndex: "code",
      className: "w-32",
      render: (item) => (
        <div className="flex gap-2">
          <span className="bg-primary/20 w-fit px-2 py-px text-primary rounded-md">
            {item.code}
          </span>
          {item.isDefault && (
            <div
              className="z-10 bg-yellow-400 rounded-full flex items-center justify-center h-5 w-5"
              title="Quỹ mặc định"
            >
              <StarIcon className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Loại quỹ",
      dataIndex: "type",
      className: "w-32",
      dataType: "enum",
      render: (value) => fundTypeMap[value.type],
    },
  ];

  if (showBalance) {
    columns.push({
      label: "Số dư hiện tại",
      dataIndex: "currentBalance",
      className: "w-32",
      dataType: "number",
    });
  }

  if (!currentStore) {
    columns.push({
      label: "Cửa hàng",
      dataIndex: "store",
      className: "w-32",
      childKey: "name",
    });
  }

  return (
    <SmartSelect<IFund>
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

export default FundSelect;
