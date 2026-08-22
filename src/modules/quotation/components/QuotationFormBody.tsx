import React from "react";
import { Input, Form, Row, Col, Select } from "antd";
import Label from "@/shared/components/display/Label";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { QuotationRequestSelect } from "@/modules/quotationRequest";
import { generateDefaultQuotationByRequest } from "@/modules/quotationRequest/quotationRequest.utils";
import { randomId } from "@/shared/utils/common.util";
import { PartialProps } from "./AddUpdateQuotationModal";
import { AddressInput } from "@/shared/components/input/AddressInput";
import { AppDatePicker } from "@/shared/components/input/AppDatePicker";
import { AppSelect } from "@/shared/components/select/AppSelect";
import { ApproveStatus } from "@/modules/shared/business.model";
import { EmployeeSelect } from "@/modules/employee";

export const QuotationFormBody: React.FC<PartialProps> = ({ form }) => {
  const customer = Form.useWatch("customer", form);
  const quotationRequest = Form.useWatch("quotationRequest", form);
  const meshSpec = Form.useWatch("meshSpec", form);
  const staff = Form.useWatch("staff", form);

  const handleClearData = (withQuotationRequest?: boolean) => {
    form.setFieldsValue({
      meshSpecId: undefined,
      meshSpec: undefined,

      lines: [],
      commissions: [],
    });

    if (withQuotationRequest) {
      form.setFieldsValue({
        quotationRequestId: undefined,
        quotationRequest: undefined,
      });
    }
  };

  return (
    <Row gutter={96}>
      {/* ===== CỘT 1: Yêu cầu BG, Khách hàng, MST, Bảng LTH ===== */}
      <Col span={10}>
        <Form.Item
          name="customerId"
          label={<Label width={132} title="Khách hàng" required />}
          rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
        >
          <PartnerSelect
            query={{ type: PartnerType.CUSTOMER }}
            defaultData={customer}
            onChangeData={(val) => {
              form.setFieldValue("customer", val);
              handleClearData(true);
            }}
          />
        </Form.Item>
        <Form.Item name="customer" hidden />
        <Form.Item name={["customer", "address"]} label={<Label width={132} title="Địa chỉ" />}>
          <AddressInput disabled />
        </Form.Item>

        <Form.Item name="quotationRequestId" label={<Label width={132} title="Đề nghị báo giá" />}>
          <QuotationRequestSelect
            defaultData={quotationRequest}
            query={{ customerId: customer?.id, approveStatus: ApproveStatus.APPROVED }}
            onChangeData={(data) => {
              form.setFieldValue("quotationRequest", data);

              if (!data) {
                handleClearData();
                return;
              }

              form.setFieldValue("customerId", data.customerId);
              form.setFieldValue("customer", data.customer);

              // Đổ dữ liệu mặc định từ đề nghị báo giá (KHÔNG clear lines/commissions)
              const defaultQuotation = generateDefaultQuotationByRequest(data);
              const defaultLines = (defaultQuotation.lines as any[]) || [];
              if (defaultLines.length) {
                form.setFieldValue("lines", defaultLines);
              }
              const defaultCommissions = (defaultQuotation.commissions as any[]) || [];
              if (defaultCommissions.length) {
                form.setFieldValue(
                  "commissions",
                  defaultCommissions.map((c: any) => ({ ...c, tempId: randomId() })),
                );
              }

              // Reset bảng thông số LTH (không đụng lines/commissions)
              form.setFieldValue("meshSpecId", undefined);
              form.setFieldValue("meshSpec", undefined);
            }}
          />
        </Form.Item>
        <Form.Item name="quotationRequest" hidden />

        <Form.Item name="meshSpecId" label={<Label width={132} title="Bảng thông số LTH" />}>
          <AppSelect allowClear placeholder="Chọn bảng thông số LTH" options={[]} />
        </Form.Item>

        <Form.Item name="note" label={<Label width={132} title="Ghi chú" />}>
          <Input />
        </Form.Item>
      </Col>

      {/* ===== CỘT 2: Người đại diện của khách hàng ===== */}
      <Col span={7}>
        <Form.Item name={["customer", "code"]} label={<Label width={132} title="Mã khách hàng" />}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name={["customer", "taxCode"]}
          label={<Label width={132} title="MST khách hàng" />}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name={["customer", "representative", "name"]}
          label={<Label width={132} title="Người đại diện" />}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name={["customer", "representative", "phone"]}
          label={<Label width={132} title="Số điện thoại" />}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name={["customer", "representative", "email"]}
          label={<Label width={132} title="Email" />}
        >
          <Input disabled />
        </Form.Item>
      </Col>

      {/* ===== CỘT 3: Số BG, Ngày, NV, Hiệu lực, Ghi chú ===== */}
      <Col span={7}>
        <Form.Item name="code" label={<Label width={132} title="Số đơn hàng" />}>
          <Input placeholder="Tự động tạo nếu để trống khi lưu" />
        </Form.Item>
        <Form.Item
          name="timeAt"
          label={<Label width={132} title="Ngày báo giá" required />}
          rules={[{ required: true, message: "Vui lòng chọn ngày báo giá" }]}
        >
          <AppDatePicker />
        </Form.Item>
        <Form.Item name="validUntil" label={<Label width={132} title="Hiệu lực đến" />}>
          <AppDatePicker />
        </Form.Item>
        <Form.Item
          name="staffId"
          label={<Label width={132} title="Người phụ trách" required />}
          rules={[{ required: true, message: "Vui lòng chọn người phụ trách" }]}
        >
          <EmployeeSelect
            defaultData={staff}
            onChangeData={(data) => {
              form.setFieldValue("staff", data);
            }}
          />
        </Form.Item>
        <Form.Item name="staff" hidden />
        <Form.Item name={["staff", "code"]} label={<Label width={132} title="Mã NV" />}>
          <Input disabled />
        </Form.Item>
      </Col>
    </Row>
  );
};
