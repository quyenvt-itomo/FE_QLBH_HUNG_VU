import React, { useEffect, useState } from "react";
import { App, TreeSelect } from "antd";
import { Attribute, AttributeQuery } from "../attribute.model";
import { AttributeType, attributeTypeMap, isStoreScopedAttributeType } from "../attribute.enum";
import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { useAttributeStore } from "../attribute.store";
import {
  DropdownColumn,
  ManagerSelect,
  ManagerSelectButton,
  MultipleManagerSelect,
  SmartMultipleSelect,
  buildTree,
} from "@/shared/components";
import { useRemoteSelect } from "@/shared/hooks";
import { SortOrder } from "@/shared/constants/enum";
import { removeVietnameseTones } from "@/shared/utils/search.util";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AttributeTreeManagerModal } from "./AttributeTreeManagerModal";
import { useGlobalData } from "@/shared/hooks";

interface AttributeSelectProps extends SelectProps<Attribute, AttributeQuery> {
  type: AttributeType;
}

export const AttributeManagerSelect: React.FC<AttributeSelectProps> = ({
  value,
  type,
  defaultData,
  query,
  placeholder,
  ref,
  className,
  disabled,
  hideOptions,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
  ...rest
}) => {
  const { message } = App.useApp();
  const { currentStore } = useGlobalData();
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<Attribute[]>([]);
  const storeId = query?.storeId ?? currentStore?.id;

  const { data, loading, creating, updating, deleting, newItem, create, remove, update } =
    useAttributeStore({
      ...query,
      isLocked: isLockHook,
      type,
      size: 10000,
    });

  useEffect(() => {
    if (data.length === 0 || data[0].type !== type) return;

    setListAttribute(data);
  }, [data, type]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listAttribute.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListAttribute([defaultData, ...listAttribute]);
  }, [defaultData, listAttribute]);

  const handleAdd = create
    ? (data: Attribute) => {
        if (isStoreScopedAttributeType(type) && !storeId) {
          message.error("Vui lòng chọn cửa hàng trước khi thêm vị trí");
          return;
        }

        create({
          ...data,
          type: type,
          ...(isStoreScopedAttributeType(type) ? { storeId } : {}),
        });
      }
    : undefined;

  const handleEdit = update
    ? (data: Attribute) => {
        update({
          ...data,
          type: type,
          ...(isStoreScopedAttributeType(type) && storeId ? { storeId } : {}),
        });
      }
    : undefined;

  const handleDelete = remove
    ? (data: Attribute) => {
        if (!data.id) return;
        remove(data.id);
      }
    : undefined;

  return (
    <div className={`flex flex-row ${className}`}>
      <ManagerSelect<Attribute>
        label={`Danh sách ${attributeTypeMap[type]?.toLowerCase()}`}
        options={listAttribute}
        value={value}
        loading={loading || creating || updating || deleting}
        newItem={newItem}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFocus={(e) => {
          setIsLockHook(false);
          onFocus?.(e);
        }}
        onBlur={onBlur}
        onChange={onChange}
        onChangeData={onChangeData}
        onManage={() => {
          setIsLockHook(false);
        }}
        placeholder={
          placeholder !== undefined ? placeholder : `Chọn ${attributeTypeMap[type]?.toLowerCase()}`
        }
        ref={ref}
        type={type}
        disabled={disabled}
        hideOptions={hideOptions}
        {...rest}
      />
    </div>
  );
};

