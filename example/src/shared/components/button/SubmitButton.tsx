import { FolderIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "antd";
import React from "react";
import clsx from "clsx";
import { CLASSNAME } from "@/shared/constants/ui";

interface SubmitButtonProps {
  size?: "small" | "middle" | "large";
  disabledCancel?: boolean;
  disabledSubmit?: boolean;
  loading?: boolean;
  cancelText?: string;
  submitText?: string;
  reverse?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
}

const sizeConfig = {
  small: {
    button: "h-7 px-2 text-xs md:min-w-16",
    icon: "w-3.5 h-3.5",
  },
  middle: {
    button: `${CLASSNAME.inputHeight} px-3 text-sm md:min-w-20`,
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
  reverse = false,
  onCancel,
  onSubmit,
}) => {
  const cfg = sizeConfig[size];

  return (
    <div className={clsx("flex gap-3 flex-shrink-0", reverse && "flex-row-reverse")}>
      <Button
        key="cancel"
        htmlType="button"
        disabled={disabledCancel}
        onClick={onCancel}
        className={clsx(cfg.button, "flex items-center gap-1")}
      >
        <XMarkIcon className={cfg.icon} />
        <span className="mb-0.5">{cancelText}</span>
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
        <FolderIcon className={cfg.icon} />
        <span className="mb-0.5">{submitText}</span>
      </Button>
    </div>
  );
};

export default SubmitButton;
