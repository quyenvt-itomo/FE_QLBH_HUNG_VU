import { TreeSelect } from "antd";
import { useEffect, useState } from "react";

import ManagerModal from "./ManagerModal";
import { SelectProps } from "antd";
import { IconArrowDown } from "../icon/ArrowDown";
import { removeVietnameseTones } from "../../utils/searchUtils";
import ManagerButton from "./ManagerButton";
import { AttributeTypeEnum } from "../../constants/enum";

export function buildTree<T extends { id: string; parentId?: string | null; name: string }>(
  data: T[],
) {
  const map = new Map<string, any>();

  data.forEach((item) => {
    map.set(item.id, {
      key: item.id,
      value: item.id,
      title: item.name,
      parentId: item.parentId,
      children: [],
    });
  });

  const tree: any[] = [];

  data.forEach((item) => {
    const node = map.get(item.id);
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId).children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
}

interface ManagerSelectProps<T> extends Omit<SelectProps<string>, "options"> {
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
  onChangeData?: (data: T | undefined) => void;
}

const ManagerSelect = <
  T extends {
    id: string;
    name: string;
    parentId?: string | null;
    parent?: T | null;
  },
>({
  ref,
  options,
  label,
  value,
  loading,
  validateFormat,
  type,
  newItem,
  placeholder,
  onAdd,
  onEdit,
  onDelete,
  onChange,
  onChangeData,
  onManage,
  onBlur,
  onFocus,
  ...rest
}: ManagerSelectProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);

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
    if (!newItem?.id || !open) return;

    onChange?.(newItem.id);
    onChangeData?.(newItem);
  }, [newItem]);

  return (
    <div className="flex w-full z-0">
      <TreeSelect
        value={value || undefined}
        treeData={buildTree(options)}
        placeholder={placeholder}
        allowClear
        showSearch
        treeDefaultExpandAll
        className={`h-8 ${isLockManager ? "" : "rounded-e-none"} z-10`}
        style={{ width: isLockManager ? "100%" : "calc(100% - 36px)" }}
        suffixIcon={<IconArrowDown />}
        filterTreeNode={(input, node) =>
          removeVietnameseTones(String(node.title)).includes(removeVietnameseTones(input))
        }
        onChange={(val) => {
          onChange?.(val as string);
          onChangeData?.(options.find((i) => i.id === val));
        }}
        onBlur={onBlur}
        onFocus={onFocus}
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
