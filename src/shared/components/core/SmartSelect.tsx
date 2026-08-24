import { Select, Spin } from "antd";
import { buildDropdownOptions, DropdownColumn, DropdownHeader } from "./CustomSelectLayout";
import { SelectProps } from "@/shared/interfaces/common";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";

export interface SmartSelectProps<T> extends Omit<
  SelectProps<T>,
  "onChangeData" | "defaultData" | "options"
> {
  dataSource: T[];
  columns: DropdownColumn<T>[];
  keyField?: keyof T;
  labelField?: keyof T;
}

export function SmartSelect<T extends Record<string, any>>({
  dataSource,
  columns,
  keyField = "id",
  labelField = "name",
  value,
  loading,
  className,
  hideOptions,
  onSearch,
  onChange,
  onPopupScroll,
  onFocus,
  ...rest
}: SmartSelectProps<T>) {
  const hideOptionKeys = hideOptions?.map((item) => item[keyField]);

  const finalDataSource =
    hideOptionKeys && hideOptionKeys.length > 0
      ? dataSource.filter(
          (item) => hideOptionKeys.includes(item[keyField]) === false || item[keyField] === value,
        )
      : dataSource;

  return (
    <Select
      loading={loading}
      value={value as any}
      options={buildDropdownOptions(finalDataSource, columns, keyField, labelField)}
      onChange={(data: any) => onChange?.(data)}
      className={`w-full ${CLASSNAME.inputHeight}${className ? ` ${className}` : ""}`}
      showSearch
      allowClear
      onSearch={onSearch}
      suffixIcon={<ChevronDownIcon className="h-3.5" />}
      placeholder="Chọn mục"
      onFocus={onFocus}
      filterOption={false}
      onPopupScroll={onPopupScroll}
      {...(loading && {
        notFoundContent: (
          <div className="flex items-center gap-2 justify-center py-2">
            <Spin size="small" />
          </div>
        ),
      })}
      dropdownRender={(menu) => (
        <>
          {columns?.length > 1 ? <DropdownHeader columns={columns} /> : <></>}
          {menu}
        </>
      )}
      {...rest}
    />
  );
}
