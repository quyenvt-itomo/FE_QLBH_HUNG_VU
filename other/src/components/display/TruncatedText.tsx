import React from "react";
import { Tooltip } from "antd";

interface TruncatedTextProps {
  content?: string;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  content,
  className = "",
}) => {
  if (!content) return null;

  // Tạo bản viết tắt: lấy chữ cái đầu của mỗi từ và viết hoa
  const getAbbreviation = (text: string): string => {
    return text
      .split(/\s+/) // Tách theo khoảng trắng
      .filter((word) => word.length > 0) // Loại bỏ khoảng trắng thừa
      .map((word) => word[0].toUpperCase()) // Lấy chữ cái đầu và viết hoa
      .join("");
  };

  const abbreviation = getAbbreviation(content);

  return (
    <Tooltip title={content} placement="top">
      <span className={`cursor-help font-medium ${className}`}>
        {abbreviation}
      </span>
    </Tooltip>
  );
};

export default TruncatedText;
