import { formatDateDDMMYYYY } from "@/shared/utils/date.util";
import { formatQuantity } from "@/shared/utils/number.util";
import { Select } from "antd";

const { Option } = Select;

type DataType = "string" | "number" | "date" | "boolean" | "enum";
type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date;

type Prev = [never, 0, 1, 2, 3];

export type DeepPath<T, Depth extends number = 4> = [Depth] extends [never]
  ? never
  : T extends Primitive
    ? never
    : {
        [K in keyof T]:
          | [K]
          | (DeepPath<NonNullable<T[K]>, Prev[Depth]> extends infer P
              ? P extends readonly PropertyKey[]
                ? [K, ...P]
                : never
              : never);
      }[keyof T];

export interface DropdownColumn<T> {
  label: string;
  dataIndex?: keyof T | DeepPath<T>;
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

function getValue(obj: any, path: readonly PropertyKey[]) {
  return path.reduce((current, key) => current?.[key], obj);
}

function getColumnValueFromItem<T>(
  item: T,
  dataIndex: keyof T | DeepPath<T>,
  dataType?: DataType,
): string {
  const value =
    typeof dataIndex === "string" ? item[dataIndex] : getValue(item, dataIndex as PropertyKey[]);

  return getColumnValue(value, dataType);
}

export const DropdownHeader = <T,>({ columns }: DropdownHeaderProps<T>) => (
  <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-3 py-1 border-b border-gray-200">
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
        {columns.map((col, index) => {
          const content = col.render
            ? col.render(item)
            : col.dataIndex
              ? getColumnValueFromItem(item, col.dataIndex, col.dataType)
              : "";
          return (
            <div
              key={index}
              className={`${col.className} truncate ${dataTypeClassMap[col.dataType || "string"]}`}
              title={
                typeof content === "string" || typeof content === "number"
                  ? String(content)
                  : undefined
              }
            >
              {content}
            </div>
          );
        })}
      </div>
    </Option>
  ));
}
