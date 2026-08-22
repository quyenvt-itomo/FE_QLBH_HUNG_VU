import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Input } from "antd";
import { CLASSNAME } from "@/shared/constants/ui";

export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  maxWidth?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onSearch: (value: string) => void;
  onFocus?: () => void;
}

const style: React.CSSProperties = {
  borderRadius: "8px !important",
};

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  maxWidth = 624,
  className = "",
  height,
  style,
  onSearch,
  onFocus,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (value === undefined || value === searchTerm) return;
    setSearchTerm(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div
      className={`relative w-full min-w-48 flex items-center ${CLASSNAME.inputHeight} ${className}`}
      style={{
        ...style,
        minWidth: 220,
        maxWidth,
        height,
      }}
    >
      <MagnifyingGlassIcon className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#747E76]" />
      <Input
        type="text"
        placeholder={placeholder || "Tìm kiếm"}
        className={`search-input pl-8 md:pl-10 pr-3 py-2 w-full ${CLASSNAME.inputHeight} flex items-center min-w-60`}
        style={{
          ...style,
          height,
        }}
        value={searchTerm}
        onChange={handleChange}
        onFocus={onFocus}
        allowClear
      />
    </div>
  );
};
