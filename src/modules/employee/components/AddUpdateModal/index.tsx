import React, { useEffect, useRef } from "react";
import { Input, Modal, Form, FormInstance, Spin } from "antd";
import { FormProps } from "antd/lib";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { FileCategory, EntityType } from "@/shared/constants/enum";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Employee } from "../../employee.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import AvatarUpload from "@/shared/components/upload/AvatarUpload";
import { getMainFile } from "@/shared/utils/file.util";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { AnchorInfo } from "./Anchor";
import "./index.css";
import { BasicInfo } from "./BasicInfo";
import { ContactInfo } from "./ContactInfo";
import { JobInfo } from "./JobInfo";

export interface AddUpdateModalPartialProps {
  form: FormInstance<Employee>;
  id: string;
}

export const AddUpdateModal: React.FC<AddUpdateModalProps<Employee>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { message, showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Employee>();
  const id = editData?.id || randomId();
  const formScrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Employee>["onFinish"] = async (values: Employee) => {
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
      title={editData ? "Chỉnh sửa thông tin nhân sự" : "Thêm nhân sự"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={"100vw"}
      className="fullscreen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        if (!editData) {
          return;
        }
        const formattedData: any = parseFormDataDates(editData);
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <div className={`employee-info flex flex-col h-full relative`}>
        {loading && (
          <div className="absolute z-10 h-full w-full top-0 flex items-center justify-center bg-slate-50/50">
            <Spin />
          </div>
        )}
        <div className="flex h-full">
          {/* Cột bên trái */}
          <div className="flex flex-col h-full gap-4 employee-info ">
            <div style={{ width: 100, height: 100 }} className="ml-auto mr-auto select-none">
              <AvatarUpload
                shape="circle"
                size={100}
                limit={50}
                entity={EntityType.EMPLOYEE}
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

            <div className="flex-1 w-full overflow-x-hidden overflow-y-auto">
              <AnchorInfo scrollContainerRef={formScrollContainerRef} />
            </div>
          </div>
          {/* Cột bên phải */}
          <div
            ref={formScrollContainerRef}
            className={`h-full flex-1 overflow-x-hidden overflow-y-auto border-s pl-6 pr-2 scroll-smooth`}
          >
            <Form
              onFinish={onFinish}
              onFinishFailed={showFormErrorMessages}
              form={form}
              layout="horizontal"
              className=""
            >
              <BasicInfo form={form} id={id} />
              <ContactInfo form={form} id={id} />
              <JobInfo form={form} id={id} />
              <div className="flex w-full justify-center mt-auto mb-0 pt-4 action-sticky-bottom">
                <SubmitButton loading={loading} onCancel={handleCancel} />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
