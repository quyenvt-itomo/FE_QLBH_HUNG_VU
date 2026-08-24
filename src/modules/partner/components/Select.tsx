import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { Partner, PartnerQuery, PartnerType } from "../partner.model";
import { useCustomerStore, usePartnerStore } from "../partner.store";
import { DropdownColumn } from "@/shared";
import { SmartMultipleSelect, SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { AddMultipleSelect } from "@/shared";
import { AddSelect } from "@/shared";
import { PartnerAddUpdateModal } from "./PartnerAddUpdateModal";
import { CustomerAddModal } from "./CustomerAddModal";
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

interface PartnerMultipleSelectProps extends MultipleSelectProps<Partner, PartnerQuery> {
  types?: PartnerType[];
}

export const PartnerMultipleSelect: React.FC<PartnerMultipleSelectProps> = ({
  defaultData,
  query,
  types,
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
      ...(query || {}),
      ...(types?.length ? { types } : {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
    resetPageDeps: [query, types],
  });

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    onChangeData?.(list.filter((item) => ids.includes(item.id)));
  };

  return (
    <SmartMultipleSelect<Partner>
      dataSource={list}
      columns={columns}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn đối tác"
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

export const CustomerAddSelect: React.FC<PartnerSelectProps> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const { errors, creating, create, newItem } = useCustomerStore(
    { isLocked: true, type: PartnerType.CUSTOMER },
    () => setOpen(false),
  );
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Partner,
    PartnerQuery
  >({
    defaultData,
    queryHook: useCustomerStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      keyword,
      page,
      size: 10,
      isLocked,
      ...query,
      type: PartnerType.CUSTOMER,
    }),
    resetPageDeps: [query],
  });

  useEffect(() => {
    if (!newItem) return;
    onChange?.(newItem.id);
    onChangeData?.(newItem);
  }, [newItem, onChange, onChangeData]);

  return (
    <AddSelect<Partner>
      options={list}
      columns={columns}
      value={value}
      loading={loading}
      onSearch={setKeywordTemp}
      onPopupScroll={handlePopupScroll}
      onChange={(id) => {
        onChange?.(id);
        onChangeData?.(list.find((item) => item.id === id));
      }}
      onFocus={(event) => {
        unlock();
        onFocus?.(event);
      }}
      placeholder="Chọn khách hàng"
      disabled={rest.disabled}
      showAddButton={!!create}
      modal={
        <CustomerAddModal
          open={open}
          errors={errors}
          loading={creating}
          onAdd={create}
          onClose={() => setOpen(false)}
        />
      }
      onOpen={() => setOpen(true)}
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
          type={types?.[0] || PartnerType.CUSTOMER}
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
