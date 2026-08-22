import { Address } from "@/shared/interfaces/common";
import { getFullAddress } from "@/shared/utils/common.util";
import { Input, InputProps } from "antd";

interface AddressInputProps extends Omit<InputProps, "value" | "onChange"> {
  value?: Address | null;
}
export const AddressInput: React.FC<AddressInputProps> = ({ value, ...props }) => {
  const text = getFullAddress(value);

  return <Input value={text} {...props} />;
};
