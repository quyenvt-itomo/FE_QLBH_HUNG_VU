import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import AddSelect from "./AddSelect";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { useClientData } from "../../hooks/core/useClientData";
import { IEmployee } from "../../models/store/employee";
import { useEmployeeData } from "../../hooks/useEmployeeData";
import AddUpdateModal from "../../pages/Private/employee/components/AddUpdateModal";

const EmployeeSelect: React.FC<SelectProps<IEmployee>> = ({
  value,
  defaultData,
  offsetAt,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [listEmployee, setListEmployee] = useState<IEmployee[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));
  const { permissions } = useClientData();

  const { newEmployee, addEmployee } = useEmployeeData({
    keyword,
    page,
    size: 10,
    isLockHook,
    onCloseModal: () => {
      setOpen(false);
      setIsLockHook(false);
      setPage(1);
      setKeywordTemp("");
    },
  });

  const { employees, loading, pagination, errors } = useEmployeeData({
    keyword,
    page,
    size: 10,
    isLockHook,
    offsetAt,
  });

  useEffect(() => {
    setPage(1);
  }, [offsetAt]);

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

  useEffect(() => {
    if (!newEmployee || !open) return;
    onChange?.(newEmployee?.id);
    onChangeData?.(newEmployee);
  }, [newEmployee]);

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
    { label: "Tên NV", dataIndex: "name", className: "w-52" },
    { label: "Mã KH", dataIndex: "code", className: "w-24" },
    { label: "SĐT", dataIndex: "phone", className: "w-24" },
  ];

  return (
    <AddSelect<IEmployee>
      placeholder="Chọn nhân viên"
      showAddButton={!!addEmployee}
      loading={loading}
      options={listEmployee}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        setIsLockHook(false);
        onFocus?.(e);
      }}
      modal={
        <AddUpdateModal
          open={open}
          errors={errors}
          onClose={() => setOpen(false)}
          onAdd={addEmployee}
        />
      }
      onOpen={() => setOpen(true)}
      {...rest}
    />
  );
};

export default EmployeeSelect;
