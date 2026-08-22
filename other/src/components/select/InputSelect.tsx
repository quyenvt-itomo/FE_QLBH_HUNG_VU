import React from "react";
import { Select, SelectProps } from "antd";

interface InputSelectProps extends SelectProps<string> {}

const InputSelect: React.FC<InputSelectProps> = ({ onChange, ...rest }) => {
  const handleSearch = (value: string) => {
    if (!value) return;
    onChange?.(value);
  };

  return (
    <Select
      showSearch
      allowClear
      onSearch={handleSearch}
      onChange={onChange}
      className="w-full h-8"
      suffixIcon={<></>}
      {...rest}
    />
  );
};

export default InputSelect;
