import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { Partner, PartnerQuery, PartnerType } from "../partner.model";
import { usePartnerStore } from "../partner.store";
import { DropdownColumn } from "@/shared/components/core/CustomSelectLayout";
import { SmartSelect } from "@/shared/components/core/SmartSelect";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import AddMultipleSelect from "@/shared/components/add_select/AddMultipleSelect";
import { PartnerAddUpdateModal } from "./PartnerAddUpdateModal";
import { useEffect, useState } from "react";

const columns: DropdownColumn<Partner>[] = [
  { label: "Tên đối tác", dataIndex: "name", className: "w-64" },
  { label: "Mã ĐT", dataIndex: "code", className: "w-24" },
  { label: "Số điện thoại", dataIndex: "phone", className: "w-32" },
  { label: "Mã số thuế", dataIndex: "taxCode", className: "w-32" },
];

interface PartnerSelectProps extends SelectProps<Partner, PartnerQuery> {}

export const PartnerSelect: React.FC<PartnerSelectProps> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Partner,
    PartnerQuery
  >({
    defaultData,
    queryHook: usePartnerStore,
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
    <SmartSelect<Partner>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={"Chọn đối tác"}
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

interface PartnerAddMultipleSelectProps extends MultipleSelectProps<Partner, PartnerQuery> {
  types?: PartnerType[];
  groupId?: string;
  staffId?: string;
  isActive?: boolean;
}

export const PartnerAddMultipleSelect: React.FC<PartnerAddMultipleSelectProps> = ({
  value,
  defaultData,
  query,
  types,
  groupId,
  staffId,
  isActive,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const { errors, creating, create, newItem } = usePartnerStore(
    {
      isLocked: true,
    },
    () => setOpen(false),
  );

  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Partner,
    PartnerQuery
  >({
    defaultData,
    queryHook: usePartnerStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
      ...(types?.length ? { types } : {}),
      ...(groupId ? { groupId } : {}),
      ...(staffId ? { staffId } : {}),
      ...(typeof isActive === "boolean" ? { isActive } : {}),
    }),
    resetPageDeps: [query, types, groupId, staffId, isActive],
  });

  useEffect(() => {
    if (!newItem) return;
    onChange?.([newItem.id]);
    onChangeData?.([newItem]);
  }, [newItem]);

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = list.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  return (
    <AddMultipleSelect<Partner>
      dataSource={list}
      placeholder="Chọn đối tác"
      showAddButton={!!create}
      loading={loading}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        unlock();
        onFocus?.(e);
      }}
      modal={
        <PartnerAddUpdateModal
          open={open}
          errors={errors}
          onClose={() => setOpen(false)}
          loading={creating}
          onAdd={create}
        />
      }
      onOpen={() => {
        setOpen(true);
      }}
      {...rest}
    />
  );
};
