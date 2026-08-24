import React, { useMemo } from "react";
import { ConfirmImportDto, StockDocument, StockDocumentType } from "../../stockDocument.model";
import Modal from "antd/lib/modal/Modal";
import { handleCloseWithPendingFiles, resolveByPath } from "@/shared/utils/common.util";
import { App, Form, FormProps, Input } from "antd";
import { formatFormData, parseFormDataDates, formatDateDDMMYYYY } from "@/shared/utils/date.util";
import { FormSection } from "@/shared";
import dayjs from "dayjs";
import { FileUploadBox } from "@/shared";
import { EntityType, FileCategory } from "@/shared/constants/enum";
import { SubmitButton } from "@/shared";
import { FormListTable, FormColumn  } from "@/shared";
import { StockDocumentLine } from "@/modules/stockDocumentLine";
import { formatMoney, formatPercentage, formatQuantity } from "@/shared/utils/number.util";
import { InputQuantity } from "@/shared";
import { StockDocumentCalculationUtil } from "../../stockDocument.util";
import { AppDatePicker } from "@/shared";
import { makeFormListEnterHandler } from "@/shared/utils/formListKeyboard";
import { textColorStyle } from "@/shared/constants/ui";

const type = StockDocumentType.PURCHASE_RECEIPT;

interface Props {
  open: boolean;
  data?: StockDocument;
  loading?: boolean;
  onClose: () => void;
  onConfirm?: (id: string, payload: ConfirmImportDto) => Promise<StockDocument | undefined>;
}

