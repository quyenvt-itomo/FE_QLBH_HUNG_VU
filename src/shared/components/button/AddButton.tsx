import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Tooltip } from "antd";
import { useEffect, useRef } from "react";
import { CLASSNAME } from "@/shared/constants/ui";

interface AddButtonProps {
  title?: string;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  type?: "primary" | "default" | "dashed" | "text" | "link";
  onOpenAdd?: () => void;
  disabled?: boolean;
  tooltip?: React.ReactNode;
}

const AddButton: React.FC<AddButtonProps> = ({
  title,
  height,
  className = "",
  style,
  icon,
  type = "primary",
  onOpenAdd,
  disabled = false,
  tooltip,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        btnRef.current?.click();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!onOpenAdd && !disabled) return null;

  const button = (
    <Button
      ref={btnRef}
      disabled={disabled}
      type={type}
      className={`flex items-center gap-2 ${CLASSNAME.inputHeight} px-4 font-medium ${className}`}
      style={{
        ...style,
        height,
      }}
      onClick={() => onOpenAdd?.()}
    >
      {icon || <PlusIcon className="h-4 w-4" />}
      {title || "Thêm mới"}
    </Button>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>
      <span className="inline-flex">{button}</span>
    </Tooltip>
  ) : (
    button
  );
};

export { AddButton };
