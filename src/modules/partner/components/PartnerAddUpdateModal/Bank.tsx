import React from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CSS } from "@/shared/constants/ui";
import { CreditCardIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FormSection } from "@/shared/components";
import { Label } from "@/shared/components";
import { PartialProps } from ".";
import { BankSelect } from "@/shared/components";

export const BankList: React.FC<PartialProps> = ({ form }) => {
  const banks = Form.useWatch("banks", form) || [];

  return (
    <Form.List name="banks">
      {(fields, { add, remove }) => (
        <FormSection
          title="Tài khoản ngân hàng"
          subtitle={
            <Button onClick={() => add()} className="text-[#1A65B7] border-[#1A65B7]">
              <PlusIcon className="w-5 h-5 mr-1" />
              Thêm tài khoản
            </Button>
          }
        >
          <Row gutter={[64, 24]} className="pb-4">
            {fields.length === 0 && (
              <Col xs={24}>
                <p className="text-gray-400 text-sm italic">Chưa có tài khoản ngân hàng nào</p>
              </Col>
            )}

            {fields.map(({ key, name, ...restField }) => (
              <Col key={key} xs={24} lg={12}>
                <div className="p-4 pt-2 pb-0 bg-slate-50 relative border border-gray-200 rounded-md">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCardIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="font-medium text-xs">Tài khoản #{name + 1}</span>
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
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "bankName"]}
                        label={<Label width={100} title="Ngân hàng" required />}
                        rules={[{ required: true, message: "Vui lòng nhập tên ngân hàng" }]}
                      >
                        <BankSelect />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "accountHolder"]}
                        label={<Label width={100} title="Chủ tài khoản" required />}
                        rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản" }]}
                      >
                        <Input placeholder="VD: NGUYEN VAN A" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "accountNumber"]}
                        label={<Label width={100} title="Số tài khoản" required />}
                        rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
                      >
                        <Input
                          placeholder="VD: 123456789"
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "branch"]}
                        label={<Label width={100} title="Chi nhánh" />}
                      >
                        <Input placeholder="VD: Hà Nội" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            ))}
          </Row>
        </FormSection>
      )}
    </Form.List>
  );
};
