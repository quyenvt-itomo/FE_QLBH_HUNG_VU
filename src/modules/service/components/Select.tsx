import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { Service, ServiceQuery } from "../service.model";
import { useServiceStore } from "../service.store";
import { DropdownColumn } from "@/shared/components/core/CustomSelectLayout";
import { SmartSelect } from "@/shared/components/core/SmartSelect";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { SmartMultipleSelect } from "@/shared/components/core/SmartMultipleSelect";
import { ServiceTypeTag } from "./Tag";

const columns: DropdownColumn<Service>[] = [
  { label: "Tên dịch vụ", dataIndex: "name", className: "w-64" },
  { label: "Mã dịch vụ", dataIndex: "code", className: "w-24" },
  {
    label: "Loại",
    dataIndex: "type",
    className: "w-28 text-center",
    render: (record) => <ServiceTypeTag value={record.type} size="sm" />,
  },
];

export const ServiceSelect: React.FC<SelectProps<Service, ServiceQuery>> = ({
  value,
  defaultData,
  placeholder,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Service,
    ServiceQuery
  >({
    defaultData,
    queryHook: useServiceStore,
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
    <SmartSelect<Service>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={placeholder || "Chọn dịch vụ"}
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

export const ServiceMultipleSelect: React.FC<MultipleSelectProps<Service, ServiceQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  hideOptions,
  ...rest
}) => {
  const { finalList, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Service,
    ServiceQuery
  >({
    defaultData,
    hideOptions,
    queryHook: useServiceStore,
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
    const selectedData = finalList.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  return (
    <SmartMultipleSelect<Service>
      dataSource={finalList}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn dịch vụ"
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
