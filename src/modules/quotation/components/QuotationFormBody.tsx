import React from "react";
import { Input, Form, Row, Col, Select } from "antd";
import { Label } from "@/shared";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { QuotationRequestSelect } from "@/modules/quotationRequest";
import { generateDefaultQuotationByRequest } from "@/modules/quotationRequest/quotationRequest.utils";
import { randomId } from "@/shared/utils/common.util";
import { PartialProps } from "./AddUpdateQuotationModal";
import { AddressInput } from "@/shared";
import { AppDatePicker } from "@/shared";
import { AppSelect } from "@/shared";
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
      {/* ===== C?T 1: Yêu c?u BG, Khách hàng, MST, B?ng LTH ===== */}
      <Col span={10}>
        <Form.Item
          name="customerId"
          label={<Label width={132} title="Khách hàng" required />}
          rules={[{ required: true, message: "Vui l?ng ch?n khách hàng" }]}
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
        <Form.Item name={["customer", "address"]} label={<Label width={132} title="Ð?a ch?" />}>
          <AddressInput disabled />
        </Form.Item>

        <Form.Item name="quotationRequestId" label={<Label width={132} title="Ð? ngh? báo giá" />}>
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

              // Ð? d? li?u m?c ð?nh t? ð? ngh? báo giá (KHÔNG clear lines/commissions)
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

              // Reset b?ng thông s? LTH (không ð?ng lines/commissions)
              form.setFieldValue("meshSpecId", undefined);
              form.setFieldValue("meshSpec", undefined);
            }}
          />
        </Form.Item>
        <Form.Item name="quotationRequest" hidden />

        <Form.Item name="meshSpecId" label={<Label width={132} title="B?ng thông s? LTH" />}>
          <AppSelect allowClear placeholder="Ch?n b?ng thông s? LTH" options={[]} />
        </Form.Item>

        <Form.Item name="note" label={<Label width={132} title="Ghi chú" />}>
          <Input />
        </Form.Item>
      </Col>

      {/* ===== C?T 2: Ngý?i ð?i di?n c?a khách hàng ===== */}
      <Col span={7}>
        <Form.Item name={["customer", "code"]} label={<Label width={132} title="M? khách hàng" />}>
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
          label={<Label width={132} title="Ngý?i ð?i di?n" />}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name={["customer", "representative", "phone"]}
          label={<Label width={132} title="S? ði?n tho?i" />}
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

      {/* ===== C?T 3: S? BG, Ngày, NV, Hi?u l?c, Ghi chú ===== */}
      <Col span={7}>
        <Form.Item name="code" label={<Label width={132} title="S? ðõn hàng" />}>
          <Input placeholder="T? ð?ng t?o n?u ð? tr?ng khi lýu" />
        </Form.Item>
        <Form.Item
          name="timeAt"
          label={<Label width={132} title="Ngày báo giá" required />}
          rules={[{ required: true, message: "Vui l?ng ch?n ngày báo giá" }]}
        >
          <AppDatePicker />
        </Form.Item>
        <Form.Item name="validUntil" label={<Label width={132} title="Hi?u l?c ð?n" />}>
          <AppDatePicker />
        </Form.Item>
        <Form.Item
          name="staffId"
          label={<Label width={132} title="Ngý?i ph? trách" required />}
          rules={[{ required: true, message: "Vui l?ng ch?n ngý?i ph? trách" }]}
        >
          <EmployeeSelect
            defaultData={staff}
            onChangeData={(data) => {
              form.setFieldValue("staff", data);
            }}
          />
        </Form.Item>
        <Form.Item name="staff" hidden />
        <Form.Item name={["staff", "code"]} label={<Label width={132} title="M? NV" />}>
          <Input disabled />
        </Form.Item>
      </Col>
    </Row>
  );
};
