import React from "react";
import { DatePicker, DatePickerProps } from "antd";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { CLASSNAME } from "@/shared/constants/ui";

interface DatePickerCustomProps extends DatePickerProps {
  onlyDate?: boolean;
}

export const DatePickerCustom: React.FC<DatePickerCustomProps> = ({
  onlyDate = false,
  className = "",
  onChange,
  ...props
}) => {
  const { format } = useGlobalData();

  const { dateFormat = "DD/MM/YYYY", timeFormat = "HH:mm" } = format || {};

  const showTime = !onlyDate;

  const fullFormat = showTime ? `${dateFormat} ${timeFormat}` : dateFormat;

  const handleChange: DatePickerProps["onChange"] = (value, dateString) => {
    if (onlyDate && value) {
      const startOfDay = value.startOf("day"); // 👈 key chỗ này
      onChange?.(startOfDay, startOfDay.format(fullFormat));
      return;
    }

    onChange?.(value, dateString);
  };

  return (
    <DatePicker
      format={fullFormat}
      showTime={showTime}
      needConfirm={false}
      className={`${CLASSNAME.inputHeight} w-full ${className || ""}`}
      placeholder={props.placeholder || fullFormat}
      suffixIcon
      prefix={<CalendarDaysIcon className="w-4 h-4 mr-1 text-gray-400" />}
      onChange={handleChange}
      {...props}
    />
  );
};
