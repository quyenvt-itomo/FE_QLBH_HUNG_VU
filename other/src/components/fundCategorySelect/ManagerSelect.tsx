import { TreeSelect } from "antd";
import { useEffect, useMemo, useState } from "react";
import ManagerModal, { BaseItem } from "./ManagerModal";
import { SelectProps } from "antd";
import { IconArrowDown } from "../icon/ArrowDown";
import { removeVietnameseTones } from "../../utils/searchUtils";
import ManagerButton from "./ManagerButton";
import { AttributeTypeEnum } from "../../constants/enum";
import { IFundCategory } from "../../models/fundCategory";

/* =========================
  Tree builder
========================= */

export function buildTreeFromParents<T extends BaseItem>(data: T[]) {
  return data.map((parent) => ({
    key: parent.id,
    value: parent.id,
    title: parent.name,
    selectable: false,
    children:
      parent.fundCategories?.map((child) => ({
        key: child.id,
        value: child.id,
        title: child.name,
      })) || [],
  }));
}

/* =========================
  Props
========================= */

interface ManagerSelectProps<T> extends Omit<SelectProps<string>, "options" | "onChange"> {
  options: T[];
  label: string;
  validateFormat?: boolean;
  newItem?: IFundCategory | null;
  type?: AttributeTypeEnum;
  onAdd?: (value: T) => void;
  onDelete?: (data: T) => void;
  onEdit?: (data: T) => void;
  onAddChild?: (child: IFundCategory) => void;
  onEditChild?: (child: IFundCategory) => void;
  onDeleteChild?: (child: IFundCategory) => void;
  onManage?: () => void;
  onChange?: (value: string) => void;
  onChangeData?: (data: IFundCategory | undefined) => void;
}

/* =========================
  Component
========================= */

const ManagerSelect = <T extends BaseItem>({
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
  onAddChild,
  onEditChild,
  onDeleteChild,
  onChange,
  onChangeData,
  onManage,
  onBlur,
  onFocus,
}: ManagerSelectProps<T>) => {
  const [open, setOpen] = useState(false);

  const isLockManager =
    !onAdd && !onEdit && !onDelete && !onAddChild && !onEditChild && !onDeleteChild;

  const treeData = useMemo(() => {
    const data = buildTreeFromParents<T>(options);
    return data.filter((parent) => parent.children && parent.children.length > 0);
  }, [options]);

  /* =========================
    Effects
  ========================= */

  useEffect(() => {
    if (!value || !open) return;
    setOpen(false);
  }, [value]);

  useEffect(() => {
    if (!newItem?.id || !open) return;
    onChange?.(newItem.id);
    onChangeData?.(newItem);
    setOpen(false);
  }, [newItem]);

  /* =========================
    Handlers
  ========================= */

  const handleChange = (val?: string) => {
    onChange?.(val as string);

    const selected = options.flatMap((p) => p.categories || []).find((c) => c.id === val);

    onChangeData?.(selected);
  };

  /* =========================
    Render
  ========================= */

  return (
    <div className="flex w-full z-0">
      <TreeSelect
        value={value || undefined}
        treeData={treeData}
        placeholder={placeholder}
        allowClear
        showSearch
        treeDefaultExpandAll={true}
        className={`h-8 ${isLockManager ? "" : "rounded-e-none"} z-10`}
        style={{ width: isLockManager ? "100%" : "calc(100% - 40px)" }}
        suffixIcon={<IconArrowDown />}
        filterTreeNode={(input, node) =>
          removeVietnameseTones(String(node.title)).includes(removeVietnameseTones(input))
        }
        onChange={(val) => handleChange(val as string)}
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
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
            onEditChild={onEditChild}
            onDeleteChild={onDeleteChild}
            onSelect={(child) => {
              handleChange(child.id);
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
