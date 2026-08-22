import { SelectProps as AntdSelectProps } from "antd";
import { DefaultOptionType } from "antd/es/select";

export interface SelectProps<T> extends Omit<
  AntdSelectProps<string, DefaultOptionType>,
  "value" | "onChange" | "options"
> {
  value?: string;
  onChange?: (value: string) => void;
  defaultData?: T | null;
  hideOptions?: T[];
  onChangeData?: (value: T | undefined) => void;
  options?: T[];
  ref?: React.Ref<any>;
  offsetAt?: string;
}

export interface MultipleSelectProps<T> extends Omit<
  AntdSelectProps<string[], DefaultOptionType>,
  "value" | "onChange" | "options" | "status" | "mode"
> {
  value?: string[];
  onChange?: (value: string[]) => void;
  defaultData?: T[];
  hideOptions?: T[];
  onChangeData?: (value: T[]) => void;
  options?: T[];
  ref?: React.Ref<any>;
  offsetAt?: string;
}
