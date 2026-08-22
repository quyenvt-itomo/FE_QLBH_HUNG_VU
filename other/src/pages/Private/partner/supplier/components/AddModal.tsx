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
import { randomId } from "../../../../../utils/common";
import Label from "../../../../../components/display/Label";
import { IAttribute } from "../../../../../models/base/attribute";
import { getMainImage } from "../../../../../utils/fileUtil";
import { IPartner } from "../../../../../models/partner";

const AddModal: React.FC<AddUpdateModalProps<IPartner>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [id, setId] = useState<string>("");
  const group: IAttribute | undefined = Form.useWatch("group", form);

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
      title={editData ? "Chỉnh sửa thông tin nhà cung cấp" : "Thêm nhà cung cấp"}
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
          setFormCode({ form, type: "supplier" });
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
                entity={FileEntityEnum.SUPPLIER}
                oId={id}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Form.Item
                name="code"
                label={<Label title="Mã nhà cung cấp" required />}
                rules={[{ required: true, message: "Vui lòng nhập mã nhà cung cấp" }]}
              >
                <Input className="h-8 w-full" />
              </Form.Item>

              <Form.Item
                name="name"
                label={<Label title="Tên nhà cung cấp" required />}
                rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp" }]}
              >
                <Input className="h-8 w-full" />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="groupId"
            label={<Label title="Nhóm nhà cung cấp" required />}
            rules={[{ required: true, message: "Vui lòng chọn nhóm nhà cung cấp" }]}
          >
            <AttributeSelect
              type={AttributeTypeEnum.SUPPLIER_GROUP}
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

          <Form.Item name="address" label={<Label title="Địa chỉ" />}>
            <Input placeholder="Nhập địa chỉ" className="h-8 w-full" />
          </Form.Item>

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
