import { Button } from "antd";
import React, { useEffect, useRef } from "react";

interface ActionModalButtonProps {
  disabledCancel?: boolean;
  cancleText?: string;
  editText?: string;
  onCancel?: () => void;
  onEdit?: () => void;
}

const ActionModalButton: React.FC<ActionModalButtonProps> = ({
  disabledCancel,
  cancleText = "Đóng",
  editText = "Chỉnh sửa",
  onCancel,
  onEdit,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelBtnRef.current?.click();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex gap-3">
      <Button
        ref={cancelBtnRef}
        disabled={disabledCancel}
        htmlType="button"
        className="md:w-24 "
        onClick={onCancel}
      >
        {cancleText}
      </Button>
      {onEdit && (
        <Button type="primary" htmlType="button" className="md:w-24 " onClick={onEdit}>
          {editText}
        </Button>
      )}
    </div>
  );
};

export default ActionModalButton;
