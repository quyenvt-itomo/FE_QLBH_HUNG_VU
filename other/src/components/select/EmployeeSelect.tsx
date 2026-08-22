import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { useEmployeeData } from "../../hooks/useEmployeeData";
import { IEmployee } from "../../models/store/employee";

const EmployeeSelect: React.FC<SelectProps<IEmployee>> = ({
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
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));

  const { employees, loading, pagination } = useEmployeeData({
    keyword,
    page,
    size: 10,
    isLockHook,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListEmployee(employees);
      return;
    }

    setListEmployee((prevList) => {
      const newValues = new Set(employees.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...employees];
    });
  }, [employees, pagination]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listEmployee.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListEmployee([defaultData, ...listEmployee]);
  }, [defaultData, listEmployee]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listEmployee.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listEmployee.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<IEmployee>[] = [
    { label: "Tên nhân sự", dataIndex: "name", className: "w-2/3" },
    { label: "Mã nhân sự", dataIndex: "code", className: "w-1/3" },
  ];

  return (
    <SmartSelect<IEmployee>
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

export default EmployeeSelect;
