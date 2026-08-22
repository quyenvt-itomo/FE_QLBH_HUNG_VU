import React, { useEffect, useState } from "react";
import { Input, Modal, Form, Button } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import SubmitButton from "../../../../../components/button/SubmitButton";
import { FileCategoryEnum, FileEntityEnum } from "../../../../../constants/enum";
import { randomId } from "../../../../../utils/common";
import Label from "../../../../../components/display/Label";
import { IUser } from "../../../../../models/user";
import AvatarUpload from "../../../../../components/upload/AvatarUpload";
import Title from "../../../../../components/display/Title";
import SystemRoleSelect from "../../../../../components/select/SystemRoleSelect";
import StoreSelect from "../../../../../components/select/StoreSelect";
import RoleSelect from "../../../../../components/no_hook_selects/RoleSelect";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { IStore } from "../../../../../models/store";
import { getMainImage } from "../../../../../utils/fileUtil";
import EmployeeSelect from "../../../../../components/add_select/EmployeeSelect";

const AddUpdateModal: React.FC<AddUpdateModalProps<IUser>> = ({
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
  const systemRole: IUser["systemRole"] = Form.useWatch("systemRole", form);
  const employee: IUser["employee"] = Form.useWatch("employee", form);
  const storeUsers: IUser["storeUsers"] = Form.useWatch("storeUsers", form);
  const [defaultStore, setDefaultStore] = useState<IStore | undefined>(undefined);
  const storeInStoreUsers = (storeUsers || [])?.map((su) => su.store);

  useEffect(() => {
    if (!defaultStore) return;

    setDefaultStore(undefined);
  }, [defaultStore]);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IUser>["onFinish"] = async (values: IUser) => {
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
      title={editData ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={1200}
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        if (!editData) {
          setFormCode({ form, type: "user", field: "code" });
          return;
        }
        const formattedData = parseFormDataDates({
          ...editData,
          password: "********",
        });
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form autoComplete="off" className="flex flex-col" form={form} onFinish={onFinish}>
        <div className="flex mt-4 h-[calc(80vh-36px)] overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-2 w-1/2 pr-8 border-r">
            <Title content="Thông tin chung" />
            <div className="flex flex-row-reverse gap-6">
              <div style={{ width: 100, height: 100 }} className="ml-auto mr-auto select-none mb-4">
                <AvatarUpload
                  shape="square"
                  size={100}
                  limit={50}
                  entity={FileEntityEnum.USER}
                  category={FileCategoryEnum.AVATAR}
                  defaultFile={getMainImage(editData?.avatar)}
                  oId={id}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Form.Item
                  name="code"
                  label={<Label title="Mã người dùng" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã người dùng",
                    },
                  ]}
                  className="w-full z-0"
                >
                  <Input placeholder="Nhập mã người dùng" className="h-8 w-full" />
                </Form.Item>

                <Form.Item
                  name="name"
                  label={<Label title="Tên người dùng" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người dùng",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên người dùng" className="h-8 w-full" />
                </Form.Item>
              </div>
            </div>
            <Form.Item name="employeeId" label={<Label title="Nhân sự" />}>
              <EmployeeSelect
                defaultData={employee}
                onChangeData={(value) => {
                  const name = form.getFieldValue("employee")?.name;
                  form.setFieldsValue({
                    employee: value,
                    phone: value?.phone,
                    email: value?.email,
                    name: name || value?.name,
                  });
                }}
              />
            </Form.Item>
            <Form.Item name="employee" hidden />
            <Form.Item
              name="phone"
              label={<Label title="Số điện thoại" />}
              rules={[
                {
                  pattern: /^[0-9]{10,15}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
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

          <div className="flex flex-col gap-2 w-1/2 h-full pl-8">
            <Title content="Thông tin đăng nhập" />
            <Form.Item
              name="username"
              label={<Label title="Tên đăng nhập" required />}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập",
                },
                // Tên đăng nhập lowercase không được chứa admin
                {
                  pattern: /^(?!.*admin).*$/,
                  message: "Tên đăng nhập không được chứa 'admin'",
                },
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" className="h-8 w-full" />
            </Form.Item>
            <Form.Item
              name="password"
              label={<Label title="Mật khẩu" required />}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              ]}
            >
              <Input.Password
                disabled={!!editData}
                placeholder="Nhập mật khẩu"
                className="h-8 w-full"
              />
            </Form.Item>
            <Form.Item name="systemRoleId" label={<Label title="Vai trò hệ thống" />}>
              <SystemRoleSelect
                defaultData={systemRole}
                onChangeData={(data) => {
                  form.setFieldValue("systemRole", data);
                }}
              />
            </Form.Item>
            <Form.Item name="systemRole" hidden />

            <Form.List name="storeUsers">
              {(fields, { add, remove }) => (
                <div>
                  <div className="flex flex-col mb-3">
                    <Label title="Vai trò tại cửa hàng" bold />
                    <div className="w-full relative">
                      <StoreSelect
                        value={defaultStore?.id}
                        onChangeData={(data) => {
                          setDefaultStore(data);
                          add({ store: data, storeId: data?.id, roleId: undefined });
                        }}
                        className="search-select"
                        hideOptions={storeInStoreUsers}
                        suffixIcon={false}
                        placeholder="Tìm kiếm và chọn cửa hàng"
                      />
                      <MagnifyingGlassIcon className="absolute z-10 left-2 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 text-[#747E76]" />
                    </div>
                  </div>
                  <table className="w-full">
                    <colgroup>
                      <col style={{ width: 212 }} />
                      <col />
                      <col style={{ width: 36 }} />
                    </colgroup>
                    <tbody>
                      {fields.map((field) => (
                        <tr key={field.key}>
                          <td className="py-1 pr-1">
                            <Form.Item {...field} name={[field.name, "id"]} hidden />
                            <div className="h-full flex items-center px-2 border-l border-l-primary pl-2">
                              <span className="block truncate w-full">
                                {storeUsers?.[field.name]?.store?.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-1">
                            <Form.Item
                              {...field}
                              name={[field.name, "roleId"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn vai trò",
                                },
                              ]}
                              noStyle
                            >
                              <RoleSelect options={storeUsers?.[field.name]?.store?.roles || []} />
                            </Form.Item>
                          </td>
                          <td className="py-1">
                            <div className="flex h-8 w-9 items-center justify-center">
                              <Button
                                type="link"
                                htmlType="button"
                                danger
                                onClick={() => remove(field.name)}
                              >
                                <TrashIcon className="h-5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Form.List>
          </div>
        </div>

        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddUpdateModal;
