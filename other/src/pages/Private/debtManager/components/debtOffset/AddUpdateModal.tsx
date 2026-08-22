import React, { useEffect } from "react";
import { Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { IDebtOffset } from "../../../../../models/store/debtOffset";
import { randomId } from "../../../../../utils/common";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import Label from "../../../../../components/display/Label";
import SubmitButton from "../../../../../components/button/SubmitButton";
import dayjs from "dayjs";
import { DatePickerCustom, InputMoney } from "../../../../../components/input";
import PartnerSelect from "../../../../../components/select/PartnerSelect";

const AddUpdateModal: React.FC<AddUpdateModalProps<IDebtOffset>> = ({
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
  const occurredAt = Form.useWatch("occurredAt", form);
  const partner = Form.useWatch("partner", form);
  const adjustedBy = Form.useWatch("adjustedBy", form);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IDebtOffset>["onFinish"] = async (values: IDebtOffset) => {
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
      title={editData ? "Chỉnh sửa thông tin phiếu đối trừ công nợ" : "Thêm phiếu đối trừ công nợ"}
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
          setFormCode({ form, type: "partnerDebtOffset", field: "code" });
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
          <DatePickerCustom
            onChange={(date) =>
              form.setFieldsValue({
                partnerId: undefined,
                partner: undefined,
                payableDebtAmount: undefined,
                receivableDebtAmount: undefined,
                occurredAt: date,
              })
            }
          />
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
          name="partnerId"
          label={<Label title="Đối tác thực hiện" required />}
          rules={[{ required: true, message: "Vui lòng chọn đối tác thực hiện" }]}
        >
          <PartnerSelect
            offsetAt={occurredAt ? dayjs(occurredAt).toISOString() : undefined}
            defaultData={partner}
            onChangeData={(data) =>
              form.setFieldsValue({
                partner: data,
                receivableDebtAmount: data?.receivableDebtAmount || 0,
                payableDebtAmount: data?.payableDebtAmount || 0,
              })
            }
          />
        </Form.Item>
        <Form.Item name="partner" hidden />

        <Form.Item name="receivableDebtAmount" label={<Label title="Công nợ phải thu" />}>
          <InputMoney notRightAlign disabled />
        </Form.Item>

        <Form.Item name="payableDebtAmount" label={<Label title="Công nợ phải trả" />}>
          <InputMoney notRightAlign disabled />
        </Form.Item>

        <Form.Item
          name="offsetAmount"
          label={<Label title="Giá trị đối trừ" required />}
          rules={[{ required: true, message: "Vui lòng nhập giá trị đối trừ" }]}
        >
          <InputMoney placeholder="Nhập giá trị đối trừ" notRightAlign />
        </Form.Item>

        <Form.Item name="reason" label={<Label title="Lý do đối trừ" />}>
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
