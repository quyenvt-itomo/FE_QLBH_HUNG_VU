import { useEffect, useState } from "react";
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
import CustomTitle from "../../../../layout/Private/header/components/Title";
import { useNavigate, useLocation } from "react-router-dom";
import { usePurchaseReturnData } from "../../../../hooks/order/usePurchaseReturnData";
import { BackButton } from "../../../../components/button/BackButton";
import { Icon } from "@iconify/react";
import { usePrintHtml, PurchaseReturnOrderPrint } from "../../../../components/print";
import BarcodePrintModal from "../../product/components/BarcodePrintModal";

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
  const { contentRef, printData, handlePrint } = usePrintHtml<IOrder>();

  const { purchaseReturn, loading, updatePurchaseReturn } = usePurchaseReturnData({
    id,
    reload,
    isLockHook: true,
    onCloseModal: () => {
      setReload(!reload);
    },
  });

  useEffect(() => {
    if (purchaseReturn) {
      setRowData(purchaseReturn);
    }
  }, [purchaseReturn]);

  useEffect(() => {
    if (!isPrint) return;
    if (!rowData) return;

    const doPrint = async () => {
      handlePrint(rowData);

      // xóa state isPrint để tránh in lại khi refresh
      navigate(location.pathname, { replace: true });
    };

    doPrint();
  }, [isPrint, rowData, handlePrint]);

  const [openPrint, setOpenPrint] = useState(false);
  const [printItems, setPrintItems] = useState<any[]>([]);

  const handleExportFile = async (data: IOrder) => {
    handlePrint(data);
  };

  const handleUpdate = updatePurchaseReturn
    ? async (data: Partial<IOrder>) => {
        if (!id) return;
        updatePurchaseReturn({
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
            className="w-full h-8 "
            onClick={() => rowData && handleExportFile(rowData)}
          >
            <Icon icon="material-symbols-light:print-outline-rounded" width="24" height="24" />
            In hóa đơn
          </Button>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <div ref={contentRef}>{printData && <PurchaseReturnOrderPrint data={printData} />}</div>
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
