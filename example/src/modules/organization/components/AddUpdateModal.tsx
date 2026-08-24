import React, { useEffect, useMemo } from "react";
import { Input, Modal, Form, Select, App, Empty, Checkbox } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Organization } from "../organization.model";
import { randomId } from "@/shared/utils/common.util";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";
import { setFormCode, setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import AvatarUpload from "@/shared/components/upload/AvatarUpload";
import { FileCategory, EntityType } from "@/shared/constants/enum";
import { getMainFile, deletePendingFiles } from "@/shared/utils/file.util";
import Label from "@/shared/components/display/Label";
import FormItemWithDiff from "@/shared/components/form/FormItemWithDiff";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { CLASSNAME } from "@/shared/constants/ui";
import { OrganizationSelect } from "./Select";
import {
  companyTypes,
  OrganizationTypeEnum,
  organizationTypeMap,
  organizationTypeOptionByParent,
} from "../organization.enum";
import { ChevronDownIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { makeFormListEnterHandler } from "@/shared/utils/formListKeyboard";
import { Attribute, AttributeManagerMultipleSelect } from "@/modules/attribute";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { AttributeType } from "@/modules/attribute";
import { EmployeeSelect } from "@/modules/employee";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { ProvinceSelect, WardSelect } from "@/shared/components/select/AddressSelect";
import { AppSwitch } from "@/shared/components/input";
import { phoneRule } from "@/shared/constants/formItemRule";

export const AddUpdateModal: React.FC<AddUpdateModalProps<Organization>> = ({
  form,
  open,
  editData,
  loading,
  errors,
  defaultData,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { message } = App.useApp();
  const id = editData?.id || randomId();
  const manager = Form.useWatch("manager", form);
  const state = Form.useWatch(["address", "state"], form);
  const parent = Form.useWatch("parent", form);
  const type = Form.useWatch("type", form);
  const [defaultValue, setDefaultValue] = useAutoResetItem<Attribute>();
  const operations = Form.useWatch("operations", form) || [];
  const hideOptions = operations.map((op) => op.operation);

  const isHeadquarter = editData?.type === OrganizationTypeEnum.HEADQUARTER;

  const { provinceOptions, wardOptions } = useAddressSelector(state);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Organization>["onFinish"] = async (values: Organization) => {
    if (type === OrganizationTypeEnum.TEAM && (!operations || operations.length === 0)) {
      message.error("Vui lòng thêm ít nhất một công đoạn sản xuất cho tổ sản xuất");
      return;
    }

    const formattedData: Organization = {
      ...values,
      id,
      tempId: id,
      operations: values.type === OrganizationTypeEnum.TEAM ? values.operations : [],
    };

    if (editData) {
      onEdit?.(formattedData);
    } else {
      onAdd?.(formattedData);
    }
  };

  const handleCancel = () => {
    onClose?.();
    deletePendingFiles(id);
  };

  return (
    <Modal
      title={editData ? "Chỉnh sửa thông tin đơn vị" : "Thêm đơn vị"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={"600px"}
      afterOpenChange={(open) => {
        if (!open) {
          form?.resetFields();
          return;
        }

        form?.setFieldValue("__trashFileIds", []);

        if (!editData) {
          setFormCode({ form, type: "organization", field: "code" });
          if (defaultData) form?.setFieldsValue(parseFormDataDates(defaultData));
          return;
        }
        const formattedData = parseFormDataDates(editData);
        form?.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form
        className="flex flex-col max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-hide"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item name="__trashFileIds" hidden />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row-reverse gap-6">
            <div style={{ width: 92, height: 92 }} className="ml-auto mr-auto select-none mb-5">
              <AvatarUpload
                shape="square"
                size={92}
                limit={50}
                entity={EntityType.ORGANIZATION}
                category={FileCategory.LOGO}
                defaultFile={getMainFile(editData?.logo)}
                oId={id}
                onMoveToTrash={(file) => {
                  const trashFileIds: string[] = form?.getFieldValue("__trashFileIds") || [];
                  if (trashFileIds.includes(file.id)) return;
                  form?.setFieldValue("__trashFileIds", [...trashFileIds, file.id]);
                }}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Form.Item
                name="parentId"
                label={<Label title="Thuộc đơn vị" required={!isHeadquarter} />}
                rules={
                  !isHeadquarter ? [{ required: true, message: "Vui lòng chọn đơn vị" }] : undefined
                }
              >
                <OrganizationSelect
                  defaultData={parent}
                  onChangeData={(val) => {
                    form?.setFieldValue("parent", val);
                    const availableTypes = organizationTypeOptionByParent(val?.type).map(
                      (opt) => opt.value,
                    );
                    form?.setFieldValue("type", availableTypes?.[0]);
                  }}
                  disabled={isHeadquarter}
                />
              </Form.Item>
              <Form.Item name="parent" hidden />
              <FormItemWithDiff
                name="code"
                label={<Label title="Mã đơn vị" required />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã đơn vị",
                  },
                ]}
                className="w-full z-0"
                originalValue={editData?.code}
              >
                <Input placeholder="Nhập mã đơn vị" className={`${CLASSNAME.inputHeight} w-full`} />
              </FormItemWithDiff>
            </div>
          </div>
          <FormItemWithDiff
            name="name"
            label={<Label title="Tên đơn vị" required />}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên đơn vị",
              },
            ]}
            originalValue={editData?.name}
          >
            <Input placeholder="Nhập tên đơn vị" className={`${CLASSNAME.inputHeight} w-full`} />
          </FormItemWithDiff>
          <FormItemWithDiff
            name="type"
            label={<Label title="Cấp tổ chức" required />}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn cấp tổ chức",
              },
            ]}
            originalValue={editData?.type}
            renderValue={(v) => organizationTypeMap[v as OrganizationTypeEnum] || String(v)}
          >
            <Select
              showSearch
              options={organizationTypeOptionByParent(parent?.type)}
              className={CLASSNAME.inputHeight}
              suffixIcon={<ChevronDownIcon className="h-3.5" />}
            />
          </FormItemWithDiff>
          <Form.List name="operations">
            {(fields, { add, remove }) => (
              <div
                className={`${type === OrganizationTypeEnum.TEAM ? "flex" : "hidden"} gap-2.5`}
                onKeyDown={makeFormListEnterHandler(
                  {
                    type: "select",
                    message: "Vui lòng chọn công đoạn ở ô tìm kiếm để thêm vào danh sách",
                  },
                  { messageApi: message },
                )}
              >
                <Label title="CĐSX đảm nhiệm" required />
                <div className="flex flex-col gap-2 w-[calc(100%-154px)]">
                  {/* HEADER */}
                  <div className="flex flex-col">
                    <AttributeManagerMultipleSelect
                      type={AttributeType.OPERATION}
                      defaultData={defaultValue ? [defaultValue] : undefined}
                      value={defaultValue ? [defaultValue.id] : undefined}
                      onChangeData={(values) => {
                        const value = values?.[0];
                        if (!value) return;
                        setDefaultValue(value);
                        add({
                          operationId: value.id,
                          operation: value,
                        });
                      }}
                      hideOptions={hideOptions}
                      prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
                      suffixIcon={false}
                      placeholder="Tìm kiếm công đoạn để thêm vào danh sách"
                    />
                  </div>

                  <div className="h-40 overflow-y-auto">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col style={{ width: 32 }} />
                        <col />
                        <col style={{ width: 32 }} />
                      </colgroup>
                      {fields.map(({ key: fieldKey, name }) => {
                        const operation = operations?.[name]?.operation;

                        return (
                          <tr key={fieldKey} className="border-b border-dashed">
                            <td className="text-center">{name + 1}</td>
                            <td className="py-1">{operation?.name}</td>

                            {/* DELETE */}
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
                    </table>
                  </div>
                </div>
              </div>
            )}
          </Form.List>
          <FormItemWithDiff
            name="phone"
            label={<Label title="Số điện thoại" />}
            rules={[phoneRule]}
            originalValue={editData?.phone}
          >
            <Input className={CLASSNAME.inputHeight} />
          </FormItemWithDiff>
          <FormItemWithDiff
            name="managerId"
            label={<Label title="Trưởng đơn vị" />}
            originalValue={editData?.managerId}
            renderValue={(v) => editData?.manager?.name}
          >
            <EmployeeSelect
              defaultData={manager}
              onChangeData={(val) => form?.setFieldValue("manager", val)}
              query={{ storeId: id }}
            />
          </FormItemWithDiff>
          <Form.Item name="manager" hidden />
          {companyTypes.includes(type) ? (
            <>
              <div className="flex gap-2.5">
                <Label title="Địa chỉ" required />
                <div className="flex flex-col flex-1">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <FormItemWithDiff
                      name={["address", "state"]}
                      rules={[{ required: true, message: "" }]}
                      originalValue={editData?.address?.state}
                    >
                      <ProvinceSelect
                        options={provinceOptions}
                        onChange={(value) => {
                          form?.setFieldValue(["address", "state"], value);
                          form?.setFieldValue(["address", "ward"], undefined);
                        }}
                      />
                    </FormItemWithDiff>
                    <FormItemWithDiff
                      name={["address", "ward"]}
                      rules={[{ required: true, message: "" }]}
                      originalValue={editData?.address?.ward}
                    >
                      <WardSelect options={wardOptions} />
                    </FormItemWithDiff>
                  </div>
                  <FormItemWithDiff
                    name={["address", "detail"]}
                    originalValue={editData?.address?.detail}
                  >
                    <Input
                      placeholder="Địa chỉ cụ thể"
                      className={`${CLASSNAME.inputHeight} w-full`}
                    />
                  </FormItemWithDiff>
                </div>
              </div>
              <FormItemWithDiff
                name="taxCode"
                label={<Label title="Mã số thuế" />}
                originalValue={editData?.taxCode}
              >
                <Input className={`${CLASSNAME.inputHeight} w-full`} />
              </FormItemWithDiff>
            </>
          ) : (
            <>
              <FormItemWithDiff
                name="industry"
                label={<Label title="Chuyên ngành" />}
                originalValue={editData?.industry}
              >
                <Input className={`${CLASSNAME.inputHeight} w-full`} />
              </FormItemWithDiff>
              <FormItemWithDiff
                name="responsibility"
                label={<Label title="Chức năng nhiệm vụ" />}
                originalValue={editData?.responsibility}
              >
                <Input className={`${CLASSNAME.inputHeight} w-full`} />
              </FormItemWithDiff>
            </>
          )}
          <FormItemWithDiff
            name="establishment"
            label={<Label title="Cơ sở thành lập" />}
            originalValue={editData?.establishment}
          >
            <Input className={`${CLASSNAME.inputHeight} w-full`} />
          </FormItemWithDiff>
          <div className="flex gap-2.5 pl-[154px]">
            <div className="flex flex-1">
              <FileUploadBox
                defaultFiles={editData?.document}
                oId={id}
                entity={EntityType.ORGANIZATION}
                category={FileCategory.DOCUMENT}
                onMoveToTrash={(file) => {
                  const trashFileIds: string[] = form?.getFieldValue("__trashFileIds") || [];
                  if (trashFileIds.includes(file.id)) return;
                  form?.setFieldValue("__trashFileIds", [...trashFileIds, file.id]);
                }}
              />
            </div>
          </div>
        </div>

        {/* <div className="flex w-full justify-center mt-4 action-sticky-bottom">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div> */}
        <div className="flex w-full justify-between mt-4 action-sticky-bottom">
          <div className="flex gap-2 items-center">
            <Form.Item name="__unCloseAfterSucess" valuePropName="checked" noStyle>
              <AppSwitch label="Ở lại sau khi lưu ?" />
            </Form.Item>
          </div>
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