interface AttributeMultipleSelectProps extends MultipleSelectProps<Attribute, AttributeQuery> {
  type: AttributeType;
}
export const AttributeMultipleSelect: React.FC<AttributeMultipleSelectProps> = ({
  value,
  defaultData,
  query,
  type,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const label = query?.type ? attributeTypeMap[query?.type]?.toLowerCase() : "thuộc tính";
  const { currentStore } = useGlobalData();
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Attribute,
    AttributeQuery
  >({
    defaultData,
    queryHook: useAttributeStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      type,
      keyword,
      page,
      size: 100000,
      isLocked,
    }),
    resetPageDeps: [query],
  });

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = list.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<Attribute>[] = [
    { label: `Tên ${label}`, dataIndex: "name", className: "w-64" },
  ];
  if (isStoreScopedAttributeType(type) && !currentStore) {
    columns.push({ label: "Cửa hàng", dataIndex: ["store", "name"], className: "w-32" });
  }

  return (
    <SmartMultipleSelect<Attribute>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={`Chọn ${label}`}
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

export const ProductGroupSelect: React.FC<Omit<AttributeSelectProps, "type">> = ({
  value,
  defaultData,
  placeholder,
  ref,
  className,
  disabled,
  hideOptions,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
}) => {
  const type = AttributeType.PRODUCT_GROUP;
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<Attribute[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const { data, loading, creating, updating, deleting, newItem, create, remove, update } =
    useAttributeStore({
      isLocked: isLockHook,
      type,
      size: 10000,
    });

  useEffect(() => {
    const nextAttributes = data.filter((item) => item.type === type);
    if (defaultData?.id && !nextAttributes.some((item) => item.id === defaultData.id)) {
      nextAttributes.unshift(defaultData);
    }

    setListAttribute((current) => {
      if (
        current.length === nextAttributes.length &&
        current.every((item, index) => item.id === nextAttributes[index]?.id)
      ) {
        return current;
      }
      return nextAttributes;
    });
  }, [data, defaultData, type]);

  const handleAdd = create
    ? (attribute: Partial<Attribute>) => create({ ...attribute, type })
    : undefined;

  const handleEdit = update
    ? (attribute: Partial<Attribute>) => update({ ...attribute, type })
    : undefined;

  const handleDelete = remove
    ? (attribute: Pick<Attribute, "id">) => {
        if (attribute.id) remove(attribute.id);
      }
    : undefined;

  const hideOptionIds = new Set(hideOptions?.map((item) => item.id));
  const options = listAttribute.filter((item) => !hideOptionIds.has(item.id) || item.id === value);
  const isLockManager = !handleAdd && !handleEdit && !handleDelete;
  const isLoading = loading || creating || updating || deleting;

  const handleChange = (nextValue?: string) => {
    setSearchValue("");
    onChange?.(nextValue || "");
    onChangeData?.(listAttribute.find((item) => item.id === nextValue));
  };

  useEffect(() => {
    if (!newItem?.id || !open || disabled) return;

    handleChange(newItem.id);
  }, [newItem]);

  useEffect(() => {
    if (!value || !open) return;
    setOpen(false);
  }, [value]);

  return (
    <div className={`flex w-full flex-row ${className || ""}`}>
      <TreeSelect
        ref={ref}
        value={value || undefined}
        treeData={buildTree(options)}
        loading={isLoading}
        disabled={disabled}
        placeholder={
          placeholder !== undefined ? placeholder : `Chọn ${attributeTypeMap[type]?.toLowerCase()}`
        }
        allowClear
        showSearch
        treeDefaultExpandAll
        searchValue={searchValue}
        onSearch={setSearchValue}
        suffixIcon={<ChevronDownIcon className="h-3.5" />}
        className={`z-10 h-8 ${isLockManager ? "" : "rounded-e-none"}`}
        style={{ width: isLockManager ? "100%" : "calc(100% - 36px)" }}
        filterTreeNode={(input, node) =>
          !!node?.title &&
          removeVietnameseTones(String(node.title)).includes(removeVietnameseTones(input).trim())
        }
        onChange={(nextValue) => handleChange(nextValue as string | undefined)}
        onFocus={(event) => {
          setIsLockHook(false);
          onFocus?.(event);
        }}
        onBlur={onBlur}
      />

      {!isLockManager && (
        <>
          <ManagerSelectButton
            onClick={() => {
              setIsLockHook(false);
              setOpen(true);
            }}
          />
          <AttributeTreeManagerModal
            label={`Danh sách ${attributeTypeMap[type]?.toLowerCase()}`}
            open={open}
            dataSource={options}
            loading={isLoading}
            selectedValue={value}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(selected) => {
              if (!selected?.id) return;
              handleChange(selected.id);
              setOpen(false);
            }}
            onClose={() => setOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export const ProductGroupMultipleSelect: React.FC<
  MultipleSelectProps<Attribute, AttributeQuery>
> = ({ value, defaultData, onChange, onChangeData, onFocus, ...rest }) => {
  const type = AttributeType.PRODUCT_GROUP;
  const [isLocked, setIsLocked] = useState(true);
  const [options, setOptions] = useState<Attribute[]>([]);
  const { data, loading } = useAttributeStore({ isLocked, type, size: 10000 });

  useEffect(() => {
    const nextOptions = data.filter((item) => item.type === type);
    if (defaultData?.length) {
      const optionIds = new Set(nextOptions.map((item) => item.id));
      nextOptions.unshift(...defaultData.filter((item) => !optionIds.has(item.id)));
    }

    setOptions((current) => {
      if (
        current.length === nextOptions.length &&
        current.every((item, index) => item.id === nextOptions[index]?.id)
      ) {
        return current;
      }
      return nextOptions;
    });
  }, [data, defaultData, type]);

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    onChangeData?.(options.filter((item) => ids.includes(item.id)));
  };

  return (
    <TreeSelect
      multiple
      allowClear
      showSearch
      treeDefaultExpandAll
      value={value as any}
      treeData={buildTree(options)}
      loading={loading}
      placeholder="Chọn nhóm sản phẩm"
      onChange={(ids) => handleChange((ids || []) as string[])}
      onFocus={(event) => {
        setIsLocked(false);
        onFocus?.(event);
      }}
      filterTreeNode={(input, node) =>
        !!node?.title &&
        removeVietnameseTones(String(node.title)).includes(removeVietnameseTones(input).trim())
      }
      {...(rest as any)}
    />
  );
};

interface AttributeManagerMultipleSelectProps extends MultipleSelectProps<
  Attribute,
  AttributeQuery
> {
  type: AttributeType;
}

export const AttributeManagerMultipleSelect: React.FC<AttributeManagerMultipleSelectProps> = ({
  value,
  type,
  defaultData,
  query,
  placeholder,
  ref,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { message } = App.useApp();
  const { currentStore } = useGlobalData();
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<Attribute[]>([]);
  const storeId = query?.storeId ?? currentStore?.id;

  const canManage =
    !query?.storeId || query?.storeId === currentStore?.id || !isStoreScopedAttributeType(type);

  const { data, loading, creating, updating, deleting, newItem, create, remove, update } =
    useAttributeStore({
      ...query,
      isLocked,
      type,
      size: 10000,
      sortOrder: SortOrder.ASC,
      sortBy: "name",
    });

  useEffect(() => {
    if (data.length === 0 || data[0].type !== type) return;

    setListAttribute(data);
  }, [data, type]);

  useEffect(() => {
    if (!defaultData) return;

    const exists = defaultData.every((attr) => listAttribute.some((item) => item.id === attr.id));
    if (exists) return;
    const filtered = defaultData.filter(
      (attr) => !listAttribute.some((item) => item.id === attr.id),
    );
    if (filtered.length === 0) return;

    setListAttribute([...filtered, ...listAttribute]);
  }, [defaultData, listAttribute]);

  const handleAdd =
    create && canManage
      ? (data: Attribute) => {
          if (isStoreScopedAttributeType(type) && !storeId) {
            message.error("Vui lòng chọn cửa hàng trước khi thêm vị trí");
            return;
          }

          create({
            ...data,
            type: type,
            ...(isStoreScopedAttributeType(type) ? { storeId } : {}),
          });
        }
      : undefined;

  const handleEdit =
    update && canManage
      ? (data: Attribute) => {
          update({
            ...data,
            type: type,
            ...(isStoreScopedAttributeType(type) && storeId ? { storeId } : {}),
          });
        }
      : undefined;

  const handleDelete =
    remove && canManage
      ? (data: Attribute) => {
          if (!data.id) return;
          remove(data.id);
        }
      : undefined;

  return (
    <div className="flex flex-row">
      <MultipleManagerSelect<Attribute>
        label={`Danh sách ${attributeTypeMap[type]?.toLowerCase()}`}
        options={listAttribute}
        value={value}
        newItem={newItem}
        loading={loading || creating || updating || deleting}
        onAdd={handleAdd}
        onFocus={(e) => {
          setIsLocked(false);
          onFocus?.(e);
        }}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onChange={onChange}
        onChangeData={onChangeData}
        onManage={() => {
          setIsLocked(false);
        }}
        placeholder={
          placeholder !== undefined ? placeholder : `Chọn ${attributeTypeMap[type]?.toLowerCase()}`
        }
        ref={ref}
        type={type}
        {...rest}
      />
    </div>
  );
};
