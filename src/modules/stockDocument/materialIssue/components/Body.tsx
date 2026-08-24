import React from "react";
import { Form, Input, Row, Col } from "antd";
import { Label } from "@/shared";
import { AppDatePicker } from "@/shared";
import { WarehouseSelect } from "@/modules/warehouse/components";
import { ProductionSelect } from "@/modules/production/components/Select";
import { EmployeeSelect } from "@/modules/employee";

interface Props {
  form: any;
  editData?: any;
}

export const BodyMaterialIssue: React.FC<Props> = ({ form }) => {
  const production = Form.useWatch("production", form);
  const receiver = Form.useWatch("receiver", form);

  return (
    <div className="px-6 pt-4">
      <Row gutter={[32, 16]}>
        <Col span={8}>
          <Form.Item name="code" label={<Label title="Số phiếu" required />}>
            <Input placeholder="Tự động tạo nếu để trống khi lưu" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="effectiveDate" label={<Label title="Ngày xuất kho" required />}>
            <AppDatePicker onlyDate />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="note" label={<Label title="Ghi chú" />}>
            <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="productionId" label={<Label title="Lệnh sản xuất" />}>
            <ProductionSelect
              defaultData={production}
              placeholder="Chọn lệnh sản xuất"
              onChangeData={(value) => {
                form.setFieldValue("production", value);
                form.setFieldValue("productionId", value?.id || null);
                form.setFieldValue(
                  "productionSnapshot",
                  value ? { id: value.id, code: value.code, timeAt: value.timeAt } : null,
                );
              }}
            />
          </Form.Item>
          <Form.Item name="production" hidden />
          <Form.Item name="productionSnapshot" hidden />
        </Col>
        <Col span={8}>
          <Form.Item name="warehouseId" label={<Label title="Kho xuất" />}>
            <WarehouseSelect />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="receiverId" label={<Label title="Đại diện nhận hàng" />}>
            <EmployeeSelect
              defaultData={receiver}
              onChangeData={(value) => {
                form.setFieldValue("receiver", value);
                form.setFieldValue("receiverId", value?.id || null);
              }}
            />
          </Form.Item>
          <Form.Item name="receiver" hidden />
          <Form.Item name="receiverId" hidden />
        </Col>
      </Row>
    </div>
  );
};
