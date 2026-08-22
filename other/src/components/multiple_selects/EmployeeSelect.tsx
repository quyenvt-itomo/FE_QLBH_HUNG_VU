import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import useDebounce from "../../hooks/core/useDebounce";
import { useEmployeeData } from "../../hooks/useEmployeeData";
import { IEmployee } from "../../models/store/employee";

export const EmployeeSelect: React.FC<MultipleSelectProps<IEmployee>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listEmployee, setListEmployee] = useState<IEmployee[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => {
    setPage(1);
  });

  const { employees, loading, pagination } = useEmployeeData({
    page,
    size: 20,
    keyword,
    isLockHook,
  });

  useEffect(() => {
    if (employees.length === 0) return;

    setListEmployee((prevList) => {
      const newValues = new Set(employees.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...employees];
    });
  }, [employees]);

  useEffect(() => {
    if (!defaultData?.length) return;

    const newItems = defaultData.filter((d) => !listEmployee.some((p) => p.id === d.id));
    if (newItems.length > 0) {
      setListEmployee((prev) => [...newItems, ...prev]);
    }
  }, [defaultData, listEmployee]);

  useEffect(() => {
    setListEmployee([]);
  }, [keyword]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listEmployee.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = listEmployee.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<IEmployee>[] = [
    { label: "Tên nhân sự", dataIndex: "name", className: "w-48" },
    { label: "Mã nhân sự", dataIndex: "code", className: "w-20" },
  ];

  return (
    <SmartMultipleSelect<IEmployee>
      dataSource={listEmployee}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn nhân sự"
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
