import React, { useEffect } from "react";
import { Input, Modal, Form, Row, Col, Button, FormInstance } from "antd";
import { FormProps } from "antd/lib";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Partner, PartnerType, partnerTypeOptions } from "../../partner.model";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import Label from "@/shared/components/display/Label";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { AttributeManagerSelect, AttributeType } from "@/modules/attribute";
import { EmployeeSelect } from "@/modules/employee";
import { InputMoney, InputPercentage, InputQuantity } from "@/shared/components/input";
import { FormSection } from "@/shared/components/form/FormSection";
import { AppSelect } from "@/shared/components/select/AppSelect";
import { PhoneInput } from "@/shared/components/input/PhoneInput";
import { ProvinceSelect, WardSelect } from "@/shared/components/select/AddressSelect";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";
import { PaymentTermSelect } from "@/modules/paymentTerm";
import { BankList } from "./Bank";
import { ContactList } from "./Contact";
import { deletePendingFiles } from "@/shared/utils/file.util";
import { getPhoneRules, getTaxCodeRules } from "@/shared/constants/formItemRule";
export interface PartialProps {
  form: FormInstance<Partner>;
  editData?: Partner;
}
interface Props extends AddUpdateModalProps<Partner> {
  defaultType?: PartnerType;
}
export const PartnerAddUpdateModal: React.FC<Props> = ({
  open,
  editData,
  loading,
  errors,
  defaultType,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Partner>();
  const id = editData?.id || randomId();
  const state = Form.useWatch(["address", "state"], form);

  const { provinceOptions, wardOptions } = useAddressSelector(state);
  const group = Form.useWatch("group", form);
  const staff = Form.useWatch("staff", form);
  const paymentTerm = Form.useWatch("paymentTerm", form);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Partner>["onFinish"] = async (values: Partner) => {
    const formattedData = {
      ...values,
      id,
      tempId: id,
    };

    if (editData) {
      onEdit?.(formattedData);
    } else {
      onAdd?.(formattedData);
    }
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center h-4">
          <span>{editData ? "Chỉnh sửa thông tin đối tác" : "Thêm đối tác"}</span>

          <SubmitButton
            loading={loading}
            onCancel={() => handleCloseWithPendingFiles(id, onClose)}
            onSubmit={() => form.submit()}
          />
        </div>
      }
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      maskClosable={false}
      closeIcon={null}
      centered
      width={"100vw"}
      className="fullscreen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        if (!editData) {
          if (defaultType) {
            form.setFieldValue("types", [defaultType]);
          }
          return;
        }
        const formattedData = parseFormDataDates(editData);
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form
        autoComplete="off"
        className="flex flex-col h-full w-full overflow-y-auto scrollbar-hide"
        form={form}
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
      >
        <div className="flex flex-col">
          <FormSection title="Thông tin chung">
            <Row gutter={[132, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item name="code" label={<Label width={140} title="Mã đối tác" required />}>
                  <Input placeholder="Tự động tạo nếu để trống khi lưu" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="name"
                  label={<Label width={140} title="Tên đối tác" required />}
                  rules={[{ required: true, message: "Vui lòng nhập tên đối tác" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="groupId"
                  label={<Label width={140} title="Nhóm đối tác" required />}
                  rules={[{ required: true, message: "Vui lòng nhập tên đối tác" }]}
                >
                  <AttributeManagerSelect
                    type={AttributeType.PARTNER_GROUP}
                    defaultData={group}
                    onChangeData={(value) => form.setFieldValue("group", value)}
                  />
                </Form.Item>
                <Form.Item name="group" hidden />
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="types" label={<Label width={140} title="Phân loại" required />}>
                  <AppSelect
                    mode="multiple"
                    placeholder="Chọn phân loại"
                    options={partnerTypeOptions}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="taxCode"
                  label={<Label width={140} title="Mã số thuế" required />}
                  rules={getTaxCodeRules(true)}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="email"
                  label={<Label width={140} title="Email" />}
                  rules={[{ type: "email", message: "Email không hợp lệ" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="phone"
                  label={<Label width={140} title="Số điện thoại" />}
                  rules={getPhoneRules()}
                >
                  <PhoneInput />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="zaloLink" label={<Label width={140} title="Link Zalo" />}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <div className="flex">
                  <Label width={150} title="Địa chỉ" />
                  <Row gutter={[16, 0]} className="flex-1">
                    <Col xs={24} sm={12}>
                      <Form.Item name={["address", "state"]}>
                        <ProvinceSelect
                          options={provinceOptions}
                          onChange={(value) => {
                            form.setFieldValue(["address", "state"], value);
                            form.setFieldValue(["address", "ward"], undefined);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={["address", "ward"]}>
                        <WardSelect options={wardOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Form.Item name={["address", "detail"]}>
                        <Input placeholder="Số nhà, đường..." />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="staffId"
                  label={<Label width={140} title="Nhân viên phụ trách" bold />}
                >
                  <EmployeeSelect
                    defaultData={staff}
                    onChangeData={(val) => form.setFieldValue("staff", val)}
                  />
                </Form.Item>
                <Form.Item name="staff" hidden />
                <Form.Item name="note" label={<Label width={140} title="Ghi chú" />}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          {/* --- Điều khoản thanh toán --- */}
          <FormSection title="Điều khoản thanh toán">
            <Row gutter={[132, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="paymentTermId"
                  label={<Label width={140} title="Mẫu điều khoản" />}
                >
                  <PaymentTermSelect
                    defaultData={paymentTerm}
                    onChangeData={(val) => form.setFieldValue("paymentTerm", val)}
                  />
                </Form.Item>
                <Form.Item name="paymentTerm" hidden />
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name={["paymentTerm", "maxDebtAmount"]}
                  label={<Label width={140} title="Số tiền nợ tối đa" />}
                >
                  <InputMoney notRightAlign disabled />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name={["paymentTerm", "maxDebtDays"]}
                  label={<Label width={140} title="Số ngày nợ tối đa" />}
                >
                  <InputQuantity notRightAlign disabled />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name={["paymentTerm", "depositRate"]}
                  label={<Label width={140} title="Tỷ lệ cọc (%)" />}
                >
                  <InputPercentage notRightAlign disabled />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          {/* --- Người đại diện --- */}
          <FormSection title="Người đại diện">
            <Row gutter={[132, 24]}>
              {/* Cột 1 */}
              <Col xs={24} lg={12}>
                <Form.Item
                  name={["representative", "name"]}
                  label={<Label width={140} title="Người đại diện" required />}
                  rules={[{ required: true, message: "Vui lòng nhập tên người đại diện" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["representative", "position"]}
                  label={<Label width={140} title="Chức vụ" />}
                >
                  <Input />
                </Form.Item>
              </Col>

              {/* Cột 2 */}
              <Col xs={24} lg={12}>
                <Form.Item
                  name={["representative", "phone"]}
                  label={<Label width={140} title="Số điện thoại" />}
                  rules={getPhoneRules()}
                >
                  <PhoneInput />
                </Form.Item>
                <Form.Item
                  name={["representative", "email"]}
                  label={<Label width={140} title="Email" />}
                  rules={[{ type: "email", message: "Email không hợp lệ" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          <BankList form={form} />

          <ContactList form={form} />
        </div>
      </Form>
    </Modal>
  );
};
