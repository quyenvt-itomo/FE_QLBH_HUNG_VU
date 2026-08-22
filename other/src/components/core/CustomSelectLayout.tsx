import { Select } from "antd";
import { formatDateDDMMYYYY } from "../../utils/dateUtils";
import { formatQuantity } from "../../utils/formatNumber";

const { Option } = Select;

type DataType = "string" | "number" | "date" | "boolean" | "enum";

export interface DropdownColumn<T, K extends keyof T = keyof T> {
  label: string;
  dataIndex: keyof T;
  childKey?: string;
  className: string;
  dataType?: DataType;
  render?: (record: T) => React.ReactNode;
}

export interface DropdownHeaderProps<T> {
  columns: DropdownColumn<T>[];
}

const dataTypeClassMap: Record<DataType, string> = {
  string: "text-left",
  number: "text-right",
  date: "text-center",
  boolean: "text-center",
  enum: "text-center",
};

function getColumnValue<T>(value: any, dataType?: DataType): string {
  switch (dataType) {
    case "number":
      return formatQuantity(value);
    case "date":
      return formatDateDDMMYYYY(value);
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return value ? String(value) : "";
  }
}

function getColumnValueFromItem<T, K extends keyof T = keyof T>(
  item: T,
  dataIndex: keyof T,
  childKey?: string,
  dataType?: DataType,
): string {
  const parentValue = item[dataIndex];

  const value = childKey ? (parentValue as any)?.[childKey as string] : parentValue;

  return getColumnValue(value, dataType);
}

export const DropdownHeader = <T,>({ columns }: DropdownHeaderProps<T>) => (
  <div className="sticky top-0 z-10 bg-white px-3 py-1 border-b border-gray-200">
    <div className="flex  text-gray-300 text-sm">
      {columns.map((col, idx) => (
        <div
          key={idx}
          className={`${col.className} truncate ${dataTypeClassMap[col.dataType || "string"]}`}
          title={col.label}
        >
          {col.label}
        </div>
      ))}
    </div>
  </div>
);

export interface DropdownBodyProps<T> {
  dataSource: T[];
  keyField?: keyof T; // default: 'id'
  labelField?: keyof T; // default: 'name'
  columns: DropdownColumn<T>[];
}

export function renderDropdownBody<T extends Record<string, any>>({
  dataSource,
  keyField = "id",
  labelField = "name",
  columns,
}: DropdownBodyProps<T>) {
  return dataSource.map((item) => (
    <Option key={item[keyField]} value={item[keyField]} label={item[labelField]}>
      <div className="flex items-center text-sm">
        {columns.map((col, index) => (
          <div
            key={index}
            className={`${col.className} truncate ${dataTypeClassMap[col.dataType || "string"]}`}
            title={
              col.render
                ? ""
                : getColumnValueFromItem(item, col.dataIndex, col.childKey, col.dataType)
            }
          >
            {col.render
              ? col.render(item)
              : getColumnValueFromItem(item, col.dataIndex, col.childKey, col.dataType)}
          </div>
        ))}
      </div>
    </Option>
  ));
}
