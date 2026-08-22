import React, { useEffect } from "react";
import { Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { randomId } from "../../../../../utils/common";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import Label from "../../../../../components/display/Label";
import SubmitButton from "../../../../../components/button/SubmitButton";
import dayjs from "dayjs";
import { DatePickerCustom, InputMoney } from "../../../../../components/input";
import EmployeeSelect from "../../../../../components/select/EmployeeSelect";
import { IVatAdjustment } from "../../../../../models/store/vatAdjustment";

const AddUpdateModal: React.FC<AddUpdateModalProps<IVatAdjustment>> = ({
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
  const adjustedBy = Form.useWatch("adjustedBy", form);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IVatAdjustment>["onFinish"] = async (values: IVatAdjustment) => {
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
      title={`${editData ? "Chỉnh sửa " : "Thêm"} phiếu điều chỉnh thuế VAT`}
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
          setFormCode({ form, type: "vatDebtAdjustment", field: "code" });
          return;
        }
        const formattedData = parseFormDataDates(editData);
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form
        className="flex flex-col mt-4 pt-4 gap-4"
        form={form}
        onFinish={onFinish}
        initialValues={{ occurredAt: dayjs() }}
      >
        <Form.Item
          name="occurredAt"
          label={<Label title="Ngày" required />}
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePickerCustom />
        </Form.Item>
        <Form.Item
          name="code"
          label={<Label title="Số phiếu" required />}
          rules={[{ required: true, message: "Vui lòng nhập số phiếu" }]}
          className="w-full z-0"
        >
          <Input placeholder="Nhập số phiếu" className="h-8 w-full" />
        </Form.Item>

        <Form.Item
          name="expectedAmount"
          label={<Label title="Giá trị điều chỉnh" required />}
          rules={[{ required: true, message: "Vui lòng nhập giá trị điều chỉnh" }]}
        >
          <InputMoney placeholder="Nhập giá trị điều chỉnh" notRightAlign />
        </Form.Item>

        <Form.Item name="adjustedById" label={<Label title="Người thực hiện" />}>
          <EmployeeSelect
            defaultData={adjustedBy}
            onChangeData={(data) => form.setFieldValue("adjustedBy", data)}
          />
        </Form.Item>
        <Form.Item name="adjustedBy" hidden />

        <Form.Item name="reason" label={<Label title="Lý do điều chỉnh" />}>
          <Input placeholder="Nhập lý do" className="h-8 w-full" />
        </Form.Item>

        <Form.Item name="note" label={<Label title="Ghi chú" />}>
          <Input.TextArea
            placeholder="Ghi chú"
            autoSize={{ minRows: 2, maxRows: 6 }}
            count={{ max: 250, show: true }}
          />
        </Form.Item>

        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddUpdateModal;
