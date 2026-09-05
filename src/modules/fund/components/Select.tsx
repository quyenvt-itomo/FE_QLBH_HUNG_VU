import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { DropdownColumn, SmartMultipleSelect, SmartSelect } from "@/shared/components";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { Fund, fundQuery, FundTypeEnum } from "../fund.model";
import { useFundStore } from "../fund.store";
import { SortOrder } from "@/shared/constants";
import { useEffect, useMemo } from "react";
import { Empty, Spin } from "antd";
import { FundCardLite } from "./FundCard";

const columns: DropdownColumn<Fund>[] = [
  { label: "Tên quỹ", dataIndex: "name", className: "w-52" },
  { label: "Mã quỹ", dataIndex: "code", className: "w-28" },
];

export const FundSelect: React.FC<SelectProps<Fund, fundQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Fund,
    fundQuery
  >({
    defaultData,
    queryHook: useFundStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
  });

  return (
    <SmartSelect<Fund>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={(id) => {
        onChange?.(id);
        onChangeData?.(list.find((item) => item.id === id));
      }}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn quỹ"
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(event) => {
        unlock();
        onFocus?.(event);
      }}
      {...rest}
    />
  );
};

export const FundMultipleSelect: React.FC<MultipleSelectProps<Fund, fundQuery>> = ({
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Fund,
    fundQuery
  >({
    defaultData,
    queryHook: useFundStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
    resetPageDeps: [query],
  });

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    onChangeData?.(list.filter((item) => ids.includes(item.id)));
  };

  return (
    <SmartMultipleSelect<Fund>
      dataSource={list}
      columns={columns}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn quỹ"
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(event) => {
        unlock();
        onFocus?.(event);
      }}
      {...rest}
    />
  );
};

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
    <div className="flex max-w-full gap-2 overflow-x-auto">
      {funds.map((fund) => (
        <FundCardLite key={fund.id} item={fund} selected={value === fund.id} onClick={selectFund} />
      ))}
    </div>
  );
};
