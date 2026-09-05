import React, { useEffect, useMemo, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
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
    <div
      ref={scrollRef}
      className="flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
      onWheel={(event) => {
        const element = scrollRef.current;
        if (!element || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        if (element.scrollWidth <= element.clientWidth) return;
        event.preventDefault();
        element.scrollLeft += event.deltaY;
      }}
    >
      {funds.map((fund) => (
        <FundCardLite
          key={fund.id}
          item={fund}
          selected={value === fund.id}
          onClick={selectFund}
        />
      ))}
    </div>
  );
};
