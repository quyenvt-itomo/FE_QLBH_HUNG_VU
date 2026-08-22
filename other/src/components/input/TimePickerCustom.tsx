import React from "react";
import { DatePicker, DatePickerProps } from "antd";
import { useClientData } from "../../hooks/core/useClientData";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export const TimePickerCustom: React.FC<DatePickerProps> = (props) => {
  const { format } = useClientData();

  const { dateFormat = "DD/MM/YYYY", timeFormat = "HH:mm" } = format || {};

  const fullFormat = `${dateFormat} ${timeFormat}`;

  return (
    <DatePicker
      showTime
      format={fullFormat}
      suffixIcon={null}
      needConfirm={false}
      className={props.className}
      placeholder={props.placeholder || fullFormat}
      prefix={<CalendarDaysIcon className="w-4 h-4 mr-1 mb-0.5 text-gray-400" />}
      {...props}
    />
  );
};
