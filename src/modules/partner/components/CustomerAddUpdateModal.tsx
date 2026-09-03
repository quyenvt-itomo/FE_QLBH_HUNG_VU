import React, { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { Col, Form, Input, Modal, Radio, Row } from "antd";
import type { FormProps } from "antd";
import {
  AppDatePicker,
  FormSection,
  GenderSelect,
  InputMoney,
  Label,
  PhoneInput,
  SubmitButton,
} from "@/shared/components";
import { Gender } from "@/shared/constants/enum";
import { getPhoneRules, getTaxCodeRules } from "@/shared/constants/formItemRule";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { Partner, PartnerType } from "../partner.model";
import { BankList } from "./PartnerAddUpdateModal/Bank";
import { ContactList } from "./PartnerAddUpdateModal/Contact";
import { AddressFields, RepresentativeFields } from "./PartnerAddUpdateModal/shared";
import { PartnerFormModalProps } from "./PartnerAddUpdateModal/form.types";
import { AttributeManagerSelect, AttributeType } from "@/modules/attribute";

const CustomerAddUpdateModal: React.FC<PartnerFormModalProps> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<Partner>();
  const id = useMemo(() => editData?.id || randomId(), [editData?.id]);
  const isOrganization = Form.useWatch("isOrganization", form) ?? false;
  const group = Form.useWatch("group", form);

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  const setValues = () => {
    if (!editData) {
      form.setFieldsValue({ isOrganization: false, addresses: [{}], banks: [], contacts: [] });
      return;
    }
    form.setFieldsValue({
      ...editData,
      gender: editData.gender ? (String(editData.gender).toUpperCase() as Gender) : null,
      dob: editData.dob ? dayjs(editData.dob) : null,
    });
  };

  const onFinish: FormProps<Partner>["onFinish"] = (values) => {
    const payload: Partial<Partner> = {
      ...values,
      id,
      tempId: id,
      type: PartnerType.CUSTOMER,
      gender: values.gender ? (String(values.gender).toLowerCase() as Gender) : null,
    };
    if (editData) onEdit?.(payload);
    else onAdd?.(payload);
  };

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center justify-between gap-4">
          <span>{`${editData ? "Cập nhật" : "Thêm mới"} khách hàng`}</span>
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
        if (!isOpen) form.resetFields();
        else setValues();
      }}
    >
      <Form<Partner>
        form={form}
        layout="vertical"
        autoComplete="off"
        className="flex h-[calc(100vh-110px)] flex-col overflow-y-auto scrollbar-hide"
        onFinish={onFinish}
      >
        <FormSection title="Thông tin khách hàng">
          <Row gutter={[64, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="name"
                label={<Label title="Tên khách hàng" required />}
                rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
              >
                <Input maxLength={255} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="code" label={<Label title="Mã khách hàng" />}>
                    <Input placeholder="Tự động" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="identityCode" label={<Label title="CMND/CCCD" />}>
                    <Input placeholder="Nhập CMND/CCCD" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} lg={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="taxCode"
                    label={<Label title="Mã số thuế" />}
                    rules={getTaxCodeRules()}
                  >
                    <Input maxLength={13} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label={<Label title="Số điện thoại" />}
                    rules={getPhoneRules()}
                  >
                    <PhoneInput />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="email"
                label={<Label title="Email" />}
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="gender" label={<Label title="Giới tính" width={100} />}>
                    <GenderSelect allowClear />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="dob" label={<Label title="Ngày sinh" width={100} />}>
                    <AppDatePicker onlyDate />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col xs={24} lg={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="maxDebtAmount"
                    label={<Label title="Hạn mức công nợ" width={140} />}
                  >
                    <InputMoney notRightAlign min={0} placeholder="Nợ tối đa" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="isOrganization"
                    label={<Label title="Phân loại đơn vị" width={140} />}
                  >
                    <Radio.Group className="w-full" buttonStyle="solid">
                      <Radio.Button className="w-1/2 text-center" value={false}>
                        Cá nhân
                      </Radio.Button>
                      <Radio.Button className="w-1/2 text-center" value={true}>
                        Tổ chức
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </FormSection>
        <FormSection title="Địa chỉ">
          <AddressFields form={form} />
        </FormSection>
        <FormSection title="Quản lý khách hàng">
          <Row gutter={[64, 0]}>
            <Col xs={24}>
              <Form.Item name="groupId" label={<Label title={`Nhóm khách hàng`} width={140} />}>
                <AttributeManagerSelect
                  type={AttributeType.CUSTOMER_GROUP}
                  defaultData={group}
                  onChangeData={(value) => form.setFieldValue("group", value)}
                />
              </Form.Item>
              <Form.Item name="group" hidden />
            </Col>

            <Col xs={24}>
              <Form.Item name="note" label={<Label title="Ghi chú" width={140} />}>
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
        <BankList form={form} />
        {isOrganization && (
          <>
            <FormSection title="Người đại diện">
              <RepresentativeFields />
            </FormSection>
            <ContactList form={form} />
          </>
        )}
      </Form>
    </Modal>
  );
};

export default CustomerAddUpdateModal;
export { CustomerAddUpdateModal };
