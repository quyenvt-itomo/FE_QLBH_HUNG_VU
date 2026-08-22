import { Select } from "antd";
import { useEffect, useState } from "react";

import ManagerModal from "./ManagerModal";
import { SelectProps } from "antd";
import { IconArrowDown } from "../icon/ArrowDown";
import { removeVietnameseTones } from "../../utils/searchUtils";
import ManagerButton from "./ManagerButton";
import { AttributeTypeEnum } from "../../constants/enum";

interface MultipleManagerSelectProps<T> extends Omit<SelectProps<string[]>, "options"> {
  ref?: React.Ref<any>;
  options: T[];
  label: string;
  validateFormat?: boolean;
  newItem?: T | null;
  type?: AttributeTypeEnum;
  onAdd?: (value: T) => void;
  onDelete?: (data: T) => void;
  onEdit?: (data: T) => void;
  onManage?: () => void;
  onChangeData?: (data: T[]) => void;
}

const ManagerSelect = <T extends { id: string; name: string }>({
  ref,
  options,
  label,
  value,
  loading,
  validateFormat,
  newItem,
  type,
  onAdd,
  onEdit,
  onDelete,
  onChange,
  onChangeData,
  onManage,
  ...rest
}: MultipleManagerSelectProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);

  const isLockManager = !onAdd && !onEdit && !onDelete;

  const handleChange = (value: string[]) => {
    onChange?.(value);
    const items = options?.filter((item) => value?.includes(item.id));
    onChangeData?.(items);
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
  }, [newItem]);

  return (
    <div className="flex w-full z-0">
      <Select
        ref={ref}
        mode="multiple"
        maxTagCount="responsive"
        options={options.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        allowClear
        showSearch
        value={value}
        loading={loading}
        className={`h-8 ${isLockManager ? "" : "rounded-e-none"} z-10`}
        style={{ width: isLockManager ? "100%" : "calc(100% - 36px)" }}
        suffixIcon={<IconArrowDown />}
        filterOption={(input, option) =>
          removeVietnameseTones(option?.label as string).includes(removeVietnameseTones(input))
        }
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

export default ManagerSelect;
