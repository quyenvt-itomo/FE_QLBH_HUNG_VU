import { Button, Form, FormInstance, message } from "antd";
import ProductInfo from "./partials/AddPage/ProductInfo";
import ShippingInfo from "./partials/AddPage/ShippingInfo";
import OrderInfo from "./partials/AddPage/OrderInfo";
import InvoiceInfo from "./partials/AddPage/InvoiceInfo";
import { formatFormData } from "../../../../utils/dateUtils";
import { setFormCode } from "../../../../utils/formUtils";
import { IOrder } from "../../../../models/store/order";
import { useSaleReturnData } from "../../../../hooks/order/useSaleReturnData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { privateRoutesName } from "../../../../constants/routerName";
import dayjs from "dayjs";
import CustomPageTitle from "../../../../layout/Private/header/components/PageTitle";
import { Icon } from "@iconify/react";
import { useClientData } from "../../../../hooks/core/useClientData";
import { BackButton } from "../../../../components/button/BackButton";
import { OrderLineTypeEnum } from "../../../../constants/enum";

export interface PartialProps {
  form: FormInstance<IOrder>;
  loading?: boolean;
}

const AddPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IOrder>();
  const { info } = useClientData();
  const { newSaleReturn, loading, addSaleReturn } = useSaleReturnData({
    isLockHook: true,
    onCloseModal: () => {},
  });

  const handleFinish = async (values: IOrder) => {
    try {
      // phải có ít nhất 1 line sản phẩm hoàn trả và 1 line sản phẩm bán mới được lưu
      const lines = values.lines || [];
      const hasReturnLine = lines.some((line) => line.lineType === OrderLineTypeEnum.RETURN);
      const hasNormalLine = lines.some((line) => line.lineType !== OrderLineTypeEnum.RETURN);

      if (!hasReturnLine) {
        message.error("Vui lòng thêm ít nhất 1 dòng sản phẩm hoàn trả.");
        return;
      }

      if (!hasNormalLine) {
        message.error("Vui lòng thêm ít nhất 1 dòng sản phẩm bán.");
        return;
      }

      const formattedData = formatFormData(values);
      addSaleReturn?.(formattedData);
    } catch (error) {
      console.error("Error adding purchase:", error);
    }
  };

  useEffect(() => {
    setFormCode({ form, type: "saleReturn", field: "code" });
  }, []);

  useEffect(() => {
    if (!newSaleReturn) return;
    const url = buildUrlWithId(privateRoutesName.saleReturn.detail, newSaleReturn.id);

    navigate(url, { replace: true });
  }, [newSaleReturn]);

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
