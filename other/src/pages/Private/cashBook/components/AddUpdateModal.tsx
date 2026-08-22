import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { IIncomeExpense } from "../../../../models/store/incomeExpense";
import {
  AttributeTypeEnum,
  IncomeExpenseTypeEnum,
  incomeExpenseTypeMap,
} from "../../../../constants/enum";
import { AddUpdateModalProps } from "../../../../models/base/interface";
import { useClientData } from "../../../../hooks/core/useClientData";
import { setFormCode, setFormErrors } from "../../../../utils/formUtils";
import { formatFormData, parseFormDataDates } from "../../../../utils/dateUtils";
import dayjs from "dayjs";
import { DatePickerCustom, InputMoney } from "../../../../components/input";
import Label from "../../../../components/display/Label";
import FundCategorySelect from "../../../../components/fundCategorySelect/FundCategorySelect";
import FundSelect from "../../../../components/select/FundSelect";
import SubmitButton from "../../../../components/button/SubmitButton";
import EmployeeSelect from "../../../../components/select/EmployeeSelect";
import PartnerSelect from "../../../../components/select/PartnerSelect";

interface Props extends AddUpdateModalProps<IIncomeExpense> {
  type: IncomeExpenseTypeEnum;
}

const AddUpdateModal: React.FC<Props> = ({
  open,
  editData,
  errors,
  type,
  onClose,
  onAdd,
  onEdit,
}) => {
  const [form] = Form.useForm<IIncomeExpense>();
  const text = (incomeExpenseTypeMap[type] || "Giao dịch quỹ").toLowerCase();
  const fund = Form.useWatch("fund", form);
  const partner = Form.useWatch("partner", form);
  const category = Form.useWatch("category", form);
  const creator = Form.useWatch("creator", form);
  const isIncome = type === IncomeExpenseTypeEnum.INCOME;
  const { info } = useClientData();

  useEffect(() => {
    setFormErrors(form, errors);
  }, [errors, form]);

  const handleSubmit = async (values: any) => {
    const formattedData = formatFormData(values);
    if (editData) {
      onEdit?.({ ...formattedData, type, id: editData.id });
    } else {
      onAdd?.({
        ...formattedData,
        type,
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={(editData ? "Chỉnh sửa thông tin phiếu" : "Thêm phiếu") + ` ${text}`}
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

        if (!editData) {
          setFormCode({
            form,
            type: isIncome ? "income" : "expense",
          });
          if (info?.defaultFund) {
            form.setFieldsValue({
              fundId: info.defaultFund.id,
              fund: info.defaultFund as any,
            });
          }
          return;
        }

        const formattedData = parseFormDataDates(editData) as any;
        form.setFieldsValue(formattedData);
      }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        className="flex flex-col pt-8"
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
        >
          <Input className="h-10" placeholder="Nhập mã số phiếu" />
        </Form.Item>
        <Form.Item name="description" label={<Label title="Diễn giải" />}>
          <Input.TextArea placeholder="Nhập diễn giải" autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item
          name="amount"
          label={<Label title="Số tiền" required />}
          rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
        >
          <InputMoney notRightAlign placeholder="Nhập số tiền" />
        </Form.Item>
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
        <Form.Item
          name="categoryId"
          label={<Label title={`Hạng mục ${text}`} required />}
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <FundCategorySelect
            defaultData={
              category?.fundCategoryGroup
                ? {
                    ...category?.fundCategoryGroup,
                    fundCategories: [category],
                  }
                : undefined
            }
            type={isIncome ? AttributeTypeEnum.INCOME_CATEGORY : AttributeTypeEnum.EXPENSE_CATEGORY}
          />
        </Form.Item>
        <Form.Item name="category" hidden />
        <Form.Item
          name="partnerId"
          label={<Label title={`Đối tượng ${isIncome ? "thanh toán" : "thụ hưởng"}`} />}
        >
          <PartnerSelect
            defaultData={partner}
            onChangeData={(value) => form.setFieldValue("partner", value)}
          />
        </Form.Item>
        <Form.Item name="partner" hidden />
        <Form.Item name="creatorId" label={<Label title="Nhân viên xử lý" />}>
          <EmployeeSelect
            defaultData={creator}
            onChangeData={(value) => form.setFieldValue("creator", value)}
          />
        </Form.Item>
        <Form.Item name="creator" hidden />
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

export default AddUpdateModal;
