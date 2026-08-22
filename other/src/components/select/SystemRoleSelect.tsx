import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { ISystemRole } from "../../models/systemRole";
import { useSystemRoleData } from "../../hooks/useSystemRoleData";

const SystemRoleSelect: React.FC<SelectProps<ISystemRole>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listSystemRole, setListSystemRole] = useState<ISystemRole[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");

  const { systemRoleData, loading, pagination } = useSystemRoleData({
    isLockHook,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListSystemRole(systemRoleData);
      return;
    }

    setListSystemRole((prevList) => {
      const newValues = new Set(systemRoleData.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...systemRoleData];
    });
  }, [systemRoleData]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listSystemRole.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListSystemRole([defaultData, ...listSystemRole]);
  }, [defaultData, listSystemRole]);

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listSystemRole.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const filteredSystemRole = listSystemRole.filter((systemRole) =>
    systemRole.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  const columns: DropdownColumn<ISystemRole>[] = [
    { label: "Tên vai trò", dataIndex: "name", className: "w-full" },
  ];

  return (
    <SmartSelect<ISystemRole>
      dataSource={filteredSystemRole}
      columns={columns}
      value={value}
      onChange={handleChange}
      placeholder="Chọn vai trò hệ thống"
      loading={loading}
      onSearch={setKeyword}
      onFocus={(e) => {
        setIsLockHook(false);
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};

export default SystemRoleSelect;
