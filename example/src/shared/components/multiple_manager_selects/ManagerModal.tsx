import { App, Button, Checkbox, Form, Input, InputNumber, Modal } from "antd";
import { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusOutlined } from "@ant-design/icons";
import ActionButtons from "../button/ActionButtons";
import { Rule } from "antd/es/form";
import { MultipleManagerModalProps } from "@/shared/interfaces/common";
import { CLASSNAME } from "@/shared/constants/ui";

const MultipleManagerModal = <T extends { id: string; name: string; isDefault?: boolean }>({
  open,
  selectedValues,
  loading,
  dataSource,
  label,
  dataType = "string",
  onClose,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
}: MultipleManagerModalProps<T>) => {
  const { modal } = App.useApp();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editData, setEditData] = useState<T | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const rules: Rule[] = [{ required: true, message: "Vui lòng không để trống" }];

  // Đồng bộ selectedValues từ ngoài vào
  useEffect(() => {
    if (selectedValues) {
      setSelectedIds(selectedValues);
    }
  }, [selectedValues]);

  useEffect(() => {
    if (!open) return;
    setIsAdding(false);
    setEditData(null);
    addForm?.resetFields();
    editForm?.resetFields();
  }, [dataSource]);

  const handleDelete = (record: T) => {
    if (!record.id || !onDelete) return;

    modal.confirm({
      centered: true,
      title: `Xóa ${label.toLowerCase()}`,
      content: `Bạn có chắc chắn muốn xóa "${record.name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        onDelete(record);
      },
    });
  };

  const handleAdd = (value: any) => {
    const trimmedName = String(value?.name || "").trim();
    if (!trimmedName || loading) return;
    onAdd?.({ ...value, name: trimmedName });
  };

  const handleEdit = (value: any) => {
    const trimmedName = String(value.name || "").trim();
    if (!trimmedName || !editData || loading) return;

    if (trimmedName === editData.name) {
      setEditData(null);
      return;
    }

    onEdit?.({ ...value, name: trimmedName, id: editData.id });
    setEditData(null);
  };

  const handleToggleItem = (itemId: string) => {
    if (editData || isAdding) return;
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
    }
  };

  const renderFormInput = () => {
    const inputProps = {
      autoFocus: true,
      className: "ml-2 w-full " + CLASSNAME.inputHeight + " border border-primary",
      onKeyDown: handleFormKeyDown,
    };

    return dataType === "string" ? (
      <Input {...inputProps} />
    ) : (
      <InputNumber {...inputProps} placeholder="" />
    );
  };

  const isSelectDisabled = isAdding || !!editData || selectedIds.length === 0;
  const showActionButtons = !editData && !isAdding;

  return (
    <Modal
      title={label}
      open={open}
      onCancel={onClose}
      centered
      maskClosable={false}
      width={420}
      footer={[
        <Button
          key="select"
          type="primary"
          className={`${CLASSNAME.inputHeight} w-full`}
          loading={loading}
          disabled={isSelectDisabled}
          onClick={() => {
            onSelect(dataSource.filter((item) => selectedIds.includes(item.id)));
          }}
        >
          Chọn ({selectedIds.length})
        </Button>,
      ]}
      destroyOnClose
      afterOpenChange={(open) => {
        if (open) return;
        addForm.resetFields();
        editForm.resetFields();
        setEditData(null);
        setIsAdding(false);
        setSelectedIds([]);
      }}
    >
      <div className="flex flex-col min-h-[440px]">
        <div className="flex flex-col max-h-[350px] overflow-y-auto mt-2 overflow-x-hidden">
          {dataSource.map((item) => (
            <div
              key={item.id}
              className={`flex items-center cursor-pointer py-2 ${
                showActionButtons ? "group" : ""
              }`}
              onClick={() => handleToggleItem(item.id)}
            >
              <Checkbox checked={selectedIds.includes(item.id)} />

              {editData?.id !== item.id ? (
                <>
                  <div className={`${CLASSNAME.inputHeight} flex-1 ml-2 flex items-center`}>
                    {item.name}
                  </div>

                  {!item.isDefault && (
                    <ActionButtons
                      onEdit={onEdit ? () => setEditData(item) : undefined}
                      onDelete={
                        onDelete
                          ? () => {
                              handleDelete(item);
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
                  <Form.Item name="name" rules={rules} initialValue={editData?.name} noStyle>
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
            <div className="flex items-center mt-2 mb-4">
              <Checkbox checked />

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
              className={`${CLASSNAME.inputHeight} w-32 rounded-[3px] text-primary border border-primary hover:bg-primary/20 mt-2`}
              onClick={() => setIsAdding(true)}
            >
              <PlusOutlined className="text-lg text-primary" />
              Thêm mới
            </Button>
          ))}
      </div>
    </Modal>
  );
};

export default MultipleManagerModal;
