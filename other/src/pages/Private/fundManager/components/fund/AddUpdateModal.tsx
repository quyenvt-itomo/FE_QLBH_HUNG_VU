import { AutoComplete, Form, Input, Modal, Radio } from "antd";
import { useEffect } from "react";
import { setFormCode, setFormErrors } from "../../../../../utils/formUtils";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { AddUpdateModalProps } from "../../../../../models/base/interface";
import SubmitButton from "../../../../../components/button/SubmitButton";
import { FundTypeEnum, fundTypeMap } from "../../../../../constants/enum";
import Label from "../../../../../components/display/Label";
import { bank_options } from "../../../../../constants/option/bank";
import { removeVietnameseTones } from "../../../../../utils/searchUtils";
import { InputMoney } from "../../../../../components/input";
import { IFund } from "../../../../../models/fund";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import StoreSelect from "../../../../../components/select/StoreSelect";
import { IStore } from "../../../../../models/store";

interface Props extends AddUpdateModalProps<IFund> {
  defaultStore?: IStore;
}

const AddUpdateModal: React.FC<Props> = ({
  open,
  editData,
  errors,
  defaultStore,
  onClose,
  onAdd,
  onEdit,
}) => {
  const [form] = Form.useForm();
  const type: FundTypeEnum = Form.useWatch("type", form);
  const store = Form.useWatch("store", form);
  const { currentStore } = useClientData();

  useEffect(() => {
    setFormErrors(form, errors);
  }, [errors, form]);

  const handleSubmit = async (values: IFund) => {
    if (editData) {
      onEdit?.({ ...values, id: editData.id });
    } else {
      onAdd?.(values);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={editData ? "Chỉnh sửa thông tin quỹ" : "Thêm quỹ"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        if (!editData) {
          setFormCode({
            form,
            type: "fund",
          });
          return;
        }

        form.setFieldsValue(editData);
      }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        className="flex flex-col gap-2 pt-8"
        initialValues={{
          type: FundTypeEnum.CASH,
          store: defaultStore,
          storeId: defaultStore?.id,
        }}
      >
        <div className="flex gap-2.5">
          <Label title="Loại quỹ" required />
          <Form.Item name="type" className="w-[calc(100%-154px)]">
            <Radio.Group optionType="button" buttonStyle="solid" className="flex w-full">
              <Radio.Button
                value={FundTypeEnum.CASH}
                className="flex items-center justify-center h-9 !rounded w-1/2 !rounded-e-none"
              >
                {fundTypeMap[FundTypeEnum.CASH]}
              </Radio.Button>
              <Radio.Button
                value={FundTypeEnum.BANK}
                className="flex items-center justify-center h-9 !rounded w-1/2 !rounded-s-none"
              >
                {fundTypeMap[FundTypeEnum.BANK]}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>

        {!currentStore && (
          <>
            <Form.Item
              name="storeId"
              label={<Label title="Cửa hàng" required />}
              rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
            >
              <StoreSelect
                defaultData={store}
                onChangeData={(value) => form.setFieldValue("store", value)}
              />
            </Form.Item>
            <Form.Item name="store" hidden />
          </>
        )}

        <Form.Item
          name="code"
          label={<Label title="Mã quỹ" required />}
          rules={[{ required: true, message: "Vui lòng nhập mã quỹ" }]}
        >
          <Input className="h-9" placeholder="Nhập mã quỹ" />
        </Form.Item>
        <Form.Item
          name="name"
          label={<Label title="Tên quỹ" required />}
          rules={[{ required: true, message: "Vui lòng nhập tên quỹ" }]}
        >
          <Input className="h-9" placeholder="Nhập tên quỹ" />
        </Form.Item>

        {type === FundTypeEnum.BANK && (
          <>
            <Form.Item
              name="bank"
              label={<Label title="Ngân hàng" required />}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hoặc nhập tên ngân hàng",
                },
              ]}
            >
              <AutoComplete
                allowClear
                placeholder="Chọn/Nhập ngân hàng"
                options={bank_options}
                className="h-9 w-full"
                suffixIcon={<ChevronDownIcon className="h-4" />}
                filterOption={(input, option) =>
                  removeVietnameseTones(option?.label as string).includes(
                    removeVietnameseTones(input),
                  )
                }
              />
            </Form.Item>
            <Form.Item
              name="accountNumber"
              label={<Label title="Số tài khoản" required />}
              rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
            >
              <Input className="h-9" placeholder="Nhập số tài khoản" />
            </Form.Item>
            <Form.Item
              name="accountHolderName"
              label={<Label title="Chủ tài khoản" required />}
              rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản" }]}
            >
              <Input className="h-9" placeholder="Nhập tên chủ tài khoản" />
            </Form.Item>
            <Form.Item name="branch" label={<Label title="Chi nhánh ngân hàng" />}>
              <Input className="h-9" placeholder="Nhập chi nhánh mở tài khoản" />
            </Form.Item>
          </>
        )}
        {editData ? (
          <></>
        ) : (
          <Form.Item name="initialBalance" label={<Label title="Số dư ban đầu" />}>
            <InputMoney notRightAlign placeholder="Nhập số dư ban đầu" />
          </Form.Item>
        )}

        <div className="flex w-full justify-center pt-4">
          <SubmitButton onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddUpdateModal;
