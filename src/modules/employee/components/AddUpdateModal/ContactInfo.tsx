import { Checkbox, Form, Input } from "antd";
import { AddUpdateModalPartialProps } from ".";
import { Label } from "@/shared";
import { CLASSNAME } from "@/shared/constants/ui";
import { PartialPanel } from "./PartialComponent";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";
import { ProvinceSelect, WardSelect } from "@/shared";
import { getPhoneRules, phoneRule } from "@/shared/constants/formItemRule";

const PermanentAddress: React.FC<AddUpdateModalPartialProps> = ({ form, id }) => {
  const state = Form.useWatch(["permanentAddress", "state"], form);
  const isPermanent = Form.useWatch(["currentAddress", "isPermanent"], form);

  const { provinceOptions, wardOptions } = useAddressSelector(state);

  return (
    <PartialPanel id="contact-permanent-address" title="Địa chỉ thường trú">
      <Form.Item name={["permanentAddress", "state"]} label={<Label title="Tỉnh/ Thành phố" />}>
        <ProvinceSelect
          options={provinceOptions}
          onChange={(value) => {
            form.setFieldValue(["permanentAddress", "state"], value);
            form.setFieldValue(["permanentAddress", "ward"], undefined);

            if (isPermanent) {
              form.setFieldValue(["currentAddress", "state"], value);
              form.setFieldValue(["currentAddress", "ward"], undefined);
            }
          }}
        />
      </Form.Item>
      <Form.Item name={["permanentAddress", "ward"]} label={<Label title="Phường/ Xã" />}>
        <WardSelect
          options={wardOptions}
          onChange={(value) => {
            form.setFieldValue(["permanentAddress", "ward"], value);
            if (isPermanent) {
              form.setFieldValue(["currentAddress", "ward"], value);
            }
          }}
        />
      </Form.Item>
      <Form.Item name={["permanentAddress", "detail"]} label={<Label title="Địa chỉ chi tiết" />}>
        <Input
          placeholder="Số nhà, Tên đường, Thôn xóm"
          className={CLASSNAME.inputHeight}
          onChange={(e) => {
            form.setFieldValue(["permanentAddress", "detail"], e.target.value);
            if (isPermanent) {
              form.setFieldValue(["currentAddress", "detail"], e.target.value);
            }
          }}
        />
      </Form.Item>
    </PartialPanel>
  );
};

const CurrentAddress: React.FC<AddUpdateModalPartialProps> = ({ form, id }) => {
  const state = Form.useWatch(["currentAddress", "state"], form);
  const isPermanent = Form.useWatch(["currentAddress", "isPermanent"], form);
  const { provinceOptions, wardOptions } = useAddressSelector(state);

  return (
    <PartialPanel id="contact-current-address" title="Nơi ở hiện tại">
      <Form.Item name={["currentAddress", "state"]} label={<Label title="Tỉnh/ Thành phố" />}>
        <ProvinceSelect
          options={provinceOptions}
          onChange={(value) => {
            form.setFieldValue(["currentAddress", "state"], value);
            form.setFieldValue(["currentAddress", "ward"], undefined);
          }}
          disabled={isPermanent}
        />
      </Form.Item>
      <Form.Item name={["currentAddress", "ward"]} label={<Label title="Phường/ Xã" />}>
        <WardSelect options={wardOptions} disabled={isPermanent} />
      </Form.Item>
      <Form.Item name={["currentAddress", "detail"]} label={<Label title="Địa chỉ chi tiết" />}>
        <Input
          placeholder="Số nhà, Tên đường, Thôn xóm"
          className={CLASSNAME.inputHeight}
          disabled={isPermanent}
        />
      </Form.Item>
      <Form.Item
        name={["currentAddress", "isPermanent"]}
        label={<Label title="" />}
        valuePropName="checked"
      >
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              const permanentAddress = form.getFieldValue("permanentAddress");
              form.setFieldValue("currentAddress", {
                ...permanentAddress,
                isPermanent: true,
              });
            } else {
              form.setFieldValue(["currentAddress", "isPermanent"], false);
            }
          }}
        >
          Là địa chỉ thường trú
        </Checkbox>
      </Form.Item>
    </PartialPanel>
  );
};

export const ContactInfo: React.FC<AddUpdateModalPartialProps> = ({ form, id }) => {
  return (
    <>
      <div
        id="contact-info"
        className="flex justify-center items-center w-full h-9 font-semibold bg-gray-200"
      >
        Thông tin liên hệ
      </div>
      <PartialPanel id="contact-phone-email" title="Số điện thoại/ Email">
        <Form.Item name="phone" label={<Label title="Số điện thoại" />} rules={getPhoneRules()}>
          <Input placeholder="09xxxxxxxx" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item name="email" label={<Label title="Email" />}>
          <Input placeholder="example@gmail.com" className={CLASSNAME.inputHeight} />
        </Form.Item>
      </PartialPanel>

      <PermanentAddress form={form} id={id} />
      <CurrentAddress form={form} id={id} />

      <PartialPanel id="contact-emergency" title="Liên hệ khẩn cấp">
        <Form.Item name={["emergencyContact", "name"]} label={<Label title="Họ và tên" />}>
          <Input placeholder="Tên người liên hệ" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item
          name={["emergencyContact", "relationship"]}
          label={<Label title="Mối quan hệ" />}
        >
          <Input placeholder="Mối quan hệ với nhân sự" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item
          name={["emergencyContact", "phone"]}
          label={<Label title="Số điện thoại" />}
          rules={getPhoneRules()}
        >
          <Input placeholder="09xxxxxxxx" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item name={["emergencyContact", "email"]} label={<Label title="Email" />}>
          <Input placeholder="example@gmail.com" className={CLASSNAME.inputHeight} />
        </Form.Item>
      </PartialPanel>
    </>
  );
};
