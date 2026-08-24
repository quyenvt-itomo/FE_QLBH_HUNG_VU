import React from "react";
import { Form, Input, Select } from "antd";
import { IdentificationType } from "@/shared/constants/enum";
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
  const type = Form.useWatch(nameType, form) as IdentificationType;
  const getLabel = () => {
    switch (type) {
      case IdentificationType.CCCD:
        return "Số CCCD";
      case IdentificationType.CMND:
        return "Số CMND";
      case IdentificationType.HC:
        return "Số HC";
      default:
        return "Số định danh";
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case IdentificationType.CCCD:
        return "Nhập số CCCD";
      case IdentificationType.CMND:
        return "Nhập số CMND";
      case IdentificationType.HC:
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
        <Form.Item name={nameType} noStyle initialValue={IdentificationType.CCCD}>
          <Select
            options={[
              { value: IdentificationType.CCCD, label: "CCCD" },
              { value: IdentificationType.CMND, label: "CMND" },
              { value: IdentificationType.HC, label: "HC" },
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

export { IdentityInput };
