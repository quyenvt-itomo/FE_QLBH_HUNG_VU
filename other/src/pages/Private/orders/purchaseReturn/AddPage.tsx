import { Button, Form, FormInstance } from "antd";
import ProductInfo from "./partials/AddPage/ProductInfo";
import ShippingInfo from "./partials/AddPage/ShippingInfo";
import OrderInfo from "./partials/AddPage/OrderInfo";
import InvoiceInfo from "./partials/AddPage/InvoiceInfo";
import { formatFormData } from "../../../../utils/dateUtils";
import { setFormCode } from "../../../../utils/formUtils";
import { IOrder } from "../../../../models/store/order";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { privateRoutesName } from "../../../../constants/routerName";
import { usePurchaseReturnData } from "../../../../hooks/order/usePurchaseReturnData";
import CustomPageTitle from "../../../../layout/Private/header/components/PageTitle";
import { Icon } from "@iconify/react";
import { useClientData } from "../../../../hooks/core/useClientData";
import { BackButton } from "../../../../components/button/BackButton";

export interface PartialProps {
  form: FormInstance<IOrder>;
  loading?: boolean;
}

const AddPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IOrder>();
  const { info } = useClientData();
  const { newPurchaseReturn, loading, addPurchaseReturn } = usePurchaseReturnData({
    isLockHook: true,
    onCloseModal: () => {},
  });

  const handleFinish = async (values: IOrder) => {
    try {
      const formattedData = formatFormData(values);
      addPurchaseReturn?.(formattedData);
    } catch (error) {
      console.error("Error adding purchaseReturn:", error);
    }
  };
  useEffect(() => {
    setFormCode({ form, type: "purchaseReturn", field: "code" });
  }, []);

  useEffect(() => {
    if (!newPurchaseReturn) return;
    const url = buildUrlWithId(privateRoutesName.purchaseReturn.detail, newPurchaseReturn.id);
    navigate(url, { replace: true });
  }, [newPurchaseReturn]);

  return (
    <Form
      form={form}
      onValuesChange={(_, values) => {}}
      onFinish={handleFinish}
      initialValues={{ orderAt: dayjs(), payment: { fundId: info?.defaultFund?.id } }}
      className="flex flex-col gap-2 h-full w-full relative"
    >
      <div className="flex justify-end items-center">
        <CustomPageTitle />

        <div className="flex gap-3">
          <BackButton align="right" />
          <Button htmlType="button" loading={loading} className="w-1/2 h-8 rounded">
            <Icon icon="material-symbols-light:print-outline-rounded" width="24" height="24" />
            Lưu & In
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} className="w-1/2 h-8 rounded">
            <Icon icon="material-symbols-light:save-outline" width="24" height="24" />
            Lưu
          </Button>
        </div>
      </div>
      <div className="flex w-full gap-4 h-[calc(100%-40px)]">
        <Form.Item name="tempId" hidden />
        <div className="w-[calc(100%-512px)] flex flex-col bg-white rounded-lg p-4 gap-4 border">
          <ProductInfo form={form} />
          <ShippingInfo form={form} />
        </div>
        <div className="w-[496px] flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide">
          <OrderInfo form={form} />
          <InvoiceInfo form={form} loading={loading} />
        </div>
      </div>
    </Form>
  );
};

export default AddPage;
