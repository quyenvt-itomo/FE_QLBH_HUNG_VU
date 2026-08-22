import React, { useEffect, useState } from "react";
import { Modal, Button, Input, message } from "antd";

type FormulaModalProps = {
  open: boolean;
  formula?: string;
  onClose: () => void;
  onSave: (formula: string) => void;
};

const isOperator = (char: string): boolean =>
  ["+", "-", "*", "/", "^"].includes(char);

const isVariable = (val: string): boolean =>
  ["D", "R", "create", "K", "T"].includes(val); // T = TaiDan, K = KhoaGai

const isNumber = (val: string): boolean => /^[0-9]$/.test(val);

const keyMap: Record<string, string> = {
  D: "D",
  R: "R",
  C: "create",
  T: "T",
  K: "K",
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  "^": "^",
  "(": "(",
  ")": ")",
  Enter: "SAVE",
  Backspace: "CLEAR",
};

export const FormulaModal: React.FC<FormulaModalProps> = ({
  open,
  formula: initialFormula,
  onClose,
  onSave,
}) => {
  const [formula, setFormula] = useState<string>("");

  useEffect(() => {
    if (initialFormula) {
      setFormula(initialFormula);
    }
  }, [initialFormula]);

  const lastChar = formula.slice(-1);

  const appendValue = (val: string) => {
    // Không cho 2 toán tử liên tiếp
    if (isOperator(lastChar) && isOperator(val)) return;

    // Không bắt đầu bằng toán tử (trừ - nếu muốn hỗ trợ âm)
    if (formula === "" && isOperator(val) && val !== "-") return;

    // Không cho ")" sau toán tử hoặc đầu tiên
    if (
      val === ")" &&
      (formula === "" || isOperator(lastChar) || lastChar === "(")
    )
      return;

    // Không cho toán tử sau "("
    if (isOperator(val) && lastChar === "(") return;

    // Không cho "(" sau biến/số nếu không muốn nhân ẩn
    if (val === "(" && /[A-Za-z0-9)]$/.test(lastChar)) return;

    // Không cho biến/số sau ")"
    if ((isVariable(val) || isNumber(val)) && lastChar === ")") return;

    setFormula((prev) => prev + val);
  };

  const handleClear = () => {
    setFormula((prev) => prev.slice(0, -1));
  };

  const isValidFormula = (f: string): boolean => {
    if (f === "") return false;
    const last = f.slice(-1);
    if (isOperator(last)) return false;

    // Kiểm tra cân bằng ngoặc
    const stack: string[] = [];
    for (const ch of f) {
      if (ch === "(") stack.push(ch);
      else if (ch === ")") {
        if (stack.length === 0) return false;
        stack.pop();
      }
    }
    return stack.length === 0;
  };

  const handleSave = () => {
    if (!isValidFormula(formula)) {
      message.warning("Công thức không hợp lệ.");
      return;
    }
    onSave(formula);
    setFormula("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    const upper = key.toUpperCase();

    let mapped = keyMap[upper];

    // Đặc biệt xử lý Enter và Backspace vì e.key.toUpperCase() không phải "Enter"
    if (e.code === "Enter") mapped = "SAVE";
    if (e.code === "Backspace") mapped = "CLEAR";

    if (!mapped && !isVariable(upper) && !isNumber(key)) return;

    e.preventDefault();

    if (mapped === "SAVE") handleSave();
    else if (mapped === "CLEAR") handleClear();
    else if (mapped) appendValue(mapped);
    else appendValue(upper);
  };

  useEffect(() => {
    if (open) window.addEventListener("keydown", handleKeyDown);
    else window.removeEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, formula]);

  const buttonGrid = [
    ["1", "2", "3", "+", "D", "T"],
    ["4", "5", "6", "-", "R", "K"],
    ["7", "8", "9", "*", "create", "CLEAR"],
    ["(", "0", ")", "/", "^", "SAVE"],
  ];

  return (
    <Modal
      open={open}
      onCancel={() => {
        setFormula("");
        onClose();
      }}
      footer={null}
      title="Tạo công thức"
    >
      <Input.TextArea
        rows={2}
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        placeholder="Công thức..."
        autoFocus
        disabled
        style={{ fontSize: 20, resize: "none" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 8,
          marginTop: 16,
        }}
      >
        {buttonGrid.flat().map((val) => {
          if (val === "CLEAR") {
            return (
              <Button danger onClick={handleClear} key={val}>
                Xóa
              </Button>
            );
          }
          if (val === "SAVE") {
            return (
              <Button type="primary" onClick={handleSave} key={val}>
                Lưu
              </Button>
            );
          }
          return (
            <Button key={val} onClick={() => appendValue(val)}>
              {val}
            </Button>
          );
        })}
      </div>
    </Modal>
  );
};
