import React, { useEffect, useState } from "react";
import { Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import SubmitButton from "../../../../../components/button/SubmitButton";
import AttributeSelect from "../../../../../components/manager_select/AttributeSelect";
import { AttributeTypeEnum, FileCategoryEnum, FileEntityEnum } from "../../../../../constants/enum";
import AvatarUpload from "../../../../../components/upload/AvatarUpload";
import { isPhoneNumber, randomId } from "../../../../../utils/common";
import Label from "../../../../../components/display/Label";
import { IAttribute } from "../../../../../models/base/attribute";
import { getMainImage } from "../../../../../utils/fileUtil";
import { IPartner } from "../../../../../models/partner";
import ProvinceSelect from "../../../../../components/no_hook_selects/ProvinceSelect";
import WardSelect from "../../../../../components/no_hook_selects/WardSelect";
import { useAddressSelector } from "../../../../../hooks/core/useAddressSelector";

interface Props extends AddUpdateModalProps<IPartner> {
  defaultPhone?: string;
}

const AddModal: React.FC<Props> = ({
  open,
  editData,
  loading,
  errors,
  defaultPhone,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [id, setId] = useState<string>("");
  const group: IAttribute | undefined = Form.useWatch("group", form);
  const state = Form.useWatch(["addresses", 0, "state"], form);
  const { provinces, wards } = useAddressSelector(state);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IPartner>["onFinish"] = async (values: IPartner) => {
    const formattedData = formatFormData({
      ...values,
      id,
      tempId: id,
    });

    if (editData) {
      onEdit?.(formattedData);
    } else {
      onAdd?.(formattedData);
    }
  };

  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  return (
    <Modal
      title={editData ? "Chỉnh sửa thông tin khách hàng" : "Thêm khách hàng"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={"600px"}
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        if (!editData) {
          setId(randomId());
          setFormCode({ form, type: "customer" });
          if (defaultPhone && isPhoneNumber(defaultPhone)) {
            form.setFieldsValue({ phone: defaultPhone });
          }
          return;
        }
        setId(editData.id);
        const formattedData = parseFormDataDates(editData);
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form className="flex flex-col" form={form} onFinish={onFinish}>
        <div className="flex flex-col gap-2 pt-8">
          <div className="flex flex-row-reverse gap-6">
            <div className="flex items-center justify-center gap-4 flex-shrink-0">
              <AvatarUpload
                defaultFile={getMainImage(editData?.avatar)}
                category={FileCategoryEnum.AVATAR}
                entity={FileEntityEnum.CUSTOMER}
                oId={id}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Form.Item
                name="code"
                label={<Label title="Mã khách hàng" required />}
                rules={[{ required: true, message: "Vui lòng nhập mã khách hàng" }]}
              >
                <Input className="h-8 w-full" />
              </Form.Item>

              <Form.Item
                name="name"
                label={<Label title="Tên khách hàng" required />}
                rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
              >
                <Input className="h-8 w-full" />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="groupId"
            label={<Label title="Nhóm khách hàng" required />}
            rules={[{ required: true, message: "Vui lòng chọn nhóm khách hàng" }]}
          >
            <AttributeSelect
              type={AttributeTypeEnum.CUSTOMER_GROUP}
              defaultData={group}
              onChangeData={(value) => form.setFieldValue("group", value)}
            />
          </Form.Item>
          <Form.Item name="group" hidden />

          <Form.Item name="phone" label={<Label title="Số điện thoại" />}>
            <Input placeholder="Nhập số điện thoại" className="h-8 w-full" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Label title="Email" />}
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input placeholder="Nhập email" className="h-8 w-full" />
          </Form.Item>

          {/* <Form.Item name="dob" label={<Label title="Sinh nhật" />}>
            <DatePickerCustom onlyDate />
          </Form.Item>

          <Form.Item name="gender" label={<Label title="Giới tính" />}>
            <GenderSelect />
          </Form.Item> */}

          <div className="flex gap-2.5">
            <Label title="Địa chỉ" />
            <div className="flex flex-col flex-1">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Form.Item name={["addresses", 0, "state"]}>
                  <ProvinceSelect
                    options={provinces.map((p) => {
                      return { value: p.Name, label: p.Name };
                    })}
                  />
                </Form.Item>
                <Form.Item name={["addresses", 0, "ward"]}>
                  <WardSelect
                    options={wards.map((p) => {
                      return { value: p.Name, label: p.Name };
                    })}
                  />
                </Form.Item>
              </div>
              <Form.Item name={["addresses", 0, "detail"]}>
                <Input placeholder="Địa chỉ cụ thể" className="h-8 w-full" />
              </Form.Item>
            </div>
          </div>

          <Form.Item name="description" label={<Label title="Ghi chú" />}>
            <Input.TextArea
              placeholder="Ghi chú"
              autoSize={{ minRows: 2, maxRows: 6 }}
              count={{
                max: 250,
                show: true,
              }}
            />
          </Form.Item>
        </div>

        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddModal;
