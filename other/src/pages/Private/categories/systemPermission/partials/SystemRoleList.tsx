import { Button, Form, Input, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusOutlined } from "@ant-design/icons";
import { ISystemRole } from "../../../../../models/systemRole";
import ActionButtons from "../../../../../components/button/ActionButtons";
import ModalDelete from "../../../../../components/modal/ModalDelete";
import { useClientData } from "../../../../../hooks/core/useClientData";
import "../index.css";

const { Title } = Typography;

interface SystemRoleListProps {
  loading: boolean;
  dataSource: ISystemRole[];
  selectedRow: ISystemRole | null;
  setSelectedRow: (record: ISystemRole) => void;
  onAdd?: (record: ISystemRole) => void;
  onEdit?: (record: ISystemRole) => void;
  onDelete?: (id: string) => void;
}

const SystemRoleList: React.FC<SystemRoleListProps> = ({
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
  const [editData, setEditData] = useState<ISystemRole | null>(null);
  const [deleteData, setDeleteData] = useState<ISystemRole | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { permissions } = useClientData();

  useEffect(() => {
    if (isAdding) return;

    addForm.resetFields();
  }, [isAdding]);

  useEffect(() => {
    setIsAdding(false);
    setEditData(null);
    setDeleteData(null);
    addForm.resetFields();
    editForm.resetFields();
  }, [dataSource]);

  const handleAdd = async (value: any) => {
    if (!value?.name || loading) return;
    onAdd?.({ ...value });
  };

  const handleEdit = async (value: any) => {
    if (!value?.name || !editData || loading) return;
    onEdit?.({
      ...value,
      id: editData.id,
    });
  };

  const handleAcceptDelete = () => {
    if (!deleteData?.id) return;
    onDelete?.(deleteData.id);
    setDeleteData(null);
    setOpenDeleteModal(false);
  };

  return (
    <div className="flex flex-col relative w-full h-full">
      {loading && (
        <div className="absolute z-10 h-full w-full flex items-center justify-center bg-white/5">
          <Spin />
        </div>
      )}
      <div className="flex items-center gap-3 justify-between h-8 ml-3 mt-2">
        <Title
          level={5}
          style={{
            fontSize: "1.2rem",
            marginBottom: 0,
            fontWeight: 500,
          }}
          className="truncate"
        >
          Vai trò trong hệ thống
        </Title>
      </div>
      <div className="flex flex-col flex-1 gap-2 overflow-x-hidden overflow-y-auto mt-4">
        {dataSource.map((item, index) => (
          <div key={item.id} className="flex flex-row items-center relative group px-3">
            {editData?.id !== item.id ? (
              <>
                <div
                  className={`flex flex-1 h-8 cursor-pointer px-[11px] role__row ${
                    selectedRow?.id === item.id
                      ? "role__selected-row"
                      : "hover:border hover:px-[10px]"
                  } items-center `}
                  style={{
                    boxSizing: "border-box",
                  }}
                  onClick={() => setSelectedRow(item)}
                >
                  {item.name}
                </div>

                {/* Nút sửa/xóa */}
                <ActionButtons
                  onEdit={
                    onEdit
                      ? () => {
                          setIsAdding(false);
                          setEditData(item);
                        }
                      : undefined
                  }
                  onDelete={
                    onDelete
                      ? () => {
                          setIsAdding(false);
                          setDeleteData(item);
                          setOpenDeleteModal(true);
                        }
                      : undefined
                  }
                />
              </>
            ) : (
              <Form form={editForm} onFinish={handleEdit} className="flex-1 flex custom-item-form">
                <Form.Item
                  name="name"
                  initialValue={editData?.name}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập vai trò",
                    },
                  ]}
                  className="w-full"
                >
                  <Input
                    className="w-full h-8 border border-blue-500"
                    placeholder="Nhập vai trò"
                    autoFocus
                  />
                </Form.Item>
                <div className="flex flex-shrink-0">
                  <button
                    type="submit"
                    className="
                    flex items-center justify-center p-0 ml-2
                    text-green-400 hover:text-green-600 transition-colors ease-in-out"
                  >
                    <CheckIcon className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    className="
                    flex items-center justify-center p-0 ml-2
                    text-red-400 hover:text-red-600 transition-colors ease-in-out"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditData(null);
                    }}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </Form>
            )}
          </div>
        ))}
        {!onAdd ? (
          <></>
        ) : isAdding ? (
          <Form form={addForm} onFinish={handleAdd} className="flex px-3">
            <Form.Item
              name="name"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên vai trò",
                },
              ]}
            >
              <Input
                className="w-full h-8 border border-blue-500"
                placeholder="Nhập tên vai trò"
                autoFocus
              />
            </Form.Item>
            <div className="flex flex-shrink-0 pb-[22px]">
              <button
                type="submit"
                className="
                flex items-center justify-center p-0 ml-2
                text-green-400 hover:text-green-600 transition-colors ease-in-out"
              >
                <CheckIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdding(false);
                }}
                className="
                flex items-center justify-center p-0 ml-2
                text-red-400 hover:text-red-600 transition-colors ease-in-out"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </Form>
        ) : (
          <Button
            loading={loading}
            disabled={!!editData}
            className={`w-32 h-8 rounded-[3px] bg-white text-primary border border-primary ml-3`}
            onClick={() => setIsAdding(true)}
          >
            <PlusOutlined className={`text-lg ${editData ? "" : "text-primary"}`} />
            Thêm vai trò
          </Button>
        )}
      </div>

      <ModalDelete
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        accept={handleAcceptDelete}
      />
    </div>
  );
};

export default SystemRoleList;
