import { Form, Typography } from "antd";
import { useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Role } from "../role.model";
import { role } from "@/shared/constants/permission";
import { SubmitButton } from "@/shared/components";
import { PermissionSelect } from "@/shared/components";

const { Title } = Typography;

interface RolePermissionProps {
  loading: boolean;
  selectedRow: Role | null;
  onUpdateRolePermission?: (record: Role) => void;
  onToggleDrawer: () => void;
}

export const RolePermission: React.FC<RolePermissionProps> = ({
  loading,
  selectedRow,
  onUpdateRolePermission,
  onToggleDrawer,
}) => {
  const [form] = Form.useForm<Role>();

  useEffect(() => {
    handleReset();
  }, [selectedRow]);

  const handleReset = () => {
    form.resetFields();
    if (!selectedRow) return;
    form.setFieldsValue({
      permissions: selectedRow.permissions || {},
    } as any);
  };

  const handleFinish = async (values: any) => {
    if (!selectedRow) return;
    onUpdateRolePermission?.({
      ...selectedRow,
      ...values,
    });
  };

  if (!selectedRow) return null;

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      className="flex flex-col h-full relative text-slate-800 dark:text-gray-100"
    >
      <div className="flex items-center gap-3 justify-between h-9">
        <div className="flex xl:hidden gap-3">
          <Title
            level={5}
            style={{ fontSize: "1.2rem", marginBottom: 0, fontWeight: 500 }}
            className="truncate dark:!text-gray-100"
          >
            {selectedRow?.name}
          </Title>
          <button
            type="button"
            className="p-1 rounded-full transition-all ease-in-out hover:rotate-180 text-slate-700 dark:text-gray-300"
            onClick={onToggleDrawer}
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
        <Title
          level={5}
          style={{ fontSize: "1.2rem", marginBottom: 0, fontWeight: 500 }}
          className="hidden xl:flex truncate dark:!text-gray-100"
        >
          Quyền truy cập hệ thống
        </Title>
        {onUpdateRolePermission ? <SubmitButton loading={loading} onCancel={handleReset} /> : <></>}
      </div>

      <div
        className="overflow-x-hidden overflow-y-auto px-6 mt-3"
        style={{ height: "calc(100% - 44px)" }}
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Nhập Excel */}
          {/* Xuất Excel */}
          {role.map((group) => (
            <div
              key={group.title}
              className="flex flex-col p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/60"
            >
              <span className="text-[14px] font-medium mb-4 text-slate-800 dark:text-gray-100">
                {group.title}
              </span>
              <div className="space-y-4 px-3">
                {group.modules.map((module) => (
                  <PermissionSelect
                    key={module}
                    form={form}
                    module={module}
                    disabled={!onUpdateRolePermission}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Form>
  );
};

export default RolePermission;
