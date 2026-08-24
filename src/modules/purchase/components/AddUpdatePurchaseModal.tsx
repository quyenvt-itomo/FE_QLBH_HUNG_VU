import React, { useEffect, useMemo } from "react";
import { Modal, Form, Input, FormProps, App, Row, Col, Select, Button, Empty } from "antd";
import { AdditionalInfo, AddUpdateModalProps } from "@/shared/interfaces/common";
import {
  Purchase,
  PaymentMethod,
  paymentMethodOptions,
  PurchaseSortOrderFields,
} from "../purchase.model";
import {
  defaultAdditionalInfo,
  DiscountTypeEnum,
  EntityType,
  FileCategory,
} from "@/shared/constants/enum";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import { extractListErrorCells, setFormErrors } from "@/shared/utils/form.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { SubmitButton } from "@/shared";
import { Label } from "@/shared";
import { EmployeeSelect } from "@/modules/employee";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { AppDatePicker } from "@/shared";
import dayjs from "dayjs";
import { PurchaseLineFormList } from "./PurchaseLineFormList";
import { FormSection } from "@/shared";
import { FormListTable, FormColumn  } from "@/shared";
import { InputMoney, InputPercentage } from "@/shared";
import { AppSelect } from "@/shared";
import { FileUploadBox } from "@/shared";
import { AddressInput } from "@/shared";
import { PartnerContactSelect } from "@/modules/partnerContact";
import { PlusOutlined } from "@ant-design/icons";
import { useAppMessage } from "@/shared/hooks/useAppMessage";

