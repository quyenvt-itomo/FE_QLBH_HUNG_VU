import { Form, Input, Spin, Typography, Collapse, Tag, App } from "antd";
import { useEffect, useState, useMemo } from "react";
import { CheckIcon, XMarkIcon, LockClosedIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";
import { Role } from "../role.model";
import ActionButtons from "@/shared/components/button/ActionButtons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface RoleListProps {
  loading: boolean;
  dataSource: Role[];
  selectedRow: Role | null;
  setSelectedRow: (record: Role) => void;
  onAdd?: (record: Role) => void;
  onEdit?: (record: Role) => void;
  onDelete?: (id: string) => void;
}

// Hàm lấy màu sắc ngẫu nhiên cho icon giống trong ảnh
const getRoleVisuals = (index: number) => {
  const styles = [
    { bg: "bg-red-100", dot: "bg-red-500" },
    { bg: "bg-purple-100", dot: "bg-purple-500" },
    { bg: "bg-amber-100", dot: "bg-amber-500" },
    { bg: "bg-cyan-100", dot: "bg-cyan-500" },
    { bg: "bg-green-100", dot: "bg-green-500" },
    { bg: "bg-blue-100", dot: "bg-blue-600" },
    { bg: "bg-slate-200", dot: "bg-slate-500" },
  ];
  return styles[index % styles.length];
};

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
  const [adding, setAdding] = useState<boolean>(false);
  const { modal } = App.useApp();

  const renderAddSection = () => {
    if (adding) {
      return (
        <Form
          form={addForm}
          onFinish={(v) => {
            onAdd?.(v);
            setAdding(false);
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
            <button type="button" onClick={() => setAdding(false)} className="text-red-400">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </Form>
      );
    }

    return (
      onAdd && (
        <button
          disabled={!!editData || !!adding}
          onClick={() => setAdding(true)}
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
          dataSource.map((role, idx) => renderRoleCard(role, idx))
        )}

        {renderAddSection()}
      </div>
    </div>
  );
};
