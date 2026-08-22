import { App, Button, Form } from "antd";
import Title from "../../../../../../components/display/Title";
import { formatMoney } from "../../../../../../utils/formatNumber";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { IOrderLine } from "../../../../../../models/store/orderLine";
import { DiscountTypeEnum, IncomeExpenseTypeEnum } from "../../../../../../constants/enum";
import { PartialProps } from "../../DetailPage";
import { useIncomeExpenseData } from "../../../../../../hooks/useIncomeExpenseData";
import EditableInfoRow from "../../../../../../components/display/EditableInfoRow";
import { IIncomeExpense } from "../../../../../../models/store/incomeExpense";
import { InputMoney } from "../../../../../../components/input";
import FundSelect from "../../../../../../components/select/FundSelect";
import AddButton from "../../../../../../components/button/AddButton";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { usePageState } from "../../../../../../hooks/core/usePageState";
import AddPaymentModal from "./AddPaymentModal";
import { MinusCircleOutlined } from "@ant-design/icons";

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

const InvoiceInfo: React.FC<PartialProps> = ({ data, qrImage, itemForm, onReload }) => {
  const itemFormValue = Form.useWatch({}, itemForm ?? undefined);
  const { modal } = App.useApp();
  const { format } = useClientData();
  const { open, setOpen, pageAction } = usePageState();
  const { loading, errors, addIncomeExpense, updateIncomeExpense, deleteIncomeExpense } =
    useIncomeExpenseData({
      isLockHook: true,
      onCloseModal: () => {
        pageAction.handleClose();
        onReload?.();
      },
    });

  if (!data) return <></>;
  const items = mergeItems(data.lines || [], itemFormValue);
  const shippingFee = data.shippingFee || 0;
  const isFreeShipping = data.isFreeShipping || false;

  const orderDiscount = data.discountValue || 0;
  const isPercent = data.discountType === DiscountTypeEnum.PERCENT;

  const payments = data.incomeExpenses || [];
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleOpenAdd = addIncomeExpense ? () => setOpen(true) : undefined;

  const handleUpdate = (paymentId: string) =>
    updateIncomeExpense
      ? async (value: Partial<IIncomeExpense>) => {
          updateIncomeExpense({
            ...value,
            id: paymentId,
          });
        }
      : undefined;

  const handleDelete = (payment: IIncomeExpense) => {
    if (!deleteIncomeExpense) return;

    modal.confirm({
      title: "Xóa thanh toán",
      content: `Bạn có chắc chắn muốn xóa phiếu thanh toán ${payment.code}?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        deleteIncomeExpense(payment.id);
      },
    });
  };

  const handleAdd = addIncomeExpense
    ? async (value: Partial<IIncomeExpense>) => {
        addIncomeExpense({
          ...value,
          type: IncomeExpenseTypeEnum.INCOME,
          orderId: data.id,
          occurredAt: data.orderAt,
          partnerId: data.partnerId,
        });
      }
    : undefined;

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
      value: data.loyaltyPointsUsed * 1000,
      bold: true,
    },
    {
      label: "Tổng phải thanh toán",
      value: fee.totalAmount - data.loyaltyPointsUsed * 1000,
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
            ${idx === invoiceItem.length - 1 ? "text-red-500" : idx === invoiceItem.length - 2 ? "text-blue-500 border-b border-dashed" : "border-b border-dashed"}
            `}
          >
            <span>{item.label}</span>
            <span>{formatMoney(item.value, format) || 0}</span>
          </div>
        ))}
      </div>

      {/* Payments */}
      <div className="flex flex-col mt-6">
        {payments.length > 0 ? (
          <>
            {payments.map((payment, index) => (
              <div key={payment.id} className="mb-4 pb-4 border-b last:border-b-0">
                {payments.length > 1 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Thanh toán {index + 1}
                    </span>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<MinusCircleOutlined />}
                      onClick={() => handleDelete(payment)}
                    >
                      Xóa
                    </Button>
                  </div>
                )}
                <EditableInfoRow<IIncomeExpense>
                  label="Khách thanh toán"
                  value={
                    <div className="flex gap-3">
                      {formatMoney(payment.amount, format)}
                      <span className="text-gray-400 ">(Số phiếu: {payment.code})</span>
                    </div>
                  }
                  fieldKey="amount"
                  editValue={payment.amount}
                  editComponent={<InputMoney notRightAlign />}
                  onUpdate={handleUpdate(payment.id)}
                />
                <EditableInfoRow<IIncomeExpense>
                  label="Quỹ nhận"
                  value={payment.fund?.name}
                  fieldKey="fundId"
                  editValue={payment.fundId}
                  editComponent={<FundSelect defaultData={payment.fund} showBalance={false} />}
                  onUpdate={handleUpdate(payment.id)}
                />
              </div>
            ))}

            {totalPaid > fee.totalAmount - (data.loyaltyPointsUsed || 0) * 1000 && (
              <div className="text-red-500 text-sm mb-2">
                Tổng thanh toán {formatMoney(totalPaid, format)} vượt quá tổng phải thanh toán{" "}
                {formatMoney(fee.totalAmount - (data.loyaltyPointsUsed || 0) * 1000, format)}
              </div>
            )}
          </>
        ) : null}

        <AddButton
          className="mt-2"
          title="Thêm thanh toán"
          icon={<BanknotesIcon className="h-4" />}
          onOpenAdd={handleOpenAdd}
        />
      </div>

      {/* QR */}
      {qrImage && (
        <div className="flex flex-col items-center border-t pt-2 pb-4">
          <div className="text-sm text-gray-500 mb-2">Quét mã QR để chuyển khoản</div>

          <img src={qrImage} alt="VietQR Payment" className="w-[126px] h-[126px]" />
        </div>
      )}

      <AddPaymentModal
        open={open}
        loading={loading}
        errors={errors}
        orderAmount={data.totalAmount - (data.loyaltyPointsDiscountAmount || 0)}
        onAdd={handleAdd}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};

export default InvoiceInfo;
