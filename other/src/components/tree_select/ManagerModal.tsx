import { Button, Form, Input, InputNumber, Modal, Radio } from "antd";
import { useEffect, useMemo, useState, Fragment } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusOutlined } from "@ant-design/icons";
import ModalDelete from "../modal/ModalDelete";
import ActionButtons from "../button/ActionButtons";
import { Rule } from "antd/es/form";
import { ManagerModalProps } from "../../models/base/interface";

/* =========================
  Types
========================= */
type BaseItem = {
  id: string;
  name: string;
  parentId?: string | null;
  isDefault?: boolean;
};

/* =========================
  ManagerModal
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
  onSelect,
}: ManagerModalProps<T>) => {
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>();
  const [editData, setEditData] = useState<T | null>(null);
  const [deleteData, setDeleteData] = useState<T | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // add-inline state
  const [isAdding, setIsAdding] = useState(false);
  const [addingParentId, setAddingParentId] = useState<string | null>(null);

  const rules: Rule[] = [{ required: true, message: "Vui lòng không để trống" }];

  /* =========================
    Sort parent → children (multi-level)
  ========================= */
  const sortedData = useMemo(() => {
    const childrenMap = new Map<string, T[]>();

    dataSource.forEach((item) => {
      if (item.parentId) {
        if (!childrenMap.has(item.parentId)) {
          childrenMap.set(item.parentId, []);
        }
        childrenMap.get(item.parentId)!.push(item);
      }
    });

    const result: Array<T & { level: number }> = [];

    const flatten = (items: T[], level: number) => {
      items.forEach((item) => {
        result.push({ ...item, level });
        const children = childrenMap.get(item.id) || [];
        if (children.length > 0) {
          flatten(children, level + 1);
        }
      });
    };

    const rootItems = dataSource.filter((i) => !i.parentId);
    flatten(rootItems, 0);

    return result;
  }, [dataSource]);

  /* =========================
    Effects
  ========================= */
  useEffect(() => {
    if (!open) return;
    setEditData(null);
    setIsAdding(false);
    setAddingParentId(null);
    setOpenDeleteModal(false);
    addForm.resetFields();
    editForm.resetFields();
  }, [open, dataSource]);

  useEffect(() => {
    if (!selectedValue) return;
    const index = sortedData.findIndex((i) => i.id === selectedValue);
    setSelectedRowIndex(index);
  }, [selectedValue, sortedData]);

  /* =========================
    Handlers
  ========================= */
  const handleAdd = (value: any) => {
    const name = String(value.name || "").trim();
    if (!name || loading) return;

    onAdd?.({
      name,
      parentId: value.parentId ?? null,
    } as any);

    setIsAdding(false);
    setAddingParentId(null);
    addForm.resetFields();
  };

  const handleEdit = (value: any) => {
    if (!editData || loading) return;
    const name = String(value.name || "").trim();
    if (!name) return;

    onEdit?.({
      id: editData.id,
      name,
    } as any);

    setEditData(null);
  };

  const renderInput = () =>
    dataType === "string" ? <Input autoFocus /> : <InputNumber autoFocus className="w-full" />;

  const isSelectDisabled = selectedRowIndex === undefined || isAdding || !!editData;

  /* =========================
    Render
  ========================= */
  return (
    <Modal
      open={open}
      title={label}
      centered
      width={540}
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
            onSelect(sortedData[selectedRowIndex]);
          }}
        >
          Chọn
        </Button>,
      ]}
    >
      <div className="flex flex-col min-h-[620px] mt-4">
        <div className="flex flex-col max-h-[560px] overflow-y-auto">
          {sortedData.map((item, index) => {
            const level = (item as any).level || 0;
            const paddingLeft = level * 24;

            return (
              <Fragment key={item.id}>
                {/* ===== ITEM ROW ===== */}
                <div
                  className="flex items-center py-2 cursor-pointer group relative"
                  style={{ paddingLeft }}
                  onClick={() => {
                    if (!isAdding && !editData) {
                      setSelectedRowIndex(index);
                    }
                  }}
                >
                  <Radio checked={selectedRowIndex === index && !isAdding} />

                  {editData?.id !== item.id ? (
                    <>
                      <div className="flex-1 ml-2 h-8 flex items-center">{item.name}</div>

                      {!item.isDefault && (
                        <ActionButtons
                          onAdd={
                            onAdd
                              ? () => {
                                  setIsAdding(true);
                                  setAddingParentId(item.id);
                                  addForm.setFieldsValue({
                                    parentId: item.id,
                                  });
                                }
                              : undefined
                          }
                          onEdit={
                            onEdit
                              ? () => {
                                  setEditData(item);
                                  editForm.setFieldsValue({
                                    name: item.name,
                                  });
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
                    <Form form={editForm} onFinish={handleEdit} className="flex-1 flex ml-2">
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
                          onClick={() => setEditData(null)}
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </Form>
                  )}
                </div>

                {/* ===== ADD CHILD INLINE ===== */}
                {isAdding && addingParentId === item.id && (
                  <div className="flex items-center py-2" style={{ paddingLeft: paddingLeft + 16 }}>
                    <Radio checked />

                    <Form form={addForm} onFinish={handleAdd} className="flex-1 flex ml-2">
                      <Form.Item name="name" rules={rules} noStyle>
                        {renderInput()}
                      </Form.Item>

                      <Form.Item name="parentId" hidden />

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

        {/* ===== ADD ROOT ===== */}
        {onAdd &&
          addingParentId === null &&
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
                  {renderInput()}
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
              onClick={() => {
                setIsAdding(true);
                setAddingParentId(null);
                addForm.setFieldsValue({ parentId: null });
              }}
            >
              <PlusOutlined className="text-lg text-primary" />
              Thêm mới
            </Button>
          ))}
      </div>

      <ModalDelete
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        accept={() => {
          if (!deleteData) return;
          onDelete?.(deleteData);
          setDeleteData(null);
        }}
      />
    </Modal>
  );
};

export default ManagerModal;
