import React from "react";
import { Form, Input, Row, Col } from "antd";
import { Label } from "@/shared";
import { AppDatePicker } from "@/shared";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { WarehouseSelect } from "@/modules/warehouse/components";
import { OrderSelect } from "@/modules/order/components/Select";
import { randomId } from "@/shared/utils/common.util";

interface Props {
  form: any;
  editData?: any;
}

export const BodyOrderIssue: React.FC<Props> = ({ form, editData }) => {
  const order = Form.useWatch("order", form);
  const partner = Form.useWatch("partner", form);
  const disabled = !!editData;

  return (
    <div className="px-6 pt-4">
      <Row gutter={[32, 16]}>
        <Col span={8}>
          <Form.Item name="code" label={<Label title="Số phiếu" required />}>
            <Input placeholder="Tự động tạo nếu để trống khi lưu" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="effectiveDate" label={<Label title="Ngày dự kiến xuất" required />}>
            <AppDatePicker onlyDate />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="note" label={<Label title="Ghi chú" />}>
            <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="orderId" label={<Label title="Đơn bán hàng" />}>
            <OrderSelect
              defaultData={order}
              placeholder="Chọn đơn bán hàng"
              onChangeData={(value) => {
                form.setFieldValue("order", value);
                form.setFieldValue("orderId", value?.id || null);
                const customer = value?.customer;
                form.setFieldValue("partnerId", customer?.id || null);
                form.setFieldValue("partner", customer || null);
                form.setFieldValue(
                  "partnerSnapshot",
                  customer
                    ? {
                        id: customer.id,
                        name: customer.name,
                        code: customer.code,
                        taxCode: customer.taxCode,
                        types: customer.types,
                        email: customer.email,
                        phone: customer.phone,
                        address: customer.address,
                      }
                    : null,
                );
                if (value?.lines) {
                  form.setFieldValue(
                    "lines",
                    value.lines.map((l: any) => ({
                      tempId: randomId(),
                      orderLineId: l.id,
                      productId: l.productId,
                      productSnapshot: l.productSnapshot,
                      product: l.product,
                      unitId: l.unitId,
                      unitSnapshot: l.unitSnapshot,
                      conversionRateAtTime: 1,
                      requestQuantity: l.quantity || 0,
                      stockQuantity: 0,
                      additionalQuantity: 0,
                      billingQuantity: 0,
                    })),
                  );
                }
              }}
            />
          </Form.Item>
          <Form.Item name="order" hidden />
        </Col>
        <Col span={8}>
          <Form.Item name="partnerId" label={<Label title="Khách hàng" />}>
            <PartnerSelect
              defaultData={partner}
              query={{ types: [PartnerType.CUSTOMER] }}
              disabled={disabled}
              onChangeData={(value) =>
                form.setFieldValue(
                  "partnerSnapshot",
                  value
                    ? {
                        id: value.id,
                        name: value.name,
                        code: value.code,
                        taxCode: value.taxCode,
                        types: value.types,
                        email: value.email,
                        phone: value.phone,
                        address: value.address,
                      }
                    : null,
                )
              }
            />
          </Form.Item>
          <Form.Item name="partner" hidden />
          <Form.Item name="partnerSnapshot" hidden />
        </Col>
        <Col span={8}>
          <Form.Item name="warehouseId" label={<Label title="Kho xuất" />}>
            <WarehouseSelect />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={["representative", "name"]} label={<Label title="Đại diện nhận hàng" />}>
            <Input placeholder="Tên người đại diện" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="vehicleType" label={<Label title="Loại phương tiện" />}>
            <Input placeholder="Nhập loại xe" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="vehiclePlate" label={<Label title="Biển số xe" />}>
            <Input placeholder="Nhập biển số" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
