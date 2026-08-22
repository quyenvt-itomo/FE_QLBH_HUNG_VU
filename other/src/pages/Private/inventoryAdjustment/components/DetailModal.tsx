import React, { useEffect, useState } from "react";
import { Input, Modal, Form, message, Row, Col, Spin } from "antd";
import { FormProps } from "antd/lib";
import { setFormErrors } from "../../../../utils/formUtils";
import { formatDateTimeDDMMYYYY } from "../../../../utils/dateUtils";
import { collectProductVariantFromLines, sortData } from "../../../../utils/common";
import { DatePickerCustom, InputMoney, InputQuantity } from "../../../../components/input";
import dayjs from "dayjs";
import Title from "../../../../components/display/Title";
import { CheckIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ProductVariantSelect from "../../../../components/tree_select/ProductVariantSelect";
import { IProductVariant } from "../../../../models/product";
import { ProductVariantTitle } from "../../../../components/display/ProductVariantTitle";
import { formatMoney, formatQuantity } from "../../../../utils/formatNumber";
import { usePageState } from "../../../../hooks/core/usePageState";
import { useInventoryAdjustmentLineData } from "../../../../hooks/inventory/useInventoryAdjustmentLineData";
import ModalDelete from "../../../../components/modal/ModalDelete";
import EditableInfoRow from "../../../../components/display/EditableInfoRow";
import EmployeeSelect from "../../../../components/select/EmployeeSelect";
import { IInventoryAdjustment } from "../../../../models/store/inventoryAdjustment";
import { IInventoryAdjustmentLine } from "../../../../models/store/inventoryAdjustmentLine";
import { useClientData } from "../../../../hooks/core/useClientData";
import VirtualList from "rc-virtual-list";
import { InventoryTransactionTypeEnum } from "../../../../constants/enum";
import DropdownAction from "../../../../components/dropdown/ActionMenu";
import { Icon } from "@iconify/react";
import { exportInventoryAdjustmentToExcel } from "../../../../utils/excelExport";

const ROW_HEIGHT = 48; // chỉnh theo chiều cao thực tế của 1 dòng
const LIST_HEIGHT = 432; // chiều cao vùng scroll

interface DetailModalProps {
  data?: IInventoryAdjustment;
  open: boolean;
  loading: boolean;
  onClose?: () => void;
  onUpdate?: (data: Partial<IInventoryAdjustment>) => void;
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
  if (!data) return <></>;

  const {
    open: openLine,
    setOpen,
    openDelete,
    setOpenDelete,
    rowData,
    setRowData,
    status,

    pageAction,
  } = usePageState<IInventoryAdjustmentLine>();
  const [form] = Form.useForm<IInventoryAdjustmentLine>();
  const [defaultProductVariant, setDefaultProductVariant] = useState<IProductVariant | undefined>(
    undefined,
  );
  const { currentStore, info, handleSetCurrentStore } = useClientData();
  const productVariant = Form.useWatch("productVariant", form);
  const expectedQty = Form.useWatch("expectedQty", form);
  const countedQty = Form.useWatch("countedQty", form);
  const costPriceAtTime = Form.useWatch("costPriceAtTime", form);

  const isAdding = !rowData && openLine;
  const isUpdating = !!rowData && openLine;
  const lines = sortData<IInventoryAdjustmentLine>(data.lines || []);
  const variantsInLines: IProductVariant[] = collectProductVariantFromLines(lines);
  const diffQty = (expectedQty ?? 0) - (countedQty ?? 0);
  const diffMoney = diffQty * (costPriceAtTime ?? 0);

  const canViewStore = info?.stores?.some((store) => store.id === data.storeId);

  const summaryRows = lines.reduce(
    (summary, line) => {
      summary.countedQty += line.countedQty || 0;
      summary.expectedQty += line.expectedQty || 0;
      summary.deltaQty +=
        (line.direction === InventoryTransactionTypeEnum.IN ? 1 : -1) * (line.deltaQty || 0);
      summary.adjustmentValue +=
        (line.direction === InventoryTransactionTypeEnum.IN ? 1 : -1) * (line.adjustmentValue || 0);
      return summary;
    },
    { countedQty: 0, expectedQty: 0, deltaQty: 0, adjustmentValue: 0 },
  );

  const {
    loading: lineLoading,
    errors,
    addInventoryAdjustmentLine,
    updateInventoryAdjustmentLine,
    deleteInventoryAdjustmentLine,
  } = useInventoryAdjustmentLineData({
    adjustmentId: data.id,
    status: status === "all" ? undefined : status,
    onCloseModal: () => {
      pageAction.handleClose();
      onReload?.();
    },
  });

  useEffect(() => {
    if (!defaultProductVariant) return;

    setDefaultProductVariant(undefined);
  }, [defaultProductVariant]);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const handleOpenAdd = onUpdate
    ? (defaultData: Partial<IInventoryAdjustmentLine>) => {
        form.setFieldsValue(defaultData);
        setRowData(undefined);
        setOpen(true);
      }
    : undefined;

  const handleOpenUpdate = onUpdate
    ? (materialRecord: IInventoryAdjustmentLine) => {
        form.setFieldsValue(materialRecord);
        setRowData(materialRecord);
        setOpen(true);
      }
    : undefined;

  const handleOpenDelete = onUpdate
    ? (materialRecord: IInventoryAdjustmentLine) => {
        setRowData(materialRecord);
        setOpenDelete(true);
      }
    : undefined;

  const handleAcceptDelete = () => {
    if (!rowData?.id) return;
    deleteInventoryAdjustmentLine?.(rowData.id);
    setRowData(undefined);
    setOpenDelete(false);
  };

  const handleUpdateStoreTranfer = onUpdate
    ? (updatedData: Partial<IInventoryAdjustment>) => {
        onUpdate({
          ...updatedData,
          id: data.id,
        });
      }
    : undefined;

  const onFinish: FormProps<IInventoryAdjustmentLine>["onFinish"] = async (values) => {
    try {
      if (isAdding) {
        addInventoryAdjustmentLine?.(values);
      } else {
        updateInventoryAdjustmentLine?.({
          ...values,
          id: rowData?.id,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center pr-8">
          <span>Chi tiết phiếu kiểm kho</span>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
            onClick={() => data && exportInventoryAdjustmentToExcel(data)}
          >
            <Icon icon="file-icons:microsoft-excel" className="w-4 h-4" />
            <span className="text-sm font-medium">Xuất Excel</span>
          </button>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      centered
      width={1520}
      height="calc(100vh - 20px)"
      className="full-screen-modal"
      destroyOnClose
    >
      <div className="flex flex-col h-[calc(100%-8px)] mt-2 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
        <div className="flex flex-shrink-0 w-full sticky top-0 bg-gradient-to-b from-white to-transparent h-4 z-10" />
        <div className="flex flex-col gap-2">
          <Row gutter={[128, 0]}>
            <Col span={12}>
              <EditableInfoRow<IInventoryAdjustment>
                width={108}
                label="Số phiếu"
                value={data.code}
                fieldKey={"code"}
                editComponent={<Input placeholder="Nhập số phiếu" className="h-8" />}
              />
            </Col>
            <Col span={12}>
              <EditableInfoRow<IInventoryAdjustment>
                width={108}
                label="Ngày"
                value={formatDateTimeDDMMYYYY(data.occurredAt)}
                fieldKey={"occurredAt"}
                required
                editValue={dayjs(data.occurredAt)}
                editComponent={<DatePickerCustom />}
                onUpdate={handleUpdateStoreTranfer}
              />
            </Col>
            <Col span={12}>
              <EditableInfoRow<IInventoryAdjustment>
                width={108}
                label="Lý do"
                value={data.reason}
                fieldKey={"reason"}
                editComponent={<Input placeholder="Lý do kiểm kho" className="h-8" />}
                onUpdate={handleUpdateStoreTranfer}
              />
            </Col>
            <Col span={12}>
              <EditableInfoRow<IInventoryAdjustment>
                width={108}
                label="NV thực hiện"
                value={data.adjustedBy?.name}
                fieldKey={"adjustedById"}
                required
                editComponent={<EmployeeSelect defaultData={data.adjustedBy} />}
                onUpdate={handleUpdateStoreTranfer}
              />
            </Col>
            <Col span={12}>
              <EditableInfoRow<IInventoryAdjustment>
                width={108}
                label={"Ghi chú"}
                value={data.note}
                fieldKey={"note"}
                editComponent={<Input placeholder="Nhập ghi chú" className="h-8" />}
                onUpdate={handleUpdateStoreTranfer}
              />
            </Col>
            {!currentStore && (
              <Col span={12}>
                <EditableInfoRow<IInventoryAdjustment>
                  width={108}
                  label={"Cửa hàng"}
                  value={data.store?.name}
                  onClick={canViewStore ? () => handleSetCurrentStore(data.store) : undefined}
                />
              </Col>
            )}
          </Row>
          <div className="flex items-center gap-6">
            <Title content="Chi tiết phiếu" level={5} />
            {handleOpenAdd && (
              <div className="w-[calc(100%-250px)] relative">
                <ProductVariantSelect
                  value={defaultProductVariant?.id ? [defaultProductVariant.id] : undefined}
                  defaultData={defaultProductVariant ? [defaultProductVariant] : undefined}
                  onChangeData={(values) => {
                    const data = values && values.length > 0 ? values[0] : undefined;
                    setDefaultProductVariant(data);
                    handleOpenAdd({
                      productVariant: data,
                      productVariantId: data?.id,
                      countedQty: data?.stockQty,
                    });
                  }}
                  hideOptions={variantsInLines}
                  suffixIcon={false}
                  className="search-select"
                  placeholder="Tìm kiếm và chọn hàng hóa để thêm vào phiếu"
                  disabled={isAdding || isUpdating}
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
            <Form.Item name="countedQty" hidden />
            <table className="min-w-[1100px] w-full table-fixed">
              <colgroup>
                <col style={{ width: 60 }} />
                <col style={{ width: 250 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 100 }} />
                <col style={{ width: 160 }} />
                <col style={{ minWidth: "150px" }} />
                {onUpdate && <col style={{ width: 72 }} />}
              </colgroup>

              <thead>
                <tr className="bg-primary text-white font-medium">
                  <th className="px-[11px] font-semibold">STT</th>
                  <th className="px-[11px] font-semibold">Hàng hóa</th>
                  <th className="px-[11px] font-semibold">ĐVT</th>
                  <th className="px-[11px] font-semibold">Tồn hệ thống</th>
                  <th className="px-[11px] font-semibold">Tồn thực tế</th>
                  <th className="px-2 font-semibold">Chênh lệch</th>
                  <th className="px-2 font-semibold">Giá trị chênh lệch</th>
                  <th className="px-[11px] font-semibold">Ghi chú</th>
                  {onUpdate && <th className="px-[11px] font-semibold w-8"></th>}
                </tr>
              </thead>

              <tbody>
                <tr className="bg-gray-100 font-medium">
                  <td className="px-[11px] border border-gray-100 text-center" colSpan={3}>
                    Tổng
                  </td>
                  <td className="border border-gray-100 px-2 text-end">
                    {formatQuantity(summaryRows.countedQty)}
                  </td>
                  <td className="border border-gray-100 px-2 text-end">
                    {formatQuantity(summaryRows.expectedQty)}
                  </td>
                  <td
                    className={`border border-gray-100 px-2 text-end ${summaryRows.deltaQty < 0 ? "text-red-500" : summaryRows.deltaQty > 0 ? "text-green-600" : ""}`}
                  >
                    {formatQuantity(summaryRows.deltaQty)}
                  </td>
                  <td
                    className={`border border-gray-100 px-2 text-end ${summaryRows.adjustmentValue < 0 ? "text-red-600" : summaryRows.adjustmentValue > 0 ? "text-green-700" : ""}`}
                  >
                    {formatMoney(summaryRows.adjustmentValue)}
                  </td>
                  <td className="border border-gray-100" colSpan={onUpdate ? 2 : 1}></td>
                </tr>
              </tbody>
            </table>
            <VirtualList data={lines} height={LIST_HEIGHT} itemHeight={ROW_HEIGHT} itemKey="id">
              {(line, index) => {
                const isUpdatingRow = isUpdating && rowData?.id === line.id;
                const isDecrease =
                  line.direction === InventoryTransactionTypeEnum.OUT && line.deltaQty !== 0;
                const adjustmentQty = (line.deltaQty || 0) * (isDecrease ? -1 : 1);
                const adjustmentValue = (line.adjustmentValue || 0) * (isDecrease ? -1 : 1);
                return (
                  <table className="min-w-[1100px] w-full table-fixed">
                    <colgroup>
                      <col style={{ width: 60 }} />
                      <col style={{ width: 250 }} />
                      <col style={{ width: 90 }} />
                      <col style={{ width: 150 }} />
                      <col style={{ width: 150 }} />
                      <col style={{ width: 100 }} />
                      <col style={{ width: 160 }} />
                      <col style={{ minWidth: "150px" }} />
                      {onUpdate && <col style={{ width: 72 }} />}
                    </colgroup>
                    <tbody>
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
                        px-[11px] border border-gray-100 cursor-not-allowed
                        ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                        `}
                        >
                          <div className="flex flex-col overflow-x-hidden">
                            <ProductVariantTitle item={lines[index]?.productVariant} />
                          </div>
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
                        border border-gray-100 px-2 text-end cursor-not-allowed
                        ${index === lines.length - 1 ? "border-b-0" : ""}
                        `}
                        >
                          {formatQuantity(line?.countedQty) || 0}
                        </td>
                        <td
                          className={`
                        border border-gray-100
                        ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                        `}
                        >
                          {isUpdatingRow ? (
                            <Form.Item
                              name="expectedQty"
                              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                              noStyle
                            >
                              <InputQuantity
                                placeholder="Nhập số lượng"
                                className="!border-none !shadow-none !ring-0"
                              />
                            </Form.Item>
                          ) : (
                            <div className="flex items-center justify-end px-[11px]">
                              {formatQuantity(line.expectedQty)}
                            </div>
                          )}
                        </td>
                        <td
                          className={`
                        border border-gray-100 px-2 text-end cursor-not-allowed
                        ${index === lines.length - 1 ? "border-b-0" : ""}
                        ${isDecrease ? "text-red-500" : line.deltaQty > 0 ? "text-green-600" : ""}
                        `}
                        >
                          {formatQuantity(adjustmentQty)}
                        </td>
                        <td
                          className={`
                        border border-gray-100 px-2 text-end cursor-not-allowed
                        ${index === lines.length - 1 ? "border-b-0" : ""}
                        ${isDecrease ? "text-red-600" : line.deltaQty > 0 ? "text-green-600" : ""}
                        `}
                        >
                          {formatMoney(adjustmentValue)}
                        </td>
                        <td
                          className={`
                        border border-gray-100
                        ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                        `}
                        >
                          {isUpdatingRow ? (
                            <Form.Item name="note" noStyle>
                              <Input className="w-full h-8 !border-none !shadow-none !ring-0" />
                            </Form.Item>
                          ) : (
                            <div className="px-[11px] break-words min-h-[36px]">{line.note}</div>
                          )}
                        </td>
                        {onUpdate && (
                          <td
                            className={`
                          border border-r-0 border-gray-100 text-center
                          ${index === lines.length - 1 && !isAdding ? "border-b-0" : ""}
                          `}
                          >
                            {isUpdatingRow ? (
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
                                onEdit={() => handleOpenUpdate?.(line)}
                                onDelete={() => handleOpenDelete?.(line)}
                              />
                            )}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                );
              }}
            </VirtualList>

            {isAdding && (
              <tr key={"adding-row"}>
                <td className="px-[11px] border border-l-0 border-gray-100 text-center cursor-not-allowed border-b-0">
                  {lines.length + 1}
                </td>
                <td className="px-[11px] border border-gray-100 cursor-not-allowed border-b-0">
                  <div className="flex w-64 flex-col overflow-x-hidden">
                    <ProductVariantTitle item={productVariant} />
                  </div>
                </td>
                <td className="px-[11px] border border-gray-100 text-center cursor-not-allowed border-b-0">
                  {productVariant?.product?.unit?.name || ""}
                </td>
                <td className="border border-gray-100 border-b-0 px-[11px] text-end cursor-not-allowed">
                  {formatQuantity(countedQty)}
                </td>
                <td className="border border-gray-100 border-b-0">
                  <Form.Item
                    name="expectedQty"
                    rules={[{ required: true, message: "Vui lòng nhập số lượng tồn thực tế" }]}
                    noStyle
                  >
                    <InputQuantity
                      placeholder="Nhập số lượng tồn thực tế"
                      className="!border-none !shadow-none !ring-0"
                    />
                  </Form.Item>
                </td>
                <td
                  className={`
                      border border-gray-100 border-b-0 px-[11px] text-end cursor-not-allowed
                      ${diffQty < 0 ? "text-red-500" : diffQty > 0 ? "text-green-600" : ""}
                      `}
                >
                  {formatQuantity(Math.abs(diffQty))}
                </td>
                <td
                  className={`
                        border border-gray-100 border-b-0 px-[11px] text-end cursor-not-allowed
                        ${diffMoney < 0 ? "text-red-600" : diffMoney > 0 ? "text-green-700" : ""}
                      `}
                >
                  {diffMoney > 0 ? formatMoney(diffMoney) : "???"}
                </td>
                <td className="border border-gray-100 border-b-0">
                  <Form.Item name="note" noStyle>
                    <Input className="w-full h-8 !border-none !shadow-none !ring-0" />
                  </Form.Item>
                </td>
                <td className="border border-r-0 border-gray-100 text-center border-b-0">
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
  );
};

export default DetailModal;
