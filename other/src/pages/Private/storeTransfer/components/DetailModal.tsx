import React, { useEffect, useState } from "react";
import { Input, Modal, Form, message, Row, Col, Spin } from "antd";
import { FormProps } from "antd/lib";
import { setFormErrors } from "../../../../utils/formUtils";
import { formatDateTimeDDMMYYYY } from "../../../../utils/dateUtils";
import { collectProductVariantFromLines, sortData } from "../../../../utils/common";
import { IStoreTransfer } from "../../../../models/storeTransfer";
import { IStoreTransferLine } from "../../../../models/storeTransferLine";
import { DatePickerCustom, InputQuantity } from "../../../../components/input";
import StoreSelect from "../../../../components/select/StoreSelect";
import dayjs from "dayjs";
import Title from "../../../../components/display/Title";
import { CheckIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ProductVariantSelect from "../../../../components/tree_select/ProductVariantSelect";
import { IProductVariant } from "../../../../models/product";
import { ProductVariantTitle } from "../../../../components/display/ProductVariantTitle";
import { formatQuantity } from "../../../../utils/formatNumber";
import { usePageState } from "../../../../hooks/core/usePageState";
import { useStoreTransferLineData } from "../../../../hooks/inventory/useStoreTransferLineData";
import ModalDelete from "../../../../components/modal/ModalDelete";
import DropdownAction from "../../../../components/dropdown/ActionMenu";
import EditableInfoRow from "../../../../components/display/EditableInfoRow";
import { exportStoreTransferToExcel } from "../../../../utils/excelExport";
import { Icon } from "@iconify/react";
// store transfer HTML generator replaced by StoreTransferPrint component
import { usePrintHtml, StoreTransferPrint } from "../../../../components/print";

interface DetailModalProps {
  data?: IStoreTransfer;
  open: boolean;
  loading: boolean;
  onClose?: () => void;
  onUpdate?: (data: Partial<IStoreTransfer>) => void;
  onReload?: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  data,
  open,
  loading,
  onClose,
  onUpdate,
  onReload,
}) => {
  const {
    open: openLine,
    setOpen,
    openDelete,
    setOpenDelete,
    rowData,
    setRowData,
    status,

    pageAction,
  } = usePageState<IStoreTransferLine>();
  const [form] = Form.useForm<IStoreTransferLine>();
  const [defaultProduct, setDefaultProduct] = useState<IProductVariant | undefined>(undefined);
  const productVariant = Form.useWatch("productVariant", form);

  const isAdding = !rowData && openLine;
  const isUpdating = !!rowData && openLine;
  const lines = sortData<IStoreTransferLine>(data?.lines || []);
  const variantsInLines: IProductVariant[] = collectProductVariantFromLines(lines);

  const {
    loading: lineLoading,
    errors,
    addStoreTransferLine,
    updateStoreTransferLine,
    deleteStoreTransferLine,
  } = useStoreTransferLineData({
    transferId: data?.id,
    status: status === "all" ? undefined : status,
    onCloseModal: () => {
      pageAction.handleClose();
      onReload?.();
    },
  });

  useEffect(() => {
    if (!defaultProduct) return;

    setDefaultProduct(undefined);
  }, [defaultProduct]);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const handleOpenAdd = onUpdate
    ? (defaultData: Partial<IStoreTransferLine>) => {
        form.setFieldsValue(defaultData);
        setRowData(undefined);
        setOpen(true);
      }
    : undefined;

  const handleOpenUpdate = onUpdate
    ? (materialRecord: IStoreTransferLine) => {
        form.setFieldsValue(materialRecord);
        setRowData(materialRecord);
        setOpen(true);
      }
    : undefined;

  const handleOpenDelete = onUpdate
    ? (materialRecord: IStoreTransferLine) => {
        setRowData(materialRecord);
        setOpenDelete(true);
      }
    : undefined;

  const handleAcceptDelete = () => {
    if (!rowData?.id) return;
    deleteStoreTransferLine?.(rowData.id);
    setRowData(undefined);
    setOpenDelete(false);
  };

  const handleUpdateStoreTranfer = onUpdate
    ? (updatedData: Partial<IStoreTransfer>) => {
        onUpdate({
          ...updatedData,
          id: data?.id,
        });
      }
    : undefined;

  const { contentRef, printData, handlePrint } = usePrintHtml<IStoreTransfer>();

  const handlePrintClick = () => {
    if (!data) return;
    handlePrint(data);
  };

  const onFinish: FormProps<IStoreTransferLine>["onFinish"] = async (values) => {
    try {
      if (isAdding) {
        addStoreTransferLine?.(values);
      } else {
        updateStoreTransferLine?.({
          ...values,
          id: rowData?.id,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  if (!data) return <></>;

  return (
    <>
      <Modal
        title={"Chi tiết phiếu chuyển kho"}
        open={open}
        onCancel={onClose}
        footer={null}
        maskClosable={false}
        centered
        width={1080}
        height="calc(100vh - 20px)"
        className="full-screen-modal"
        destroyOnClose
      >
        <div className="absolute right-12 top-4 flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={handlePrintClick}
          >
            <Icon icon="material-symbols-light:print-outline-rounded" className="w-4 h-4" />
            <span className="text-sm font-medium">In PDF</span>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
            onClick={() => data && exportStoreTransferToExcel(data)}
          >
            <Icon icon="file-icons:microsoft-excel" className="w-4 h-4" />
            <span className="text-sm font-medium">Xuất Excel</span>
          </button>
        </div>
        <div className="flex flex-col h-[calc(100%-8px)] mt-2 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
          <div className="flex flex-shrink-0 w-full sticky top-0 bg-gradient-to-b from-white to-transparent h-4 z-10" />
          <div className="flex flex-col gap-2">
            <Row gutter={96}>
              <Col span={12}>
                <EditableInfoRow<IStoreTransfer>
                  width={88}
                  label="Số phiếu"
                  value={data.code}
                  fieldKey={"code"}
                  editComponent={<Input placeholder="Nhập số phiếu" className="h-8" />}
                />
                <EditableInfoRow<IStoreTransfer>
                  width={88}
                  label="Kho xuất"
                  value={data.fromStore?.name}
                  fieldKey={"fromStoreId"}
                  required
                  editComponent={<StoreSelect defaultData={data.fromStore} />}
                  onUpdate={handleUpdateStoreTranfer}
                />
                <EditableInfoRow<IStoreTransfer>
                  width={88}
                  label="Lý do"
                  value={data.reason}
                  fieldKey={"reason"}
                  editComponent={<Input placeholder="Lý do chuyển kho" className="h-8" />}
                  onUpdate={handleUpdateStoreTranfer}
                />
              </Col>
              <Col span={10}>
                <EditableInfoRow<IStoreTransfer>
                  width={88}
                  label="Ngày"
                  value={formatDateTimeDDMMYYYY(data.occurredAt)}
                  fieldKey={"occurredAt"}
                  required
                  editValue={dayjs(data.occurredAt)}
                  editComponent={<DatePickerCustom />}
                  onUpdate={handleUpdateStoreTranfer}
                />
                <EditableInfoRow<IStoreTransfer>
                  width={88}
                  label="Kho nhập"
                  required
                  value={data.toStore?.name}
                  fieldKey={"toStoreId"}
                  editComponent={<Input placeholder="Nhập số phiếu" className="h-8" />}
                  onUpdate={handleUpdateStoreTranfer}
                />

                <EditableInfoRow<IStoreTransfer>
                  width={88}
                  label={"Ghi chú"}
                  value={data.note}
                  fieldKey={"note"}
                  editComponent={<Input placeholder="Nhập ghi chú" className="h-8" />}
                  onUpdate={handleUpdateStoreTranfer}
                />
              </Col>
            </Row>
            <div className="flex gap-6 items-center">
              <Title content="Chi tiết phiếu" level={5} />
              {handleOpenAdd && (
                <div className="w-[calc(100%-250px)] relative">
                  <ProductVariantSelect
                    value={defaultProduct?.id ? [defaultProduct.id] : undefined}
                    defaultData={defaultProduct ? [defaultProduct] : undefined}
                    onChangeData={(values) => {
                      const data = values && values.length > 0 ? values[0] : undefined;
                      setDefaultProduct(data);
                      handleOpenAdd({
                        productVariant: data,
                        productVariantId: data?.id,
                      });
                    }}
                    hideOptions={variantsInLines}
                    suffixIcon={false}
                    className="search-select"
                    placeholder="Tìm kiếm và chọn hàng hóa để thêm vào phiếu"
                  />
                  <MagnifyingGlassIcon className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 text-[#747E76]" />
                </div>
              )}
            </div>
            <Form
              className="border border-gray-200 rounded overflow-x-auto w-full"
              form={form}
              onFinish={onFinish}
              onFinishFailed={(errors) => {
                const errorMessages = Array.from(
                  new Set(errors.errorFields.flatMap((err) => err.errors)),
                );

                message.error({
                  content: <div className="text-sm">{errorMessages.join(", ")}</div>,
                  duration: 5,
                });
              }}
            >
              <Form.Item name="productVariant" hidden />
              <Form.Item name="productVariantId" hidden />
              <table className="w-full table-auto">
                <colgroup>
                  <col style={{ width: 60 }} />
                  <col style={{ width: 400 }} />
                  <col style={{ width: 80 }} />
                  <col style={{ width: 180 }} />
                  <col style={{ minWidth: "150px" }} />
                  <col style={{ width: 32 }} />
                </colgroup>
                <thead>
                  <tr className="bg-primary text-white font-medium">
                    <th className="px-[11px] font-semibold">STT</th>
                    <th className="px-[11px] font-semibold">Hàng hóa</th>
                    <th className="px-[11px] font-semibold">ĐVT</th>
                    <th className="px-[11px] font-semibold">Số lượng</th>
                    <th className="px-[11px] font-semibold">Ghi chú</th>
                    <th className="px-[11px] font-semibold w-8"></th>
                  </tr>
                </thead>

                <tbody>
                  {lines.map((line, index) => (
                    <tr key={line.id} className="group">
                      <td
                        className={`
                      px-[11px] border border-l-0 border-gray-100 text-center cursor-not-allowed
                      ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                      `}
                      >
                        {index + 1}
                      </td>
                      <td
                        className={`
                      px-[11px] py-1 border border-gray-100 cursor-not-allowed
                      ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                      `}
                      >
                        <ProductVariantTitle
                          item={{
                            ...lines[index]?.productVariantSnapshot,
                            image: lines[index]?.productVariant?.image,
                          }}
                          fontSize={10}
                        />
                      </td>
                      <td
                        className={`
                      px-[11px] border border-gray-100 text-center cursor-not-allowed
                      ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                      `}
                      >
                        {line.productVariant?.product?.unit?.name || ""}
                      </td>
                      <td
                        className={`
                      border border-gray-100
                      ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                      `}
                      >
                        {isUpdating && rowData?.id === line.id ? (
                          <Form.Item
                            name="quantity"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số lượng",
                              },
                            ]}
                            noStyle
                          >
                            <InputQuantity
                              placeholder="Nhập số lượng"
                              className="!border-none !shadow-none !ring-0"
                            />
                          </Form.Item>
                        ) : (
                          <div className="flex items-center justify-end px-[11px]">
                            {formatQuantity(line.quantity)}
                          </div>
                        )}
                      </td>
                      <td
                        className={`
                      border border-gray-100
                      ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                      `}
                      >
                        {isUpdating && rowData?.id === line.id ? (
                          <Form.Item name="note" noStyle>
                            <Input className="w-full h-8 !border-none !shadow-none !ring-0" />
                          </Form.Item>
                        ) : (
                          <div className="px-[11px] break-words min-h-[36px]">{line.note}</div>
                        )}
                      </td>
                      <td
                        className={`
                      px-[11px] border border-r-0 border-gray-100 text-center
                      ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                      `}
                      >
                        {isUpdating && rowData?.id === line.id ? (
                          <div className="flex w-[72px] justify-center gap-2">
                            <button
                              type="submit"
                              className="flex items-center justify-center p-0 text-green-400 hover:text-green-600 transition-colors ease-in-out disabled:opacity-50"
                            >
                              <CheckIcon className="h-6 w-6" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                pageAction.handleClose();
                                form.resetFields();
                              }}
                              className="flex items-center justify-center p-0 text-red-400 hover:text-red-600 transition-colors ease-in-out disabled:opacity-50"
                            >
                              <XMarkIcon className="h-6 w-6" />
                            </button>
                          </div>
                        ) : (
                          <DropdownAction
                            onEdit={handleOpenUpdate ? () => handleOpenUpdate(line) : undefined}
                            onDelete={handleOpenDelete ? () => handleOpenDelete(line) : undefined}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                  {isAdding && (
                    <tr key={"adding-row"}>
                      <td className="px-[11px] border border-l-0 border-gray-100 text-center cursor-not-allowed border-b-0">
                        {lines.length + 1}
                      </td>
                      <td className="px-[11px] border border-gray-100 cursor-not-allowed border-b-0">
                        <div className="flex w-64 flex-col overflow-x-hidden">
                          <ProductVariantTitle item={productVariant} fontSize={10} />
                        </div>
                      </td>
                      <td className="px-[11px] border border-gray-100 text-center cursor-not-allowed border-b-0">
                        {productVariant?.product?.unit?.name || ""}
                      </td>
                      <td className="border border-gray-100 border-b-0">
                        <Form.Item
                          name="quantity"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số lượng",
                            },
                          ]}
                          noStyle
                        >
                          <InputQuantity
                            placeholder={`Tồn kho: ${formatQuantity(productVariant?.stockQty)}`}
                            className="!border-none !shadow-none !ring-0"
                          />
                        </Form.Item>
                      </td>
                      <td className="border border-gray-100 border-b-0">
                        <Form.Item name="note" noStyle>
                          <Input className="w-full h-8 !border-none !shadow-none !ring-0" />
                        </Form.Item>
                      </td>
                      <td className="px-[11px] border border-r-0 border-gray-100 text-center border-b-0">
                        <div className="flex w-[72px] justify-center gap-2">
                          <button
                            type="submit"
                            className="flex items-center justify-center p-0 text-green-400 hover:text-green-600 transition-colors ease-in-out disabled:opacity-50"
                          >
                            <CheckIcon className="h-6 w-6" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              pageAction.handleClose();
                              form.resetFields();
                            }}
                            className="flex items-center justify-center p-0 text-red-400 hover:text-red-600 transition-colors ease-in-out disabled:opacity-50"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Form>
          </div>
          {(loading || lineLoading) && (
            <div className="absolute bg-white/5 w-full h-full flex items-center justify-center">
              <Spin />
            </div>
          )}
          <ModalDelete
            open={openDelete}
            setOpen={() => {
              setOpenDelete(false);
              setRowData(undefined);
            }}
            accept={handleAcceptDelete}
          />
        </div>
      </Modal>
      <div style={{ display: "none" }}>
        <div ref={contentRef}>{printData && <StoreTransferPrint data={printData} />}</div>
      </div>
    </>
  );
};

export default DetailModal;
