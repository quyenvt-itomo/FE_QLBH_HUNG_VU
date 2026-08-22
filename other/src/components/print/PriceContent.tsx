import { DiscountTypeEnum } from "../../constants/enum";
import { IOrderLine } from "../../models/store/orderLine";
import { formatMoney } from "../../utils/formatNumber";

export const PriceContent: React.FC<{
  item: IOrderLine;
}> = ({ item }) => {
  if (item.discountValue) {
    const discountedPrice =
      item.discountType === DiscountTypeEnum.PERCENT
        ? item.unitPrice * (1 - item.discountValue / 100)
        : item.unitPrice - item.discountValue;
    item.unitPrice - item.discountValue;
    return (
      <div className="flex gap-1 text-xs">
        <span>{formatMoney(discountedPrice)}</span>
        <span className="line-through text-gray-400">{formatMoney(item.unitPrice)}</span>
      </div>
    );
  }

  return <span className="text-xs">{formatMoney(item.unitPrice)}</span>;
};
