import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { IAddress } from "../../models/base/interface";
import SubmitButton from "../button/SubmitButton";
import Label from "../display/Label";
import { removeVietnameseTones } from "../../utils/searchUtils";
import ProvinceSelect from "../no_hook_selects/ProvinceSelect";
import WardSelect from "../no_hook_selects/WardSelect";
import { useAddressSelector } from "../../hooks/core/useAddressSelector";
import { IPartner } from "../../models/partner";

export interface DataType extends IAddress {
  key?: string;
  [key: string]: any;
}

interface AddUpdateModalProps {
  open: boolean;
  editData: DataType | undefined;
  customer?: IPartner;
  onClose: () => void;
  onAdd: (newEvent: DataType) => void;
  onEdit: any;
}

const AddUpdateModal: React.FC<AddUpdateModalProps> = ({
  open,
  editData,
  customer,
  onClose,
  onAdd,
  onEdit,
}) => {
  const [form] = Form.useForm();
  const state = Form.useWatch("state", form);

  const { provinces, wards } = useAddressSelector(state);

  const handleSubmit = async (values: DataType) => {
    if (editData && !customer) {
      onEdit({ ...editData, ...values });
    } else if (editData && customer) {
      const newAddresses = customer.addresses.map((addr, idx) =>
        idx === editData.index ? { ...addr, ...values } : addr,
      );

      onEdit({ addresses: newAddresses, id: customer.id });
    } else if (!editData && customer) {
      onEdit({
        addresses: [...customer.addresses, { ...values }],
        id: customer.id,
      });
    } else {
      onAdd(values);
    }
    form.resetFields();
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={editData ? "Chỉnh sửa" : "Thêm địa chỉ"}
      open={open}
      onCancel={handleCancel}
      footer={false}
      afterOpenChange={(open) => {
        if (open && editData) {
          form.setFieldsValue(editData);
        } else {
          form.resetFields();
        }
      }}
      centered
      width={500}
    >
      <Form form={form} layout="horizontal" onFinish={handleSubmit} className="mb-4 mt-12">
        <Form.Item name={"state"} label={<Label title="Tỉnh/Thành phố" />}>
          <ProvinceSelect
            options={provinces.map((p) => {
              return { value: p.Name, label: p.Name };
            })}
          />
        </Form.Item>
        <Form.Item name={"ward"} label={<Label title="Xã/Phường" />}>
          <WardSelect
            options={wards.map((p) => {
              return { value: p.Name, label: p.Name };
            })}
          />
        </Form.Item>

        <Form.Item name={"detail"} label={<Label title="Địa chỉ cụ thể" />}>
          <Input placeholder="Nhập địa chỉ" className="h-8 w-full" />
        </Form.Item>
        <div className="flex justify-center mt-8">
          <SubmitButton onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddUpdateModal;
