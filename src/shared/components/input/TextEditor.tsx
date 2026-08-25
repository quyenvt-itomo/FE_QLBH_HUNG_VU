import React, { useEffect, useRef } from "react";

interface TextEditorProps {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const editorCommands = [
  { command: "bold", label: "B", title: "Đậm" },
  { command: "italic", label: "I", title: "Nghiêng" },
  { command: "underline", label: "U", title: "Gạch chân" },
  { command: "insertUnorderedList", label: "•", title: "Danh sách" },
];

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  minHeight = 180,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    const nextValue = value || "";
    if (editor && editor.innerHTML !== nextValue) editor.innerHTML = nextValue;
  }, [value]);

  const execute = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    onChange?.(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
      <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1">
        {editorCommands.map((item) => (
          <button
            key={item.command}
            type="button"
            title={item.title}
            className="h-7 min-w-7 rounded px-2 text-sm text-gray-600 hover:bg-gray-200"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => execute(item.command)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        className="prose max-w-none overflow-y-auto px-3 py-2 text-sm outline-none empty:before:pointer-events-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]"
        style={{ minHeight }}
        onInput={(event) => onChange?.(event.currentTarget.innerHTML)}
      />
    </div>
  );
};
