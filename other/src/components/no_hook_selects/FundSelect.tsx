import { useState } from "react";
import { SelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { IFund } from "../../models/fund";
import { useFundData } from "../../hooks/fund/useFundData";
import { fundTypeMap } from "../../constants/enum";
import { useClientData } from "../../hooks/core/useClientData";

const FundSelect: React.FC<SelectProps<IFund>> = ({
  value,
  defaultData,
  hideOptions,
  offsetAt,
  onChange,
  onChangeData,
  ...rest
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const { funds, loading } = useFundData({ isLockHook: true, offsetAt });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = funds.find((item) => item.id === id);
    onChangeData?.(data);
  };
  const { currentStore } = useClientData();

  const filteredFunds =
    // lọc theo keyword
    keyword.trim() === ""
      ? funds.filter((fund) => !hideOptions?.some((hide) => hide.id === fund.id))
      : funds
          .filter((fund) => !hideOptions?.some((hide) => hide.id === fund.id))
          .filter(
            (fund) =>
              fund.name.toLowerCase().includes(keyword.trim().toLowerCase()) ||
              fund.code.toLowerCase().includes(keyword.trim().toLowerCase()),
          );

  const columns: DropdownColumn<IFund>[] = [
    { label: "Tên quỹ", dataIndex: "name", className: "w-52" },
    { label: "Mã quỹ", dataIndex: "code", className: "w-32" },
    {
      label: "Loại quỹ",
      dataIndex: "type",
      className: "w-20",
      dataType: "enum",
      render: (value) => fundTypeMap[value.type],
    },
    {
      label: "Số dư",
      dataIndex: "currentBalance",
      className: "w-40",
      dataType: "number",
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
    <SmartSelect<IFund>
      dataSource={filteredFunds}
      columns={columns}
      value={value}
      onChange={handleChange}
      placeholder="Chọn quỹ"
      loading={loading}
      onSearch={setKeyword}
      {...rest}
    />
  );
};

export default FundSelect;
