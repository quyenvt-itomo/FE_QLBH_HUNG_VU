import { Select } from "antd";
import { useEffect, useState } from "react";

import ManagerModal from "./ManagerModal";
import { SelectProps } from "antd";
import ManagerButton from "./ManagerButton";
import { removeVietnameseTones } from "@/shared/utils/search.util";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";
import { AttributeType } from "@/modules/attribute";

interface MultipleManagerSelectProps<T> extends Omit<SelectProps<string[]>, "options"> {
  ref?: React.Ref<any>;
  options: T[];
  label: string;
  validateFormat?: boolean;
  newItem?: T | null;
  type?: AttributeType;
  hideOptions?: T[];
  onAdd?: (value: T) => void;
  onDelete?: (data: T) => void;
  onEdit?: (data: T) => void;
  onManage?: () => void;
  onChangeData?: (data: T[]) => void;
}

const MultipleManagerSelect = <T extends { id: string; name: string }>({
  ref,
  options,
  label,
  value,
  loading,
  validateFormat,
  newItem,
  type,
  hideOptions,
  onAdd,
  onEdit,
  onDelete,
  onChange,
  onChangeData,
  onManage,
  ...rest
}: MultipleManagerSelectProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const hideOptionKeys = hideOptions?.map((item) => item.id);
  const finalOptions =
    hideOptionKeys && hideOptionKeys.length > 0
      ? options.filter(
          (item) => hideOptionKeys.includes(item.id) === false || value?.includes(item.id),
        )
      : options;

  const isLockManager = !onAdd && !onEdit && !onDelete;

  const handleChange = (value: string[]) => {
    onChange?.(value);
    const items = options?.filter((item) => value?.includes(item.id));
    onChangeData?.(items);
  };

  const handleSearch = (val: string) => {
    setSearchValue(val);
  };

  const handleFilterOption = (input: string, option?: { label?: string; value?: string }) => {
    if (!option?.label) return false;
    return removeVietnameseTones(option.label).includes(removeVietnameseTones(input));
  };

  useEffect(() => {
    if (!newItem?.id || !open) return;

    if (!value) {
      onChange?.([newItem.id]);
      onChangeData?.([newItem]);
      return;
    }
    const newValue = [...value, newItem.id];
    const uniqueValue = Array.from(new Set(newValue));
    onChange?.(uniqueValue);
    const newListItems = [...options, newItem];
    const uniqueValueItem = newListItems.filter((item) => uniqueValue.includes(item.id));
    onChangeData?.(uniqueValueItem);
    setOpen(false);
  }, [newItem]);

  return (
    <div className="flex w-full z-0">
      <Select
        ref={ref}
        mode="multiple"
        maxTagCount="responsive"
        options={finalOptions.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        allowClear
        showSearch
        searchValue={searchValue}
        onSearch={handleSearch}
        value={value}
        loading={loading}
        className={`${CLASSNAME.inputHeight} ${isLockManager ? "" : "rounded-e-none"} z-10`}
        style={{ width: isLockManager ? "100%" : "calc(100% - 36px)" }}
        suffixIcon={<ChevronDownIcon className="h-3.5" />}
        filterOption={handleFilterOption}
        onChange={handleChange}
        {...rest}
      />
      {!isLockManager && (
        <>
          <ManagerButton
            onClick={() => {
              onManage?.();
              setOpen(true);
            }}
          />
          <ManagerModal<T>
            label={label}
            open={open}
            dataSource={options}
            loading={loading}
            validateFormat={validateFormat}
            selectedValues={value}
            type={type}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
            onSelect={(selected) => {
              const ids = selected.map((item) => item.id);
              handleChange?.(ids);
              setOpen(false);
            }}
            onClose={() => setOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default MultipleManagerSelect;
