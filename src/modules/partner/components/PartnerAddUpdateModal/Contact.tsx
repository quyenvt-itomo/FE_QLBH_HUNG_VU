import React from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { CreditCardIcon, PhoneIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FormSection } from "@/shared";
import { Label } from "@/shared";
import { PartialProps } from ".";
import { BankSelect } from "@/shared";
import { getPhoneRules } from "@/shared/constants/formItemRule";

export const ContactList: React.FC<PartialProps> = ({ form }) => {
  return (
    <Form.List name="contacts">
      {(fields, { add, remove }) => (
        <FormSection
          title="Người liên hệ"
          subtitle={
            <Button onClick={() => add()} className="text-[#1A65B7] border-[#1A65B7]">
              <PlusIcon className="w-5 h-5 mr-1" />
              Thêm người liên hệ
            </Button>
          }
        >
          {fields.length === 0 && (
            <p className="text-gray-400 text-sm italic mb-4">Chưa có người liên hệ nào</p>
          )}

          {fields.map(({ key, name, ...restField }) => (
            <div
              key={key}
              className="p-4 pt-2 bg-slate-50 relative border border-gray-200 rounded-md mb-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <PhoneIcon className="w-6 h-6 text-gray-700" />
                <span className="font-medium text-xs">Liên hệ #{name + 1}</span>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => remove(name)}
                  className="ml-auto"
                />
              </div>

              <Row gutter={[16, 0]}>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item
                    {...restField}
                    layout="vertical"
                    name={[name, "name"]}
                    label={<Label width={120} title="Tên người liên hệ" required />}
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  >
                    <Input placeholder="VD: Nguyễn Thị Lan" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item
                    {...restField}
                    layout="vertical"
                    name={[name, "phone"]}
                    label={<Label width={120} title="Số điện thoại" required />}
                    rules={getPhoneRules(true)}
                  >
                    <Input
                      placeholder="0901234567"
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item
                    {...restField}
                    layout="vertical"
                    name={[name, "position"]}
                    label={<Label width={120} title="Chức danh" />}
                  >
                    <Input placeholder="VD: Giám đốc kinh doanh" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item
                    {...restField}
                    layout="vertical"
                    name={[name, "email"]}
                    label={<Label width={120} title="Email" />}
                    rules={[{ type: "email", message: "Email không hợp lệ" }]}
                  >
                    <Input placeholder="VD: lan@abc.com.vn" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Nested banks - compact, 2 per row */}
              <div className="mt-8 pt-3 border-t border-gray-200">
                <Form.List name={[name, "banks"]}>
                  {(bankFields, { add: addBank, remove: removeBank }) => (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          Tài khoản ngân hàng
                        </span>
                        <Button
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => addBank()}
                          className="text-xs"
                        >
                          Thêm
                        </Button>
                      </div>

                      <Row gutter={[132, 8]}>
                        {bankFields.map(({ key: bkKey, name: bkName, ...bkRest }) => (
                          <Col key={bkKey} xs={24} md={12} className="mt-2">
                            <div className="flex items-center gap-2">
                              <CreditCardIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="grid grid-cols-4 gap-2 flex-1">
                                <Form.Item
                                  {...bkRest}
                                  name={[bkName, "bankName"]}
                                  rules={[{ required: true, message: "Vui lòng nhập" }]}
                                  noStyle
                                >
                                  <BankSelect size="small" placeholder="Ngân hàng" />
                                </Form.Item>
                                <Form.Item
                                  {...bkRest}
                                  name={[bkName, "accountHolder"]}
                                  rules={[{ required: true, message: "Vui lòng nhập" }]}
                                  noStyle
                                >
                                  <Input placeholder="Chủ TK" size="small" />
                                </Form.Item>
                                <Form.Item
                                  {...bkRest}
                                  name={[bkName, "accountNumber"]}
                                  rules={[{ required: true, message: "Vui lòng nhập" }]}
                                  noStyle
                                >
                                  <Input
                                    placeholder="Số TK"
                                    size="small"
                                    onChange={(e) => {
                                      e.target.value = e.target.value.replace(/\D/g, "");
                                    }}
                                  />
                                </Form.Item>
                                <Form.Item {...bkRest} name={[bkName, "branch"]} noStyle>
                                  <Input placeholder="Chi nhánh" size="small" />
                                </Form.Item>
                              </div>
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => removeBank(bkName)}
                                className="flex-shrink-0"
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </Form.List>
              </div>
            </div>
          ))}
        </FormSection>
      )}
    </Form.List>
  );
};
