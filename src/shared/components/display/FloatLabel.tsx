import React, { useMemo, useState, ReactElement, cloneElement } from "react";
import "./FloatLabel.css";

interface FloatLabelProps {
  label: string;
  required?: boolean;
  children: ReactElement;
  value?: any;
  type?: "normal" | "primary";
  left?: number | string;
  onChange?: (value: any) => void;
}

const FloatLabel: React.FC<FloatLabelProps> = ({
  label,
  required,
  children,
  value,
  type = "normal",
  left = 11,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  const childProps = children.props || {};

  const isOccupied = useMemo(() => {
    return focused || (value !== undefined && value !== null && value.toString().length > 0);
  }, [focused, value]);

  const onFocus = () => {
    setFocused(true);
    childProps.onFocus?.();
  };

  const onBlur = () => {
    setFocused(false);
    childProps.onBlur?.();
  };

  const enhancedChild = cloneElement(children, {
    value,
    onChange,
    onFocus,
    onBlur,
  });

  return (
    <div className={`float-label ${isOccupied ? "active" : ""}`}>
      {enhancedChild}
      <label
        className={`label ${type} ${isOccupied ? "as-label" : "as-placeholder"}`}
        style={{ left }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

export default FloatLabel;
