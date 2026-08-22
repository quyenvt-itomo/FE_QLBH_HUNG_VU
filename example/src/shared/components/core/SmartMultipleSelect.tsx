import { Select, Spin } from "antd";
import { DropdownColumn, DropdownHeader, renderDropdownBody } from "./CustomSelectLayout";
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
  onChange,
  ...rest
}: SmartMultipleSelect<T>) {
  return (
    <Select
      mode="multiple"
      maxTagCount="responsive"
      className={`w-full ${CLASSNAME.inputHeight}${className ? ` ${className}` : ""}`}
      showSearch
      labelInValue
      allowClear
      suffixIcon={<ChevronDownIcon className="h-3.5" />}
      loading={loading}
      placeholder="Chọn mục"
      value={value as any}
      onChange={(data: any) => {
        if (!data || data.length === 0) onChange?.([]);
        const ids = data.map((item: { value: number }) => item.value);
        onChange?.(ids);
      }}
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
    >
      {renderDropdownBody({
        dataSource: dataSource,
        columns: columns,
      })}
    </Select>
  );
}
