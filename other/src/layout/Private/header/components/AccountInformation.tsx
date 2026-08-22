import React, { useEffect } from "react";
import { Col, Form, Input, Modal, Row } from "antd";
import { FormProps, Select, UploadFile } from "antd/lib";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../stores";
import { UserInfo } from "../../../../models/base/auth";
import { getInfo, resetUpdateInfo, updateInfo } from "../../../../stores/auth/slice";
import { IconArrowDown } from "../../../../components/icon/ArrowDown";
import { getMainImage } from "../../../../utils/fileUtil";
import AvatarUpload from "../../../../components/upload/AvatarUpload";
import { FileCategoryEnum, FileEntityEnum } from "../../../../constants/enum";
import SubmitButton from "../../../../components/button/SubmitButton";
import { useAddressSelector } from "../../../../hooks/core/useAddressSelector";
import Label from "../../../../components/display/Label";
import ProvinceSelect from "../../../../components/no_hook_selects/ProvinceSelect";
import WardSelect from "../../../../components/no_hook_selects/WardSelect";
import GenderSelect from "../../../../components/no_hook_selects/GenderSelect";
import { DatePickerCustom } from "../../../../components/input";
import { formatFormData, parseFormDataDates } from "../../../../utils/dateUtils";

interface InfoProps {
  open: boolean;
  onClose: () => void;
}

const AccountInformation: React.FC<InfoProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { userInfo, loading, isCheckUpdateInfo } = useSelector(
    (state: RootState) => state.Auth,
    shallowEqual,
  );
  const state = Form.useWatch(["address", "state"], form);

  const { provinces, wards } = useAddressSelector(state);

  useEffect(() => {
    if (!isCheckUpdateInfo) return;

    resetUpdateInfo();

    dispatch(getInfo());

    onClose();
    form.resetFields();
  }, [isCheckUpdateInfo]);

  const onFinish: FormProps<UserInfo>["onFinish"] = async (values: UserInfo) => {
    dispatch(updateInfo(formatFormData(values)));
  };

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      footer={null}
      afterOpenChange={(open) => {
        if (!open) return; // chỉ chạy khi Modal mở

        if (userInfo) {
          form.setFieldsValue(parseFormDataDates(userInfo));
        } else {
          form.resetFields();
        }
      }}
    >
      <div className="max-w-3xl mx-auto bg-white rounded md:rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-8">Thông tin tài khoản</h1>
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <AvatarUpload
              shape="circle"
              size={100}
              limit={50}
              entity={FileEntityEnum.USER}
              category={FileCategoryEnum.AVATAR}
              defaultFile={getMainImage(userInfo?.avatar)}
              oId={userInfo?.id}
            />
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <Form layout="vertical" form={form} onFinish={(values) => onFinish(values)} className="">
            <Form.Item
              name="name"
              label={<Label title="Họ và tên" bold height={18} required />}
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" className="rounded-md h-8" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={<Label title="Email" bold height={18} />}
                  rules={[{ type: "email", message: "Email không hợp lệ" }]}
                >
                  <Input placeholder={"Nhập email"} className="rounded-md h-8" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={<Label title="Số điện thoại" bold height={18} />}
                  rules={[
                    {
                      pattern: /^[0-9]{10,15}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input className="h-8 w-full" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="gender" label={<Label title="Giới tính" bold height={18} />}>
                  <GenderSelect />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dob"
                  label={<Label title="Ngày sinh" bold height={18} />}
                  className="mb-6"
                >
                  <DatePickerCustom onlyDate />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex flex-col gap-2.5">
              <Label title="Địa chỉ" bold height={18} />
              <div className="flex flex-col flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item name={["address", "state"]}>
                    <ProvinceSelect
                      options={provinces.map((p) => {
                        return { value: p.Name, label: p.Name };
                      })}
                    />
                  </Form.Item>
                  <Form.Item name={["address", "ward"]}>
                    <WardSelect
                      options={wards.map((p) => {
                        return { value: p.Name, label: p.Name };
                      })}
                    />
                  </Form.Item>
                </div>
                <Form.Item name={["address", "detail"]}>
                  <Input placeholder="Địa chỉ cụ thể" className="h-8 w-full" />
                </Form.Item>
              </div>
            </div>

            <div className="flex w-full justify-center mt-4">
              <SubmitButton loading={loading} onCancel={onClose} />
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default AccountInformation;
