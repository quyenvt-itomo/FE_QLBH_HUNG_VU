import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { PartnerContact, PartnerContactQuery } from "../partnerContact.model";
import { usePartnerContactStore } from "../partnerContact.store";
import { DropdownColumn } from "@/shared/components";
import { SmartSelect } from "@/shared/components";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { SmartMultipleSelect } from "@/shared/components";

const columns: DropdownColumn<PartnerContact>[] = [
  { label: "Tên người liên hệ", dataIndex: "name", className: "w-64" },
  { label: "Số điện thoại", dataIndex: "phone", className: "w-32" },
  { label: "Email", dataIndex: "email", className: "w-48" },
  {
    className: "w-32",
    label: "Đối tác",
    dataIndex: "partner",
    render: (contact: PartnerContact) => contact?.name || "",
  },
];

interface PartnerContactSelectProps extends SelectProps<PartnerContact, PartnerContactQuery> {}

export const PartnerContactSelect: React.FC<PartnerContactSelectProps> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    PartnerContact,
    PartnerContactQuery
  >({
    defaultData,
    queryHook: usePartnerContactStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      keyword,
      page,
      size: 10,
      isLocked,
      ...query,
    }),
  });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  return (
    <SmartSelect<PartnerContact>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={"Chọn người liên hệ"}
      labelField="name"
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

export const PartnerContactMultipleSelect: React.FC<
  MultipleSelectProps<PartnerContact, PartnerContactQuery>
> = ({ value, defaultData, query, onChange, onChangeData, onFocus, hideOptions, ...rest }) => {
  const { finalList, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    PartnerContact,
    PartnerContactQuery
  >({
    defaultData,
    hideOptions,
    queryHook: usePartnerContactStore,
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
    <SmartMultipleSelect<PartnerContact>
      dataSource={finalList}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn người liên hệ"
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
