import { Button, Form, Input, Modal, Select } from "antd";
import { IContact } from "../../../../../../models/partnerContact";
import SubmitButton from "../../../../../../components/button/SubmitButton";
import Label from "../../../../../../components/display/Label";
import BankList from "../../../../../../components/BankList";
import { IPartner } from "../../../../../../models/partner";

export interface DataType extends IContact {
  key: string;
  [key: string]: any;
}

interface AddUpdateContactModalProps {
  open: boolean;
  editData: IContact | undefined;
  supplier?: IPartner;
  onClose: () => void;
  onAdd: (newEvent: DataType) => void;
  onEdit: any;
}

const AddUpdateContactModal: React.FC<AddUpdateContactModalProps> = ({
  open,
  editData,
  supplier,
  onClose,
  onAdd,
  onEdit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: DataType) => {
    if (editData && !supplier) {
      onEdit({ ...editData, ...values });
    } else if (supplier && editData) {
      onEdit({ ...values, partnerId: supplier.id, id: editData?.id });
    } else if (!editData && supplier) {
      onAdd({ ...values, partnerId: supplier.id });
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
      title={editData ? "Chỉnh sửa" : "Thêm người liên hệ"}
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
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="horizontal" onFinish={handleSubmit} className="mb-4 mt-8">
        <Form.Item
          name="name"
          label={<Label title="Tên người liên hệ" width={166} />}
          className="mt-4"
        >
          <Input className="h-8" />
        </Form.Item>
        <Form.Item name="email" label={<Label title="Email" width={166} />} className="mt-4">
          <Input className="h-8" />
        </Form.Item>
        <Form.Item
          name="phone"
          label={<Label title="Số điện thoại" width={166} />}
          className="mt-4"
        >
          <Input className="h-8" />
        </Form.Item>
        <BankList title={<Label title="Tài khoản ngân hàng" width={174} />} form={form} />
      </Form>
    </Modal>
  );
};

export default AddUpdateContactModal;
