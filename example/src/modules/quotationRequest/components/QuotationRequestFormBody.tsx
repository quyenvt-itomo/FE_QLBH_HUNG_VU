import React from "react";
import { Form, Input, DatePicker } from "antd";
import { QuotationRequest, QuotationRequestLine } from "../quotationRequest.model";
import { PartnerSelect } from "../../partner/components/Select";
import { EmployeeSelect } from "../../employee/components/Select";
import { ProductMultipleSelect } from "../../product/components/Select";
import { AttributeManagerSelect } from "../../attribute/components/Select";
import { AttributeType } from "../../attribute/attribute.enum";
import { FormListTable, FormColumn } from "@/shared/components/form/FormListTable";

interface Props {
  initialValues?: Partial<QuotationRequest>;
  onFinish: (values: any) => void;
  loading?: boolean;
}

export const QuotationRequestFormBody: React.FC<Props> = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();
  const lines: QuotationRequestLine[] = Form.useWatch("lines", form) || [];

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        timeAt: initialValues.timeAt ? new Date(initialValues.timeAt) : undefined,
      });
    }
  }, [initialValues, form]);

  const lineColumns: FormColumn<QuotationRequestLine>[] = [
    {
      title: "STT",
      dataIndex: "__idx",
      width: 50,
      render: ({ index }) => index + 1,
    },
    {
      title: "Hàng hóa",
      dataIndex: "productName",
      width: 200,
      render: ({ record }) => <span>{record?.productSnapshot?.name || "--"}</span>,
    },
    {
      title: "ĐVT",
      dataIndex: "unitId",
      width: 120,
      editable: true,
      render: () => <AttributeManagerSelect type={AttributeType.UNIT} placeholder="ĐVT" />,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 100,
      editable: true,
      rules: [{ required: true }],
      render: () => <Input type="number" min={0} placeholder="SL" />,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      editable: true,
      render: () => <Input placeholder="Ghi chú" />,
    },
  ];

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} disabled={loading}>
      <div className="grid grid-cols-3 gap-4">
        <Form.Item name="customerId" label="Khách hàng">
          <PartnerSelect placeholder="Chọn khách hàng" />
        </Form.Item>
        <Form.Item name="staffId" label="Người phụ trách">
          <EmployeeSelect placeholder="Chọn người phụ trách" />
        </Form.Item>
        <Form.Item name="timeAt" label="Ngày">
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>
      </div>

      <div className="mt-4">
        <FormListTable
          title="Danh sách hàng hóa"
          form={form}
          fieldName="lines"
          columns={lineColumns}
          records={lines}
          showDelete
          renderAdd={(add) => (
            <ProductMultipleSelect
              placeholder="Tìm kiếm và chọn hàng hóa để thêm"
              onChangeData={(data) => {
                const item = data?.[0];
                if (!item) return;
                add({
                  productId: item.id,
                  productSnapshot: item,
                  quantity: 1,
                });
              }}
            />
          )}
        />
      </div>
    </Form>
  );
};
