import React from "react";
import { DatePicker, DatePickerProps } from "antd";
import { useClientData } from "../../hooks/core/useClientData";

interface DatePickerCustomProps extends DatePickerProps {
  onlyDate?: boolean;
}

export const DatePickerCustom: React.FC<DatePickerCustomProps> = ({
  onlyDate = false,
  ...props
}) => {
  const { format } = useClientData();

  const {
    dateFormat = "DD/MM/YYYY",
    timeFormat = "HH:mm",
    timeDisplayMode = "none",
  } = format || {};

  const showTime = !onlyDate;

  const fullFormat = showTime ? `${dateFormat} ${timeFormat}` : dateFormat;

  return (
    <DatePicker
      format={fullFormat}
      showTime={showTime}
      needConfirm={false}
      className={`h-8 w-full ${props.className || ""}`}
      placeholder={props.placeholder || fullFormat}
      {...props}
    />
  );
};
