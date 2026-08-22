import React, { useState } from "react";
import { Button, Form, Row, Col, Input, Card } from "antd";
import { CreditCardIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FormInstance } from "antd/lib";
import Label from "../../../../../../components/display/Label";
import Title from "../../../../../../components/display/Title";
import AddUpdateContactModal from "./AddUpdateContactModal";
import { CSS } from "../../../../../../constants/UI";
import ActionButtonsNoHover from "../../../../../../components/button/ActionButtonsNoHover";
import InfoRow from "../../../../../../components/display/InfoRow";

interface ContactListProps {
  form: FormInstance;
  onFormChange?: () => void;
}

const ContactList: React.FC<ContactListProps> = ({ form, onFormChange }) => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const contacts: any[] = Form.useWatch("contacts", form) || [];

  return (
    <div className="pb-4">
      <Form.List name="contacts">
        {(fields, { add, remove }) => (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-6" id="contacts">
              <Title content="Thông tin liên hệ" level={4} />
              <Button
                onClick={() => {
                  setOpen(true);
                  setEditIndex(null);
                }}
                className="text-[#1A65B7] border-[#1A65B7] rounded-lg"
              >
                <PlusIcon className="w-5 h-5 mr-1 " />
                Thêm người liên hệ
              </Button>
            </div>

            {/* Contact cards */}
            {fields.map((field, index) => (
              <Card key={field.key} className="group relative">
                {/* Action buttons (hover) */}
                <ActionButtonsNoHover
                  onEdit={() => {
                    setEditIndex(index);
                    setOpen(true);
                  }}
                  onDelete={() => {
                    remove(field.name);
                    onFormChange?.();
                  }}
                />

                {/* Card content */}
                <Row className="px-8 py-6" gutter={[108, 28]}>
                  {/* Left column */}
                  <Col lg={12} xs={24} className="space-y-2">
                    <InfoRow
                      label="Tên người liên hệ"
                      value={contacts[field.name]?.name}
                      bold
                      width={164}
                    />

                    <InfoRow
                      label="Email"
                      value={contacts[field.name]?.email}
                      width={164}
                    />

                    <InfoRow
                      label="Số điện thoại"
                      value={contacts[field.name]?.phone}
                      width={164}
                    />
                  </Col>

                  <Col lg={12} xs={24}>
                    <Form.Item
                      label={<Label width={164} title="Tài khoản ngân hàng" />}
                    >
                      <div className="space-y-2">
                        {(contacts[field.name]?.banks || []).length === 0 ? (
                          <span className="text-gray-400 italic">
                            Chưa có tài khoản ngân hàng
                          </span>
                        ) : (
                          contacts[field.name].banks.map(
                            (bank: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg"
                                style={CSS.container}
                              >
                                <CreditCardIcon className="w-6 h-6 text-gray-500" />

                                <div className="flex flex-col text-sm">
                                  <span className="font-medium">
                                    {bank.accountHolder} – {bank.accountNumber}
                                  </span>
                                  <span className="text-gray-500">
                                    {bank.bankName}
                                    {bank.branch ? ` – ${bank.branch}` : ""}
                                  </span>
                                </div>
                              </div>
                            ),
                          )
                        )}
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}
            <AddUpdateContactModal
              open={open}
              editData={editIndex !== null ? contacts[editIndex] : undefined}
              onClose={() => {
                setOpen(false);
                setEditIndex(null);
              }}
              onAdd={(record) => {
                add(record);
                setOpen(false);
                onFormChange?.();
              }}
              onEdit={(record: any) => {
                if (editIndex !== null) {
                  const current = form.getFieldValue("contacts") || [];
                  current[editIndex] = record;
                  form.setFieldValue("contacts", [...current]);
                  onFormChange?.();
                }
                setOpen(false);
                setEditIndex(null);
              }}
            />
          </div>
        )}
      </Form.List>
    </div>
  );
};

export default ContactList;
