import { SelectProps } from "@/shared/interfaces/common";
import { QuotationRequest, QuotationRequestQuery } from "../quotationRequest.model";
import { useQuotationRequestStore } from "../quotationRequest.store";
import { DropdownColumn } from "@/shared";
import { SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { formatDateTime } from "@/shared/utils/date.util";
import { resolveByPath } from "@/shared/utils/common.util";

interface Props extends SelectProps<QuotationRequest, QuotationRequestQuery> {}

export const QuotationRequestSelect: React.FC<Props> = ({
  value,
  defaultData,
  placeholder,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    QuotationRequest,
    QuotationRequestQuery
  >({
    defaultData,
    queryHook: useQuotationRequestStore,
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

  const columns: DropdownColumn<QuotationRequest>[] = [
    { label: "Mã YCBG", dataIndex: "code", className: "w-32" },
    {
      label: "Khách hàng",
      className: "w-48",
      render: (record) => resolveByPath(record, ["customer", "name"], "--"),
    },
    {
      label: "Ngày",
      dataIndex: "timeAt",
      className: "w-28 text-center",
      render: (record) => (record.timeAt ? formatDateTime(record.timeAt) : "--"),
    },
  ];

  return (
    <SmartSelect<QuotationRequest>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={placeholder || "Chọn yêu cầu báo giá"}
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