export const AddUpdatePurchaseModal: React.FC<AddUpdateModalProps<Purchase>> = ({
  open,
  editData,
  loading,
  errors,
  defaultData,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { modal } = App.useApp();
  const { message, errorCells, setErrorCells, showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Purchase>();
  const id = editData?.id || randomId();
  const supplier = Form.useWatch("supplier", form);
  const staff = Form.useWatch("staff", form);
  const seller = Form.useWatch("seller", form);
  const additionalInfo = Form.useWatch("additionalInfo", form) || [];

  useEffect(() => {
    if (!errors) {
      setErrorCells(new Map());
      return;
    }
    setFormErrors(form, errors, { scrollToFirst: true });
    // Trích xuất các cell bị lỗi để highlight
    const cells = extractListErrorCells(errors, "lines");
    setErrorCells(cells);
  }, [errors, form]);

  const onFinish: FormProps<Purchase>["onFinish"] = async (values: Purchase) => {
    const formattedData = formatFormData({ ...values, id, tempId: id }, PurchaseSortOrderFields);

    modal.confirm({
      title: editData ? "Xác nhận sửa đơn mua hàng?" : "Xác nhận thêm đơn mua hàng?",
      content: editData
        ? "Bạn có chắc chắn muốn sửa đơn mua hàng này không?"
        : "Bạn có chắc chắn muốn thêm đơn mua hàng này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
      },
    });
  };

  const additionalColumns: FormColumn<AdditionalInfo>[] = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "__idx",
        width: 40,
        align: "center",
        render: ({ index }) => index + 1,
      },
      {
        title: "Hạng mục",
        dataIndex: "label",
        width: 200,
        editable: true,
        render: ({ record }) => <Input placeholder="Tên hạng mục" variant="borderless" />,
      },
      {
        title: "Nội dung",
        dataIndex: "value",
        editable: true,
        render: ({ record }) => (
          <Input.TextArea
            placeholder={`Nội dung ${String(record?.label || "")?.toLocaleLowerCase() || ""}`}
            variant="borderless"
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Modal
      title={editData ? "Sửa đơn mua hàng" : "Thêm đơn mua hàng"}
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      maskClosable={false}
      centered
      width="100vw"
      className="fullscreen-modal"
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields();
          return;
        }

        if (editData) {
          const formatted = parseFormDataDates(editData, PurchaseSortOrderFields);
          form.setFieldsValue(formatted);
          return;
        }

        if (defaultData) form.setFieldsValue(parseFormDataDates(defaultData));
      }}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
        className="flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
        initialValues={{
          orderedAt: dayjs(),
          discountType: DiscountTypeEnum.AMOUNT,
          discountValue: 0,
          taxType: DiscountTypeEnum.PERCENT,
          taxValue: 0,
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          toleranceRate: 5,
          additionalInfo: defaultAdditionalInfo,
        }}
      >
        <FormSection title="Thông tin chung">
          <Row gutter={[64, 0]}>
            <Col span={10}>
              <Form.Item
                name="supplierId"
                label={<Label width={120} title="Nhà cung cấp" required />}
                rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
              >
                <PartnerSelect
                  defaultData={supplier}
                  onChangeData={(val) => {
                    form.setFieldValue("supplier", val);
                    form.setFieldValue("sellerId", null);
                    form.setFieldValue("seller", null);
                  }}
                  query={{ types: [PartnerType.SUPPLIER] }}
                />
              </Form.Item>
              <Form.Item name="supplier" hidden />
            </Col>
            <Col span={7}>
              <Form.Item name="sellerId" label={<Label width={120} title="Người bán" />}>
                <PartnerContactSelect
                  defaultData={seller}
                  onChangeData={(val) => form.setFieldValue("seller", val)}
                  disabled={!supplier}
                  query={{ partnerId: supplier?.id }}
                />
              </Form.Item>
              <Form.Item name="seller" hidden />
            </Col>
            <Col span={7}>
              <Form.Item name="code" label={<Label width={120} title="Số đơn hàng" />}>
                <Input placeholder="Tự động tạo nếu để trống khi lưu" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name={["supplier", "taxCode"]}
                label={<Label width={120} title="Mã số thuế" />}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name={["seller", "phone"]}
                label={<Label width={120} title="SĐT người bán" />}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="orderedAt" label={<Label width={120} title="Ngày đơn hàng" />}>
                <AppDatePicker />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name={["supplier", "address"]}
                label={<Label width={120} title="Địa chỉ" />}
              >
                <AddressInput disabled />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="paymentMethod" label={<Label width={120} title="Hình thức TT" />}>
                <AppSelect options={paymentMethodOptions} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="staffId" label={<Label width={120} title="NV mua hàng" />}>
                <EmployeeSelect
                  defaultData={staff}
                  onChangeData={(val) => {
                    form.setFieldValue("staff", val);
                  }}
                />
              </Form.Item>
              <Form.Item name="staff" hidden />
            </Col>
            <Col span={10}>
              <Form.Item
                name={["supplier", "representative", "name"]}
                label={<Label width={120} title="Người đại diện" />}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="toleranceRate" label={<Label width={120} title="Dung sai (%)" />}>
                <InputPercentage notRightAlign />
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item name="discountType" label={<Label width={120} title="Chiết khấu" />}>
                <AppSelect
                  options={[
                    { value: DiscountTypeEnum.AMOUNT, label: "Số tiền" },
                    { value: DiscountTypeEnum.PERCENT, label: "%" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="discountValue" label={<Label width={120} title="Giá trị CK" />}>
                <InputMoney />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="taxType" label={<Label width={120} title="VAT tính theo" />}>
                <AppSelect
                  options={[
                    { value: DiscountTypeEnum.AMOUNT, label: "Số tiền" },
                    { value: DiscountTypeEnum.PERCENT, label: "%" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="taxValue" label={<Label width={120} title="Giá trị VAT" />}>
                <InputMoney />
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item name="note" label={<Label width={120} title="Ghi chú" />}>
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <PurchaseLineFormList form={form} errorCells={errorCells} />

        <FormSection title="Thông tin bổ sung">
          <FormListTable
            form={form}
            sortable
            fieldName="additionalInfo"
            columns={additionalColumns}
            records={additionalInfo}
            emptyText={(addFn: (data: any, insertIndex?: number) => void) => (
              <div className="flex flex-col items-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="flex flex-col items-center">
                      <span>
                        Thêm các hạng mục bổ sung để cung cấp thông tin chi tiết về đơn mua hàng
                      </span>
                      <Button
                        className={`pl-3 rounded-md text-primary border border-primary hover:bg-primary/20`}
                        onClick={() =>
                          addFn?.({
                            tempId: randomId(),
                          })
                        }
                      >
                        <PlusOutlined className="text-lg text-primary" />
                        Thêm hạng mục
                      </Button>
                    </div>
                  }
                />
              </div>
            )}
            renderSummary={({
              addFn,
            }: {
              records: AdditionalInfo[];
              addFn: (data: any, insertIndex?: number) => void;
            }) => {
              return (
                <td className="" colSpan={3}>
                  <Button
                    className={`pl-3 rounded-md text-primary border border-primary hover:bg-primary/20`}
                    onClick={() =>
                      addFn?.({
                        tempId: randomId(),
                      })
                    }
                  >
                    <PlusOutlined className="text-lg text-primary" />
                    Thêm hạng mục
                  </Button>
                </td>
              );
            }}
          />
        </FormSection>

        <div className="flex justify-between items-end mt-auto mb-0 action-sticky-bottom">
          <div className="flex w-[520px]">
            <FileUploadBox
              defaultFiles={editData?.document}
              oId={id}
              entity={EntityType.PURCHASE}
              category={FileCategory.DOCUMENT}
              maxCount={5}
              onMoveToTrash={(file) => {
                const trashFileIds: string[] = form?.getFieldValue("__trashFileIds") || [];
                if (trashFileIds.includes(file.id)) return;
                form?.setFieldValue("__trashFileIds", [...trashFileIds, file.id]);
              }}
            />
            <Form.Item name="__trashFileIds" hidden />
          </div>
          <SubmitButton
            loading={loading}
            onCancel={() => handleCloseWithPendingFiles(id, onClose)}
          />
        </div>
      </Form>
    </Modal>
  );
};
