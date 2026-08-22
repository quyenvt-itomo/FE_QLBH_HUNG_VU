import { Button } from "antd";
import { useEffect, useRef } from "react";

interface SubmitFormButtonProps {
  title?: string;
  loading?: boolean;
}

const SubmitFormButton: React.FC<SubmitFormButtonProps> = ({ title, loading }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        btnRef.current?.click();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Button
      ref={btnRef}
      type="primary"
      htmlType="submit"
      loading={loading}
      className="md:w-40 h-8 md:h-8 text-[16px] rounded-lg "
    >
      {title || "Lưu"}
    </Button>
  );
};

export default SubmitFormButton;
