import { Button, Form } from "antd";
import Title from "../../../../../../components/display/Title";
import { PartialProps } from "../../AddPage";
import { formatMoney } from "../../../../../../utils/formatNumber";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { DiscountTypeEnum, FundTypeEnum } from "../../../../../../constants/enum";
import { InputMoney } from "../../../../../../components/input";
import Label from "../../../../../../components/display/Label";
import FundSelect from "../../../../../../components/select/FundSelect";
import { IFund } from "../../../../../../models/fund";
import { QrPay } from "../../../../../../utils/qrcode";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { bank_bin_map } from "../../../../../../constants/option/bank";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface InvoiceInfoItem {
  label: string;
  value: number;
  bold?: boolean;
}

const InvoiceInfo: React.FC<
  PartialProps & {
    containerRef?: React.RefObject<HTMLDivElement>;
  }
> = ({ containerRef, form, onFormChange }) => {
  const { format, info } = useClientData();
  const code = Form.useWatch("code", form);
  const lines = Form.useWatch("lines", form) || [];
  const shippingFee: number = Form.useWatch("shippingFee", form) || 0;
  const isFreeShipping: boolean = Form.useWatch("isFreeShipping", form) || false;
  const payments: Array<{ fundId?: string; amount?: number; fund?: IFund }> =
    Form.useWatch("payments", form) || [];
  const orderDiscount: number = Form.useWatch("discountValue", form) || 0;
  const discountType = Form.useWatch("discountType", form);
  const loyaltyPointsUsed: number = Form.useWatch("loyaltyPointsUsed", form) || 0;
  const [qrImage, setQrImage] = useState<string | undefined>();

  // Calculate total payment amount
  const totalPaymentAmount = payments.reduce((sum, payment) => sum + (payment?.amount || 0), 0);

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

  const fundInPayments = payments.map((p) => p.fund).filter((f): f is IFund => !!f);

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
      label: "Sử dụng điểm",
      value: loyaltyPointsUsed * 1000,
      bold: true,
    },
    {
      label: "Tổng phải thanh toán",
      value: fee.totalAmount - loyaltyPointsUsed * 1000,
      bold: true,
    },
  ];

  useEffect(() => {
    // Get first bank fund for QR code
    const bankFund = payments.find((p) => p.fund?.type === FundTypeEnum.BANK)?.fund;
    const bin = bank_bin_map[bankFund?.bank || ""];

    if (!bin || !bankFund) {
      setQrImage(undefined);
      return;
    }

    const qrPayData = QrPay.vietQR({
      bin,
      bankNumber: bankFund.accountNumber,
      amount: (fee.totalAmount - loyaltyPointsUsed * 1000).toString(),
      purpose: code ? `Thanh toan don hang ${code}` : "Thanh toan don hang",
    }).build();

    if (!qrPayData) {
      setQrImage(undefined);
      return;
    }

    QRCode.toDataURL(qrPayData, {
      width: 260,
      margin: 1,
    }).then(setQrImage);
  }, [payments, fee, loyaltyPointsUsed, code]);

  return (
    <div className="flex flex-col bg-white border rounded-lg p-4 pb-0 flex-1">
      <Title content="Hóa đơn & Thanh toán" className="mb-2" level={3} />

      <div className="flex flex-col">
        {invoiceItem.map((item, idx) => (
          <div
            key={item.label}
            className={`flex justify-between py-1 ${item.bold ? "font-semibold" : ""}
            ${idx === invoiceItem.length - 1 ? "text-red-500" : idx === invoiceItem.length - 2 ? "text-blue-500 border-b border-dashed" : "border-b border-dashed"}
            `}
          >
            <span>{item.label}</span>
            <span>{formatMoney(item.value, format) || 0}</span>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="flex flex-col mt-6">
        <Form.List name="payments">
          {(fields, { add, remove }) => {
            const totalAmountToPay = fee.totalAmount - loyaltyPointsUsed * 1000;
            const showAllButton = fields.length === 1;

            return (
              <>
                {fields.map(({ key, ...fieldData }, index) => {
                  const payment = payments[index];
                  const paymentAmount = payment?.amount || 0;
                  const fund = payment?.fund;

                  const fundHideOptions = fundInPayments.filter((f) => f.id !== fund?.id);

                  return (
                    <div key={key} className="mb-4">
                      {fields.length > 1 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Phương thức thanh toán {index + 1}
                          </span>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(fieldData.name)}
                          >
                            Xóa
                          </Button>
                        </div>
                      )}

                      <div className="relative">
                        <Form.Item
                          {...fieldData}
                          name={[fieldData.name, "amount"]}
                          label={<Label title="Khách thanh toán" />}
                        >
                          <InputMoney
                            notRightAlign
                            placeholder="Nhập số tiền"
                            max={fund?.type === FundTypeEnum.CASH ? undefined : totalAmountToPay}
                          />
                        </Form.Item>
                        {showAllButton && (
                          <button
                            type="button"
                            className="absolute top-[5px] right-2 text-gray-400 hover:text-primary transition-all ease-in-out"
                            onClick={() => {
                              form.setFieldValue(
                                ["payments", index, "amount"] as any,
                                totalAmountToPay,
                              );
                              onFormChange?.();
                            }}
                          >
                            Toàn bộ
                          </button>
                        )}
                        {paymentAmount > totalAmountToPay && showAllButton && (
                          <span className="absolute top-8 left-40 italic text-xs text-red-500">
                            Tiền thừa trả khách:{" "}
                            {formatMoney(paymentAmount - totalAmountToPay, format)}
                          </span>
                        )}
                      </div>

                      <Form.Item
                        {...fieldData}
                        name={[fieldData.name, "fundId"]}
                        label={<Label title="Quỹ nhận" />}
                        rules={
                          !!paymentAmount
                            ? [
                                {
                                  required: true,
                                  message: "Vui lòng chọn quỹ nhận",
                                },
                              ]
                            : undefined
                        }
                      >
                        <FundSelect
                          defaultData={fund || info?.defaultFund}
                          hideOptions={fundHideOptions}
                          showBalance={false}
                          onChangeData={(value) => {
                            form.setFieldValue(["payments", index, "fund"] as any, value);
                            onFormChange?.();
                          }}
                        />
                      </Form.Item>
                      <Form.Item {...fieldData} name={[fieldData.name, "fund"]} hidden />
                    </div>
                  );
                })}

                {totalPaymentAmount > totalAmountToPay && (
                  <div className="text-red-500 text-sm mb-2">
                    Tổng thanh toán {formatMoney(totalPaymentAmount, format)} vượt quá tổng phải
                    thanh toán {formatMoney(totalAmountToPay, format)}
                  </div>
                )}

                <Button
                  type="dashed"
                  onClick={() => {
                    add({ amount: 0 });
                    // Cuộn xuống cuối khi thêm mới
                    setTimeout(() => {
                      containerRef?.current?.scrollTo({
                        top: containerRef.current.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 100);
                  }}
                  block
                  icon={<PlusOutlined />}
                  className="mb-4"
                >
                  Thêm phương thức thanh toán
                </Button>
              </>
            );
          }}
        </Form.List>

        {/* QR */}
        {qrImage && (
          <div className="flex flex-col items-center border-t pt-2 pb-4">
            <div className="text-sm text-gray-500 mb-2">Quét mã QR để chuyển khoản</div>

            <img src={qrImage} alt="VietQR Payment" className="w-[126px] h-[126px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceInfo;
