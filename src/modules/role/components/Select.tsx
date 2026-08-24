import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { Role, RoleQuery, RoleType } from "../role.model";
import { useRoleStore } from "../role.store";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { useEffect, useMemo, useState } from "react";
import { TreeSelect } from "antd";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { ManagerButton } from "@/shared/components/manager_select/ManagerButton";
import { AddRoleModal } from "./AddModal";

export const RoleSelect: React.FC<SelectProps<Role, RoleQuery>> = ({
  value,
  defaultData,
  query,
  disabled,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(["system", "store"]);
  const { list, loading, unlock } = useRemoteSelect<Role, RoleQuery>({
    defaultData,
    queryHook: useRoleStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 999,
      isLocked,
    }),
  });
  const { errors, newItem, create } = useRoleStore();

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const toggleGroup = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  useEffect(() => {
    if (!newItem) return;
    onChange?.(newItem.id);
    onChangeData?.(newItem);
  }, [newItem]);

  const treeData = useMemo(() => {
    const systemRoles = list.filter((r) => r.type === RoleType.SYSTEM);
    const storeRoles = list.filter((r) => r.type === RoleType.STORE);

    const renderGroupTitle = (label: string, key: string) => (
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleGroup(key);
        }}
        className="flex items-center gap-2 font-semibold cursor-pointer hover:text-indigo-600"
      >
        {label}
      </div>
    );

    return [
      {
        title: renderGroupTitle("Vai trò hệ thống", "system"),
        key: "system",
        value: "system",
        selectable: false,
        children: systemRoles.map((r) => ({
          title: r?.name,
          value: r.id,
          key: r.id,
          data: r,
        })),
      },
      {
        title: renderGroupTitle("Vai trò cửa hàng", "store"),
        key: "store",
        value: "store",
        selectable: false,
        children: storeRoles.map((r) => ({
          title: r?.name,
          value: r.id,
          key: r.id,
          data: r,
        })),
      },
    ];
  }, [list]);

  return (
    <div className="flex w-full z-0">
      <TreeSelect<any, any>
        className={`role-tree-select ${create ? "w-[calc(100%-40px)] rounded-e-none" : "w-full"} z-10`}
        popupClassName="role-tree-dropdown"
        treeData={treeData}
        value={value ?? undefined}
        loading={loading}
        placeholder="Chọn vai trò hệ thống"
        treeExpandedKeys={expandedKeys}
        treeDefaultExpandAll={false}
        showSearch
        treeNodeFilterProp="title"
        onChange={handleChange}
        onTreeExpand={(keys) => setExpandedKeys(keys as string[])}
        suffixIcon={<ChevronDownIcon className="h-3.5" />}
        onFocus={(e) => {
          unlock();
          onFocus?.(e);
        }}
        disabled={disabled}
        {...rest}
      />

      {create && (
        <>
          <ManagerButton
            onClick={() => {
              setOpen(true);
            }}
            disabled={disabled}
          />
          <AddRoleModal
            open={open}
            loading={loading}
            errors={errors}
            onClose={() => setOpen(false)}
            onAdd={create}
          />
        </>
      )}
    </div>
  );
};

export const RoleMultipleSelect: React.FC<MultipleSelectProps<Role, RoleQuery>> = ({
  value,
  defaultData,
  query,
  disabled,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(["system", "store"]);
  const { list, loading, unlock } = useRemoteSelect<Role, RoleQuery>({
    defaultData,
    queryHook: useRoleStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 999,
      isLocked,
    }),
  });
  const { errors, newItem, create } = useRoleStore();

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const data = list.filter((item) => ids.includes(item.id));
    onChangeData?.(data);
  };

  const toggleGroup = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  useEffect(() => {
    if (!newItem) return;
    const newIds = [...(value || []), newItem.id];
    onChange?.(newIds);
    const data = list.filter((item) => newIds.includes(item.id));
    onChangeData?.(data);
  }, [newItem]);

  const treeData = useMemo(() => {
    const systemRoles = list.filter((r) => r.type === RoleType.SYSTEM);
    const storeRoles = list.filter((r) => r.type === RoleType.STORE);

    const renderGroupTitle = (label: string, key: string) => (
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleGroup(key);
        }}
        className="flex items-center gap-2 font-semibold cursor-pointer hover:text-indigo-600"
      >
        {label}
      </div>
    );

    return [
      {
        title: renderGroupTitle("Vai trò hệ thống", "system"),
        key: "system",
        value: "system",
        selectable: false,
        children: systemRoles.map((r) => ({
          title: r?.name,
          value: r.id,
          key: r.id,
          data: r,
        })),
      },
      {
        title: renderGroupTitle("Vai trò cửa hàng", "store"),
        key: "store",
        value: "store",
        selectable: false,
        children: storeRoles.map((r) => ({
          title: r?.name,
          value: r.id,
          key: r.id,
          data: r,
        })),
      },
    ];
  }, [list]);

  return (
    <div className="flex w-full z-0">
      <TreeSelect<any, any>
        multiple
        className={`role-tree-select ${create ? "w-[calc(100%-40px)] rounded-e-none" : "w-full"} z-10`}
        popupClassName="role-tree-dropdown"
        treeData={treeData}
        value={value ?? undefined}
        loading={loading}
        placeholder="Chọn vai trò hệ thống"
        treeExpandedKeys={expandedKeys}
        treeDefaultExpandAll={false}
        showSearch
        treeNodeFilterProp="title"
        onChange={handleChange}
        onTreeExpand={(keys) => setExpandedKeys(keys as string[])}
        suffixIcon={<ChevronDownIcon className="h-3.5" />}
        onFocus={(e) => {
          unlock();
          onFocus?.(e);
        }}
        disabled={disabled}
        {...rest}
      />

      {create && (
        <>
          <ManagerButton
            onClick={() => {
              setOpen(true);
            }}
            disabled={disabled}
          />
          <AddRoleModal
            open={open}
            loading={loading}
            errors={errors}
            onClose={() => setOpen(false)}
            onAdd={create}
          />
        </>
      )}
    </div>
  );
};
