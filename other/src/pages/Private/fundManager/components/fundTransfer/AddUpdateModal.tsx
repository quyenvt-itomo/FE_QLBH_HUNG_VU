import React, { useEffect } from "react";
import { Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { IFundTransfer } from "../../../../../models/fundTransfer";
import { randomId } from "../../../../../utils/common";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import Label from "../../../../../components/display/Label";
import SubmitButton from "../../../../../components/button/SubmitButton";
import dayjs from "dayjs";
import { DatePickerCustom, InputMoney } from "../../../../../components/input";
import FundSelect from "../../../../../components/no_hook_selects/FundSelect";

const AddUpdateModal: React.FC<AddUpdateModalProps<IFundTransfer>> = ({
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
  const fromFund = Form.useWatch("fromFund", form);
  const toFund = Form.useWatch("toFund", form);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IFundTransfer>["onFinish"] = async (values: IFundTransfer) => {
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
      title={editData ? "Chỉnh sửa thông tin phiếu chuyển quỹ" : "Thêm phiếu chuyển quỹ"}
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
          setFormCode({ form, type: "fundTransfer", field: "code" });
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
          name="fromFundId"
          label={<Label title="Quỹ nguồn" required />}
          rules={[{ required: true, message: "Vui lòng chọn quỹ nguồn" }]}
        >
          <FundSelect
            hideOptions={toFund ? [toFund] : undefined}
            onChangeData={(data) => form.setFieldValue("fromFund", data)}
          />
        </Form.Item>
        <Form.Item name="fromFund" hidden />

        <Form.Item
          name="toFundId"
          label={<Label title="Quỹ nhận" required />}
          rules={[{ required: true, message: "Vui lòng chọn quỹ nhận" }]}
        >
          <FundSelect
            hideOptions={fromFund ? [fromFund] : undefined}
            onChangeData={(data) => form.setFieldValue("toFund", data)}
          />
        </Form.Item>
        <Form.Item name="toFund" hidden />

        <Form.Item
          name="amount"
          label={<Label title="Số tiền" required />}
          rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
        >
          <InputMoney placeholder="Nhập số tiền" notRightAlign />
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
