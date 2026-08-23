import { App, Button, Empty, Form, FormInstance } from "antd";
import ProductInfo from "./partials/AddPage/ProductInfo";
import ShippingInfo from "./partials/AddPage/ShippingInfo";
import OrderInfo from "./partials/AddPage/OrderInfo";
import InvoiceInfo from "./partials/AddPage/InvoiceInfo";
import { formatFormData, parseFormDataDates } from "../../../../utils/dateUtils";
import { IOrder } from "../../../../models/store/order";
import { useSaleData } from "../../../../hooks/order/useSaleData";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { BackButton } from "../../../../components/button/BackButton";
import { useSaleOrderCache } from "../../../../hooks/cache/useSaleOrderCache";
import { OrderTab } from "../../../../components/card/Order";
import { PlayIcon, PlusIcon } from "@heroicons/react/24/outline";
import { bank_bin_map } from "../../../../constants/option/bank";
import { FundTypeEnum } from "../../../../constants/enum";
import { QrPay } from "../../../../utils/qrcode";
import QRCode from "qrcode";
// HTML generator not used here anymore; use SaleOrderPrint via usePrintHtml
import { usePrintHtml, SaleOrderPrint } from "../../../../components/print";
import { useClientData } from "../../../../hooks/core/useClientData";

export interface PartialProps {
  form: FormInstance<IOrder>;
  loading?: boolean;
  onFormChange?: () => void;
}

