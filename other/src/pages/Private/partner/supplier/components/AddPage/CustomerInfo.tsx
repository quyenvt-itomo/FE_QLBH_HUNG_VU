import { Col, DatePicker, Form, Input, Radio, Row, Switch } from "antd";
import { FormInstance } from "antd/lib";
import { IPartner } from "../../../../../../models/partner";
import Label from "../../../../../../components/display/Label";
import Title from "../../../../../../components/display/Title";
import { AttributeTypeEnum, PartnerTypeEnum } from "../../../../../../constants/enum";
import AddressList from "../../../../../../components/AddressList";
import BankList from "../../../../../../components/BankList";
import AttributeSelect from "../../../../../../components/manager_select/AttributeSelect";
import SubTypeRow from "./SubTypeRow";
import { useEffect } from "react";
import { setFormCode } from "../../../../../../utils/formUtils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface CustomerInfoProps {
  form: FormInstance<IPartner>;
  onFormChange?: () => void;
}

interface SwitchLabelProps {
  title: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  width?: number;
  subtitle?: string;
}

export const SwitchLabel: React.FC<SwitchLabelProps> = ({
  title,
  checked,
  onChange,
  className = "",
  width,
  subtitle,
}) => {
  return (
    <div
      className={`flex justify-between items-center flex-shrink-0 pb-[22px] ${className}`}
      title={subtitle || title}
      style={{ width }}
    >
      {title}
      <Switch className="ml-2" checked={checked} onChange={onChange} />
    </div>
  );
};

const updateSubTypes = (form: any, type: PartnerTypeEnum, groupId?: string, checked?: boolean) => {
  const subTypes = form.getFieldValue("subTypes") || [];

  if (checked) {
    if (!subTypes.some((i: any) => i.type === type)) {
      form.setFieldsValue({
        subTypes: [...subTypes, { type, groupId }],
      });
    }
  } else {
    form.setFieldsValue({
      subTypes: subTypes.filter((i: any) => i.type !== type),
    });
  }
};

export const CustomerInfo: React.FC<CustomerInfoProps> = ({ form, onFormChange }) => {
  const isOrganization = Form.useWatch("isOrganization", form);

  useEffect(() => {
    setFormCode({ form, type: "supplier", field: "code" });
  }, []);

  return (
    <div className="flex flex-col">
      {/* 🔥 BẮT BUỘC REGISTER FIELD */}
      <Form.Item name="subTypes" noStyle>
        <></>
      </Form.Item>

      <div className="flex items-center gap-20" id="info">
        <Title content="Thông tin chung" level={4} />
        <Form.Item name="isOrganization" noStyle>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio.Button value={false}>Cá nhân</Radio.Button>
            <Radio.Button value={true}>Tổ chức</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>

      <Row className="px-8 pt-6" gutter={[108, 28]}>
        <Col lg={12} xs={24} className="space-y-2">
          <Form.Item
            name="code"
            label={<Label width={164} title="Mã NCC" required />}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã NCC",
              },
            ]}
          >
            <Input className="h-8" />
          </Form.Item>

          <Form.Item
            name="name"
            label={<Label width={164} title="Tên NCC" required />}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên NCC",
              },
            ]}
          >
            <Input className="h-8" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Label width={164} title="Email" required />}
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              {
                type: "email",
                message: "Email không đúng định dạng",
              },
            ]}
          >
            <Input className="h-8" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<Label width={164} title="Số điện thoại" required />}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
              {
                pattern: /^[0-9]{10,15}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input className="h-8" />
          </Form.Item>
          <Form.Item name="note" label={<Label width={164} title="Ghi chú" />}>
            <Input.TextArea className="h-8" />
          </Form.Item>
        </Col>

        <Col lg={12} xs={24} className="space-y-2">
          <Form.Item
            name="groupId"
            label={<Label width={164} title="Nhóm NCC" required />}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn nhóm NCC",
              },
            ]}
          >
            <AttributeSelect type={AttributeTypeEnum.SUPPLIER_GROUP} placeholder="Chọn nhóm NCC" />
          </Form.Item>
          <Form.Item name="taxCode" label={<Label width={164} title="Mã số thuế" />}>
            <Input className="h-8" />
          </Form.Item>

          {/* ===== SUB TYPES ===== */}
          <SubTypeRow
            form={form}
            type={PartnerTypeEnum.CUSTOMER}
            title="Là khách hàng"
            subtitle="Là khách hàng"
            attributeType={AttributeTypeEnum.CUSTOMER_GROUP}
            placeholder="Chọn nhóm khách hàng"
            requiredMessage="Vui lòng chọn nhóm khách hàng"
          />

          <SubTypeRow
            form={form}
            type={PartnerTypeEnum.SHIPPER}
            title="Là ĐVVC"
            subtitle="Là đơn vị vận chuyển"
            attributeType={AttributeTypeEnum.SHIPPER_GROUP}
            placeholder="Chọn nhóm đơn vị vận chuyển"
            requiredMessage="Vui lòng chọn nhóm đơn vị vận chuyển"
          />
        </Col>
      </Row>

      <Row className="px-8 mt-2" gutter={[108, 28]}>
        <Col lg={12}>
          <AddressList
            title={<Label title="Địa chỉ" width={174} />}
            form={form}
            onFormChange={onFormChange}
          />
        </Col>
        <Col lg={12}>
          <BankList
            title={<Label title="Tài khoản ngân hàng" width={174} />}
            form={form}
            onFormChange={onFormChange}
          />
        </Col>
      </Row>
      {isOrganization && (
        <div>
          <div className="flex items-center gap-20" id="representative">
            <Title content="Người đại diện" level={4} />
          </div>
          <Row className="px-8 py-6" gutter={[108, 28]}>
            <Col lg={12} xs={24} className="space-y-7">
              <Form.Item
                name={["representative", "name"]}
                label={<Label width={164} title="Tên người đại diện" />}
              >
                <Input placeholder="Nhập tên người đại diện" className="h-8 w-full" />
              </Form.Item>
              <Form.Item
                name={["representative", "position"]}
                label={<Label width={164} title="Chức vụ" />}
              >
                <Input placeholder="Nhập chức vụ" className="h-8 w-full" />
              </Form.Item>
            </Col>
            <Col lg={12} xs={24} className="space-y-7">
              <Form.Item
                name={["representative", "email"]}
                label={<Label width={164} title="Email" />}
              >
                <Input placeholder="Nhập email" className="h-8 w-full" />
              </Form.Item>
              <Form.Item
                name={["representative", "phone"]}
                label={<Label width={164} title="Số điện thoại" />}
              >
                <Input placeholder="Nhập số điện thoại" className="h-8 w-full" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
