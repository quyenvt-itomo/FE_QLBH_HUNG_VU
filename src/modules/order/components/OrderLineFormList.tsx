import React from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { FormListTable, FormColumn } from "@/shared/components";

interface Props {
  form: any;
  products: any[];
}

export const OrderLineFormList: React.FC<Props> = ({ form, products }) => {
  const lines = Form.useWatch("lines", form) || [];
  const columns: FormColumn[] = [
    {
      title: "Hàng hóa",
      dataIndex: "productId",
      width: 200,
      editable: true,
      render: () => (
        <Select
          showSearch
          options={products.map((p: any) => ({ value: p.id, label: p.code + " - " + p.name }))}
          placeholder="Ch?n hàng hóa"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "ÐVT",
      dataIndex: "unitId",
      width: 100,
      editable: true,
      render: () => <Select options={[]} style={{ width: "100%" }} />,
    },
    {
      title: "SL",
      dataIndex: "quantity",
      width: 100,
      align: "right",
      editable: true,
      render: () => <InputNumber min={1} style={{ width: "100%" }} />,
    },
    {
      title: "Ðõn giá",
      dataIndex: "unitPrice",
      width: 130,
      align: "right",
      editable: true,
      render: () => <InputNumber min={0} style={{ width: "100%" }} />,
    },
    {
      title: "Thành ti?n",
      dataIndex: "subTotal",
      width: 130,
      align: "right",
      render: ({ record }) => ((record.quantity || 0) * (record.unitPrice || 0)).toLocaleString(),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 150,
      editable: true,
      render: () => <Input placeholder="Ghi chú" />,
    },
  ];
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Danh sách hàng hóa</h3>
      <FormListTable form={form} fieldName="lines" columns={columns} records={lines} showDelete />
    </div>
  );
};
