import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import useDebounce from "../../hooks/core/useDebounce";
import { IUser } from "../../models/user";
import { useUserData } from "../../hooks/useUserData";

export const UserSelect: React.FC<MultipleSelectProps<IUser>> = ({
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
  const keyword = useDebounce(keywordTemp, 300, () => {
    setPage(1);
  });

  const { users, loading, pagination } = useUserData({
    page,
    size: 20,
    keyword,
    isLockHook,
  });

  useEffect(() => {
    if (users.length === 0) return;

    setListUser((prevList) => {
      const newValues = new Set(users.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...users];
    });
  }, [users]);

  useEffect(() => {
    if (!defaultData?.length) return;

    const newItems = defaultData.filter((d) => !listUser.some((p) => p.id === d.id));
    if (newItems.length > 0) {
      setListUser((prev) => [...newItems, ...prev]);
    }
  }, [defaultData, listUser]);

  useEffect(() => {
    setListUser([]);
  }, [keyword]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listUser.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = listUser.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<IUser>[] = [
    { label: "Tên nhân sự", dataIndex: "name", className: "w-2/3" },
    { label: "Mã nhân sự", dataIndex: "code", className: "w-1/3" },
  ];

  return (
    <SmartMultipleSelect<IUser>
      dataSource={listUser}
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
