import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartSelect } from "../core/SmartSelect";
import { IUser } from "../../models/user";
import { useUserData } from "../../hooks/useUserData";

const UserSelect: React.FC<SelectProps<IUser>> = ({
  value,
  defaultData,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listUser, setListUser] = useState<IUser[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));

  const { users, loading, pagination } = useUserData({
    keyword,
    page,
    size: 10,
    isLockHook,
  });

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListUser(users);
      return;
    }

    setListUser((prevList) => {
      const newValues = new Set(users.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...users];
    });
  }, [users, pagination]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listUser.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListUser([defaultData, ...listUser]);
  }, [defaultData, listUser]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listUser.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listUser.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<IUser>[] = [
    { label: "Tên người dùng", dataIndex: "name", className: "w-40" },
    { label: "Mã người dùng", dataIndex: "code", className: "w-16" },
  ];

  return (
    <SmartSelect<IUser>
      dataSource={listUser}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      placeholder="Chọn người dùng"
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

export default UserSelect;
