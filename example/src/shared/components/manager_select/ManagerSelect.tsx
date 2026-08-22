import { Select } from "antd";
import { useEffect, useState } from "react";

import ManagerModal from "./ManagerModal";
import { SelectProps } from "antd";
import ManagerButton from "./ManagerButton";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { removeVietnameseTones } from "@/shared/utils/search.util";
import { CLASSNAME } from "@/shared/constants/ui";
import { AttributeType } from "@/modules/attribute";

interface ManagerSelectProps<T> extends Omit<SelectProps<string>, "options"> {
  ref?: React.Ref<any>;
  options: T[];
  label: string;
  validateFormat?: boolean;
  newItem?: T | null;
  type?: AttributeType;
  noBorder?: boolean;
  hideOptions?: T[];
  onAdd?: (value: T) => void;
  onDelete?: (data: T) => void;
  onEdit?: (data: T) => void;
  onManage?: () => void;
  onChangeData?: (data: T | undefined) => void;
}

const ManagerSelect = <T extends { id: string; name: string }>({
  ref,
  options,
  label,
  value,
  loading,
  validateFormat,
  type,
  newItem,
  disabled,
  noBorder,
  hideOptions,
  onAdd,
  onEdit,
  onDelete,
  onChange,
  onChangeData,
  onManage,
  ...rest
}: ManagerSelectProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const hideOptionKeys = hideOptions?.map((item) => item.id);
  const finalOptions =
    hideOptionKeys && hideOptionKeys.length > 0
      ? options.filter((item) => hideOptionKeys.includes(item.id) === false || item.id === value)
      : options;

  const isLockManager = !onAdd && !onEdit && !onDelete;

  useEffect(() => {
    if (!value || !open) return;
    setOpen(false);
  }, [value]);

  const handleChange = (value: string) => {
    onChange?.(value);
    const item = options.find((item) => item.id === value);
    onChangeData?.(item);
  };

  useEffect(() => {
    if (!newItem?.id || !open || disabled) return;

    onChange?.(newItem.id);
    onChangeData?.(newItem);
  }, [newItem]);

  return (
    <div className="flex w-full z-0">
      <Select
        ref={ref}
        options={finalOptions.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        allowClear
        showSearch
        searchValue={searchValue}
        onSearch={setSearchValue}
        value={value}
        loading={loading}
        className={`${CLASSNAME.inputHeight} ${isLockManager ? "" : "rounded-e-none"} z-10 ${noBorder ? "border-none h-12" : ""}`}
        style={{ width: isLockManager ? "100%" : "calc(100% - 36px)" }}
        suffixIcon={<ChevronDownIcon className="h-3.5" />}
        filterOption={(input, option) => {
          if (!option?.label) return false;
          return removeVietnameseTones(option.label).includes(removeVietnameseTones(input).trim());
        }}
        onChange={handleChange}
        disabled={disabled}
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
            selectedValue={value}
            type={type}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
            onSelect={(selected) => {
              if (selected?.id) {
                handleChange?.(selected.id);
                setOpen(false);
              }
            }}
            onClose={() => setOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default ManagerSelect;
