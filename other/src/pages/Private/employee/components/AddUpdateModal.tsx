import React, { useEffect } from "react";
import { Input, Modal, Form, Tooltip } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../models/base/interface";
import { setFormCode, setFormErrors } from "../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../utils/dateUtils";
import SubmitButton from "../../../../components/button/SubmitButton";
import AttributeSelect from "../../../../components/manager_select/AttributeSelect";
import { AttributeTypeEnum, FileCategoryEnum, FileEntityEnum } from "../../../../constants/enum";
import AvatarUpload from "../../../../components/upload/AvatarUpload";
import { randomId } from "../../../../utils/common";
import Label from "../../../../components/display/Label";
import { IAttribute } from "../../../../models/base/attribute";
import { useAddressSelector } from "../../../../hooks/core/useAddressSelector";
import ProvinceSelect from "../../../../components/no_hook_selects/ProvinceSelect";
import WardSelect from "../../../../components/no_hook_selects/WardSelect";
import { IEmployee } from "../../../../models/store/employee";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";

const AddUpdateModal: React.FC<AddUpdateModalProps<IEmployee>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm();
  const id = editData?.id || randomId();
  const position: IAttribute | undefined = Form.useWatch("position", form);
  const state = Form.useWatch(["address", "state"], form);
  const store = Form.useWatch("store", form);

  const { currentStore } = useClientData();

  const { provinces, wards } = useAddressSelector(state);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IEmployee>["onFinish"] = async (values: IEmployee) => {
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
      title={editData ? "Chỉnh sửa thông tin nhân sự" : "Thêm nhân sự"}
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
          setFormCode({ form, type: "employee", field: "code" });
          return;
        }
        const formattedData = parseFormDataDates(editData);
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form className="flex flex-col" form={form} onFinish={onFinish}>
        <div className="flex flex-col gap-2 pt-8">
          <div className="flex flex-row-reverse gap-6">
            <div style={{ width: 100, height: 100 }} className="ml-auto mr-auto select-none mb-4">
              <AvatarUpload
                shape="square"
                size={100}
                limit={50}
                entity={FileEntityEnum.EMPLOYEE}
                category={FileCategoryEnum.AVATAR}
                oId={id}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Form.Item
                name="code"
                label={<Label title="Mã nhân sự" required />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã nhân sự",
                  },
                ]}
                className="w-full z-0"
              >
                <Input placeholder="Nhập mã nhân sự" className="h-8 w-full" />
              </Form.Item>

              <Form.Item
                name="name"
                label={<Label title="Tên nhân sự" required />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhân sự",
                  },
                ]}
              >
                <Input placeholder="Nhập tên nhân sự" className="h-8 w-full" />
              </Form.Item>
            </div>
          </div>
          {!currentStore && (
            <>
              <Form.Item
                name="storeId"
                label={<Label title="Cửa hàng" required />}
                rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
              >
                <StoreSelect
                  defaultData={store}
                  onChangeData={(data) => form.setFieldValue("store", data)}
                />
              </Form.Item>
              <Form.Item name="store" hidden />
            </>
          )}
          <Form.Item
            name="phone"
            label={<Label title="Số điện thoại" required />}
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" className="h-8 w-full" />
          </Form.Item>
          <Form.Item
            name="email"
            label={<Label title="Email" />}
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input placeholder="Nhập email" className="h-8 w-full" />
          </Form.Item>
          <Form.Item name="identityNumber" label={<Label title="CCCD/CMND" />}>
            <Input placeholder="Nhập CCCD/CMND" className="h-8 w-full" />
          </Form.Item>

          <Form.Item name="positionId" label={<Label title="Vị trí công việc" />}>
            <AttributeSelect
              type={AttributeTypeEnum.EMPLOYEE_POSITION}
              defaultData={position}
              onChangeData={(value) => form.setFieldValue("position", value)}
            />
          </Form.Item>
          <Form.Item name="position" hidden />

          <div className="flex gap-2.5">
            <Label title="Địa chỉ" />
            <div className="flex flex-col flex-1">
              <div className="grid grid-cols-2 gap-3 mb-2">
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

          <Form.Item name="note" label={<Label title="Ghi chú" />}>
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

export default AddUpdateModal;
