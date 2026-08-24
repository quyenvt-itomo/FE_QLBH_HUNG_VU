import React, { useEffect, useState } from "react";
import { TreeSelect } from "antd";
import { Attribute, AttributeQuery } from "../attribute.model";
import { AttributeType, attributeTypeMap } from "../attribute.enum";
import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { useAttributeStore } from "../attribute.store";
import {
  DropdownColumn,
  ManagerSelect,
  ManagerSelectButton,
  MultipleManagerSelect,
  SmartMultipleSelect,
  buildTree,
  useRemoteSelect,
} from "@/shared";
import { SortOrder } from "@/shared/constants/enum";
import { removeVietnameseTones } from "@/shared/utils/search.util";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AttributeTreeManagerModal } from "./AttributeTreeManagerModal";

interface AttributeManagerSelectProps extends SelectProps<Attribute, AttributeQuery> {
  type: AttributeType;
  noBorder?: boolean;
  hideOptions?: Attribute[];
}

export const AttributeManagerSelect: React.FC<AttributeManagerSelectProps> = ({
  value,
  type,
  defaultData,
  placeholder,
  ref,
  className,
  disabled,
  noBorder,
  hideOptions,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<Attribute[]>([]);

  const { data, loading, creating, updating, deleting, newItem, create, remove, update } =
    useAttributeStore({
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
        create({
          ...data,
          type: type,
        });
      }
    : undefined;

  const handleEdit = update
    ? (data: Attribute) => {
        update({
          ...data,
          type: type,
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
        noBorder={noBorder}
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

export const ProductGroupSelect: React.FC<Omit<AttributeManagerSelectProps, "type">> = ({
  value,
  defaultData,
  placeholder,
  ref,
  className,
  disabled,
  noBorder,
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
    setListAttribute(data.filter((item) => item.type === type));
  }, [data, type]);

  useEffect(() => {
    if (!defaultData?.id) return;

    setListAttribute((current) =>
      current.some((item) => item.id === defaultData.id) ? current : [defaultData, ...current],
    );
  }, [defaultData]);

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
        className={`z-10 h-8 ${isLockManager ? "" : "rounded-e-none"} ${
          noBorder ? "border-none h-12" : ""
        }`}
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
    setOptions(data.filter((item) => item.type === type));
  }, [data, type]);

  useEffect(() => {
    if (!defaultData?.length) return;

    setOptions((current) => {
      const currentIds = new Set(current.map((item) => item.id));
      return [...defaultData.filter((item) => !currentIds.has(item.id)), ...current];
    });
  }, [defaultData]);

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    onChangeData?.(options.filter((item) => ids.includes(item.id)));
  };

  return (
    <TreeSelect
      {...(rest as any)}
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
    />
  );
};

interface AttributeManagerMultipleSelectProps extends MultipleSelectProps<Attribute> {
  type: AttributeType;
}

export const AttributeManagerMultipleSelect: React.FC<AttributeManagerMultipleSelectProps> = ({
  value,
  type,
  defaultData,
  placeholder,
  ref,
  disabled,
  suffixIcon,
  prefix,
  hideOptions,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
}) => {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<Attribute[]>([]);

  const { data, loading, creating, updating, deleting, newItem, create, remove, update } =
    useAttributeStore({
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

  const handleAdd = create
    ? (data: Attribute) => {
        create({
          ...data,
          type: type,
        });
      }
    : undefined;

  const handleEdit = update
    ? (data: Attribute) => {
        update({
          ...data,
          type: type,
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
        onBlur={onBlur}
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
        disabled={disabled}
        suffixIcon={suffixIcon}
        prefix={prefix}
        hideOptions={hideOptions}
      />
    </div>
  );
};
