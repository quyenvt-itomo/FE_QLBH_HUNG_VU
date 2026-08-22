import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "antd";
import { useEffect, useRef } from "react";

interface AddButtonProps {
  title?: string;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  onOpenAdd?: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({
  title,
  height,
  className = "",
  style,
  icon,
  onOpenAdd,
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

  if (!onOpenAdd) return null;

  return (
    <Button
      ref={btnRef}
      type="primary"
      className={`flex items-center gap-2 h-8 px-4 rounded font-light ${className}`}
      style={{
        ...style,
        height,
      }}
      onClick={onOpenAdd}
    >
      {icon || <PlusIcon className="h-5 w-5" />}
      {title || "Thêm mới"}
    </Button>
  );
};

export default AddButton;
