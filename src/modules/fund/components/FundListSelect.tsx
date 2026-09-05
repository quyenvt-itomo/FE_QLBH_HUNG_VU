import React, { useEffect, useMemo } from "react";
import { Empty, Spin } from "antd";
import { SelectProps } from "@/shared/interfaces/common";
import { SortOrder } from "@/shared/constants/enum";
import { Fund, fundQuery, FundTypeEnum } from "../fund.model";
import { useFundStore } from "../fund.store";
import { FundCardLite } from "./FundCard";

interface Props extends SelectProps<Fund, fundQuery> {
  showBalance?: boolean;
}

export const FundListSelect: React.FC<Props> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  hideOptions,
}) => {
  const { data, loading } = useFundStore({
    ...(query || {}),
    page: 1,
    size: 10000,
    sortBy: "createdAt",
    sortOrder: SortOrder.ASC,
  });

  const funds = useMemo(() => {
    const dataWithDefault =
      defaultData && !data.some((fund) => fund.id === defaultData.id)
        ? [defaultData, ...data]
        : data;
    const hiddenIds = new Set((hideOptions || []).map((fund) => fund.id));

    return dataWithDefault
      .filter((fund) => !hiddenIds.has(fund.id))
      .sort((first, second) => {
        if (first.type === FundTypeEnum.CASH && second.type !== FundTypeEnum.CASH) return -1;
        if (first.type !== FundTypeEnum.CASH && second.type === FundTypeEnum.CASH) return 1;
        return 0;
      });
  }, [data, defaultData, hideOptions]);

  useEffect(() => {
    if (!value && funds.length > 0) {
      const fund = funds.find((item) => item.type === FundTypeEnum.CASH) || funds[0];
      onChange?.(fund.id);
      onChangeData?.(fund);
    }
  }, [funds, value, onChange, onChangeData]);

  const selectFund = (fund: Fund) => {
    onChange?.(fund.id);
    onChangeData?.(fund);
  };

  if (loading) {
    return (
      <div className="flex min-h-16 items-center justify-center">
        <Spin size="small" />
      </div>
    );
  }

  if (!funds.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có quỹ khả dụng" />;
  }

  return (
    <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
      {funds.map((fund) => (
        <FundCardLite key={fund.id} item={fund} selected={value === fund.id} onClick={selectFund} />
      ))}
    </div>
  );
};