export const ConfirmImportModal: React.FC<Props> = ({
  open,
  data,
  loading,
  onClose,
  onConfirm,
}) => {
  const { modal, message } = App.useApp();
  const [form] = Form.useForm<StockDocument>();
  const lines = Form.useWatch("lines", form) || [];

  const calc = new StockDocumentCalculationUtil();

  const columns: FormColumn<StockDocumentLine>[] = useMemo(
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
        render: ({ record }) => resolveByPath(record, ["product", "name"]),
      },
      {
        title: "Mã hàng",
        dataIndex: "productCode",
        width: 120,
        render: ({ record }) => resolveByPath(record, ["product", "code"]),
      },
      {
        title: "ĐVT",
        dataIndex: "unitId",
        width: 90,
        align: "center",
        render: ({ record }) => resolveByPath(record, ["unit", "name"]),
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
            render: ({ record }) => formatQuantity(record?.billingQuantity),
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
        title: "%VAT",
        dataIndex: "taxRate",
        width: 80,
        align: "right",
        render: ({ record }) => formatPercentage(record?.purchaseLine?.taxRate),
      },
      {
        title: "Tiền VAT",
        dataIndex: "taxAmount",
        width: 90,
        align: "right",
        render: ({ record }) => formatMoney(calc.calculateTaxAmount(record)),
      },
      {
        title: "Tổng tiền",
        dataIndex: "grossAmount",
        width: 90,
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
        dataIndex: "varianceQuantity",
        align: "right",
        children: [
          {
            title: "SL",
            dataIndex: "varianceQuantity",
            width: 60,
            align: "right",
            render: ({ record }) => {
              const varianceQuantity = calc.calculateVarianceQuantity(record, type);
              return (
                <span className={textColorStyle(varianceQuantity)}>
                  {formatQuantity(varianceQuantity)}
                </span>
              );
            },
          },
          {
            title: "Thành tiền",
            dataIndex: "varianceAmount",
            width: 90,
            align: "right",
            render: ({ record }) => {
              const varianceAmount = calc.calculateVarianceAmount(record, type);
              return (
                <span className={textColorStyle(varianceAmount)}>
                  {formatMoney(varianceAmount)}
                </span>
              );
            },
          },
        ],
      },
    ],
    [],
  );

  if (!data) return null;
  const { id, code } = data;

  const onFinish: FormProps<StockDocument>["onFinish"] = async (values: StockDocument) => {
    const formattedData = formatFormData({ ...values, id });

    const confirmData: ConfirmImportDto = {
      actualImportDate: formattedData.actualImportDate,
      lines: formattedData.lines?.map((line) => ({
        id: line.id,
        stockQuantity: line.stockQuantity ?? 0,
      })),
    };

    modal.confirm({
      centered: true,
      title: "Xác nhận nhập kho",
      content: `Bạn có chắc chắn muốn xác nhận nhập kho cho phiếu ${code}?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => onConfirm?.(id, confirmData),
    });
  };

  return (
    <Modal
      title="Xác nhận nhập kho"
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      maskClosable={false}
      centered
      destroyOnClose
      width="100vw"
      className="fullscreen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        const formattedData = parseFormDataDates(data, ["lines"]);
        form.setFieldsValue({
          ...formattedData,
          actualImportDate: dayjs(formattedData.actualImportDate ?? undefined),
        });
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        className="flex flex-col h-full overflow-x-hidden overflow-y-auto scrollbar-hide"
      >
        <FormSection title="Thông tin phiếu">
          {/* Card hiển thị thông tin chính */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Đơn mua hàng</div>
              <div className="font-semibold text-blue-700">
                {resolveByPath(data, ["purchase", "code"]) || "--"}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {resolveByPath(data, ["partner", "name"]) || "--"}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Phương án vận chuyển
              </div>
              <div className="font-semibold text-green-700 flex items-center gap-3">
                {resolveByPath(data, ["shippingPlan", "code"]) || "--"}
                <div className="text-sm font-light text-gray-400 mt-0.5">
                  Cước VC (Không bao gồm VAT):{" "}
                  {resolveByPath(data, ["shippingPlan", "unitPrice"]) != null
                    ? formatMoney(resolveByPath(data, ["shippingPlan", "unitPrice"]))
                    : "--"}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {resolveByPath(data, ["shipper", "name"]) || "--"}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Số phiếu</div>
              <div className="font-semibold text-purple-700">{data?.code || "--"}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Ngày dự kiến:{" "}
                  {data?.effectiveDate ? formatDateDDMMYYYY(data.effectiveDate) : "--"}
                </div>
                <div className="flex items-center w-72">
                  <div className="text-sm text-gray-500 mr-2 flex-shrink-0">Ngày thực nhập:</div>
                  <Form.Item
                    name="actualImportDate"
                    noStyle
                    rules={[{ required: true, message: "Vui lòng chọn ngày thực nhập" }]}
                  >
                    <AppDatePicker className="w-full" placeholder="Chọn ngày" />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          {/* Card chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-0.5">Kho nhập</div>
              <div className="text-sm font-medium">{data?.warehouse?.name || "--"}</div>
              <div className="text-xs text-gray-400">
                Thủ kho: {data?.warehouse?.manager?.name || "--"}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-0.5">Đại diện giao hàng</div>
              <div className="text-sm font-medium">{data?.representative?.name || "--"}</div>
              <div className="text-xs text-gray-400">
                CMND/CCCD: {data?.representative?.identityCode || "--"}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-0.5">Phương tiện</div>
              <div className="text-sm font-medium">{data?.vehicleType || "--"}</div>
              <div className="text-xs text-gray-400">Biển số: {data?.vehiclePlate || "--"}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-0.5">Ghi chú</div>
              <div className="text-sm">{data?.note || "--"}</div>
            </div>
          </div>
        </FormSection>

        <div className="px-6 pb-4">
          <FormListTable
            title="Danh sách hàng hóa"
            form={form}
            fieldName="lines"
            columns={columns}
            records={lines}
            showDelete={false}
            renderSummary={() => {
              const total = calc.calculateTotalForArray(lines, type);
              return (
                <>
                  <td className="px-3 py-1.5 font-semibold text-center" colSpan={4}>
                    Tổng
                  </td>
                  <td className="border-l text-end px-3 py-1.5 font-semibold">
                    {formatQuantity(total.totalBillingQuantity)}
                  </td>
                  <td className="border-l text-end px-3 py-1.5 font-semibold">
                    {formatQuantity(total.totalStockQuantity)}
                  </td>
                  <td className="border-l" />
                  <td className="border-l text-end px-3 py-1.5">
                    {formatMoney(total.totalSubTotal)}
                  </td>
                  <td className="border-l" />
                  <td className="px-3 py-1.5 border-l text-end">
                    {formatMoney(total.totalTaxAmount)}
                  </td>
                  <td className="border-l text-end text-primary font-semibold px-3 py-1.5">
                    {formatMoney(total.totalGrossAmount)}
                  </td>
                  <td className="border-l" />
                  <td
                    className={`border-l text-end font-semibold px-3 py-1.5 ${textColorStyle(total.totalVarianceQuantity)}`}
                  >
                    {formatMoney(total.totalVarianceQuantity)}
                  </td>
                  <td
                    className={`border-l text-end text-primary font-semibold px-3 ${textColorStyle(total.totalVarianceAmount)}`}
                  >
                    {formatMoney(total.totalVarianceAmount)}
                  </td>
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
              oId={id}
              entity={EntityType.STOCK_DOCUMENT}
              category={FileCategory.DOCUMENT}
              placeholder={
                <div className="flex flex-col">
                  <span>Tài liệu bổ sung (Tối đa 3 file)</span>
                  <span className="text-xs text-muted-foreground">
                    (Chỉ chấp nhận file PDF, DOC, DOCX, XLS, XLSX)
                  </span>
                </div>
              }
              maxCount={3}
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
