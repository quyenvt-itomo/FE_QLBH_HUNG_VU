import React, { useEffect, useMemo, useState } from "react";
import Title from "../../../../../components/display/Title";
import { Button, Form, Input, message, App, Table, TableProps, Tag } from "antd";
import { PartialProps } from "../../DetailPage";
import { usePageState } from "../../../../../hooks/core/usePageState";
import { IAttribute } from "../../../../../models/base/attribute";
import { IProductOption } from "../../../../../models/product";
import { useProductOptionData } from "../../../../../hooks/product/useProductOptionData";
import { randomId } from "../../../../../utils/common";
import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "../../../../../constants/UI";
import AttributeSelect from "../../../../../components/manager_select/AttributeSelect";
import { AttributeTypeEnum } from "../../../../../constants/enum";
import { PlusOutlined } from "@ant-design/icons";

interface DataType {
  id: string;
  type: IAttribute;
  typeId: string;
  typeIndex: number;
  options: IProductOption[];
}

export const OptionInfo: React.FC<PartialProps> = ({ data, onReload }) => {
  if (!data) return <></>;
  const { modal } = App.useApp();
  const { open, setOpen, rowData, setRowData, dataSource, setDataSource } =
    usePageState<DataType>();
  const [form] = Form.useForm();
  const values: string[] = Form.useWatch("values", form) || [];

  const [newValue, setNewValue] = useState("");
  const [editValue, setEditValue] = useState("");

  const {
    loading,
    addProductOption,
    addManyProductOption,
    deleteProductOption,
    deleteManyProductOption,
  } = useProductOptionData({
    productId: data?.id,
    onCloseModal: () => {
      onReload?.();
      form.resetFields();
      setEditValue("");
      setOpen(false);
    },
  });

  // Dùng useMemo để tránh tính toán lại formatted data mỗi render
  const formattedData = useMemo(() => {
    const group: Record<string, DataType> = {};

    data?.options?.forEach((op) => {
      if (!group[op.typeId] && op.type) {
        group[op.typeId] = {
          id: op.typeId,
          typeId: op.typeId,
          type: op.type,
          typeIndex: op.typeIndex,
          options: [],
        };
      }
      if (group[op.typeId]) {
        group[op.typeId].options.push(op);
      }
    });

    return Object.values(group);
  }, [data]);

  // Update dataSource khi formattedData thay đổi
  useEffect(() => {
    setDataSource(formattedData);
  }, [formattedData, setDataSource]);

  const handleDelete = (option: IProductOption) => {
    if (!deleteProductOption) return;
    modal.confirm({
      title: `Xoá thuộc tính ${option.type?.name}: ${option.value} khỏi sản phẩm?`,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      centered: true,
      onOk: () => {
        deleteProductOption(option.id);
      },
    });
  };

  const handleDeleteMany = (record: DataType) => {
    if (!deleteManyProductOption) return;
    modal.confirm({
      title: `Xoá thuộc tính ${record?.type?.name} khỏi sản phẩm?`,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      centered: true,
      onOk: () => {
        deleteManyProductOption(record.id);
      },
    });
  };

  const handleOpenAdd = () => {
    setRowData(undefined);
    setOpen(true);
  };

  const handleOpenEdit = (data: DataType) => {
    setRowData(data);
  };

  const handleCancelEdit = () => {
    setRowData(undefined);
  };

  const handleFinish = async (type: { typeId: string; values?: string[] }) => {
    try {
      if (!data?.id || !addManyProductOption) return;
      const { typeId, values = [] } = type;

      addManyProductOption({
        typeId,
        typeIndex: dataSource.length,
        values,
      });
    } catch (error) {
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
      console.log("handleFinish error:", error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setOpen(false);
    setRowData(undefined);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên phân loại",
      dataIndex: ["type", "name"],
      key: "typeName",
      width: "40%",
      ellipsis: true,
      render: (value: string) => <span className="px-3 py-px bg-slate-100 rounded">{value}</span>,
    },
    {
      title: "Giá trị",
      dataIndex: "options",
      key: "options",
      render: (values: DataType["options"], record) =>
        rowData?.id === record.id ? (
          <div
            className="border border-gray-300 rounded-lg px-2 min-h-8 w-full flex flex-wrap items-center
           hover:border-primary focus-within:border-primary focus-within:shadow-sm transition-all"
          >
            {values?.map((value) => (
              <Tag
                key={value.id}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleDelete(value);
                }}
                className="mb-0"
              >
                {value?.value}
              </Tag>
            ))}
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={values.length === 0 ? "Nhập giá trị và nhấn Enter" : ""}
              onKeyDown={(e) => {
                if (e.key === "Enter" && editValue.trim() && addProductOption) {
                  e.preventDefault();
                  e.stopPropagation();

                  const id = randomId();
                  addProductOption({
                    typeId: record.typeId,
                    value: editValue.trim(),
                    typeIndex: record.typeIndex,
                    id,
                    tempId: id,
                  });

                  setEditValue(""); // ✅ clear đúng
                }
              }}
              className="flex-1 border-none shadow-none outline-none focus:shadow-none min-w-[100px] px-0"
              variant="borderless"
            />
          </div>
        ) : (
          <div className="!h-8 px-3 flex items-center">
            <span className="block truncate">
              {values?.map((option) => option.value).join(", ")}
            </span>
          </div>
        ),
    },
  ];

  if (addManyProductOption || deleteManyProductOption) {
    columns.push({
      title: "",
      key: "action",
      width: 80,
      render: (_, record) =>
        rowData?.id === record.id ? (
          <div className="flex flex-shrink-0 justify-end px-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center justify-center p-0 ml-2 text-green-400 hover:text-green-600 transition-colors ease-in-out"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center justify-center p-0 ml-2 text-red-400 hover:text-red-600 transition-colors ease-in-out"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-shrink-0 justify-end px-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEdit(record);
              }}
              className="flex items-center justify-center p-0 ml-2 text-blue-400 hover:text-blue-600 transition-colors ease-in-out"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMany(record);
              }}
              className="flex items-center justify-center p-0 ml-2 text-red-400 hover:text-red-600 transition-colors ease-in-out"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ),
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4 pt-6">
        <div className="w-[174px]">
          <Title content="Quy cách & phân loại" />
        </div>
      </div>

      <div className="flex flex-col w-full">
        <Table<DataType>
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          className={CLASSNAME.detail_table}
          pagination={false}
          loading={loading}
        />

        {addManyProductOption &&
          (open ? (
            <Form form={form} onFinish={handleFinish} layout="inline" className="w-full">
              <div className="flex items-center w-full">
                <div className="w-2/5 flex-shrink-0">
                  <Form.Item
                    name="typeId"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phân loại",
                      },
                    ]}
                    noStyle
                  >
                    <AttributeSelect type={AttributeTypeEnum.PRODUCT_TYPE} />
                  </Form.Item>
                </div>
                <Form.Item name="values" hidden />
                <div className="w-[calc(60%-80px)] border border-gray-300 rounded-lg px-2 py-1 min-h-[36px] flex flex-wrap items-center hover:border-primary focus-within:border-primary focus-within:shadow-sm transition-all">
                  {values.map((value: string, idx: number) => (
                    <Tag
                      key={idx}
                      closable
                      onClose={(e) => {
                        e.preventDefault();
                        const newValues = values.filter((v) => v !== value);
                        form.setFieldValue("values", newValues);
                      }}
                      className="mb-0"
                    >
                      {value}
                    </Tag>
                  ))}
                  <Input
                    placeholder={values.length === 0 ? "Nhập giá trị và nhấn Enter" : ""}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        if (newValue && !values.includes(newValue) && data) {
                          const newValues = [...values, newValue];
                          form.setFieldValue("values", newValues);
                        }
                        setNewValue("");
                      }
                    }}
                    className="flex-1 border-none shadow-none outline-none focus:shadow-none min-w-[100px] px-0 h-6"
                    variant="borderless"
                  />
                </div>
                <div className="flex flex-shrink-0 justify-end px-2 w-20">
                  <button
                    type="submit"
                    className="flex items-center justify-center p-0 ml-2 text-green-400 hover:text-green-600 transition-colors ease-in-out"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex items-center justify-center p-0 ml-2 text-red-400 hover:text-red-600 transition-colors ease-in-out"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Form>
          ) : (
            <Button
              type="link"
              onClick={handleOpenAdd}
              icon={<PlusOutlined />}
              className="self-start px-3"
            >
              Thêm phân loại
            </Button>
          ))}
      </div>
    </div>
  );
};
