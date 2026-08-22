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
import { useSaleData } from "../../../../hooks/order/useSaleData";
import CustomTitle from "../../../../layout/Private/header/components/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { BackButton } from "../../../../components/button/BackButton";
import { usePrintHtml, SaleOrderPrint } from "../../../../components/print";
import { bank_bin_map } from "../../../../constants/option/bank";
import { FundTypeEnum } from "../../../../constants/enum";
import { QrPay } from "../../../../utils/qrcode";
import QRCode from "qrcode";

export interface PartialProps {
  data?: IOrder;
  qrImage?: string;
  itemForm?: FormInstance<any>;
  reload?: boolean;
  onReload?: () => void;
  onUpdate?: (data: Partial<IOrder>) => void | Promise<void>;
}

const DetailPage: React.FC = () => {
  const { id, rowData, setRowData, reload, setReload, pageAction } = usePageState<IOrder>();
  const [itemForm] = Form.useForm<IOrderLine>();
  const navigate = useNavigate();
  const [qrImage, setQrImage] = useState<string | undefined>();
  const { contentRef, printData, handlePrint } = usePrintHtml<{ data: IOrder; qrImage?: string }>();
  const location = useLocation();
  const isPrint = location.state?.isPrint;

  const { sale, loading, updateSale } = useSaleData({
    id,
    reload,
    isLockHook: true,
    onCloseModal: () => {
      setReload(!reload);
    },
  });

  useEffect(() => {
    if (sale) setRowData(sale);
  }, [sale]);

  useEffect(() => {
    if (!isPrint) return;
    if (!rowData) return;

    const doPrint = async () => {
      const qr = await getQrImage(rowData);
      handlePrint({ data: rowData, qrImage: qr });

      // xóa state isPrint để tránh in lại khi refresh
      navigate(location.pathname, { replace: true });
    };

    doPrint();
  }, [isPrint, rowData, handlePrint]);

  useEffect(() => {
    if (!rowData) return;
    getQrImage(rowData);
  }, [rowData]);

  const handleUpdate = updateSale
    ? async (data: Partial<IOrder>) => {
        if (!id) return;
        updateSale({
          ...data,
          id,
        });
      }
    : undefined;

  const getQrImage = async (data: IOrder) => {
    const fund = data.incomeExpenses?.find((ie) => ie.fund?.type === FundTypeEnum.BANK)?.fund;
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
    setQrImage(qrImage);
    return qrImage;
  };

  const handleExportFile = async (data?: IOrder) => {
    if (!data) return;
    const qr = await getQrImage(data);
    handlePrint({ data, qrImage: qr });
  };

  const showNotFound = useNotFoundGuard({
    id,
    loading,
    data: rowData,
  });

  if (showNotFound) return <NotFoundData />;

  return (
    <>
      <div className="flex flex-col w-full h-full gap-3">
        <div className="flex justify-between items-center">
          <CustomTitle />

          <div className="flex gap-3">
            <BackButton align="right" />
            <Button
              type="primary"
              htmlType="button"
              className="w-full h-8 "
              onClick={() => handleExportFile(rowData)}
            >
              <Icon icon="material-symbols-light:print-outline-rounded" width="24" height="24" />
              In
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
            <ShippingInfo
              data={rowData}
              onReload={pageAction.handleReload}
              onUpdate={handleUpdate}
            />
          </div>
          <div className="w-[496px] flex flex-col gap-4 overflow-y-auto scrollbar-hide">
            <OrderInfo data={rowData} onReload={pageAction.handleReload} onUpdate={handleUpdate} />
            <InvoiceInfo
              data={rowData}
              itemForm={itemForm}
              qrImage={qrImage}
              onReload={pageAction.handleReload}
            />
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <div ref={contentRef}>
          {printData && <SaleOrderPrint data={printData.data} qrImage={printData.qrImage} />}
        </div>
      </div>
    </>
  );
};

export default DetailPage;
