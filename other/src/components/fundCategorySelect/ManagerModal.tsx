import { Button, Form, Input, InputNumber, Modal, Radio } from "antd";
import { useEffect, useMemo, useState, Fragment } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusOutlined } from "@ant-design/icons";
import ModalDelete from "../modal/ModalDelete";
import ActionButtons from "../button/ActionButtons";
import { Rule } from "antd/es/form";
import { IAttribute } from "../../models/base/attribute";
import { AttributeTypeEnum } from "../../constants/enum";
import dayjs from "dayjs";
import { IFundCategory } from "../../models/fundCategory";

/* =========================
  Types
========================= */

export interface BaseItem extends IAttribute {
  categories?: IFundCategory[];
}

type RowItem<T> =
  | { type: "parent"; data: T }
  | { type: "child"; data: IFundCategory; parentId: string };

export interface ManagerModalProps<T extends BaseItem> {
  open: boolean;
  loading?: boolean;
  selectedValue?: string | null;
  dataSource: T[];
  label: string;
  dataType?: "string" | "number";
  validateFormat?: boolean;
  type?: AttributeTypeEnum;
  onClose: () => void;
  onAdd?: (data: T) => void;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  onAddChild?: (data: IFundCategory) => void;
  onEditChild?: (data: IFundCategory) => void;
  onDeleteChild?: (data: IFundCategory) => void;
  onSelect: (data: IFundCategory) => void;
}

/* =========================
  Component
========================= */

