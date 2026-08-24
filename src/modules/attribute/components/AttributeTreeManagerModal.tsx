import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Radio } from "antd";
import { useEffect, useMemo, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { ActionButtons } from "@/shared";
import { CLASSNAME } from "@/shared/constants/ui";
import { Attribute } from "../attribute.model";

type TreeAttribute = Pick<Attribute, "id" | "name" | "parentId" | "isDefault">;

interface SortedTreeAttribute extends TreeAttribute {
  level: number;
}

interface AttributeTreeManagerModalProps {
  open: boolean;
  selectedValue?: string | null;
  loading?: boolean;
  dataSource: Attribute[];
  label: string;
  onClose: () => void;
  onAdd?: (data: Partial<Attribute>) => void;
  onEdit?: (data: Partial<Attribute>) => void;
  onDelete?: (data: TreeAttribute) => void;
  onSelect: (data: TreeAttribute) => void;
}

const MAX_PRODUCT_GROUP_DEPTH = 3;

export const AttributeTreeManagerModal: React.FC<
  AttributeTreeManagerModalProps
> = ({
  open,
  selectedValue,
  loading,
  dataSource,
  label,
  onClose,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const { modal } = App.useApp();
  const [addForm] = Form.useForm<{ name: string; parentId: string | null }>();
  const [editForm] = Form.useForm<{ name: string }>();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>();
  const [editData, setEditData] = useState<TreeAttribute | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addingParentId, setAddingParentId] = useState<string | null>(null);

  const sortedData = useMemo<SortedTreeAttribute[]>(() => {
    const itemsByParent = new Map<string, TreeAttribute[]>();
    const itemIds = new Set(dataSource.map((item) => item.id));

    dataSource.forEach((item) => {
      if (!item.parentId || !itemIds.has(item.parentId)) return;
      const children = itemsByParent.get(item.parentId) || [];
      children.push(item);
      itemsByParent.set(item.parentId, children);
    });

    const result: SortedTreeAttribute[] = [];
    const visited = new Set<string>();

    const flatten = (items: TreeAttribute[], level: number) => {
      items.forEach((item) => {
        if (visited.has(item.id)) return;
        visited.add(item.id);
        result.push({ ...item, level });
        flatten(itemsByParent.get(item.id) || [], level + 1);
      });
    };

    const roots = dataSource.filter(
      (item) => !item.parentId || !itemIds.has(item.parentId),
    );
    flatten(roots, 0);

    // Keep malformed/cyclic records visible instead of silently hiding them.
    flatten(
      dataSource.filter((item) => !visited.has(item.id)),
      0,
    );

    return result;
  }, [dataSource]);

  useEffect(() => {
    if (!open) return;

    setEditData(null);
    setIsAdding(false);
    setAddingParentId(null);
    setSelectedRowIndex(undefined);
    addForm.resetFields();
    editForm.resetFields();
  }, [open, addForm, editForm]);

  useEffect(() => {
    if (!selectedValue) {
      setSelectedRowIndex(undefined);
      return;
    }

    setSelectedRowIndex(sortedData.findIndex((item) => item.id === selectedValue));
  }, [selectedValue, sortedData]);

  const resetAdd = () => {
    setIsAdding(false);
    setAddingParentId(null);
    addForm.resetFields();
  };

  const handleAdd = (value: { name: string; parentId?: string | null }) => {
    const name = String(value.name || "").trim();
    if (!name || loading) return;

    onAdd?.({
      name,
      parentId: value.parentId ?? null,
    });
    resetAdd();
  };

  const handleEdit = (value: { name: string }) => {
    const name = String(value.name || "").trim();
    if (!name || !editData || loading) return;

    onEdit?.({ id: editData.id, name });
    setEditData(null);
    editForm.resetFields();
  };

  const confirmDelete = (item: TreeAttribute) => {
    if (!onDelete) return;

    modal.confirm({
      title: `Xóa ${label.toLowerCase()}`,
      content: `Bạn có chắc chắn muốn xóa "${item.name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => onDelete(item),
    });
  };

  const selectedItem =
    selectedRowIndex === undefined ? undefined : sortedData[selectedRowIndex];
  const isSelectDisabled =
    !selectedItem || isAdding || editData !== null;

  return (
    <Modal
      title={label}
      open={open}
      centered
      width={540}
      maskClosable={false}
      destroyOnClose
      onCancel={onClose}
      footer={[
        <Button
          key="select"
          type="primary"
          className={`${CLASSNAME.inputHeight} w-full`}
          loading={loading}
          disabled={isSelectDisabled}
          onClick={() => selectedItem && onSelect(selectedItem)}
        >
          Chọn
        </Button>,
      ]}
    >
      <div className="flex min-h-[520px] flex-col pt-3">
        <div className="flex max-h-[460px] flex-col overflow-y-auto overflow-x-hidden">
          {sortedData.map((item, index) => {
            const isEditing = editData?.id === item.id;
            const canAddChild = item.level + 1 < MAX_PRODUCT_GROUP_DEPTH;

            return (
              <div key={item.id}>
                <div
                  className={`relative flex cursor-pointer items-center py-2 ${
                    !isAdding && !editData ? "group" : ""
                  }`}
                  style={{ paddingLeft: item.level * 24 }}
                  onClick={() => {
                    if (!isAdding && !editData) setSelectedRowIndex(index);
                  }}
                >
                  <Radio checked={selectedRowIndex === index && !isAdding} />

                  {isEditing ? (
                    <Form
                      form={editForm}
                      onFinish={handleEdit}
                      className="ml-2 flex flex-1"
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Vui lòng không để trống" }]}
                        noStyle
                      >
                        <Input autoFocus className={`ml-2 w-full ${CLASSNAME.inputHeight}`} />
                      </Form.Item>
                      <div className="ml-2 flex shrink-0">
                        <button type="submit" className="text-green-500">
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => setEditData(null)}
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <div className={`ml-2 flex flex-1 ${CLASSNAME.inputHeight} items-center`}>
                        {item.name}
                      </div>
                      {!item.isDefault && (
                        <ActionButtons
                          onAdd={onAdd && canAddChild ? () => {
                            setIsAdding(true);
                            setAddingParentId(item.id);
                            addForm.setFieldsValue({ parentId: item.id });
                          } : undefined}
                          onEdit={onEdit ? () => {
                            setEditData(item);
                            editForm.setFieldsValue({ name: item.name });
                          } : undefined}
                          onDelete={onDelete ? () => confirmDelete(item) : undefined}
                        />
                      )}
                    </>
                  )}
                </div>

                {isAdding && addingParentId === item.id && (
                  <div
                    className="flex items-center py-2"
                    style={{ paddingLeft: item.level * 24 + 16 }}
                  >
                    <Radio checked />
                    <Form
                      form={addForm}
                      onFinish={handleAdd}
                      className="ml-2 flex flex-1"
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Vui lòng không để trống" }]}
                        noStyle
                      >
                        <Input autoFocus className={`w-full ${CLASSNAME.inputHeight}`} />
                      </Form.Item>
                      <Form.Item name="parentId" hidden />
                      <div className="ml-2 flex shrink-0">
                        <button type="submit" className="text-green-500">
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button type="button" className="ml-2 text-red-500" onClick={resetAdd}>
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </Form>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {onAdd && (
          <div className="mt-2">
            {isAdding && addingParentId === null ? (
              <div className="flex items-center">
                <Radio checked />
                <Form
                  form={addForm}
                  onFinish={handleAdd}
                  className="flex flex-1"
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Vui lòng không để trống" }]}
                    noStyle
                  >
                    <Input autoFocus className={`ml-2 w-full ${CLASSNAME.inputHeight}`} />
                  </Form.Item>
                  <Form.Item name="parentId" hidden />
                  <div className="ml-2 flex shrink-0">
                    <button type="submit" className="text-green-500">
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button type="button" className="ml-2 text-red-500" onClick={resetAdd}>
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </Form>
              </div>
            ) : (
              <Button
                loading={loading}
                className={`mt-2 w-32 ${CLASSNAME.inputHeight} border border-primary text-primary`}
                onClick={() => {
                  setIsAdding(true);
                  setAddingParentId(null);
                  addForm.setFieldsValue({ parentId: null });
                }}
              >
                <PlusOutlined className="text-primary" />
                Thêm mới
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
