import { Form, FormInstance } from "antd";
import { AttributeTypeEnum, PartnerTypeEnum } from "../../../../../../constants/enum";
import { SwitchLabel } from "./CustomerInfo";
import { IPartnerSubType } from "../../../../../../models/partnerSubType";
import AttributeSelect from "../../../../../../components/manager_select/AttributeSelect";

interface SubTypeRowProps {
  form: FormInstance;
  type: PartnerTypeEnum;
  title: string;
  subtitle: string;
  attributeType: AttributeTypeEnum;
  placeholder: string;
  requiredMessage: string;
}

interface ISubType extends IPartnerSubType {
  enabled: boolean;
}

const SubTypeRow: React.FC<SubTypeRowProps> = ({
  form,
  type,
  title,
  subtitle,
  attributeType,
  placeholder,
  requiredMessage,
}) => {
  const subTypes: ISubType[] = Form.useWatch("subTypes", form) || [];

  const index = subTypes.findIndex((i) => i.type === type);
  const item = subTypes[index];

  const enabled = item?.enabled;

  const toggle = (checked: boolean) => {
    const next = subTypes.map((i) => (i.type === type ? { ...i, enabled: checked } : i));
    form.setFieldsValue({ subTypes: next });
  };

  return (
    <div className="flex gap-3 items-center">
      <SwitchLabel
        title={title}
        subtitle={subtitle}
        width={164}
        checked={enabled}
        onChange={toggle}
      />

      {index > -1 && (
        <Form.Item
          name={["subTypes", index, "groupId"]}
          rules={[
            {
              required: enabled,
              message: requiredMessage,
            },
          ]}
          className="w-full"
        >
          <AttributeSelect
            type={attributeType}
            placeholder={placeholder}
            className="w-full h-8"
            disabled={!enabled}
          />
        </Form.Item>
      )}
    </div>
  );
};
export default SubTypeRow;
