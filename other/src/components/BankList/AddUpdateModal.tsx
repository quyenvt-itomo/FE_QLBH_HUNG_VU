import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { IBank, IPartner } from "../../models/partner";
import SubmitButton from "../button/SubmitButton";
import Label from "../display/Label";
import { removeVietnameseTones } from "../../utils/searchUtils";
import { bank_options } from "../../constants/option/bank";
import { IconArrowDown } from "../icon/ArrowDown";

export interface DataType extends IBank {
  key: string;
  [key: string]: any;
}

interface AddUpdateModalProps {
  open: boolean;
  editData: any;
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

  const handleSubmit = async (values: DataType) => {
    if (editData && !customer) {
      onEdit({ ...editData, ...values });
    } else if (editData && customer) {
      const newBanks = customer.banks.map((addr, idx) =>
        idx === editData.index ? { ...addr, ...values } : addr,
      );

      onEdit({ banks: newBanks, id: customer.id });
    } else if (!editData && customer) {
      onEdit({
        banks: [...customer.banks, { ...values }],
        id: customer.id,
      });
    } else {
      onAdd({ ...values, key: Date.now().toString() });
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
      title={editData ? "Chỉnh sửa" : "Thêm ngân hàng"}
      open={open}
      onCancel={handleCancel}
      footer={
        <div className="flex justify-end mt-8">
          <SubmitButton onCancel={handleCancel} onSubmit={() => form.submit()} />
        </div>
      }
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
      <Form form={form} layout="horizontal" onFinish={handleSubmit} className="mb-4 mt-8">
        <Form.Item
          name="bankName"
          label={<Label title="Ngân hàng" required />}
          rules={[
            {
              required: true,
              message: "Chọn ngân hàng thanh toán",
            },
          ]}
          className="mt-7"
        >
          <Select options={bank_options} className="h-8" suffixIcon={<IconArrowDown />} />
        </Form.Item>
        <Form.Item
          name="accountHolder"
          label={<Label title="Tên chủ tài khoản" required />}
          className="mt-4"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên chủ tài khoản",
            },
          ]}
          normalize={(value) => removeVietnameseTones(value || "").toUpperCase()}
        >
          <Input className="h-8" />
        </Form.Item>
        <Form.Item
          name="accountNumber"
          label={<Label title="Số tài khoản" required />}
          className="mt-4"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số tài khoản",
            },
          ]}
        >
          <Input className="h-8" />
        </Form.Item>
        <Form.Item name="branch" label={<Label title="Chi nhánh" />} className="mt-4">
          <Input className="h-8" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUpdateModal;
