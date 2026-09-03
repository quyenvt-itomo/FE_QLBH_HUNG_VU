import React from "react";
import { Col, Form, FormInstance, Input, Radio, Row } from "antd";
import { AttributeManagerSelect } from "@/modules/attribute/components/Select";
import { Label, PhoneInput, ProvinceSelect, WardSelect } from "@/shared/components";
import { getPhoneRules } from "@/shared/constants/formItemRule";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";
import { Partner, PartnerType, partnerTypeMap } from "../../partner.model";
import { groupTypeMap } from "./form.constants";

export const AddressFields: React.FC<{
  form: FormInstance<Partner>;
}> = ({ form }) => {
  const addressState = Form.useWatch(["address", "state"], form);
  const { provinceOptions, wardOptions } = useAddressSelector(addressState);

  return (
    <Row gutter={[64, 0]}>
      <Col xs={24} md={12}>
        <Form.Item name={["address", "state"]} label="Tỉnh/thành phố">
          <ProvinceSelect
            options={provinceOptions}
            onChange={() => form.setFieldValue(["address", "ward"], undefined)}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name={["address", "ward"]} label="Phường/xã">
          <WardSelect options={wardOptions} />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item name={["address", "detail"]} label="Địa chỉ chi tiết">
          <Input placeholder="Số nhà, đường..." />
        </Form.Item>
      </Col>
    </Row>
  );
};

export const RepresentativeFields: React.FC = () => (
  <Row gutter={[64, 0]}>
    <Col xs={24} lg={12}>
      <Form.Item name={["representative", "name"]} label={<Label title="Họ và tên" width={140} />}>
        <Input />
      </Form.Item>
    </Col>
    <Col xs={24} lg={12}>
      <Form.Item
        name={["representative", "identityCode"]}
        label={<Label title="CCCD/CMND" width={140} />}
      >
        <Input maxLength={20} />
      </Form.Item>
    </Col>
    <Col xs={24} lg={12}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={["representative", "identityCode"]} label={<Label title="CMND/CCCD" />}>
            <Input placeholder="Nhập CMND/CCCD" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={["representative", "phone"]}
            label={<Label title="Số điện thoại" width={140} />}
            rules={getPhoneRules()}
          >
            <PhoneInput />
          </Form.Item>
        </Col>
      </Row>
    </Col>
    <Col xs={24} lg={12}>
      <Form.Item
        name={["representative", "email"]}
        label={<Label title="Email" width={140} />}
        rules={[{ type: "email", message: "Email không hợp lệ" }]}
      >
        <Input />
      </Form.Item>
    </Col>
  </Row>
);
