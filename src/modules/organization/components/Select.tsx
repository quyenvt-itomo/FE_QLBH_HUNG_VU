import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { Organization, OrganizationQuery } from "../organization.model";
import { useOrganizationStore } from "../organization.store";
import { DropdownColumn } from "@/shared/components/core/CustomSelectLayout";
import { SmartSelect } from "@/shared/components/core/SmartSelect";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { organizationTypeMap } from "../organization.enum";
import { SmartMultipleSelect } from "@/shared/components/core/SmartMultipleSelect";

const columns: DropdownColumn<Organization>[] = [
  { label: "Tên đơn vị", dataIndex: "name", className: "w-64" },
  { label: "Mã đơn vị", dataIndex: "code", className: "w-20" },
  {
    label: "Cấp tổ chức",
    dataIndex: "type",
    className: "w-24",
    render: (record) => organizationTypeMap[record.type],
  },
];

export const OrganizationSelect: React.FC<SelectProps<Organization, OrganizationQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Organization,
    OrganizationQuery
  >({
    defaultData,
    queryHook: useOrganizationStore,
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
    <SmartSelect<Organization>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={"Chọn đơn vị"}
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

export const OrganizationMultipleSelect: React.FC<
  MultipleSelectProps<Organization, OrganizationQuery>
> = ({ value, defaultData, query, onChange, onChangeData, onFocus, hideOptions, ...rest }) => {
  const { finalList, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Organization,
    OrganizationQuery
  >({
    defaultData,
    hideOptions,
    queryHook: useOrganizationStore,
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
    <SmartMultipleSelect<Organization>
      dataSource={finalList}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn đơn vị"
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
