import React from "react";
import { SelectProps } from "@/shared/interfaces/common";
import { ShippingPlan, ShippingPlanQuery } from "../shippingPlan.model";
import { useShippingPlanStore } from "../shippingPlan.store";
import { DropdownColumn } from "@/shared";
import { SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { resolveByPath } from "@/shared/utils/common.util";
import { ApproveStatusTag } from "@/shared";

const columns: DropdownColumn<ShippingPlan>[] = [
  { label: "Mã PA", dataIndex: "code", className: "w-32" },
  {
    label: "ĐVVC",
    className: "w-48",
    render: (record) => resolveByPath(record, ["partner", "name"]),
  },
  {
    label: "Mã ĐVVC",
    className: "w-24",
    render: (record) => resolveByPath(record, ["partner", "code"]),
  },
  {
    label: "Cước VC",
    dataIndex: "unitPrice",
    className: "w-24",
    dataType: "number",
  },
  {
    label: "Trạng thái",
    dataIndex: "approveStatus",
    className: "w-24",
    dataType: "enum",
    render: (record) => <ApproveStatusTag value={record.approveStatus} />,
  },
];

export const ShippingPlanSelect: React.FC<SelectProps<ShippingPlan, ShippingPlanQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    ShippingPlan,
    ShippingPlanQuery
  >({
    defaultData,
    queryHook: useShippingPlanStore,
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

  return (
    <SmartSelect<ShippingPlan>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn PA vận chuyển"
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
