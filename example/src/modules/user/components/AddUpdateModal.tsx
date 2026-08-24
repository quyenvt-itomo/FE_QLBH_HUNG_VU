import React, { useEffect, useMemo } from "react";
import { Input, Modal, Form, Row, Col } from "antd";
import { FormProps } from "antd/lib";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { FileCategory, EntityFile } from "@/shared/constants/enum";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { User } from "../user.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormCode, setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import AvatarUpload from "@/shared/components/upload/AvatarUpload";
import { getMainFile } from "@/shared/utils/file.util";
import Label from "@/shared/components/display/Label";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { CLASSNAME } from "@/shared/constants/ui";
import { makeFormListEnterHandler } from "@/shared/utils/formListKeyboard";
import { companyTypes, Organization, OrganizationMultipleSelect } from "@/modules/organization";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { RoleSelect } from "@/modules/role";
import { EmployeeSelect } from "@/modules/employee";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { FormSection } from "@/shared/components/form/FormSection";
import { getPhoneRules } from "@/shared/constants/formItemRule";

export const AddUpdateModal: React.FC<AddUpdateModalProps<User>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { message } = useAppMessage();
  const { info, currentStore } = useGlobalData();
  const isAdmin = info?.isAdmin;
  const [form] = Form.useForm<User>();
  const id = editData?.id || randomId();
  const companyUsers = Form.useWatch("companyUsers", form);
  const role = Form.useWatch("role", form);
  const employee = Form.useWatch("employee", form);
  const hideOptions = companyUsers?.map((cu) => cu.company) || [];
  const [defaultValue, setDefaultValue] = useAutoResetItem<Organization>();

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<User>["onFinish"] = async (values: User) => {
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
      title={editData ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={1080}
      // className="fullscreen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        if (!editData) {
          setFormCode({ form, type: "user", field: "code" });
          return;
        }
        const currentStoreUser = editData.companyUsers?.find(
          (cu) => cu.company?.id === currentStore?.id,
        );
        const formattedData: any = parseFormDataDates({
          ...editData,
          password: editData?.password ? "********" : undefined,
          roleId: currentStoreUser?.roleId,
          role: currentStoreUser?.role,
          employeeId: currentStoreUser?.employeeId,
          employee: currentStoreUser?.employee,
        });
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form
        // layout="vertical"
        autoComplete="off"
        className="flex flex-col h-full w-full overflow-y-auto scrollbar-hide"
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          message.error("Vui lòng kiểm tra lại thông tin");
        }}
        initialValues={{ canLogin: false }}
      >
        <div className="flex flex-col w-full">
          <div style={{ width: 86, height: 86 }} className="mx-auto select-none">
            <AvatarUpload
              shape="circle"
              size={86}
              limit={50}
              entity={EntityFile.USER}
              category={FileCategory.AVATAR}
              defaultFile={getMainFile(editData?.avatar)}
              oId={id}
              onMoveToTrash={(file) => {
                const trashFileIds: string[] = form.getFieldValue("__trashFileIds") || [];
                if (trashFileIds.includes(file.id)) return;
                form.setFieldValue("__trashFileIds", [...trashFileIds, file.id]);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FormSection title="Thông tin tài khoản">
              <Row gutter={[64, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="code"
                    label={<Label title="Mã người dùng" required />}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã người dùng",
                      },
                    ]}
                    className="z-0"
                  >
                    <Input
                      placeholder="Nhập mã người dùng"
                      className={`${CLASSNAME.inputHeight} w-full`}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
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
                    <Input
                      placeholder="Nhập tên người dùng"
                      className={`${CLASSNAME.inputHeight} w-full`}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="username"
                    label={<Label title="Tên đăng nhập" required />}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên đăng nhập",
                      },
                      {
                        pattern: /^(?!.*admin).*$/,
                        message: "Tên đăng nhập không được chứa 'admin'",
                      },
                    ]}
                  >
                    <Input
                      autoComplete="new-username"
                      placeholder="Nhập tên đăng nhập"
                      className={`${CLASSNAME.inputHeight} w-full`}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
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
                      autoComplete="new-password"
                      disabled={!!editData?.password}
                      placeholder="Nhập mật khẩu"
                      className={`${CLASSNAME.inputHeight} w-full`}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label={<Label title="Email" required />}
                    rules={[
                      {
                        type: "email",
                        message: "Email không hợp lệ",
                      },
                      {
                        required: true,
                        message: "Vui lòng nhập email",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập email" className={`${CLASSNAME.inputHeight} w-full`} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label={<Label title="Số điện thoại" />}
                    rules={getPhoneRules()}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      className={`${CLASSNAME.inputHeight} w-full`}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </FormSection>
            <Row gutter={[64, 0]}>
              <Col span={24}>
                {isAdmin ? (
                  <Form.List name="companyUsers">
                    {(fields, { add, remove }) => (
                      <div
                        className="flex flex-col gap-3 col-span-2"
                        onKeyDown={makeFormListEnterHandler(
                          {
                            type: "select",
                            message: "Vui lòng chọn công đoạn ở ô tìm kiếm để thêm vào danh sách",
                          },
                          { messageApi: message },
                        )}
                      >
                        <FormSection
                          title="Phân quyền"
                          subtitle={
                            <div className="flex-1 h-fit flex justify-end">
                              <OrganizationMultipleSelect
                                defaultData={defaultValue ? [defaultValue] : undefined}
                                value={defaultValue ? [defaultValue.id] : undefined}
                                onChangeData={(values) => {
                                  const value = values?.[0];
                                  if (!value) return;
                                  setDefaultValue(value);
                                  add({
                                    storeId: value.id,
                                    company: value,
                                  });
                                }}
                                hideOptions={hideOptions}
                                prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
                                suffixIcon={false}
                                query={{ types: companyTypes, getAll: true }}
                                className="!w-96"
                                placeholder="Tìm kiếm công ty để thêm vào danh sách"
                              />
                            </div>
                          }
                        >
                          <div className="h-40 overflow-y-auto scrollbar-hide">
                            <table className="w-full table-fixed">
                              <colgroup>
                                <col />
                                <col style={{ width: 260 }} />
                                <col style={{ width: 260 }} />
                                <col style={{ width: 32 }} />
                              </colgroup>
                              {fields.map(({ key: fieldKey, name }) => {
                                const { company, role, employee } = companyUsers?.[name] || {};

                                return (
                                  <tr key={fieldKey} className="border-b border-dashed">
                                    <td className="py-1">{company?.name}</td>
                                    <td>
                                      <Form.Item
                                        name={[name, "roleId"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Vui lòng chọn vai trò",
                                          },
                                        ]}
                                        noStyle
                                      >
                                        <RoleSelect
                                          defaultData={role}
                                          onChangeData={(val) =>
                                            form.setFieldValue(["companyUsers", name, "role"], val)
                                          }
                                          query={{ storeId: company?.id }}
                                        />
                                      </Form.Item>
                                    </td>
                                    <td>
                                      <Form.Item name={[name, "employeeId"]} noStyle>
                                        <EmployeeSelect
                                          defaultData={employee}
                                          onChangeData={(val) =>
                                            form.setFieldValue(
                                              ["companyUsers", name, "employee"],
                                              val,
                                            )
                                          }
                                          query={{ storeId: company?.id }}
                                        />
                                      </Form.Item>
                                    </td>
                                    <td className="pr-1">
                                      <div className="flex items-center justify-end">
                                        <button
                                          type="button"
                                          onClick={() => remove(name)}
                                          className="text-red-400 hover:text-red-500"
                                        >
                                          <TrashIcon className="w-5 h-5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}

                              {fields.length === 0 && (
                                <tr>
                                  <td colSpan={4}>
                                    <div className="w-full h-32 flex justify-center items-center text-gray-400 text-sm italic">
                                      Chưa có công ty nào được phân quyền
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </table>
                          </div>
                        </FormSection>
                      </div>
                    )}
                  </Form.List>
                ) : (
                  <FormSection title="Phân quyền">
                    <Row gutter={[64, 0]}>
                      <Col span={12}>
                        <Form.Item
                          name="roleId"
                          label={<Label title="Vai trò" required />}
                          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                        >
                          <RoleSelect
                            defaultData={role}
                            onChangeData={(val) => (form as any).setFieldValue("role", val)}
                            query={{ storeId: currentStore?.id }}
                          />
                        </Form.Item>
                        <Form.Item name="role" hidden />
                      </Col>
                      <Col span={12}>
                        <Form.Item name="employeeId" label={<Label title="Nhân viên" />}>
                          <EmployeeSelect
                            defaultData={employee}
                            onChangeData={(val) => (form as any).setFieldValue("employee", val)}
                            query={{ storeId: currentStore?.id }}
                          />
                        </Form.Item>
                        <Form.Item name="employee" hidden />
                      </Col>
                    </Row>
                  </FormSection>
                )}
              </Col>
            </Row>
            <div className="px-6">
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
          </div>
        </div>

        <div className="flex w-full justify-center mt-auto mb-0 action-sticky-bottom">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
