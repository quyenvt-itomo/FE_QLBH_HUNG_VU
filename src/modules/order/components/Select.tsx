import { SelectProps } from "@/shared/interfaces/common";
import { Order, OrderQuery } from "../order.model";
import { useOrderStore } from "../order.store";
import { DropdownColumn } from "@/shared";
import { SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

export const OrderSelect: React.FC<SelectProps<Order, OrderQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Order,
    OrderQuery
  >({
    defaultData,
    queryHook: useOrderStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
  });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<Order>[] = [
    { label: "Mã đơn hàng", dataIndex: "code", className: "w-24" },
    { label: "Ngày", dataIndex: "timeAt", className: "w-20", dataType: "date" },
    {
      label: "Khách hàng",
      dataIndex: ["customer", "name"],
      className: "w-36",
    },
  ];

  return (
    <SmartSelect<Order>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={"Chọn nhân viên"}
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        unlock();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};
