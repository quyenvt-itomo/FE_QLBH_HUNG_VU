import { Button, Form, Input, InputNumber, Modal, Radio } from "antd";
import { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusOutlined } from "@ant-design/icons";
import ModalDelete from "../modal/ModalDelete";
import ActionButtons from "../button/ActionButtons";
import { Rule } from "antd/es/form";
import { ManagerModalProps } from "../../models/base/interface";

const ManagerModal = <T extends { id: string; name: string; isDefault?: boolean }>({
  open,
  selectedValue,
  loading,
  dataSource,
  label,
  dataType = "string",
  onClose,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
}: ManagerModalProps<T>) => {
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>();
  const [editData, setEditData] = useState<T | null>(null);
  const [deleteData, setDeleteData] = useState<T | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const rules: Rule[] = [{ required: true, message: "Vui lòng không để trống" }];

  // Reset on dataSource change
  useEffect(() => {
    if (!open) return;
    addForm.resetFields();
    editForm.resetFields();
    setEditData(null);
    setIsAdding(false);
    setOpenDeleteModal(false);
  }, [dataSource, addForm, editForm]);

  // Reset edit form when editData is cleared
  useEffect(() => {
    if (!editData) editForm.resetFields();
  }, [editData, editForm]);

  // Sync selected value with index
  useEffect(() => {
    if (!selectedValue) return;
    const index = dataSource.findIndex((item) => item.id === selectedValue);
    setSelectedRowIndex(index);
  }, [selectedValue, dataSource]);

  // Handle adding mode
  useEffect(() => {
    if (!isAdding) {
      setSelectedRowIndex(undefined);
      addForm.resetFields();
      return;
    }
    setSelectedRowIndex(dataSource.length);
    setEditData(null);
  }, [isAdding, dataSource.length, addForm]);

  const handleClose = () => {
    setSelectedRowIndex(undefined);
    onClose();
  };

  const handleAcceptDelete = () => {
    if (!deleteData) return;
    onDelete?.(deleteData);
    setDeleteData(null);
    setOpenDeleteModal(false);
  };

  const handleAdd = async (value: any) => {
    const trimmedName = String(value?.name || "").trim();
    if (!trimmedName || loading) return;
    onAdd?.({ ...value, name: trimmedName });
  };

  const handleEdit = async (value: any) => {
    const trimmedName = String(value.name || "").trim();
    if (!trimmedName || !editData || loading) return;

    if (trimmedName === editData.name) {
      setEditData(null);
      return;
    }

    onEdit?.({ ...value, name: trimmedName, id: editData.id });
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
    }
  };

  const renderFormInput = () => {
    const inputProps = {
      className: "w-full h-8 border border-primary ml-2",
      autoFocus: true,
      onKeyDown: handleFormKeyDown,
    };

    return dataType === "string" ? (
      <Input {...inputProps} />
    ) : (
      <InputNumber {...inputProps} placeholder="" />
    );
  };

  const isSelectDisabled = selectedRowIndex === undefined || isAdding || editData !== null;
  const showActionButtons = !editData && !isAdding;

  return (
    <Modal
      title={label}
      open={open}
      onCancel={handleClose}
      footer={[
        <Button
          key="select"
          type="primary"
          className="h-8 w-full"
          loading={loading}
          disabled={isSelectDisabled}
          onClick={() => {
            if (selectedRowIndex === undefined) return;
            onSelect(dataSource[selectedRowIndex]);
          }}
        >
          Chọn
        </Button>,
      ]}
      centered
      maskClosable={false}
      width={420}
      destroyOnClose
      afterOpenChange={(open) => {
        if (open) return;
        addForm.resetFields();
        editForm.resetFields();
        setEditData(null);
        setIsAdding(false);
        setOpenDeleteModal(false);
      }}
    >
      <div className="flex flex-col min-h-[440px]">
        <div className="flex flex-col max-h-[380px] overflow-y-auto mt-2 pb-4 overflow-x-hidden">
          {dataSource.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-row items-center cursor-pointer relative ${
                showActionButtons ? "group" : ""
              } py-2`}
              onClick={showActionButtons ? () => setSelectedRowIndex(index) : undefined}
            >
              <Radio checked={selectedRowIndex === index} />

              {editData?.id !== item.id ? (
                <>
                  <div className="flex flex-1 ml-2 h-8 items-center">{item.name}</div>
                  {!item.isDefault && (
                    <ActionButtons
                      onEdit={
                        onEdit
                          ? () => {
                              setEditData(item);
                              setSelectedRowIndex(index);
                            }
                          : undefined
                      }
                      onDelete={
                        onDelete
                          ? () => {
                              setDeleteData(item);
                              setOpenDeleteModal(true);
                            }
                          : undefined
                      }
                    />
                  )}
                </>
              ) : (
                <Form
                  form={editForm}
                  onFinish={handleEdit}
                  className="flex-1 flex"
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Form.Item name="name" initialValue={editData?.name} rules={rules} noStyle>
                    {renderFormInput()}
                  </Form.Item>{" "}
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
                      className="flex items-center justify-center p-0 ml-2
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
        </div>

        {onAdd &&
          (isAdding ? (
            <div className="flex mb-4 mt-2 items-center">
              <Radio checked={true} />
              <Form
                form={addForm}
                onFinish={handleAdd}
                className="flex-1 flex"
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Form.Item name="name" rules={rules} noStyle>
                  {renderFormInput()}
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
            </div>
          ) : (
            <Button
              loading={loading}
              className="w-32 h-8 rounded-[3px] bg-white text-primary border border-primary hover:bg-primary/20 mt-2"
              onClick={() => setIsAdding(true)}
            >
              <PlusOutlined className="text-lg text-primary" />
              Thêm mới
            </Button>
          ))}
      </div>

      <ModalDelete
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        accept={handleAcceptDelete}
      />
    </Modal>
  );
};

export default ManagerModal;
