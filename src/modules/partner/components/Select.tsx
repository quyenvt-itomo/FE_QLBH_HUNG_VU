import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { Partner, PartnerQuery, PartnerType } from "../partner.model";
import {
  useCustomerStore,
  usePartnerStore,
  useShipperStore,
  useSupplierStore,
} from "../partner.store";
import { DropdownColumn } from "@/shared/components";
import { SmartMultipleSelect, SmartSelect } from "@/shared/components";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { AddMultipleSelect } from "@/shared/components";
import { AddSelect } from "@/shared/components";
import { PartnerAddUpdateModal } from "./PartnerAddUpdateModal";
import { CustomerAddModal } from "./CustomerAddModal";
import { useEffect, useState } from "react";
import SupplierAddUpdateModal from "./SupplierAddUpdateModal";
import { ShipperAddUpdateModal } from "./ShipperAddUpdateModal";
import { isPhoneNumber } from "@/shared/utils/common.util";

const columns: DropdownColumn<Partner>[] = [
  { label: "Tên đối tác", dataIndex: "name", className: "w-48" },
  { label: "Mã ĐT", dataIndex: "code", className: "w-24" },
  { label: "SDDT", dataIndex: "phone", className: "w-20" },
  { label: "MST", dataIndex: "taxCode", className: "w-20" },
];

const getFinalColumns = (configs: {
  showPayableDebt?: boolean;
  showReceivableDebt?: boolean;
}): DropdownColumn<Partner>[] => {
  const { showPayableDebt, showReceivableDebt } = configs;
  const finalColumns = [...columns];

  if (showPayableDebt) {
    finalColumns.push({
      label: "Nợ phải trả",
      dataIndex: "payableDebtAmount",
      className: "w-24",
      dataType: "number",
    });
  }

  if (showReceivableDebt) {
    finalColumns.push({
      label: "Nợ phải thu",
      dataIndex: "receivableDebtAmount",
      className: "w-32",
      dataType: "number",
    });
  }
  return finalColumns;
};

const resolvePartnerType = (query?: PartnerQuery, type?: PartnerType) =>
  type ?? query?.type ?? query?.types?.[0];

const normalizePartnerQuery = (query?: PartnerQuery, type?: PartnerType): PartnerQuery => {
  const { types: _types, ...rest } = query || {};
  const resolvedType = resolvePartnerType(query, type);

  return resolvedType ? { ...rest, type: resolvedType } : rest;
};

const getPartnerQueryHook = (type?: PartnerType) => {
  switch (type) {
    case PartnerType.CUSTOMER:
      return useCustomerStore;
    case PartnerType.SUPPLIER:
      return useSupplierStore;
    case PartnerType.SHIPPER:
      return useShipperStore;
    default:
      return usePartnerStore;
  }
};

interface PartnerSelectProps extends SelectProps<Partner, PartnerQuery> {
  showPayableDebt?: boolean;
  showReceivableDebt?: boolean;
}

export const PartnerSelect: React.FC<PartnerSelectProps> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const partnerQuery = normalizePartnerQuery(query);
  const queryHook = getPartnerQueryHook(partnerQuery.type);

  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Partner,
    PartnerQuery
  >({
    defaultData,
    queryHook,
    buildParams: ({ keyword, page, isLocked }) => ({
      keyword,
      page,
      size: 10,
      isLocked,
      ...partnerQuery,
    }),
    resetPageDeps: [partnerQuery],
  });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const finalColumns = getFinalColumns({
    showPayableDebt: rest.showPayableDebt,
    showReceivableDebt: rest.showReceivableDebt,
  });

  return (
    <SmartSelect<Partner>
      dataSource={list}
      columns={finalColumns}
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
  type?: PartnerType;
  types?: PartnerType[];
  showPayableDebt?: boolean;
  showReceivableDebt?: boolean;
}

