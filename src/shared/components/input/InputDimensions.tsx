import React, { useState, useEffect } from "react";
import { Input } from "antd";

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

interface InputDimensionsProps {
  value?: Dimensions;
  onChange?: (value: Dimensions) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const InputDimensions: React.FC<InputDimensionsProps> = ({
  value,
  onChange,
  placeholder = "D x R x C",
  disabled = false,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value && (value.length || value.width || value.height)) {
      setDisplayValue(
        `${value.length || 0} x ${value.width || 0} x ${value.height || 0}`,
      );
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setDisplayValue(text);

    // Parse format: "10 x 20 x 30" or "10x20x30"
    const parts = text.split(/\s*x\s*/i).map((p) => p.trim());

    if (parts.length === 3) {
      const [length, width, height] = parts.map((p) => {
        const num = parseFloat(p);
        return isNaN(num) ? 0 : num;
      });

      onChange?.({ length, width, height });
    } else if (text === "") {
      onChange?.({ length: 0, width: 0, height: 0 });
    }
  };

  const handleBlur = () => {
    // Format lại khi blur
    if (value && (value.length || value.width || value.height)) {
      setDisplayValue(
        `${value.length || 0} x ${value.width || 0} x ${value.height || 0}`,
      );
    }
  };

  return (
    <Input
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
};
