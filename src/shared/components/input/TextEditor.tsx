import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  minHeight = 180,
}) => (
  <div
    className="text-editor [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:px-3 [&_.ql-editor]:py-2"
    style={
      {
        "--text-editor-min-height": `${minHeight}px`,
      } as React.CSSProperties
    }
  >
    <ReactQuill
      theme="snow"
      value={value || ""}
      onChange={(content) => onChange?.(content)}
      placeholder={placeholder}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "blockquote"],
          ["clean"],
        ],
      }}
      formats={["header", "bold", "italic", "underline", "strike", "list", "link", "blockquote"]}
    />
    <style>{`
      .text-editor .ql-editor {
        min-height: var(--text-editor-min-height);
      }
      .text-editor .ql-container {
        font-family: inherit;
        font-size: 14px;
      }
      .ql-toolbar.ql-snow {
        border-radius: 6px 6px 0 0;
      }
      .ql-container.ql-snow {
        border-radius: 0 0 6px 6px;
      }
    `}</style>
  </div>
);