const ManagerModal = <T extends BaseItem>({
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
  onAddChild,
  onEditChild,
  onDeleteChild,
  onSelect,
}: ManagerModalProps<T>) => {
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>();
  const [editRow, setEditRow] = useState<RowItem<T> | null>(null);
  const [deleteRow, setDeleteRow] = useState<RowItem<T> | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [addingParentId, setAddingParentId] = useState<string | null>(null);

  const rules: Rule[] = [{ required: true, message: "Vui lòng không để trống" }];

  /* =========================
    Build rows
  ========================= */

  const rows = useMemo<RowItem<T>[]>(() => {
    const result: RowItem<T>[] = [];
    dataSource.forEach((parent) => {
      result.push({ type: "parent", data: parent });
      const categories = [...(parent.fundCategories || [])].sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
      );
      categories?.forEach((child) => {
        result.push({
          type: "child",
          data: child,
          parentId: parent.id,
        });
      });
    });
    return result;
  }, [dataSource]);

  /* =========================
    Effects
  ========================= */

  useEffect(() => {
    if (!open) return;
    setEditRow(null);
    setIsAdding(false);
    setAddingParentId(null);
    setOpenDeleteModal(false);
    addForm.resetFields();
    editForm.resetFields();
  }, [open]);

  useEffect(() => {
    if (!selectedValue) return;
    const index = rows.findIndex((r) => r.type === "child" && r.data.id === selectedValue);
    setSelectedRowIndex(index >= 0 ? index : undefined);
  }, [selectedValue, rows]);

  /* =========================
    Helpers
  ========================= */

  const renderInput = () =>
    dataType === "string" ? (
      <Input autoFocus className="h-8" />
    ) : (
      <InputNumber autoFocus className="w-full h-8" />
    );

  const isSelectDisabled =
    selectedRowIndex === undefined ||
    isAdding ||
    !!editRow ||
    rows[selectedRowIndex]?.type !== "child";

  /* =========================
    Handlers
  ========================= */

  const handleAdd = (value: any) => {
    const name = String(value.name || "").trim();
    if (!name || loading) return;

    if (addingParentId) {
      onAddChild?.({
        name,
        fundCategoryGroupId: addingParentId,
      } as IFundCategory);
    } else {
      onAdd?.({ name } as T);
    }

    setIsAdding(false);
    setAddingParentId(null);
    addForm.resetFields();
  };

  const handleEdit = (value: any) => {
    if (!editRow || loading) return;
    const name = String(value.name || "").trim();
    if (!name) return;

    if (editRow.type === "parent") {
      onEdit?.({ ...editRow.data, name });
    } else {
      onEditChild?.({
        ...editRow.data,
        name,
        fundCategoryGroupId: editRow.parentId,
      });
    }

    setEditRow(null);
  };

  const checkCanAdd = (isChild: boolean) => {
    if (isChild) return false;
    return !!onAddChild;
  };

  const checkCanEdit = (isChild: boolean) => {
    if (isChild) return !!onEditChild;
    return !!onEdit;
  };

  const checkCanDelete = (isChild: boolean) => {
    if (isChild) return !!onDeleteChild;
    return !!onDelete;
  };

  /* =========================
    Render
  ========================= */

  return (
    <Modal
      open={open}
      title={label}
      centered
      width={440}
      maskClosable={false}
      onCancel={onClose}
      footer={[
        <Button
          key="select"
          type="primary"
          className="w-full h-8"
          loading={loading}
          disabled={isSelectDisabled}
          onClick={() => {
            if (selectedRowIndex === undefined) return;
            const row = rows[selectedRowIndex];
            if (row.type === "child") onSelect(row.data);
          }}
        >
          Chọn
        </Button>,
      ]}
    >
      <div className="flex flex-col min-h-[420px]">
        <div className="flex flex-col max-h-[320px] overflow-y-auto scrollbar-hide mt-2">
          {rows.map((row, index) => {
            const isChild = row.type === "child";
            const data = row.data;

            return (
              <Fragment key={data.id}>
                <div
                  className={`flex items-center group relative ${isChild ? "cursor-pointer" : ""}`}
                  style={{ paddingLeft: isChild ? 16 : 0 }}
                  onClick={() => {
                    if (!isAdding && !editRow && isChild) {
                      setSelectedRowIndex(index);
                    }
                  }}
                >
                  {isChild && <Radio checked={selectedRowIndex === index} />}

                  {editRow?.data.id !== data.id ? (
                    <>
                      <div className="flex-1 ml-3 h-8 flex items-center">{data.name}</div>

                      <ActionButtons
                        addTitle={`Thêm hạng mục con cho "${data.name}"`}
                        editTitle={`Chỉnh sửa hạng mục "${data.name}"`}
                        deleteTitle={`Xóa hạng mục "${data.name}"`}
                        onAdd={
                          checkCanAdd(isChild)
                            ? () => {
                                setIsAdding(true);
                                setAddingParentId(data.id);
                                addForm.setFieldsValue({
                                  parentId: data.id,
                                });
                              }
                            : undefined
                        }
                        onEdit={
                          !data.isDefault && checkCanEdit(isChild)
                            ? () => {
                                setEditRow(row);
                                editForm.setFieldsValue({ name: data.name });
                              }
                            : undefined
                        }
                        onDelete={
                          !data.isDefault && checkCanDelete(isChild)
                            ? () => {
                                setDeleteRow(row);
                                setOpenDeleteModal(true);
                              }
                            : undefined
                        }
                      />
                    </>
                  ) : (
                    <Form form={editForm} onFinish={handleEdit} className="flex-1 flex">
                      <Form.Item name="name" rules={rules} noStyle>
                        {renderInput()}
                      </Form.Item>

                      <div className="flex ml-2">
                        <button type="submit" className="text-green-500">
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="text-red-500 ml-2"
                          onClick={() => setEditRow(null)}
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </Form>
                  )}
                </div>

                {isAdding && addingParentId === data.id && row.type === "parent" && (
                  <div className="flex items-center py-2 pl-4">
                    <Radio checked />

                    <Form form={addForm} onFinish={handleAdd} className="flex-1 flex ml-2">
                      <Form.Item name="name" rules={rules} noStyle>
                        {renderInput()}
                      </Form.Item>

                      <div className="flex ml-2">
                        <button type="submit" className="text-green-500">
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="text-red-500 ml-2"
                          onClick={() => {
                            setIsAdding(false);
                            setAddingParentId(null);
                            addForm.resetFields();
                          }}
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </Form>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {onAdd &&
          addingParentId === null &&
          (isAdding ? (
            <div className="flex mb-4 mt-2 items-center">
              <Radio checked />
              <Form form={addForm} onFinish={handleAdd} className="flex-1 flex">
                <Form.Item name="name" rules={rules} noStyle>
                  {renderInput()}
                </Form.Item>
                <div className="flex ml-2">
                  <button type="submit" className="text-green-500">
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={() => setIsAdding(false)}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </Form>
            </div>
          ) : (
            <Button
              loading={loading}
              className="w-32 h-8 mt-2"
              onClick={() => {
                setIsAdding(true);
                setAddingParentId(null);
              }}
            >
              <PlusOutlined /> Thêm mới
            </Button>
          ))}
      </div>

      <ModalDelete
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        accept={() => {
          if (!deleteRow) return;
          deleteRow.type === "parent"
            ? onDelete?.(deleteRow.data)
            : onDeleteChild?.(deleteRow.data);
          setDeleteRow(null);
        }}
      />
    </Modal>
  );
};

export default ManagerModal;
