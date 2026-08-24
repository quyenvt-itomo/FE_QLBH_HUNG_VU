import React, { useEffect } from "react";
import { Col, Form, Input, Modal, Radio, Row, Switch } from "antd";
import type { FormProps } from "antd";

import { AttributeManagerSelect } from "@/modules/attribute/components/Select";
import { AttributeType } from "@/modules/attribute/attribute.enum";
import {
  FormSection,
  InputMoney,
  Label,
  ProvinceSelect,
  SubmitButton,
  WardSelect,
  PhoneInput,
} from "@/shared/components";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { getPhoneRules, getTaxCodeRules } from "@/shared/constants/formItemRule";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";

import { Partner, PartnerType, partnerTypeMap } from "../../partner.model";
import { BankList } from "./Bank";
import { ContactList } from "./Contact";

export interface PartialProps {
  form: ReturnType<typeof Form.useForm<Partner>>[0];
  editData?: Partner;
}

const groupTypeMap: Record<PartnerType, AttributeType> = {
  [PartnerType.CUSTOMER]: AttributeType.CUSTOMER_GROUP,
  [PartnerType.SUPPLIER]: AttributeType.SUPPLIER_GROUP,
  [PartnerType.SHIPPER]: AttributeType.SHIPPER_GROUP,
};

interface Props extends AddUpdateModalProps<Partner> {
  type: PartnerType;
}
export const PartnerAddUpdateModal: React.FC<Props> = ({
  open,
  editData,
  loading,
  errors,
  type,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<Partner>();
  const id = editData?.id || randomId();
  const text = partnerTypeMap[type].toLowerCase();
  const isOrganization = Form.useWatch("isOrganization", form) ?? true;
  const group = Form.useWatch("group", form);
  const addressState = Form.useWatch(["addresses", 0, "state"], form);
  const { provinceOptions, wardOptions } = useAddressSelector(addressState);

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Partner>["onFinish"] = (values) => {
    const payload: Partial<Partner> = {
      ...values,
      id,
      tempId: id,
      type,
    };

    editData ? onEdit?.(payload) : onAdd?.(payload);
  };

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center justify-between gap-4">
          <span>{`${editData ? "Cập nhật" : "Thêm mới"} ${text}`}</span>
          <SubmitButton
            loading={loading}
            onCancel={() => handleCloseWithPendingFiles(id, onClose)}
            onSubmit={() => form.submit()}
          />
        </div>
      }
      footer={null}
      width={980}
      centered
      maskClosable={false}
      closeIcon={null}
      destroyOnClose
      className="fullscreen-modal"
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields();
          return;
        }

        if (!editData) {
          form.setFieldsValue({
            isOrganization: false,
            addresses: [{}],
            banks: [],
            contacts: [],
          });
          return;
        }

        form.setFieldsValue(editData);
      }}
    >
      <Form<Partner>
        form={form}
        layout="vertical"
        autoComplete="off"
        className="flex h-[calc(100vh-110px)] flex-col overflow-y-auto scrollbar-hide"
        onFinish={onFinish}
      >
        <FormSection title="Thông tin chung">
          <Row gutter={[64, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="name"
                label={<Label title={`Tên ${text}`} width={140} required />}
                rules={[{ required: true, message: `Vui lòng nhập tên ${text}` }]}
              >
                <Input maxLength={255} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <div className="flex gap-4">
                <Form.Item
                  name="code"
                  className="w-[calc(50%-8px)]"
                  label={<Label title={`Mã ${text}`} width={140} />}
                >
                  <Input placeholder="Tự động" />
                </Form.Item>
                <Form.Item
                  name="isOrganization"
                  className="w-[calc(50%-8px)]"
                  label={<Label title="Phân loại đơn vị" width={140} />}
                >
                  <Radio.Group optionType="button" buttonStyle="solid" className="flex w-full">
                    <Radio.Button value={false} className="w-1/2 text-center">
                      Cá nhân
                    </Radio.Button>
                    <Radio.Button value={true} className="w-1/2 text-center">
                      Tổ chức
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="flex gap-4">
                <Form.Item
                  name="taxCode"
                  className="w-[calc(50%-8px)]"
                  label={<Label title="Mã số thuế" width={140} />}
                  rules={getTaxCodeRules()}
                >
                  <Input maxLength={13} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  className="w-[calc(50%-8px)]"
                  label={<Label title="Số điện thoại" width={140} />}
                  rules={getPhoneRules()}
                >
                  <PhoneInput />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="email"
                label={<Label title="Email" width={140} />}
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="groupId" label={<Label title={`Nhóm ${text}`} width={140} />}>
                <AttributeManagerSelect
                  type={groupTypeMap[type]}
                  defaultData={group}
                  onChangeData={(value) => form.setFieldValue("group", value)}
                />
              </Form.Item>
              <Form.Item name="group" hidden />
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="note" label={<Label title="Ghi chú" width={140} />}>
                <Input.TextArea rows={1} />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection title="Địa chỉ">
          <Row gutter={[64, 0]}>
            <Col xs={24} md={12}>
              <Form.Item name={["addresses", 0, "state"]} label="Tỉnh/thành phố">
                <ProvinceSelect
                  options={provinceOptions}
                  onChange={() => form.setFieldValue(["addresses", 0, "ward"], undefined)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={["addresses", 0, "ward"]} label="Phường/xã">
                <WardSelect options={wardOptions} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name={["addresses", 0, "detail"]} label="Địa chỉ chi tiết">
                <Input placeholder="Số nhà, đường..." />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        {(type === PartnerType.CUSTOMER || type === PartnerType.SUPPLIER) && (
          <FormSection title={`Điều khoản công nợ ${text}`}>
            <Row gutter={[64, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="maxDebtAmount"
                  label={<Label title="Hạn mức công nợ" width={140} />}
                >
                  <InputMoney notRightAlign min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label={<Label title={`Loại ${text}`} width={140} />}>
                  <Input value={partnerTypeMap[type]} disabled />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>
        )}

        {isOrganization && (
          <FormSection title="Người đại diện">
            <Row gutter={[64, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name={["representative", "name"]}
                  label={<Label title="Họ và tên" width={140} />}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["representative", "position"]}
                  label={<Label title="Chức vụ" width={140} />}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name={["representative", "phone"]}
                  label={<Label title="Số điện thoại" width={140} />}
                  rules={getPhoneRules()}
                >
                  <PhoneInput />
                </Form.Item>
                <Form.Item
                  name={["representative", "email"]}
                  label={<Label title="Email" width={140} />}
                  rules={[{ type: "email", message: "Email không hợp lệ" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>
        )}

        <BankList form={form} />
        <ContactList form={form} />
        <Form.Item name="type" hidden />
      </Form>
    </Modal>
  );
};