export const PartnerMultipleSelect: React.FC<PartnerMultipleSelectProps> = ({
  defaultData,
  query,
  type,
  types,
  showPayableDebt,
  showReceivableDebt,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const partnerType = resolvePartnerType(query, type ?? types?.[0]);
  const partnerQuery = normalizePartnerQuery(query, partnerType);
  const queryHook = getPartnerQueryHook(partnerType);

  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Partner,
    PartnerQuery
  >({
    defaultData,
    queryHook,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...partnerQuery,
      keyword,
      page,
      size: 10,
      isLocked,
    }),
    resetPageDeps: [partnerQuery, partnerType],
  });

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    onChangeData?.(list.filter((item) => ids.includes(item.id)));
  };

  const finalColumns = getFinalColumns({
    showPayableDebt,
    showReceivableDebt,
  });

  return (
    <SmartMultipleSelect<Partner>
      dataSource={list}
      columns={finalColumns}
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
  showPayableDebt,
  showReceivableDebt,
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
  const { list, loading, keywordTemp, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
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

  const finalColumns = getFinalColumns({
    showPayableDebt,
    showReceivableDebt,
  });

  return (
    <AddSelect<Partner>
      options={list}
      columns={finalColumns}
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
          defaultPhone={isPhoneNumber(keywordTemp) ? keywordTemp.trim() : undefined}
        />
      }
      onOpen={() => setOpen(true)}
      {...rest}
    />
  );
};

export const SupplierAddSelect: React.FC<PartnerSelectProps> = ({
  value,
  defaultData,
  query,
  showPayableDebt,
  showReceivableDebt,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const { errors, creating, create, newItem } = useSupplierStore(
    { isLocked: true, type: PartnerType.SUPPLIER },
    () => setOpen(false),
  );
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Partner,
    PartnerQuery
  >({
    defaultData,
    queryHook: useSupplierStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      keyword,
      page,
      size: 10,
      isLocked,
      ...query,
      type: PartnerType.SUPPLIER,
    }),
    resetPageDeps: [query],
  });

  useEffect(() => {
    if (!newItem) return;
    onChange?.(newItem.id);
    onChangeData?.(newItem);
  }, [newItem, onChange, onChangeData]);

  const finalColumns = getFinalColumns({
    showPayableDebt,
    showReceivableDebt,
  });

  return (
    <AddSelect<Partner>
      options={list}
      columns={finalColumns}
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
      placeholder="Chọn nhà cung cấp"
      disabled={rest.disabled}
      showAddButton={!!create}
      modal={
        <SupplierAddUpdateModal
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

export const ShipperAddSelect: React.FC<PartnerSelectProps> = ({
  value,
  defaultData,
  query,
  showPayableDebt,
  showReceivableDebt,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const { errors, creating, create, newItem } = useShipperStore(
    { isLocked: true, type: PartnerType.SUPPLIER },
    () => setOpen(false),
  );
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Partner,
    PartnerQuery
  >({
    defaultData,
    queryHook: useShipperStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      keyword,
      page,
      size: 10,
      isLocked,
      ...query,
      type: PartnerType.SUPPLIER,
    }),
    resetPageDeps: [query],
  });

  useEffect(() => {
    if (!newItem) return;
    onChange?.(newItem.id);
    onChangeData?.(newItem);
  }, [newItem, onChange, onChangeData]);

  const finalColumns = getFinalColumns({
    showPayableDebt,
    showReceivableDebt,
  });

  return (
    <AddSelect<Partner>
      options={list}
      columns={finalColumns}
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
      placeholder="Chọn đơn vị vận chuyển"
      disabled={rest.disabled}
      showAddButton={!!create}
      modal={
        <ShipperAddUpdateModal
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
  showPayableDebt?: boolean;
  showReceivableDebt?: boolean;
}

export const PartnerAddMultipleSelect: React.FC<PartnerAddMultipleSelectProps> = ({
  value,
  defaultData,
  query,
  types,
  groupId,
  staffId,
  isActive,
  showPayableDebt,
  showReceivableDebt,
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

  const finalColumns = getFinalColumns({
    showPayableDebt,
    showReceivableDebt,
  });

  return (
    <AddMultipleSelect<Partner>
      dataSource={list}
      placeholder="Chọn đối tác"
      showAddButton={!!create}
      loading={loading}
      columns={finalColumns}
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
