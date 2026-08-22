import { SelectProps } from "@/shared/interfaces/common";
import { Employee, EmployeeQuery } from "../employee.model";
import { useEmployeeStore } from "../employee.store";
import { DropdownColumn } from "@/shared/components/core/CustomSelectLayout";
import { SmartSelect } from "@/shared/components/core/SmartSelect";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

export const EmployeeSelect: React.FC<SelectProps<Employee, EmployeeQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Employee,
    EmployeeQuery
  >({
    defaultData,
    queryHook: useEmployeeStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
  });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<Employee>[] = [
    { label: "Tên NV", dataIndex: "name", className: "w-64" },
    { label: "Mã NV", dataIndex: "code", className: "w-20" },
    {
      label: "Đơn vị công tác",
      dataIndex: "workingOrganization",
      className: "w-48",
      render: (record) => record.workingOrganization?.name,
    },
    {
      label: "Vị trí công việc",
      dataIndex: "jobPosition",
      className: "w-48",
      render: (record) => record.jobPosition?.name,
    },
  ];

  return (
    <SmartSelect<Employee>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={"Chọn nhân viên"}
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        unlock();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};
