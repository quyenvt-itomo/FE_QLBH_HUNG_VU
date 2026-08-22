import { useEffect, useRef } from "react";
import { usePageState } from "../../../../hooks/core/usePageState";
import { useNotFoundGuard } from "../../../../hooks/core/useNotFoundGuard";
import NotFoundData from "../../../../components/display/NotFoundData";
import ProductInfo from "./partials/DetailPage/ProductInfo";
import ShippingInfo from "./partials/DetailPage/ShippingInfo";
import OrderInfo from "./partials/DetailPage/OrderInfo";
import InvoiceInfo from "./partials/DetailPage/InvoiceInfo";
import { Button, Form, FormInstance } from "antd";
import { IOrder } from "../../../../models/store/order";
import { IOrderLine } from "../../../../models/store/orderLine";
import { usePurchaseData } from "../../../../hooks/order/usePurchaseData";
import CustomTitle from "../../../../layout/Private/header/components/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton } from "../../../../components/button/BackButton";
import { Icon } from "@iconify/react";
// using PurchaseOrderPrint component for printing
import { useState } from "react";
import BarcodePrintModal from "../../product/components/BarcodePrintModal";
import { getVariantOptionContent } from "../../../../utils/common";
import { exportPurchaseOrderToExcel } from "../../../../utils/excelExport";
import { useReactToPrint } from "react-to-print";
import { PurchaseOrderPrint } from "../../../../components/print";

export interface PartialProps {
  data?: IOrder;
  itemForm?: FormInstance<any>;
  reload?: boolean;
  onReload?: () => void;
  onUpdate?: (data: Partial<IOrder>) => void | Promise<void>;
}

const DetailPage: React.FC = () => {
  const { id, rowData, setRowData, reload, setReload, pageAction } = usePageState<IOrder>();
  const [itemForm] = Form.useForm<IOrderLine>();
  const navigate = useNavigate();
  const location = useLocation();
  const isPrint = location.state?.isPrint;
  const [openPrint, setOpenPrint] = useState(false);
  const [printItems, setPrintItems] = useState<any[]>([]);
  const printContentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef: printContentRef });

  const { purchase, loading, updatePurchase } = usePurchaseData({
    id,
    reload,
    isLockHook: true,
    onCloseModal: () => {
      setReload(!reload);
    },
  });

  useEffect(() => {
    if (purchase) {
      setRowData(purchase);
    }
  }, [purchase]);

  useEffect(() => {
    if (!isPrint) return;
    if (!rowData) return;

    const doPrint = async () => {
      handleExportPdf();

      // xóa state isPrint để tránh in lại khi refresh
      navigate(location.pathname, { replace: true });
    };

    doPrint();
  }, [isPrint, rowData]);

  const handleExportPdf = () => {
    reactToPrintFn();
  };

  const handleExportExcel = async (data: IOrder) => {
    await exportPurchaseOrderToExcel(data);
  };

  const handlePrintBarcode = () => {
    if (!rowData || !rowData.lines) return;

    const items: any[] = [];
    rowData.lines.forEach((line) => {
      // Chỉ in mã vạch cho các dòng hàng (NORMAL)
      if (line.productVariantSnapshot) {
        const variant = line.productVariantSnapshot;
        const barcode = variant.barcode;
        if (barcode) {
          const variantName = getVariantOptionContent(variant);
          const name = variant.product?.name || "";
          items.push({
            barcode,
            name: variantName ? `${name} - ${variantName}` : name,
            code: variant.product?.code || "",
            price: variant.price,
            quantity: line.quantity, // Lấy số lượng từ dòng đơn hàng
          });
        }
      }
    });

    if (items.length === 0) {
      return;
    }

    setPrintItems(items);
    setOpenPrint(true);
  };

  const handleUpdate = updatePurchase
    ? async (data: Partial<IOrder>) => {
        if (!id) return;
        updatePurchase({
          ...data,
          id,
        });
      }
    : undefined;

  const showNotFound = useNotFoundGuard({
    id,
    loading,
    data: rowData,
  });

  if (showNotFound) return <NotFoundData />;

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="flex justify-between items-center">
        <CustomTitle />

        <div className="flex gap-3">
          <BackButton align="right" />
          <Button
            type="primary"
            htmlType="button"
            className="flex items-center gap-2 h-8 px-4 font-light"
            onClick={handlePrintBarcode}
          >
            <Icon icon="ic:baseline-barcode" width="18" height="18" />
            In mã vạch
          </Button>
          <Button
            type="primary"
            htmlType="button"
            className="h-8 px-4"
            onClick={() => rowData && handleExportPdf()}
          >
            <Icon icon="material-symbols-light:print-outline-rounded" width="24" height="24" />
            In PDF
          </Button>
          <Button
            type="primary"
            htmlType="button"
            className="h-8 px-4"
            onClick={() => rowData && handleExportExcel(rowData)}
          >
            <Icon icon="file-icons:microsoft-excel" width="18" height="18" />
            Xuất Excel
          </Button>
        </div>
      </div>
      <div className="flex gap-6 h-[calc(100%-44px)] w-full">
        <div className="w-[calc(100%-512px)] h-full flex flex-col bg-white border rounded-lg p-4 gap-4">
          <ProductInfo
            data={rowData}
            itemForm={itemForm}
            onReload={pageAction.handleReload}
            onUpdate={handleUpdate}
          />
          <ShippingInfo data={rowData} onReload={pageAction.handleReload} onUpdate={handleUpdate} />
        </div>
        <div className="w-[496px] flex flex-col gap-4 overflow-y-auto scrollbar-hide">
          <OrderInfo data={rowData} onReload={pageAction.handleReload} onUpdate={handleUpdate} />
          <InvoiceInfo data={rowData} itemForm={itemForm} />
        </div>
      </div>

      <div style={{ display: "none" }}>
        <div ref={printContentRef}>{rowData && <PurchaseOrderPrint data={rowData} />}</div>
      </div>

      <BarcodePrintModal
        open={openPrint}
        items={printItems}
        onClose={() => {
          setOpenPrint(false);
          setPrintItems([]);
        }}
      />
    </div>
  );
};

export default DetailPage;
