import { SelectProps } from "@/shared/interfaces/common";
import { PaymentTerm, PaymentTermQuery } from "../paymentTerm.model";
import { usePaymentTermStore } from "../paymentTerm.store";
import { DropdownColumn } from "@/shared";
import { SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

const columns: DropdownColumn<PaymentTerm>[] = [
  { label: "Tên ĐK", dataIndex: "name", className: "w-64" },
  { label: "Mã ĐK ", dataIndex: "code", className: "w-24" },
];

interface Props extends SelectProps<PaymentTerm, PaymentTermQuery> {}

export const PaymentTermSelect: React.FC<Props> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    PaymentTerm,
    PaymentTermQuery
  >({
    defaultData,
    queryHook: usePaymentTermStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      keyword,
      page,
      size: 10,
      isLocked,
      ...query,
    }),
  });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  return (
    <SmartSelect<PaymentTerm>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={"Chọn điều khoản"}
      labelField="name"
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
