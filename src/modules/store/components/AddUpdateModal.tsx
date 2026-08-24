import React, { useEffect } from "react";
import { Form, FormProps, Input, Modal } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Store } from "../store.model";
import SubmitButton from "@/shared/components/button/SubmitButton";
import {
  AvatarUpload,
  EntityType,
  FileCategory,
  getMainFile,
  Label,
  parseFormDataDates,
  ProvinceSelect,
  randomId,
  setFormErrors,
  useAddressSelector,
  WardSelect,
} from "@/shared";

export const StoreAddUpdateModal: React.FC<AddUpdateModalProps<Store>> = ({
  open,
  editData,
  loading,
  errors,
  onClose,
  onAdd,
  onEdit,
}) => {
  const [form] = Form.useForm();
  const id = editData?.id || randomId();
  const state = Form.useWatch(["address", "state"], form);

  const { provinceOptions, wardOptions } = useAddressSelector(state);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Store>["onFinish"] = async (values: Store) => {
    const formattedData = {
      ...values,
      id,
      tempId: id,
    };

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
      title={editData ? "Chỉnh sửa thông tin cửa hàng" : "Thêm cửa hàng"}
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
          return;
        }
        form;
        const formattedData = parseFormDataDates(editData);
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form className="flex flex-col" form={form} onFinish={onFinish}>
        <div className="flex flex-col md:gap-2">
          <div className="flex flex-col md:flex-row-reverse gap-6">
            <div style={{ width: 100, height: 100 }} className="ml-auto mr-auto select-none mb-4">
              <AvatarUpload
                shape="square"
                size={100}
                limit={50}
                entity={EntityType.STORE}
                category={FileCategory.IMAGE}
                defaultFile={getMainFile(editData?.image)}
                oId={id}
              />
            </div>
            <div className="flex flex-col md:gap-2 flex-1">
              <Form.Item
                name="code"
                label={<Label title="Mã cửa hàng" required />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã cửa hàng",
                  },
                ]}
                className="w-full z-0"
              >
                <Input placeholder="Nhập mã cửa hàng" />
              </Form.Item>

              <Form.Item
                name="name"
                label={<Label title="Tên cửa hàng" required />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên cửa hàng",
                  },
                ]}
              >
                <Input placeholder="Nhập tên cửa hàng" />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            name="phone"
            label={<Label title="Số điện thoại" required />}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
              {
                pattern: /^[0-9]{10,15}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <div className="flex flex-col md:flex-row gap-2.5">
            <Label title="Địa chỉ" required />
            <div className="flex flex-col flex-1">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Form.Item name={["address", "state"]} rules={[{ required: true, message: "" }]}>
                  <ProvinceSelect
                    options={provinceOptions}
                    onChange={(value) => {
                      form.setFieldValue(["address", "state"], value);
                      form.setFieldValue(["address", "ward"], undefined);
                    }}
                  />
                </Form.Item>
                <Form.Item name={["address", "ward"]} rules={[{ required: true, message: "" }]}>
                  <WardSelect options={wardOptions} />
                </Form.Item>
              </div>
              <Form.Item name={["address", "detail"]}>
                <Input placeholder="Địa chỉ cụ thể" />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            name="email"
            label={<Label title="Email" />}
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item name="taxCode" label={<Label title="Mã số thuế" />}>
            <Input placeholder="Nhập mã số thuế" />
          </Form.Item>

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

        <div className="flex w-full justify-center mt-4 action-sticky-bottom">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
