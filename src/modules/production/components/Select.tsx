import { SelectProps } from "@/shared/interfaces/common";
import { Production, ProductionQuery } from "../production.model";
import { useProductionStore } from "../production.store";
import { DropdownColumn } from "@/shared/components/core/CustomSelectLayout";
import { SmartSelect } from "@/shared/components/core/SmartSelect";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

export const ProductionSelect: React.FC<SelectProps<Production, ProductionQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Production,
    ProductionQuery
  >({
    defaultData,
    queryHook: useProductionStore,
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

  const columns: DropdownColumn<Production>[] = [
    { label: "Mã LSX", dataIndex: "code", className: "w-24" },
    { label: "Ngày", dataIndex: "timeAt", className: "w-20", dataType: "date" },
  ];

  return (
    <SmartSelect<Production>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={"Chọn LSX"}
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
