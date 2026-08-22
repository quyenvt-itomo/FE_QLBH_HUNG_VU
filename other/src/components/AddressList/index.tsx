import React, { useState } from "react";
import { Button, Form, Empty, FormInstance } from "antd";
import { PlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import AddUpdateModal, { DataType } from "./AddUpdateModal";
import ActionButtons from "../button/ActionButtons";
import { CSS } from "../../constants/UI";
import { IPartner } from "../../models/partner";
import { getFullAddress } from "../../utils/common";
import Label from "../display/Label";

interface AddressListProps {
  title?: React.ReactNode;
  form: FormInstance<IPartner>;
  onFormChange?: () => void;
}

const AddressList: React.FC<AddressListProps> = ({ title = "Địa chỉ", form, onFormChange }) => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addresses = Form.useWatch("addresses", form) || [];

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
          Thêm địa chỉ
        </Button>
      </div>

      {/* List */}
      <div className="mt-4 flex w-full">
        <Label title="" width={174} />
        <Form.List name="addresses">
          {(fields, { add, remove }) => (
            <div className="grid gap-4 w-full">
              {fields.map((field, index) => {
                const item = addresses[index];

                return (
                  <div
                    key={field.key}
                    className="group relative flex items-center gap-2 bg-slate-50 px-4 py-2"
                    style={CSS.container}
                  >
                    <MapPinIcon className="w-10 h-8" />

                    <div className="flex flex-col flex-1">{getFullAddress(item)}</div>

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
                editData={editIndex !== null ? addresses[editIndex] : undefined}
                onAdd={(record) => {
                  add(record);
                  setOpen(false);
                  onFormChange?.();
                }}
                onEdit={(record: any) => {
                  if (editIndex !== null) {
                    const current = form.getFieldValue("addresses") || [];
                    current[editIndex] = record;
                    form.setFieldValue("addresses", [...current]);
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

export default AddressList;
