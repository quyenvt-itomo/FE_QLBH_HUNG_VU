import { Form } from "antd";
import Title from "../../../../../../components/display/Title";
import { formatMoney } from "../../../../../../utils/formatNumber";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { IOrderLine } from "../../../../../../models/store/orderLine";
import { DiscountTypeEnum } from "../../../../../../constants/enum";
import { PartialProps } from "../../DetailPage";

interface InvoiceInfoItem {
  label: string;
  value: number;
  bold?: boolean;
}

function mergeItems(items: IOrderLine[], itemForm?: IOrderLine): IOrderLine[] {
  if (!itemForm || !itemForm.productVariantId) return items;

  const index = items.findIndex((item) => item.productVariantId === itemForm.productVariantId);

  if (index >= 0) {
    const newItems = [...items];
    newItems[index] = itemForm;
    return newItems;
  }

  return [...items, itemForm];
}

const InvoiceInfo: React.FC<PartialProps> = ({ data, itemForm }) => {
  const itemFormValue = Form.useWatch({}, itemForm ?? undefined);
  const { format } = useClientData();

  if (!data) return <></>;
  const items = mergeItems(data.lines || [], itemFormValue);
  const shippingFee = data.shippingFee || 0;
  const isFreeShipping = data.isFreeShipping || false;

  const orderDiscount = data.discountValue || 0;
  const isPercent = data.discountType === DiscountTypeEnum.PERCENT;

  function calculateFee() {
    const result = {
      totalMoney: 0, // tiền hàng gốc
      totalProductDiscount: 0, // giảm giá SP
      totalOrderDiscount: 0, // giảm giá đơn
      totalTaxableAmount: 0, // tiền tính thuế (sau mọi giảm)
      totalVat: 0, // tổng VAT
      totalAmount: 0, // tổng phải trả
    };

    const tempItems: {
      baseAmount: number;
      vatRate: number;
    }[] = [];

    // 1️⃣ Giảm theo sản phẩm
    items.forEach((item) => {
      const quantity = item.quantity || 0;
      const price = item.unitPrice || 0;
      const vatRate = item.taxRate || 0;

      const money = quantity * price;

      const discountPerUnit =
        item.discountType === DiscountTypeEnum.PERCENT
          ? (price * (item.discountValue || 0)) / 100
          : item.discountValue || 0;

      const productDiscount = quantity * discountPerUnit;
      const baseAmount = money - productDiscount;

      result.totalMoney += money;
      result.totalProductDiscount += productDiscount;

      tempItems.push({
        baseAmount,
        vatRate,
      });
    });

    // 2️⃣ Tổng tiền sau giảm SP (chưa VAT)
    const totalBaseAmount = tempItems.reduce((sum, i) => sum + i.baseAmount, 0);

    // 3️⃣ Tính giảm giá đơn (chưa VAT)
    const orderDiscountAmount = isPercent
      ? (totalBaseAmount * orderDiscount) / 100
      : orderDiscount || 0;

    result.totalOrderDiscount = Math.min(orderDiscountAmount, totalBaseAmount);

    // 4️⃣ Phân bổ giảm giá đơn + tính VAT
    let allocatedSum = 0;

    tempItems.forEach((item, index) => {
      let allocatedDiscount = 0;

      if (index === tempItems.length - 1) {
        allocatedDiscount = result.totalOrderDiscount - allocatedSum;
      } else {
        allocatedDiscount = (item.baseAmount / totalBaseAmount) * result.totalOrderDiscount;

        allocatedDiscount = Math.round(allocatedDiscount);
        allocatedSum += allocatedDiscount;
      }

      const taxableAmount = item.baseAmount - allocatedDiscount;
      const vatAmount = (taxableAmount * item.vatRate) / 100;

      result.totalTaxableAmount += taxableAmount;
      result.totalVat += vatAmount;
    });

    // 5️⃣ Tổng thanh toán
    result.totalAmount =
      result.totalTaxableAmount + result.totalVat + (isFreeShipping ? 0 : shippingFee);

    return result;
  }

  const fee = calculateFee();

  const invoiceItem: InvoiceInfoItem[] = [
    {
      label: "Tổng tiền hàng",
      value: fee.totalMoney,
      bold: true,
    },
    {
      label: "Giảm giá sản phẩm",
      value: fee.totalProductDiscount,
    },
    {
      label: "Giảm giá đơn hàng",
      value: fee.totalOrderDiscount,
    },
    {
      label: "Số tiền VAT",
      value: fee.totalVat,
    },
    {
      label: "Phí giao hàng",
      value: isFreeShipping ? 0 : shippingFee,
    },
    {
      label: "Tổng phải thanh toán",
      value: fee.totalAmount,
      bold: true,
    },
  ];

  return (
    <div className="flex flex-col bg-white border rounded-lg p-4 flex-1">
      <Title content="Hóa đơn & Thanh toán" className="mb-2" level={3} />

      <div className="flex flex-col">
        {invoiceItem.map((item, idx) => (
          <div
            key={item.label}
            className={`flex justify-between py-1 ${item.bold ? "font-semibold" : ""}
            ${idx === invoiceItem.length - 1 ? "text-red-500" : "border-b border-dashed"}
            `}
          >
            <span>{item.label}</span>
            <span>{formatMoney(item.value, format) || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceInfo;
