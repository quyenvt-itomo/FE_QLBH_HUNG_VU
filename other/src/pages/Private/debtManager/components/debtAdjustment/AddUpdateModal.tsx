import React, { useEffect } from "react";
import { Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import { IDebtAdjustment } from "../../../../../models/store/debtAdjustment";
import { randomId, stringToAcronym } from "../../../../../utils/common";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../../utils/dateUtils";
import Label from "../../../../../components/display/Label";
import SubmitButton from "../../../../../components/button/SubmitButton";
import dayjs from "dayjs";
import { DatePickerCustom, InputMoney } from "../../../../../components/input";
import PartnerSelect from "../../../../../components/select/PartnerSelect";
import {
  PartnerDebtSideEnum,
  partnerDebtSideMap,
  PartnerTypeEnum,
  partnerTypeMap,
} from "../../../../../constants/enum";
import EmployeeSelect from "../../../../../components/select/EmployeeSelect";

interface Props extends AddUpdateModalProps<IDebtAdjustment> {
  side: PartnerDebtSideEnum;
}
const AddUpdateModal: React.FC<Props> = ({
  side,
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

  const onFinish: FormProps<IDebtAdjustment>["onFinish"] = async (values: IDebtAdjustment) => {
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
      title={`${editData ? "Chỉnh sửa " : "Thêm"} phiếu điều chỉnh công nợ ${partnerDebtSideMap[side]?.toLowerCase() || ""}`}
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
          setFormCode({ form, type: "partnerDebtAdjustment", field: "code" });
          return;
        }
        const formattedData = parseFormDataDates(editData);
        form.setFieldsValue(formattedData);
      }}
      destroyOnClose
    >
      <Form
        className="flex flex-col mt-4 pt-4"
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
          name="partnerId"
          label={
            <Label
              title={`${stringToAcronym(
                partnerTypeMap[
                  side === PartnerDebtSideEnum.RECEIVABLE
                    ? PartnerTypeEnum.CUSTOMER
                    : PartnerTypeEnum.SUPPLIER
                ],
              )} thực hiện`}
              required
            />
          }
          rules={[
            {
              required: true,
              message: `Vui lòng chọn ${
                partnerTypeMap[
                  side === PartnerDebtSideEnum.RECEIVABLE
                    ? PartnerTypeEnum.CUSTOMER
                    : PartnerTypeEnum.SUPPLIER
                ]
              }`,
            },
          ]}
        >
          <PartnerSelect
            offsetAt={dayjs(formValue?.occurredAt).toISOString()}
            defaultData={formValue?.partner}
            type={
              side === PartnerDebtSideEnum.RECEIVABLE
                ? PartnerTypeEnum.CUSTOMER
                : PartnerTypeEnum.SUPPLIER
            }
            onChangeData={(data) => form.setFieldValue("partner", data)}
            showPayableBalance={side === PartnerDebtSideEnum.PAYABLE}
            showReceivableBalance={side === PartnerDebtSideEnum.RECEIVABLE}
          />
        </Form.Item>
        <Form.Item name="partner" hidden />

        <Form.Item name="countedAmount" label={<Label title="Nợ hệ thống" />}>
          <InputMoney notRightAlign disabled />
        </Form.Item>

        <Form.Item
          name="expectedAmount"
          label={<Label title="Nợ thực tế" required />}
          rules={[{ required: true, message: "Vui lòng nhập nợ thực tế" }]}
        >
          <InputMoney placeholder="Nhập nợ thực tế" notRightAlign />
        </Form.Item>

        <div className="flex items-center gap-2.5 pb-[22px]">
          <Label title="Chênh lệch" />
          <InputMoney
            notRightAlign
            disabled
            value={diffAmount}
            className={diffAmount > 0 ? "text-green-600" : diffAmount < 0 ? "text-red-600" : ""}
          />
        </div>

        <Form.Item name="adjustedById" label={<Label title="Người thực hiện" />}>
          <EmployeeSelect
            defaultData={formValue?.adjustedBy}
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
