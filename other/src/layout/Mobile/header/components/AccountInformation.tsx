import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Upload, UploadProps } from "antd";
import { FormProps, Select, UploadFile } from "antd/lib";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../stores";
import { UserInfo } from "../../../../models/base/auth";
import { getInfo, resetUpdateInfo, updateInfo } from "../../../../stores/auth/slice";
import { IconArrowDown } from "../../../../components/icon/ArrowDown";
import { uploads } from "../../../../utils/fileUtil";

interface InfoProps {
  open: boolean;
  onClose: () => void;
}

const AccountInformation: React.FC<InfoProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const dispatch = useDispatch();

  const { userInfo, isCheckUpdateInfo } = useSelector(
    (state: RootState) => state.Auth,
    shallowEqual,
  );

  useEffect(() => {
    if (!open) return; // chỉ chạy khi Modal mở

    if (userInfo) {
      form.setFieldsValue(userInfo);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [userInfo, form, open]);

  useEffect(() => {
    if (!isCheckUpdateInfo) return;

    resetUpdateInfo();

    dispatch(getInfo());

    onClose();
    form.resetFields();
  }, [isCheckUpdateInfo]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish: FormProps<UserInfo>["onFinish"] = async (values: UserInfo) => {
    let uploadedPicture: string = "";

    const newFiles = fileList.filter((file) => !file.url);
    if (newFiles.length > 0) {
      const formData = new FormData();
      const keys = ["avatar"] as const;
      newFiles.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files[]", file.originFileObj);
        }
      });
    }

    const payload: UserInfo = {
      ...values,
    };

    dispatch(updateInfo(payload));
  };

  return (
    <Modal open={open} centered onCancel={onClose} footer={null}>
      <div className="max-w-3xl mx-auto bg-white rounded md:rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-8">Thông tin tài khoản</h1>
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onChange={onChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div className="flex flex-col items-center">
                  <span>Tải lên ảnh</span>
                </div>
              )}
            </Upload>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <Form
            layout="vertical"
            form={form}
            onFinish={(values) => onFinish(values)}
            className="space-y-4"
          >
            <Form.Item
              name="name"
              label={<span className="font-medium">Họ và tên</span>}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên",
                },
              ]}
              className="mb-6"
            >
              <Input placeholder={"Nhập họ và tên"} className="rounded-md h-8" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={<span className="font-medium">{"Email"}</span>}
                  className="mb-6"
                >
                  <Input placeholder={"Nhập email"} className="rounded-md h-8" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={<span className="font-medium">Số điện thoại</span>}
                  className="mb-6"
                >
                  <Input
                    className="h-8 w-full"
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      form.setFieldValue("phone", onlyNumbers);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label={<span className="font-medium">Giới tính</span>}
                  className="mb-6"
                >
                  <Select
                    placeholder="Chọn giới tính"
                    className="w-full rounded-md h-8"
                    options={[
                      {
                        value: "MALE",
                        label: "Nam",
                      },
                      {
                        value: "FEMALE",
                        label: "Nữ",
                      },
                      {
                        value: "ORTHER",
                        label: "Khác",
                      },
                    ]}
                    suffixIcon={<IconArrowDown />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dob"
                  label={<span className="font-medium">Ngày sinh</span>}
                  className="mb-6"
                >
                  <Input placeholder="Nhập ngày sinh" className="rounded-md h-8" type="date" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label={<span className="font-medium">Địa chỉ</span>}
              className="mb-6"
            >
              <Input placeholder="Nhập địa chỉ" className="rounded-md h-8" />
            </Form.Item>

            <div className="flex justify-center space-x-4 pt-4">
              <Button
                type="default"
                className="min-w-[100px] rounded-md h-8 hover:bg-gray-100"
                onClick={onClose}
              >
                Đóng
              </Button>
              {/* <Button
                type="primary"
                className="min-w-[100px] rounded-md h-8"
                onClick={() => onFinish(form.getFieldsValue())}
              >
                Lưu
              </Button> */}
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default AccountInformation;
