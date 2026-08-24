import { SelectProps } from "@/shared/interfaces/common";
import { Role, RoleQuery } from "../role.model";
import { useRoleStore } from "../role.store";
import { DropdownColumn } from "@/shared";
import { SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

interface Props extends SelectProps<Role, RoleQuery> {
  showBalance?: boolean;
}

export const RoleSelect: React.FC<Props> = ({
  value,
  defaultData,
  query,
  showBalance,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Role,
    RoleQuery
  >({
    defaultData,
    queryHook: useRoleStore,
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

  const columns: DropdownColumn<Role>[] = [
    { label: "Tên vai trò", dataIndex: "name", className: "w-52" },
  ];

  return (
    <SmartSelect<Role>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn vai trò"
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
