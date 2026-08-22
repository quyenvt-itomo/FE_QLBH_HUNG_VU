import React, { useEffect } from "react";
import { Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import SubmitButton from "../../../../../components/button/SubmitButton";
import { FileCategoryEnum, FileEntityEnum } from "../../../../../constants/enum";
import { randomId } from "../../../../../utils/common";
import Label from "../../../../../components/display/Label";
import { useAddressSelector } from "../../../../../hooks/core/useAddressSelector";
import ProvinceSelect from "../../../../../components/no_hook_selects/ProvinceSelect";
import WardSelect from "../../../../../components/no_hook_selects/WardSelect";
import { IStore } from "../../../../../models/store";
import AvatarUpload from "../../../../../components/upload/AvatarUpload";
import { getMainImage } from "../../../../../utils/fileUtil";

const AddUpdateModal: React.FC<AddUpdateModalProps<IStore>> = ({
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
  const state = Form.useWatch(["address", "state"], form);

  const { provinces, wards } = useAddressSelector(state);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IStore>["onFinish"] = async (values: IStore) => {
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
          setFormCode({ form, type: "store", field: "code" });
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
                entity={FileEntityEnum.STORE}
                category={FileCategoryEnum.IMAGE}
                defaultFile={getMainImage(editData?.image)}
                oId={id}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
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
                <Input placeholder="Nhập mã cửa hàng" className="h-8 w-full" />
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
                <Input placeholder="Nhập tên cửa hàng" className="h-8 w-full" />
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
            <Input placeholder="Nhập số điện thoại" className="h-8 w-full" />
          </Form.Item>

          <div className="flex gap-2.5">
            <Label title="Địa chỉ" required />
            <div className="flex flex-col flex-1">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Form.Item name={["address", "state"]} rules={[{ required: true, message: "" }]}>
                  <ProvinceSelect
                    options={provinces.map((p) => {
                      return { value: p.Name, label: p.Name };
                    })}
                  />
                </Form.Item>
                <Form.Item name={["address", "ward"]} rules={[{ required: true, message: "" }]}>
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
          <Form.Item
            name="email"
            label={<Label title="Email" />}
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input placeholder="Nhập email" className="h-8 w-full" />
          </Form.Item>
          <Form.Item name="taxCode" label={<Label title="Mã số thuế" />}>
            <Input placeholder="Nhập mã số thuế" className="h-8 w-full" />
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

        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddUpdateModal;
