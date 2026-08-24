import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { User } from "@/shared/base/entity";
import { UserQuery } from "../user.model";
import { useUserStore } from "../user.store";
import { DropdownColumn, SmartMultipleSelect } from "@/shared/components";
import { SmartSelect } from "@/shared/components";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

const columns: DropdownColumn<User>[] = [
  { label: "Tên người dùng", dataIndex: "name", className: "w-52" },
  {
    label: "Mã người dùng",
    dataIndex: "code",
    className: "w-32",
  },
  { label: "Tên đăng nhập", dataIndex: "username", className: "w-36" },
];

export const UserSelect: React.FC<SelectProps<User, UserQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    User,
    UserQuery
  >({
    defaultData,
    queryHook: useUserStore,
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

  return (
    <SmartSelect<User>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn người dùng"
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

export const UserMultipleSelect: React.FC<MultipleSelectProps<User, UserQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    User,
    UserQuery
  >({
    defaultData,
    queryHook: useUserStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
    resetPageDeps: [query],
  });

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = list.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  return (
    <SmartMultipleSelect<User>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn người dùng"
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
