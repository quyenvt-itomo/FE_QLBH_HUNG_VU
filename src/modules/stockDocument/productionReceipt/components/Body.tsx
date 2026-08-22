import React from "react";
import { Form, Input, Row, Col } from "antd";
import Label from "@/shared/components/display/Label";
import { AppDatePicker } from "@/shared/components/input/AppDatePicker";
import { WarehouseSelect } from "@/modules/warehouse/components";
import { ProductionSelect } from "@/modules/production/components/Select";
import { EmployeeSelect } from "@/modules/employee";

interface Props {
  form: any;
  editData?: any;
}

export const BodyProductionReceipt: React.FC<Props> = ({ form }) => {
  const production = Form.useWatch("production", form);
  const deliverer = Form.useWatch("deliverer", form);

  return (
    <div className="px-6 pt-4">
      <Row gutter={[32, 16]}>
        <Col span={8}>
          <Form.Item name="code" label={<Label title="Số phiếu" required />}>
            <Input placeholder="Tự động tạo nếu để trống khi lưu" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="effectiveDate" label={<Label title="Ngày nhập kho" required />}>
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
          <Form.Item name="warehouseId" label={<Label title="Kho nhận" />}>
            <WarehouseSelect />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="delivererId" label={<Label title="Đại diện giao hàng" />}>
            <EmployeeSelect
              defaultData={deliverer}
              onChangeData={(value) => {
                form.setFieldValue("deliverer", value);
                form.setFieldValue("delivererId", value?.id || null);
              }}
            />
          </Form.Item>
          <Form.Item name="deliverer" hidden />
          <Form.Item name="delivererId" hidden />
        </Col>
      </Row>
    </div>
  );
};
