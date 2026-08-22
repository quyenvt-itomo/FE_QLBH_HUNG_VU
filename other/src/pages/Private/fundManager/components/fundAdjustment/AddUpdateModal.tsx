import React, { useEffect } from "react";
import { Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { IFundAdjustment } from "../../../../../models/fundAdjustment";
import { randomId } from "../../../../../utils/common";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import Label from "../../../../../components/display/Label";
import SubmitButton from "../../../../../components/button/SubmitButton";
import dayjs from "dayjs";
import { DatePickerCustom, InputMoney } from "../../../../../components/input";
import FundSelect from "../../../../../components/no_hook_selects/FundSelect";

const AddUpdateModal: React.FC<AddUpdateModalProps<IFundAdjustment>> = ({
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
  const formValue = Form.useWatch([], form);
  const diffAmount = (formValue?.expectedAmount || 0) - (formValue?.countedAmount || 0);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IFundAdjustment>["onFinish"] = async (values: IFundAdjustment) => {
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
      title={editData ? "Chỉnh sửa thông tin phiếu kiểm quỹ" : "Thêm phiếu kiểm quỹ"}
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
          setFormCode({ form, type: "fundAdjustment", field: "code" });
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
          name="fundId"
          label={<Label title="Quỹ thực hiện" required />}
          rules={[{ required: true, message: "Vui lòng chọn quỹ thực hiện" }]}
        >
          <FundSelect
            defaultData={formValue?.fund}
            onChangeData={(fund) =>
              form.setFieldsValue({
                fund,
                countedAmount: fund?.currentBalance,
              })
            }
          />
        </Form.Item>
        <Form.Item name="fund" hidden />

        <Form.Item name="countedAmount" label={<Label title="Số dư hệ thống" />}>
          <InputMoney notRightAlign disabled />
        </Form.Item>

        <Form.Item
          name="expectedAmount"
          label={<Label title="Số dư thực tế" required />}
          rules={[{ required: true, message: "Vui lòng nhập giá trị tồn" }]}
        >
          <InputMoney placeholder="Nhập giá trị tồn" notRightAlign />
        </Form.Item>

        <div className="flex items-center gap-2.5 pb-[22px]">
          <Label title="Chênh lệch" />
          <InputMoney notRightAlign disabled value={diffAmount} />
        </div>

        <Form.Item name="reason" label={<Label title="Lý do kiểm quỹ" />}>
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
