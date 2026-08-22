import { FolderIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "antd";
import React from "react";
import clsx from "clsx";

interface SubmitButtonProps {
  size?: "small" | "middle" | "large";
  disabledCancel?: boolean;
  disabledSubmit?: boolean;
  loading?: boolean;
  cancelText?: string;
  submitText?: string;
  submitIcon?: React.ReactNode;
  onCancel?: () => void;
  onSubmit?: () => void;
}

const sizeConfig = {
  small: {
    button: "h-7 px-2 text-xs md:min-w-16",
    icon: "w-3.5 h-3.5",
  },
  middle: {
    button: "h-8 px-3 text-sm md:min-w-20",
    icon: "w-4 h-4",
  },
  large: {
    button: "h-10 px-4 text-base md:min-w-24",
    icon: "w-5 h-5",
  },
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  size = "middle",
  disabledCancel,
  disabledSubmit,
  loading,
  cancelText = "Hủy",
  submitText = "Lưu",
  submitIcon,
  onCancel,
  onSubmit,
}) => {
  const cfg = sizeConfig[size];

  return (
    <div className="flex gap-3 flex-shrink-0">
      <Button
        key="cancel"
        htmlType="button"
        disabled={disabledCancel}
        onClick={onCancel}
        className={clsx(cfg.button, "flex items-center gap-1")}
      >
        <XMarkIcon className={cfg.icon} />
        {cancelText}
      </Button>

      <Button
        key="save"
        type="primary"
        htmlType="submit"
        disabled={disabledSubmit}
        onClick={onSubmit}
        loading={loading}
        className={clsx(cfg.button, "flex items-center gap-1")}
      >
        {submitIcon || <FolderIcon className={cfg.icon} />}
        {submitText}
      </Button>
    </div>
  );
};

export default SubmitButton;