const AddPage: React.FC = () => {
  const { modal } = App.useApp();
  const [isPrint, setIsPrint] = useState(false);
  const [form] = Form.useForm<IOrder>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { newSale, loading, addSale } = useSaleData({
    isLockHook: true,
    onCloseModal: () => {},
  });
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const rightRef = useRef<HTMLDivElement>(null);
  const { currentStore, info, handleSetOpenShiftModal } = useClientData();
  const currentShift = info?.currentShift;

  const {
    cachedOrders,
    currentOrder,
    totalCached,
    createNewCache,
    updateCurrentCache,
    removeFromCache,
    selectCache,
  } = useSaleOrderCache();

  const { contentRef, printData, handlePrint } = usePrintHtml<{ data: IOrder; qrImage?: string }>();

  useEffect(() => {
    if (!newSale?.tempId) return;
    removeFromCache(newSale.tempId);

    if (!isPrint) return;
    setIsPrint(false);
    const doPrint = async () => {
      const qrImage = await getQrImage(newSale);
      handlePrint({ data: newSale, qrImage });
    };
    doPrint();
  }, [newSale]);

  const getQrImage = async (data: IOrder) => {
    const fund = data.incomeExpenses?.[0]?.fund;
    const bin = bank_bin_map[fund?.bank || ""];
    if (!bin) return undefined;

    const qrPayData =
      fund?.type === FundTypeEnum.BANK
        ? QrPay.vietQR({
            bin,
            bankNumber: fund.accountNumber,
            amount: ((data.totalAmount || 0) - (data.loyaltyPointsDiscountAmount || 0)).toString(),
            purpose: data.code ? `Thanh toan don hang ${data.code}` : "Thanh toan don hang",
          }).build()
        : undefined;

    if (!qrPayData) return undefined;
    const qrImage = await QRCode.toDataURL(qrPayData, {
      width: 260,
      margin: 1,
    });
    return qrImage;
  };

  const handleExportFile = async (data?: IOrder) => {
    if (!data) return;
    const qrImage = await getQrImage(data);
    handlePrint({ data, qrImage });
  };

  // Scroll to right when new order is created
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [totalCached]);

  useEffect(() => {
    if (currentOrder) {
      // Normalize data: extract IDs from nested objects and parse dates
      const order = parseFormDataDates(currentOrder) as any;
      const normalizedOrder = {
        ...order,
        partnerId: order.partner?.id || order.partnerId,
        employeeId: order.employee?.id || order.employeeId,
        shipperId: order.shipper?.id || order.shipperId,
      };
      form.setFieldsValue(normalizedOrder);
    } else if (cachedOrders.length > 0) {
      const order = cachedOrders[0];
      if (order?.id) selectCache(order.id);
    } else {
      form.resetFields();
      createNewCache();
    }
  }, [currentOrder]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save function
  const debouncedSave = useCallback(
    (values: Partial<IOrder>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        const formattedValues = formatFormData(values);
        // Merge form values with currentOrder to preserve nested objects
        const mergedData = {
          ...currentOrder,
          ...formattedValues,
          // Preserve nested objects from values or currentOrder
          partner: values.partner || currentOrder?.partner,
          employee: values.employee || currentOrder?.employee,
          shipper: values.shipper || currentOrder?.shipper,
          // Preserve lines from form values
          lines: formattedValues.lines || currentOrder?.lines || [],
        };
        updateCurrentCache(mergedData);
      }, 300);
    },
    [updateCurrentCache, currentOrder],
  );

  const handleFormChange = useCallback(() => {
    // Use getFieldsValue(true) to get all values including just-set fields
    const values = form.getFieldsValue(true);
    debouncedSave(values);
  }, [form, debouncedSave]);

  const handleFinish = async (values: IOrder) => {
    try {
      const { orderAt, ...formattedData } = formatFormData(values);
      addSale?.(formattedData);
    } catch (error) {
      console.error("Error adding sell order:", error);
    }
  };

  const handleSelectCache = (id: string) => {
    form.resetFields();
    selectCache(id);
  };

  const handleRemoveCache = (id: string) => {
    modal.confirm({
      title: "Xóa đơn hàng",
      content: `Bạn có chắc chắn muốn xóa đơn hàng này khỏi bộ nhớ tạm?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        removeFromCache(id);
        if (id !== currentOrder?.id) return;
        form.resetFields();
      },
    });
  };

  const handleSaveAndPrint = async () => {
    setIsPrint(true);
    form.submit();

    setTimeout(() => {
      setIsPrint(false);
    }, 5000);
  };

  if (!currentStore) {
    return (
      <div className="flex flex-col gap-4 h-full w-full justify-center items-center">
        <Empty description="Vui lòng chọn cửa hàng để tạo đơn hàng" />
      </div>
    );
  }

  if (!currentShift) {
    return (
      <div className="flex flex-col gap-4 h-full w-full justify-center items-center">
        <Empty description="Vui lòng mở ca làm việc để tạo đơn hàng" />
        <Button type="primary" onClick={() => handleSetOpenShiftModal(true)}>
          <PlayIcon className="w-5 h-5" /> Mở ca làm việc
        </Button>
      </div>
    );
  }

  return (
    <>
      <Form
        form={form}
        onValuesChange={() => {
          // Get all form values to ensure we capture everything including lines
          const allValues = form.getFieldsValue(true);
          debouncedSave(allValues);
        }}
        onFinish={handleFinish}
        className="flex flex-col gap-2 w-full h-full"
      >
        <div className="flex justify-end items-center">
          <div
            ref={scrollRef}
            className="flex gap-3 w-full overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {cachedOrders.map((order) => (
              <OrderTab
                key={order.id}
                order={order}
                active={order.id === currentOrder?.id}
                selectCache={handleSelectCache}
                removeFromCache={handleRemoveCache}
              />
            ))}
            <button
              type="button"
              className="
            h-8 w-8 flex items-center justify-center bg-white rounded-lg text-primary/80 border
            hover:bg-gray-100 hover:text-primary transition-all ease-in-out flex-shrink-0
            "
              onClick={() => createNewCache()}
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-3">
            <BackButton align="right" />
            {currentOrder && (
              <>
                <Button
                  htmlType="button"
                  loading={loading}
                  className="w-1/2 h-8 rounded"
                  onClick={handleSaveAndPrint}
                >
                  <Icon
                    icon="material-symbols-light:print-outline-rounded"
                    width="24"
                    height="24"
                  />
                  Lưu & In
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-1/2 h-8 rounded"
                >
                  <Icon icon="material-symbols-light:save-outline" width="24" height="24" />
                  Lưu
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-4 h-[calc(100%-40px)] w-full relative">
          {currentOrder ? (
            <>
              <Form.Item name="tempId" hidden />
              <div className="w-[calc(100%-512px)] flex flex-col bg-white border rounded-lg p-4 gap-4">
                <ProductInfo form={form} onFormChange={handleFormChange} />
                <ShippingInfo form={form} onFormChange={handleFormChange} />
              </div>
              <div className="w-[496px] flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide">
                <OrderInfo form={form} onFormChange={handleFormChange} />
                <InvoiceInfo
                  containerRef={rightRef}
                  form={form}
                  loading={loading}
                  onFormChange={handleFormChange}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full w-full justify-center items-center">
              <Empty description="Chưa có đơn hàng nào được chọn" />
            </div>
          )}
        </div>
      </Form>
      <div style={{ display: "none" }}>
        <div ref={contentRef}>
          {printData && <SaleOrderPrint data={printData.data} qrImage={printData.qrImage} />}
        </div>
      </div>
    </>
  );
};

export default AddPage;
