import React, { useState } from "react";
import { Button, Form, FormInstance } from "antd";
import { CreditCardIcon, PlusIcon } from "@heroicons/react/24/outline";
import AddUpdateModal, { DataType } from "./AddUpdateModal";
import ActionButtons from "../button/ActionButtons";
import { CSS } from "../../constants/UI";
import { IBank, IPartner } from "../../models/partner";
import Label from "../display/Label";

interface BankListProps {
  title?: React.ReactNode;
  form: FormInstance<IPartner>;
  namePath?: (string | number)[];
  onFormChange?: () => void;
}

const BankList: React.FC<BankListProps> = ({
  title = "Tài khoản ngân hàng",
  form,
  namePath = ["banks"],
  onFormChange,
}) => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // banks là IBank[]
  const banks: IBank[] = Form.useWatch(namePath, form) || [];

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center">
        <div>{title}</div>
        <Button
          onClick={() => {
            setEditIndex(null);
            setOpen(true);
          }}
          className="text-[#1A65B7] border-[#1A65B7] rounded"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Thêm tài khoản
        </Button>
      </div>

      {/* List */}
      <div className="mt-4 flex w-full">
        <Label title="" width={174} />
        <Form.List name={namePath}>
          {(fields, { add, remove }) => (
            <div className="grid gap-4 w-full">
              {fields.map((field, index) => {
                const item = banks[index];

                return (
                  <div
                    key={field.key}
                    className="group relative flex items-center gap-2 bg-slate-50 px-4 py-2"
                    style={CSS.container}
                  >
                    <CreditCardIcon className="w-10 h-8" />

                    <div className="flex flex-col flex-1">
                      <span>
                        {item?.accountHolder} – {item?.accountNumber}
                      </span>
                      <span>
                        {item?.bankName} – {item?.branch}
                      </span>
                    </div>

                    <ActionButtons
                      onEdit={() => {
                        setEditIndex(index);
                        setOpen(true);
                      }}
                      onDelete={() => {
                        remove(field.name);
                        onFormChange?.();
                      }}
                    />
                  </div>
                );
              })}

              {/* Modal add / edit */}
              <AddUpdateModal
                open={open}
                editData={editIndex !== null ? banks[editIndex] : undefined}
                onAdd={(record) => {
                  add(record); // record = IBank
                  setOpen(false);
                  onFormChange?.();
                }}
                onEdit={(record: any) => {
                  if (editIndex !== null) {
                    const current = form.getFieldValue(namePath as any) || [];
                    current[editIndex] = record;
                    form.setFieldValue(namePath as any, [...current]);
                    onFormChange?.();
                  }
                  setOpen(false);
                }}
                onClose={() => {
                  setEditIndex(null);
                  setOpen(false);
                }}
              />
            </div>
          )}
        </Form.List>
      </div>
    </div>
  );
};

export default BankList;
