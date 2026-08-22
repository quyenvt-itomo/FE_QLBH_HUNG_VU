import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { IIncomeExpense } from "../../../../../../models/store/incomeExpense";
import { IncomeExpenseTypeEnum, incomeExpenseTypeMap } from "../../../../../../constants/enum";
import { AddUpdateModalProps } from "../../../../../../models/base/interface";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { setFormCode, setFormErrors } from "../../../../../../utils/formUtils";
import { formatFormData } from "../../../../../../utils/dateUtils";
import dayjs from "dayjs";
import { InputMoney } from "../../../../../../components/input";
import Label from "../../../../../../components/display/Label";
import FundSelect from "../../../../../../components/select/FundSelect";
import SubmitButton from "../../../../../../components/button/SubmitButton";
import { formatMoney } from "../../../../../../utils/formatNumber";

interface Props extends AddUpdateModalProps<IIncomeExpense> {
  orderAmount: number;
}

const AddPaymentModal: React.FC<Props> = ({ open, errors, orderAmount, onClose, onAdd }) => {
  const [form] = Form.useForm<IIncomeExpense>();
  const text = (
    incomeExpenseTypeMap[IncomeExpenseTypeEnum.INCOME] || "Giao dịch quỹ"
  ).toLowerCase();
  const fund = Form.useWatch("fund", form);
  const amount = Form.useWatch("amount", form) || 0;
  const { info } = useClientData();

  useEffect(() => {
    setFormErrors(form, errors);
  }, [errors, form]);

  const handleSubmit = async (values: any) => {
    values.amount = Math.min(values.amount, orderAmount);
    const formattedData = formatFormData(values);

    onAdd?.(formattedData);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`Thêm phiếu ${text}`}
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      destroyOnClose
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        setFormCode({
          form,
          type: "income",
        });
        if (info?.defaultFund) {
          form.setFieldsValue({
            fundId: info.defaultFund.id,
            fund: info.defaultFund as any,
          });
        }
      }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        className="flex flex-col pt-8"
        initialValues={{ occurredAt: dayjs() }}
      >
        <Form.Item
          name="code"
          label={<Label title="Số phiếu" required />}
          rules={[{ required: true, message: "Vui lòng nhập số phiếu" }]}
        >
          <Input className="h-10" placeholder="Nhập mã số phiếu" />
        </Form.Item>
        <div className="w-full relative">
          <Form.Item
            name="amount"
            label={<Label title="Số tiền" required />}
            rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
          >
            <InputMoney notRightAlign placeholder="Nhập số tiền" />
          </Form.Item>
          <button
            type="button"
            className="absolute top-[5px] right-2 text-gray-400 hover:text-primary transition-all ease-in-out"
            onClick={() => {
              form.setFieldValue("amount", orderAmount);
            }}
          >
            Toàn bộ
          </button>
          {amount > orderAmount && (
            <span className="absolute top-8 left-40 italic text-xs text-red-500">
              Tiền thừa trả khách: {formatMoney(amount - orderAmount)}
            </span>
          )}
        </div>
        <Form.Item
          name="fundId"
          label={<Label title="Quỹ" required />}
          rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
        >
          <FundSelect
            defaultData={fund}
            onChangeData={(data) => {
              form.setFieldValue("fund", data);
            }}
          />
        </Form.Item>
        <Form.Item name="fromFund" hidden />
        <Form.Item name="fund" hidden />
        <Form.Item name="note" label={<Label title="Ghi chú" />}>
          <Input.TextArea placeholder="Nhập ghi chú" autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <div className="flex w-full justify-center pt-4">
          <SubmitButton onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddPaymentModal;
