import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
    className="text-editor [&_.ck-editor__editable_inline]:overflow-y-auto [&_.ck-editor__editable_inline]:px-3 [&_.ck-editor__editable_inline]:py-2"
    style={{
      "--text-editor-min-height": `${minHeight}px`,
    } as React.CSSProperties}
  >
    <CKEditor
      editor={ClassicEditor}
      data={value || ""}
      config={{
        placeholder,
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "link",
          "blockQuote",
          "insertTable",
        ],
      }}
      onChange={(_, editor) => onChange?.(editor.getData())}
    />
    <style>{`
      .text-editor .ck-editor__editable_inline {
        min-height: var(--text-editor-min-height);
      }
    `}</style>
  </div>
);
