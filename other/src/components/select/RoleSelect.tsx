import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { IRole } from "../../models/store/role";
import { useRoleData } from "../../hooks/core/useRoleData";

interface Props extends SelectProps<IRole> {
  storeId?: string;
}

const RoleSelect: React.FC<Props> = ({
  value,
  defaultData,
  storeId,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listRole, setListRole] = useState<IRole[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");

  const { roleData, loading, pagination } = useRoleData({
    isLockHook,
    storeId,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListRole(roleData);
      return;
    }

    setListRole((prevList) => {
      const newValues = new Set(roleData.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...roleData];
    });
  }, [roleData]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listRole.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListRole([defaultData, ...listRole]);
  }, [defaultData, listRole]);

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listRole.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const filteredRole = listRole.filter((role) =>
    role.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  const columns: DropdownColumn<IRole>[] = [
    { label: "Tên vai trò", dataIndex: "name", className: "w-full" },
  ];

  return (
    <SmartSelect<IRole>
      dataSource={filteredRole}
      columns={columns}
      value={value}
      onChange={handleChange}
      placeholder="Chọn vai trò"
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

export default RoleSelect;
