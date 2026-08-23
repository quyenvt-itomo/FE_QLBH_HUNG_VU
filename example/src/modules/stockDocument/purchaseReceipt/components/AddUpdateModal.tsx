import React, { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { App, AutoComplete, Col, Form, FormProps, Input, Modal, Row } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { handleCloseWithPendingFiles, randomId, resolveByPath } from "@/shared/utils/common.util";
import { extractListErrorCells, setFormErrors } from "@/shared/utils/form.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { AppDatePicker } from "@/shared/components/input/AppDatePicker";
import Label from "@/shared/components/display/Label";
import { InputMoney, InputQuantity } from "@/shared/components/input";

import { PurchaseSelect } from "@/modules/purchase";
import { WarehouseSelect } from "@/modules/warehouse";
import { ShippingPlanSelect } from "@/modules/shippingPlan";
import { usePartnerContactStore } from "@/modules/partnerContact";
import { StockDocument, StockDocumentStatus, StockDocumentType } from "../../stockDocument.model";
import { FormSection } from "@/shared/components/form/FormSection";
import { ApproveStatus } from "@/modules/shared/business.model";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { EntityFile, FileCategory } from "@/shared/constants/enum";
import FormListTable, { FormColumn } from "@/shared/components/form/FormListTable";
import { StockDocumentLine } from "@/modules/stockDocumentLine";
import { formatMoney, formatPercentage, formatQuantity } from "@/shared/utils/number.util";
import { StockDocumentCalculationUtil } from "../../stockDocument.util";
import { makeFormListEnterHandler } from "@/shared/utils/formListKeyboard";
import { textColorStyle } from "@/shared/constants/ui";
import { StockDocumentStatusTag } from "../../components";
import {
  collectPurchaseLine,
  PurchaseLine,
  PurchaseLineMultipleSelect,
} from "@/modules/purchaseLine";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { MagnifyingGlassIcon } from "@/shared/icons";
import { useAppMessage } from "@/shared/hooks/useAppMessage";

const calc = new StockDocumentCalculationUtil();
const type = StockDocumentType.PURCHASE_RECEIPT;

export const AddUpdateModal: React.FC<AddUpdateModalProps<StockDocument>> = ({
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
  const [form] = Form.useForm<StockDocument>();
  const [defaultPurchaseLine, setDefaultPurchaseLine] = useAutoResetItem<PurchaseLine>();
  const id = editData?.id || randomId();
  const purchase = Form.useWatch("purchase", form);
  const shippingPlan = Form.useWatch("shippingPlan", form);
  const partner = Form.useWatch("partner", form);
  const warehouse = Form.useWatch("warehouse", form);
  const lines = Form.useWatch("lines", form) || [];
  const isImported = editData?.status === StockDocumentStatus.COMPLETED;

  const hidePurchaseLines = collectPurchaseLine(lines);

  const { data: partnerContacts } = usePartnerContactStore({
    partnerId: partner?.id,
    isLocked: !partner,
  });

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

  // Columns cho phiếu chưa nhập kho (chỉ hiển thị, không sửa được stockQuantity)
  const normalColumns: FormColumn<StockDocumentLine>[] = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "__idx",
        width: 40,
        align: "center",
        render: ({ index }) => index + 1,
      },
      {
        title: "Hàng hóa",
        dataIndex: "productId",
        width: 260,
        fixed: "left",
        render: ({ record }) => resolveByPath(record, ["product", "name"], "--"),
      },
      {
        title: "Mã hàng",
        dataIndex: "productCode",
        width: 120,
        render: ({ record }) => resolveByPath(record, ["product", "code"], "--"),
      },
      {
        title: "ĐVT",
        dataIndex: "unitId",
        width: 90,
        align: "center",
        render: ({ record }) => resolveByPath(record, ["unit", "name"], "--"),
      },
      {
        title: "SL chứng từ",
        dataIndex: "billingQuantity",
        align: "right",
        width: 120,
        editable: true,
        className: "yellow-column",
        render: ({ record }) => {
          let placeholder = "Nhập SL chứng từ";
          const purchaseLine = record?.purchaseLine;

          if (purchaseLine) {
            const remainingQuantity = Math.max(
              0,
              purchaseLine.quantity - (purchaseLine.deliveredQuantity || 0),
            );
            placeholder = `Chưa giao: ${formatQuantity(remainingQuantity) || 0}`;
          }
          return <InputQuantity variant="borderless" min={0} placeholder={placeholder} />;
        },
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        width: 120,
        align: "right",
        render: ({ record }) => formatMoney(record?.purchaseLine?.unitPrice),
      },
      {
        title: "Thành tiền",
        dataIndex: "subTotal",
        width: 120,
        align: "right",
        render: ({ record }) => formatMoney(calc.calculateSubTotal(record)),
      },
      {
        title: "VAT",
        dataIndex: "tax",
        children: [
          {
            title: "%",
            dataIndex: "taxRate",
            width: 80,
            align: "right",
            render: ({ record }) => formatPercentage(record?.purchaseLine?.taxRate),
          },
          {
            title: "Thành tiền",
            dataIndex: "taxAmount",
            width: 90,
            align: "right",
            render: ({ record }) => formatMoney(calc.calculateTaxAmount(record)),
          },
        ],
      },
      {
        title: "Tổng tiền",
        dataIndex: "grossAmount",
        width: 150,
        align: "right",
        render: ({ record }) => formatMoney(calc.calculateGrossAmount(record)),
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        width: 160,
        editable: true,
        render: () => <Input placeholder="Nhập ghi chú" variant="borderless" />,
      },
    ],
    [],
  );

  // Columns cho phiếu đã nhập kho (có thêm cột chênh lệch + sửa được stockQuantity)
  const importedColumns: FormColumn<StockDocumentLine>[] = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "__idx",
        width: 40,
        align: "center",
        render: ({ index }) => index + 1,
      },
      {
        title: "Hàng hóa",
        dataIndex: "productId",
        width: 260,
        fixed: "left",
        render: ({ record }) => resolveByPath(record, ["product", "name"], "--"),
      },
      {
        title: "Mã hàng",
        dataIndex: "productCode",
        width: 120,
        render: ({ record }) => resolveByPath(record, ["product", "code"], "--"),
      },
      {
        title: "ĐVT",
        dataIndex: "unitId",
        width: 90,
        align: "center",
        render: ({ record }) => resolveByPath(record, ["unit", "name"], "--"),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        align: "right",
        children: [
          {
            title: "Chứng từ",
            dataIndex: "billingQuantity",
            width: 90,
            align: "right",
            editable: true,
            className: "yellow-column",
            render: () => <InputQuantity variant="borderless" min={0} />,
          },
          {
            title: "Thực nhập",
            dataIndex: "stockQuantity",
            width: 90,
            align: "right",
            editable: true,
            className: "yellow-column",
            render: () => <InputQuantity variant="borderless" min={0} />,
          },
        ],
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        width: 120,
        align: "right",
        render: ({ record }) => formatMoney(record?.purchaseLine?.unitPrice),
      },
      {
        title: "Thành tiền",
        dataIndex: "subTotal",
        width: 120,
        align: "right",
        render: ({ record }) => formatMoney(calc.calculateSubTotal(record)),
      },
      {
        title: "VAT",
        dataIndex: "tax",
        children: [
          {
            title: "%",
            dataIndex: "taxRate",
            width: 50,
            align: "right",
            render: ({ record }) => formatPercentage(record?.purchaseLine?.taxRate),
          },
          {
            title: "Thành tiền",
            dataIndex: "taxAmount",
            width: 90,
            align: "right",
            render: ({ record }) => formatMoney(calc.calculateTaxAmount(record)),
          },
        ],
      },
      {
        title: "Tổng tiền",
        dataIndex: "grossAmount",
        width: 150,
        align: "right",
        render: ({ record }) => formatMoney(calc.calculateGrossAmount(record)),
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        width: 160,
        editable: true,
        render: () => <Input placeholder="Nhập ghi chú" variant="borderless" />,
      },
      {
        title: "Chênh lệch",
        dataIndex: "variance",
        children: [
          {
            title: "SL",
            dataIndex: "varianceQuantity",
            width: 80,
            align: "right",
            render: ({ record }) => {
              const v = calc.calculateVarianceQuantity(record, type);
              return <span className={textColorStyle(v)}>{formatQuantity(v)}</span>;
            },
          },
          {
            title: "Thành tiền",
            dataIndex: "varianceAmount",
            width: 90,
            align: "right",
            render: ({ record }) => {
              const v = calc.calculateVarianceAmount(record, type);
              return <span className={textColorStyle(v)}>{formatMoney(v)}</span>;
            },
          },
        ],
      },
    ],
    [],
  );

  const columns = isImported ? importedColumns : normalColumns;

  const onFinish: FormProps<StockDocument>["onFinish"] = async (values: StockDocument) => {
    const formattedData = formatFormData({ ...values, type, id, tempId: id }, ["lines"]);

    modal.confirm({
      centered: true,
      title: editData ? "Xác nhận sửa phiếu nhập mua?" : "Xác nhận thêm phiếu nhập mua?",
      content: editData
        ? "Bạn có chắc chắn muốn sửa phiếu nhập mua này không?"
        : "Bạn có chắc chắn muốn thêm phiếu nhập mua này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
      },
    });
  };

  return (
    <Modal
      title={editData ? "Sửa thông tin phiếu nhập mua" : "Thêm phiếu nhập mua"}
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      maskClosable={false}
      centered
      width="100vw"
      className="fullscreen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        if (editData) {
          const formattedData = parseFormDataDates(editData, ["lines"]);
          form.setFieldsValue(formattedData);
          return;
        }

        form.setFieldValue("type", type);
        form.setFieldValue("lines", defaultData?.lines || []);
        if (defaultData) form.setFieldsValue(parseFormDataDates(defaultData));
      }}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
        className="flex flex-col h-full overflow-x-hidden overflow-y-auto"
        initialValues={{ effectiveDate: dayjs().add(1, "day") }}
      >
        <FormSection
          title="Thông tin phiếu"
          subtitle={<StockDocumentStatusTag value={editData?.status} />}
        >
          <Row gutter={[96, 0]}>
            <Col span={10}>
              <Form.Item
                name="purchaseId"
                label={<Label title="Đơn mua hàng" required />}
                rules={[{ required: true, message: "Vui lòng chọn đơn mua hàng" }]}
              >
                <PurchaseSelect
                  defaultData={purchase}
                  onChangeData={(value) => {
                    form.setFieldValue("purchase", value);
                    form.setFieldValue("partnerId", value?.supplierId);
                    form.setFieldValue("partner", value?.supplier || null);

                    form.setFieldValue("shippingPlanId", null);
                    form.setFieldValue("shippingPlan", null);
                    form.setFieldValue("shipperId", null);
                    form.setFieldValue("shipper", null);

                    form.setFieldValue("lines", []);
                  }}
                  disabled={!!editData}
                  query={{
                    isCompleted: false,
                    approveStatus: ApproveStatus.APPROVED,
                  }}
                />
              </Form.Item>
              <Form.Item name="purchase" hidden />

              <Form.Item name={["partner", "name"]} label={<Label title="Nhà cung cấp" />}>
                <Input disabled placeholder="Chọn đơn mua hàng" />
              </Form.Item>
              <Form.Item name="partner" hidden />
              <Form.Item name="partnerId" hidden />

              <Form.Item
                name={["representative", "name"]}
                label={<Label title="Đại diện giao hàng" required />}
                rules={[{ required: true, message: "Vui lòng nhập tên người đại diện" }]}
              >
                <AutoComplete
                  options={partnerContacts?.map((contact) => ({
                    label: contact.name,
                    value: contact.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name={["representative", "identityCode"]}
                label={<Label title="Số CMND/CCCD" required />}
                rules={[
                  { required: true, message: "Vui lòng nhập số CMND/CCCD của người đại diện" },
                ]}
              >
                <Input placeholder="Số CMND/CCCD" />
              </Form.Item>

              <Form.Item name="note" label={<Label title="Ghi chú" />}>
                <Input placeholder="Ghi chú" />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="shippingPlanId"
                label={<Label title="PA vận chuyển" required />}
                rules={[{ required: true, message: "Vui lòng chọn phương án vận chuyển" }]}
              >
                <ShippingPlanSelect
                  defaultData={shippingPlan}
                  onChangeData={(value) => {
                    form.setFieldValue("shippingPlan", value);
                    form.setFieldValue("shipperId", value?.partnerId);
                    form.setFieldValue("shipper", value?.partner || null);
                  }}
                  disabled={!purchase || !!editData}
                  query={{ purchaseId: purchase?.id, approveStatus: ApproveStatus.APPROVED }}
                />
              </Form.Item>
              <Form.Item name="shippingPlan" hidden />

              <Form.Item name={["shipper", "name"]} label={<Label title="ĐVVC" />}>
                <Input disabled placeholder="Chọn PA vận chuyển" />
              </Form.Item>
              <Form.Item name="shipperId" hidden />
              <Form.Item name="shipper" hidden />

              <Form.Item
                name={["shippingPlan", "unitPrice"]}
                label={<Label title="Cước VC" />}
                extra="Không bao gồm VAT"
              >
                <InputMoney notRightAlign disabled placeholder="Chọn PA vận chuyển" />
              </Form.Item>

              <Form.Item
                name="vehicleType"
                label={<Label title="Loại phương tiện" required />}
                rules={[{ required: true, message: "Vui lòng nhập loại phương tiện" }]}
              >
                <Input placeholder="Nhập loại xe" />
              </Form.Item>

              <Form.Item
                name="vehiclePlate"
                label={<Label title="Biển số xe" required />}
                rules={[{ required: true, message: "Vui lòng nhập biển số xe" }]}
              >
                <Input placeholder="Nhập biển số" />
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item name="code" label={<Label title="Số phiếu" />}>
                <Input disabled placeholder="Tự động tạo sau khi lưu" />
              </Form.Item>

              {editData?.status === StockDocumentStatus.COMPLETED ? (
                <Form.Item
                  name="actualImportDate"
                  label={<Label title="Ngày nhập kho" required />}
                  rules={[{ required: true, message: "Vui lòng chọn ngày nhập kho" }]}
                >
                  <AppDatePicker />
                </Form.Item>
              ) : (
                <Form.Item
                  name="effectiveDate"
                  label={<Label title="Ngày dự kiến" required />}
                  rules={[{ required: true, message: "Vui lòng chọn ngày dự kiến" }]}
                >
                  <AppDatePicker onlyDate />
                </Form.Item>
              )}
              <Form.Item
                name="warehouseId"
                label={<Label title="Kho nhập" required />}
                rules={[{ required: true, message: "Vui lòng chọn kho nhập" }]}
              >
                <WarehouseSelect
                  defaultData={warehouse}
                  onChangeData={(value) => {
                    form.setFieldValue("warehouse", value);
                  }}
                />
              </Form.Item>
              <Form.Item name="warehouse" hidden />
              <Form.Item name={["warehouse", "manager", "name"]} label={<Label title="Thủ kho" />}>
                <Input disabled placeholder="Chọn kho nhập" />
              </Form.Item>

              <Form.Item label={<Label title="NV mua hàng" />}>
                <Input value={resolveByPath(purchase, ["staff", "name"])} />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
        {isImported && <FormSection title="Thông tin nhập kho"></FormSection>}
        <div className="px-6 pb-4 h-fit">
          <FormListTable
            title="Danh sách hàng hóa"
            form={form}
            fieldName="lines"
            columns={columns}
            records={lines}
            showDelete
            errorCells={errorCells}
            renderAdd={(add) => (
              <PurchaseLineMultipleSelect
                value={defaultPurchaseLine ? [defaultPurchaseLine.id] : undefined}
                query={{ isLocked: !purchase, purchaseId: purchase?.id }}
                placeholder={
                  purchase?.id
                    ? "Tìm kiếm và chọn hàng hóa trong đơn mua hàng để thêm vào phiếu"
                    : "Vui lòng chọn đơn mua hàng trước"
                }
                hideOptions={hidePurchaseLines}
                prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
                suffixIcon={null}
                disabled={!purchase}
                onChangeData={(data) => {
                  const item = data?.[0];
                  setDefaultPurchaseLine(item);
                  if (!item) return;

                  add({
                    tempId: randomId(),
                    productId: item.productId,
                    product: item.product,
                    unitId: item.unitId,
                    unit: item.unit,
                    purchaseLineId: item.id,
                    purchaseLine: item,
                  });
                }}
              />
            )}
            renderSummary={() => {
              const total = calc.calculateTotalForArray(lines, type);
              return (
                <>
                  <td className="text-center font-semibold" colSpan={4}>
                    Tổng
                  </td>
                  <td className="border-l text-end px-3 font-semibold">
                    {formatQuantity(total.totalBillingQuantity)}
                  </td>
                  {isImported && (
                    <td className="border-l text-end px-3 font-semibold">
                      {formatQuantity(total.totalStockQuantity)}
                    </td>
                  )}
                  <td className="border-l" />
                  <td className="border-l text-end px-3">{formatMoney(total.totalSubTotal)}</td>
                  <td className="border-l" />
                  <td className="border-l text-end px-3">{formatMoney(total.totalTaxAmount)}</td>
                  <td className="border-l text-end font-semibold px-3">
                    {formatMoney(total.totalGrossAmount)}
                  </td>
                  <td className="border-l" />
                  {isImported && (
                    <>
                      <td
                        className={`border-l text-end font-semibold px-3 ${textColorStyle(total.totalVarianceQuantity)}`}
                      >
                        {formatQuantity(total.totalVarianceQuantity)}
                      </td>
                      <td
                        className={`border-l text-end font-semibold px-3 ${textColorStyle(total.totalVarianceAmount)}`}
                      >
                        {formatMoney(total.totalVarianceAmount)}
                      </td>
                    </>
                  )}
                </>
              );
            }}
            onKeyDown={makeFormListEnterHandler(
              { type: "select", message: "Vui lòng chọn hàng hóa ở ô tìm kiếm để thêm vào đơn" },
              { messageApi: message },
            )}
          />
        </div>

        <div className="flex justify-between items-end mt-auto mb-0 action-sticky-bottom">
          <div className="flex w-[520px]">
            <FileUploadBox
              defaultFiles={editData?.document}
              oId={id}
              entity={EntityFile.PURCHASE}
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
