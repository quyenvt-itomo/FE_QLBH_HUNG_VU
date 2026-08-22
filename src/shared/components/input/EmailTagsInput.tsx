import { Tag, message, Tooltip } from "antd";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";

interface EmailTagsInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_MIN_WIDTH = 200;

export const EmailTagsInput: React.FC<EmailTagsInputProps> = ({
  value = [],
  onChange,
}) => {
  const [input, setInput] = useState("");
  const [inputWidth, setInputWidth] = useState(INPUT_MIN_WIDTH);
  const inputRef = useRef<HTMLInputElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);

  const addEmail = () => {
    const email = input.trim();
    if (!email) return;

    if (!emailRegex.test(email)) {
      message.error("Email không hợp lệ");
      return;
    }

    if (value.includes(email)) {
      message.warning("Email đã tồn tại");
      return;
    }

    onChange?.([...value, email]);
    setInput("");
    setInputWidth(INPUT_MIN_WIDTH);
  };

  useEffect(() => {
    if (!containerRef.current || !mirrorRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const textWidth = mirrorRef.current.scrollWidth + 12;

    setInputWidth(
      Math.min(Math.max(textWidth, INPUT_MIN_WIDTH), containerWidth),
    );
  }, [input, value]);

  const clearInput = () => {
    setInput("");
    setInputWidth(INPUT_MIN_WIDTH);
  };

  const clearAll = () => {
    onChange?.([]);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        // tránh mất focus khi click nút / tag
        if (e.target === e.currentTarget) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }}
      className="
        relative
        border border-gray-300 rounded-lg
        px-2 py-1
        min-h-[96px]
        flex flex-wrap items-start
        gap-x-1 gap-y-0.5
        hover:border-primary
        focus-within:border-primary
        focus-within:shadow-sm
        transition-all cursor-text
      "
    >
      {value.map((email) => (
        <Tag
          key={email}
          closable
          className="leading-6 px-2 py-0.5"
          onClose={(e) => {
            e.preventDefault();
            onChange?.(value.filter((e) => e !== email));
          }}
        >
          {email}
        </Tag>
      ))}

      {/* INPUT WRAPPER */}
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addEmail();
            }
          }}
          style={{ width: inputWidth }}
          className="border-none outline-none bg-transparent h-7 pr-5"
          placeholder={value.length === 0 ? "Nhập email và nhấn Enter" : ""}
        />

        {/* CLEAR INPUT */}
        {input && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CLEAR ALL TAGS */}
      {value.length > 0 && (
        <Tooltip title="Xóa toàn bộ email">
          <button
            type="button"
            onClick={clearAll}
            className="
            absolute bottom-1.5 right-1.5
          text-gray-400 hover:text-red-500
            transition-colors
            "
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      )}

      {/* MIRROR */}
      <span ref={mirrorRef} className="absolute invisible whitespace-pre">
        {input || ""}
      </span>
    </div>
  );
};
