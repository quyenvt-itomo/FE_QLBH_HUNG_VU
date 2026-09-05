import { App, Collapse, Form, Input, Spin, Typography } from "antd";
import { useEffect, useState, useMemo } from "react";
import { CheckIcon, XMarkIcon, LockClosedIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";
import { Role, RoleType, roleTypeMap } from "../role.model";
import { ActionButtons } from "@/shared/components";

const { Title, Text } = Typography;

interface RoleListProps {
  loading: boolean;
  dataSource: Role[];
  selectedRow: Role | null;
  setSelectedRow: (record: Role) => void;
  onAdd?: (record: Role) => void;
  onEdit?: (record: Role) => void;
  onDelete?: (id: string) => void;
}

export const RoleList: React.FC<RoleListProps> = ({
  loading,
  dataSource,
  selectedRow,
  setSelectedRow,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editData, setEditData] = useState<Role | null>(null);
  const [addingType, setAddingType] = useState<RoleType | null>(null);
  const { modal } = App.useApp();

  const groupedRoles = useMemo(
    () =>
      [RoleType.SYSTEM, RoleType.STORE]
        .map((type) => ({
          type,
          roles: dataSource.filter((role) => role.type === type),
        }))
        .filter(({ roles, type }) => roles.length > 0 || Boolean(onAdd) || addingType === type),
    [addingType, dataSource, onAdd],
  );

  useEffect(() => {
    if (!addingType) addForm.resetFields();
  }, [addForm, addingType]);

  const renderAddSection = (type: RoleType) => {
    if (addingType === type) {
      return (
        <Form
          form={addForm}
          onFinish={(v) => {
            onAdd?.({ ...v, type } as Role);
            setAddingType(null);
          }}
          className="mt-2"
        >
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border-2 border-blue-400 dark:border-blue-500">
            <Form.Item name="name" noStyle rules={[{ required: true, message: "Nhập tên!" }]}>
              <Input
                placeholder="Nhập tên vai trò..."
                className="border-none dark:!bg-slate-800 dark:!text-gray-100"
                autoFocus
              />
            </Form.Item>
            <button type="submit" className="text-green-500">
              <CheckIcon className="h-6 w-6" />
            </button>
            <button type="button" onClick={() => setAddingType(null)} className="text-red-400">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </Form>
      );
    }

    return (
      onAdd && (
        <button
          disabled={!!editData || Boolean(addingType)}
          onClick={() => setAddingType(type)}
          className="w-full h-[57.2px]  mt-2 py-3 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2 font-semibold text-[14px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <PlusOutlined /> Tạo vai trò tùy chỉnh
        </button>
      )
    );
  };

  const handleDelete = onDelete
    ? (record: Role) => {
        modal.confirm({
          title: "Xóa vai trò",
          content: `Bạn có chắc chắn muốn xóa vai trò "${record.name}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            onDelete(record.id);
          },
        });
      }
    : undefined;

  const renderRoleCard = (item: Role, index: number) => {
    const isSelected = selectedRow?.id === item.id;
    const isEditing = editData?.id === item.id;

    // Kiểm tra quyền mặc định
    const isDefaultRole = item.isDefault === true;

    if (isEditing) {
      return (
        <Form
          form={editForm}
          onFinish={(v) => {
            onEdit?.({ ...v, id: item.id });
            setEditData(null); // Reset sau khi edit
          }}
          className="mb-3"
        >
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border-2 border-blue-400 dark:border-blue-500">
            <Form.Item name="name" initialValue={item.name} noStyle rules={[{ required: true }]}>
              <Input
                className="border-none focus:ring-0 dark:!bg-slate-800 dark:!text-gray-100"
                autoFocus
              />
            </Form.Item>
            <button type="submit" className="text-green-500 hover:scale-110 transition-transform">
              <CheckIcon className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => setEditData(null)} className="text-red-400">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </Form>
      );
    }

    return (
      <div
        key={item.id}
        onClick={() => setSelectedRow(item)}
        className={`
          relative group flex items-center p-3 mb-3 cursor-pointer rounded-xl border-2 transition-all
          ${isSelected ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm" : "border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-200 dark:hover:border-slate-600"}
        `}
      >
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <Text
              className="font-bold text-[14px] text-slate-700 dark:!text-gray-100 truncate"
              title={item.name}
            >
              {item.name}
            </Text>
            {isDefaultRole && (
              <LockClosedIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            )}
          </div>
          <Text
            className="text-gray-400 dark:!text-gray-400 text-[12px] block"
            title={`${item.userCount || 0} users`}
          >
            {item.userCount || 0} users
          </Text>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          {!isDefaultRole ? (
            <ActionButtons
              onEdit={onEdit ? () => setEditData(item) : undefined}
              onDelete={
                onDelete
                  ? () => {
                      handleDelete?.(item);
                    }
                  : undefined
              }
            />
          ) : (
            <span className="text-2xs text-gray-400 dark:text-gray-500 italic px-2">Hệ thống</span>
          )}
        </div>
      </div>
    );
  };

  const collapseItems = groupedRoles.map(({ type, roles }) => ({
    key: type,
    label: (
      <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-widest">
        {roleTypeMap[type]}
      </span>
    ),
    children: (
      <>
        {roles.map((role, idx) => renderRoleCard(role, idx))}
        {renderAddSection(type)}
      </>
    ),
  }));

  return (
    <div className="flex flex-col w-full h-full rounded-lg overflow-hidden">
      <Title level={5} className="!mb-4 !font-bold text-slate-800 dark:!text-gray-100">
        Vai trò
      </Title>

      <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-hide">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : (
          <Collapse
            ghost
            defaultActiveKey={groupedRoles.map(({ type }) => type)}
            items={collapseItems}
            className="role-collapse"
            expandIcon={({ isActive }) => (
              <ChevronDownIcon
                className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};
