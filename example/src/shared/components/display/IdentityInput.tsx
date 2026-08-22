import React from "react";
import { Form, Input, Select } from "antd";
import { IdentificationTypeEnum } from "@/shared/constants/enum";
import { CLASSNAME } from "@/shared/constants/ui";

type FieldName = string | (string | number)[];

interface IdentityInputProps {
  form: any;
  nameNumber?: FieldName;
  nameType?: FieldName;
}

const IdentityInput: React.FC<IdentityInputProps> = ({
  form,
  nameNumber = "identityCode",
  nameType = "type",
}) => {
  const type = Form.useWatch(nameType, form) as IdentificationTypeEnum;
  const getLabel = () => {
    switch (type) {
      case IdentificationTypeEnum.CCCD:
        return "Số CCCD";
      case IdentificationTypeEnum.CMND:
        return "Số CMND";
      case IdentificationTypeEnum.HC:
        return "Số HC";
      default:
        return "Số định danh";
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case IdentificationTypeEnum.CCCD:
        return "Nhập số CCCD";
      case IdentificationTypeEnum.CMND:
        return "Nhập số CMND";
      case IdentificationTypeEnum.HC:
        return "Nhập số HC";
      default:
        return "Nhập số định danh";
    }
  };

  return (
    <div
      className="
        flex items-center w-full rounded-lg
        border border-[var(--color-border)]
        bg-white dark:bg-slate-900
        hover:border-primary
        focus-within:border-primary
        focus-within:ring-2 focus-within:ring-primary/20
        transition
      "
    >
      {/* Input */}
      <Form.Item
        name={nameNumber}
        rules={[
          {
            required: true,
            message: `Vui lòng nhập ${getLabel().toLowerCase()}`,
          },
        ]}
        noStyle
      >
        <Input
          className="
            h-[34px] w-full
            !border-none !shadow-none
            rounded-e-none rounded-lg
          "
          placeholder={getPlaceholder()}
        />
      </Form.Item>

      {/* Divider */}
      <div className="w-px h-7 border-l" />

      {/* Select */}
      <div className="w-20">
        <Form.Item name={nameType} noStyle initialValue={IdentificationTypeEnum.CCCD}>
          <Select
            options={[
              { value: IdentificationTypeEnum.CCCD, label: "CCCD" },
              { value: IdentificationTypeEnum.CMND, label: "CMND" },
              { value: IdentificationTypeEnum.HC, label: "HC" },
            ]}
            value={type}
            onChange={(value) => form.setFieldValue(nameType, value)}
            suffixIcon={null}
            variant="borderless"
            className={`${CLASSNAME.inputHeight} w-full shrink-0
            !border-none !shadow-none !ring-0 rounded-s-none`}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default IdentityInput;
