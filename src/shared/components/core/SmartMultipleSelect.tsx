import { Select, Spin } from "antd";
import { buildDropdownOptions, DropdownColumn, DropdownHeader } from "./CustomSelectLayout";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { MultipleSelectProps } from "@/shared/interfaces/common";
import { CLASSNAME } from "@/shared/constants/ui";

export interface SmartMultipleSelect<T> extends Omit<
  MultipleSelectProps<T>,
  "onChangeData" | "defaultData" | "options"
> {
  dataSource: T[];
  columns: DropdownColumn<T>[];
  keyField?: keyof T;
  labelField?: keyof T;
}

export function SmartMultipleSelect<T extends Record<string, any>>({
  dataSource,
  columns,
  keyField = "id",
  labelField = "name",
  value,
  loading,
  className,
  hideOptions,
  onChange,
  ...rest
}: SmartMultipleSelect<T>) {
  const hideOptionKeys = hideOptions?.map((item) => item[keyField]);

  const finalDataSource =
    hideOptionKeys && hideOptionKeys.length > 0
      ? dataSource.filter(
          (item) => hideOptionKeys.includes(item[keyField]) === false || item[keyField] === value,
        )
      : dataSource;

  return (
    <Select
      mode="multiple"
      maxTagCount="responsive"
      className={`w-full ${CLASSNAME.inputHeight}${className ? ` ${className}` : ""}`}
      showSearch
      options={buildDropdownOptions(finalDataSource, columns, keyField, labelField)}
      allowClear
      suffixIcon={<ChevronDownIcon className="h-3.5" />}
      loading={loading}
      placeholder="Chọn mục"
      value={value as any}
      onChange={(data: string[]) => onChange?.(data || [])}
      filterOption={false}
      {...(loading && {
        notFoundContent: (
          <div className="flex items-center gap-2 justify-center py-2">
            <Spin size="small" />
          </div>
        ),
      })}
      dropdownRender={(menu) => (
        <>
          {columns.length > 1 && <DropdownHeader columns={columns} />}
          {menu}
        </>
      )}
      {...rest}
    />
  );
}
