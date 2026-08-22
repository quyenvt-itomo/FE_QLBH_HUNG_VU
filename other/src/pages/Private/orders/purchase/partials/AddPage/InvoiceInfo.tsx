import { Button, Form } from "antd";
import Title from "../../../../../../components/display/Title";
import { PartialProps } from "../../AddPage";
import { formatMoney } from "../../../../../../utils/formatNumber";
import { Icon } from "@iconify/react";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { IOrderLine } from "../../../../../../models/store/orderLine";
import { DiscountTypeEnum } from "../../../../../../constants/enum";
import Label from "../../../../../../components/display/Label";
import { InputMoney } from "../../../../../../components/input";
import FundSelect from "../../../../../../components/select/FundSelect";

interface InvoiceInfoItem {
  label: string;
  value: number;
  bold?: boolean;
}

const InvoiceInfo: React.FC<PartialProps> = ({ form, loading }) => {
  const { format, info } = useClientData();
  const lines: IOrderLine[] = Form.useWatch("lines", form) || [];
  const shippingFee: number = Form.useWatch("shippingFee", form) || 0;
  const isFreeShipping: boolean = Form.useWatch("isFreeShipping", form) || false;
  const orderDiscount: number = Form.useWatch("discountValue", form) || 0;
  const discountType = Form.useWatch("discountType", form);

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
    lines.forEach((item) => {
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
    const orderDiscountAmount =
      discountType === DiscountTypeEnum.PERCENT
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
    <div className="flex flex-col bg-white border rounded-lg p-4 pb-0 flex-1">
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

      <div className="flex flex-col mt-6">
        <div className="relative">
          <Form.Item name={["payment", "amount"]} label={<Label title="Số tiền thanh toán" />}>
            <InputMoney notRightAlign placeholder="Nhập số tiền" />
          </Form.Item>
          <button
            type="button"
            className="absolute top-[5px] right-2 text-gray-400 hover:text-primary transition-all ease-in-out"
            onClick={() => {
              form.setFieldValue(["payment", "amount"] as any, fee.totalAmount);
            }}
          >
            Toàn bộ
          </button>
        </div>

        <Form.Item name={["payment", "fundId"]} label={<Label title="Quỹ thực hiện" />}>
          <FundSelect defaultData={info?.defaultFund} />
        </Form.Item>
      </div>
    </div>
  );
};

export default InvoiceInfo;
