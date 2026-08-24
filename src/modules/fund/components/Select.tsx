import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { DropdownColumn, SmartMultipleSelect, SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { Fund, fundQuery } from "../fund.model";
import { useFundStore } from "../fund.store";

const columns: DropdownColumn<Fund>[] = [
  { label: "Tên quỹ", dataIndex: "name", className: "w-52" },
  { label: "Mã quỹ", dataIndex: "code", className: "w-28" },
];

export const FundSelect: React.FC<SelectProps<Fund, fundQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Fund,
    fundQuery
  >({
    defaultData,
    queryHook: useFundStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
  });

  return (
    <SmartSelect<Fund>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={(id) => {
        onChange?.(id);
        onChangeData?.(list.find((item) => item.id === id));
      }}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn quỹ"
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(event) => {
        unlock();
        onFocus?.(event);
      }}
      {...rest}
    />
  );
};

export const FundMultipleSelect: React.FC<MultipleSelectProps<Fund, fundQuery>> = ({
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Fund,
    fundQuery
  >({
    defaultData,
    queryHook: useFundStore,
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
    onChangeData?.(list.filter((item) => ids.includes(item.id)));
  };

  return (
    <SmartMultipleSelect<Fund>
      dataSource={list}
      columns={columns}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn quỹ"
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(event) => {
        unlock();
        onFocus?.(event);
      }}
      {...rest}
    />
  );
};
