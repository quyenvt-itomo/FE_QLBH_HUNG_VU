import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import { IOrderLine } from "../../models/store/orderLine";
import { ProductVariantTitle } from "../display/ProductVariantTitle";
import { DiscountTypeEnum } from "../../constants/enum";
import { formatMoney, formatPercentage } from "../../utils/formatNumber";

export const OrderLineSelect: React.FC<MultipleSelectProps<IOrderLine>> = ({
  value,
  defaultData,
  options = [],
  hideOptions = [],
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const finalOptions = options.filter(
    (item) => !hideOptions.some((hideItem) => hideItem.refOrderLineId === item.id),
  );

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = finalOptions.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  const columns: DropdownColumn<IOrderLine>[] = [
    {
      label: "Sản phẩm",
      dataIndex: "productVariantSnapshot",
      className: "w-64",
      render: (data) => <ProductVariantTitle item={data.productVariantSnapshot} />,
    },
    {
      label: "Số lượng mua",
      dataIndex: "quantity",
      className: "w-24 text-right",
      dataType: "number",
    },
    { label: "Đơn giá", dataIndex: "unitPrice", className: "w-32 text-right", dataType: "number" },
    {
      label: "Giảm giá",
      dataIndex: "discountValue",
      className: "w-32 text-right",
      dataType: "enum",
      render: (data) =>
        !data.discountValue
          ? ""
          : data.discountType === DiscountTypeEnum.AMOUNT
            ? formatMoney(data.discountValue)
            : formatPercentage(data.discountValue),
    },
    {
      label: "%VAT",
      dataIndex: "taxRate",
      className: "w-16",
      dataType: "number",
    },
  ];

  return (
    <SmartMultipleSelect<IOrderLine>
      dataSource={finalOptions}
      columns={columns}
      value={value}
      onChange={handleChange}
      placeholder="Chọn sản phẩm"
      onFocus={(e) => {
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};
