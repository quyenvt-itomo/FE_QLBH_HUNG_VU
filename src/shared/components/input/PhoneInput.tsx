import { Input, InputProps } from "antd";

export const PhoneInput: React.FC<InputProps> = ({ onChange, ...rest }) => {
  return (
    <Input
      maxLength={15}
      onChange={(e) => {
        const onlyNumbers = e.target.value.replace(/\D/g, "");
        onChange?.({
          ...e,
          target: {
            ...e.target,
            value: onlyNumbers,
          },
        });
      }}
      {...rest}
    />
  );
};
