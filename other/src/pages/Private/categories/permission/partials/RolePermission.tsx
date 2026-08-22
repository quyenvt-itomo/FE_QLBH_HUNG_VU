import { Form, Typography } from "antd";
import { IRole } from "../../../../../models/store/role";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import SubmitButton from "../../../../../components/button/SubmitButton";
import { role } from "../../../../../constants/permission";
import PermissionSelect from "../../../../../components/core/PermissionSelect";

const { Title } = Typography;

interface RolePermissionProps {
  loading: boolean;
  selectedRow: IRole | null;
  onUpdateRolePermission?: (record: IRole) => void;
  onToggleDrawer: () => void;
}

const RolePermission: React.FC<RolePermissionProps> = ({
  loading,
  selectedRow,
  onUpdateRolePermission,
  onToggleDrawer,
}) => {
  const [form] = Form.useForm();
  const { permissions } = useClientData();
  useEffect(() => {
    handleReset();
  }, [selectedRow]);

  const handleReset = () => {
    if (!selectedRow) return;
    form.setFieldsValue(selectedRow?.permissions);
  };

  const handleFinish = async (values: any) => {
    if (!selectedRow) return;

    onUpdateRolePermission?.({
      ...selectedRow,
      permissions: values,
    });
  };

  if (!selectedRow) return null;

  return (
    <Form form={form} onFinish={handleFinish} className="flex flex-col h-full relative p-3">
      <div className="flex items-center gap-3 justify-between h-8">
        <div className="flex xl:hidden gap-3">
          <Title
            level={5}
            style={{
              fontSize: "1.2rem",
              marginBottom: 0,
              fontWeight: 500,
            }}
            className="truncate"
          >
            {selectedRow?.name}
          </Title>

          <button
            type="button"
            className="p-1 rounded-full transition-all ease-in-out hover:rotate-180"
            onClick={onToggleDrawer}
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
        <Title
          level={5}
          style={{
            fontSize: "1.2rem",
            marginBottom: 0,
            fontWeight: 500,
          }}
          className="hidden xl:flex truncate"
        >
          Quyền truy cập hệ thống
        </Title>
        {onUpdateRolePermission ? <SubmitButton loading={loading} onCancel={handleReset} /> : <></>}
      </div>
      <div
        className="overflow-x-hidden overflow-y-auto px-6 mt-3"
        style={{
          height: "calc(100% - 44px)",
        }}
      >
        <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(420px,1fr))]">
          {role.map((group) => (
            <div key={group.title} className="flex flex-col p-4 border rounded-lg">
              <span className="text-[14px] font-medium mb-4">{group.title}</span>
              <div className="space-y-4 px-3">
                {group.modules.map((module) => {
                  return (
                    <PermissionSelect
                      key={module}
                      context="store"
                      form={form}
                      module={module}
                      disabled={!onUpdateRolePermission}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Form>
  );
};

export default RolePermission;
