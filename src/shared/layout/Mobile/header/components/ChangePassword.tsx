import React, { useEffect } from "react";
import { Modal, Form, Input, message, Checkbox } from "antd";
import { Label } from "@/shared/components";
import { SubmitButton } from "@/shared/components";
import { useAuth } from "@/shared/hooks/useAuth";
import { CLASSNAME } from "@/shared/constants/ui";

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();

  const { changePasswordLoading, changePassword } = useAuth();

  useEffect(() => {
    if (open) {
      form.resetFields(); // reset khi mở modal
    }
  }, [open, form]);

  // Hàm đóng modal
  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  // Hàm xử lý thay đổi mật khẩu
  const handleChangePassword = async (values: any) => {
    try {
      // Kiểm tra mật khẩu cũ và mới
      if (values.oldPassword === values.newPassword) {
        message.error("Mật khẩu mới không được giống mật khẩu hiện tại");
        return;
      }

      changePassword(values, {
        onSuccess: () => handleCancel(),
      }); // Gọi dispatch để thay đổi mật khẩu
    } catch (err) {
      console.error("Lỗi thay đổi mật khẩu: ", err);
    }
  };

  return (
    <Modal title="Thay đổi mật khẩu" open={open} onCancel={handleCancel} footer={null} centered>
      <Form
        form={form}
        initialValues={{ isLogout: false }}
        onFinish={handleChangePassword}
        className="px-4 py-6"
      >
        <Form.Item
          name="oldPassword"
          label={<Label title="Mật khẩu hiện tại" required />}
          className="mt-4"
          rules={[
            {
              required: true,
              message: "Hãy nhập mật khẩu hiện tại",
            },
          ]}
        >
          <Input.Password className={CLASSNAME.inputHeight} />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={<Label title="Mật khẩu mới" required />}
          className="mt-4"
          rules={[
            { required: true, message: "Hãy nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password className={CLASSNAME.inputHeight} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<Label title="Nhập lại mật khẩu" required />}
          className="mt-4"
          rules={[
            {
              required: true,
              message: "Hãy xác nhận lại mật khẩu mới",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const newPassword = getFieldValue("newPassword");
                if (!value || value === newPassword) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu nhập lại phải giống với mật khẩu mới!"));
              },
            }),
          ]}
        >
          <Input.Password className={CLASSNAME.inputHeight} />
        </Form.Item>

        <Form.Item name="isLogout" valuePropName="checked" className="mt-4">
          <Checkbox>Đăng xuất khỏi mọi thiết bị</Checkbox>
        </Form.Item>

        <div className="flex justify-center mt-8">
          <SubmitButton onCancel={handleCancel} loading={changePasswordLoading} />
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
