import React, { useEffect, useMemo } from "react";
import { Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { JobPosition } from "../jobPosition.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormCode, setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import Label from "@/shared/components/display/Label";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { CLASSNAME } from "@/shared/constants/ui";
import { AttributeManagerSelect } from "@/modules/attribute";
import { AttributeType } from "@/modules/attribute";

export const AddUpdateModal: React.FC<AddUpdateModalProps<JobPosition>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { message } = useAppMessage();
  const [form] = Form.useForm<JobPosition>();
  const id = editData?.id || randomId();

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<JobPosition>["onFinish"] = async (values: JobPosition) => {
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
      title={editData ? "Chỉnh sửa thông tin vị trí công việc" : "Thêm vị trí công việc"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        if (!editData) {
          setFormCode({ form, type: "user", field: "code" });
          return;
        }
        const formattedData = parseFormDataDates(editData);
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form
        autoComplete="off"
        className="flex flex-col h-full w-full overflow-y-auto scrollbar-hide"
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          message.error("Vui lòng kiểm tra lại thông tin");
        }}
        initialValues={{ canLogin: false }}
      >
        <Form.Item
          name="name"
          label={<Label title="Vị trí công việc" required />}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên vị trí công việc",
            },
          ]}
        >
          <Input className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item
          name="jobTitleId"
          label={<Label title="Chức danh" required />}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn chức danh",
            },
          ]}
        >
          <AttributeManagerSelect
            type={AttributeType.JOB_TITLE}
            onChangeData={(val) => form.setFieldValue("jobTitle", val)}
          />
        </Form.Item>
        <Form.Item name="level" label={<Label title="Cấp bậc" />}>
          <Input className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item name="note" label={<Label title="Mô tả công việc" />}>
          <Input.TextArea
            autoSize={{
              minRows: 2,
              maxRows: 6,
            }}
          />
        </Form.Item>

        <div className="flex w-full justify-center mt-auto mb-0 action-sticky-bottom">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
