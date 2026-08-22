import React from "react";

interface ExcelFillHandleProps {
  visible: boolean;
  /** Đã click chọn cell này làm nguồn fill chưa */
  selected?: boolean;
  /** Đang trong vùng drag highlight */
  highlight?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  /** Ctrl+Shift+Click → fill toàn bộ cột */
  onHardClick?: (e: React.MouseEvent) => void;
}

/**
 * Handle vuông nhỏ ở góc phải dưới của cell.
 * - Hover cell → hiện chấm xanh mờ (outline)
 * - Click chấm → chấm đặc (selected), sẵn sàng kéo fill
 * - Kéo xuống/lên → fill giá trị cho các dòng
 * - Ctrl+Shift+Click → fill toàn bộ cột — giống Excel.
 */
export const ExcelFillHandle: React.FC<ExcelFillHandleProps> = ({
  visible,
  selected = false,
  highlight = false,
  onMouseDown,
  onHardClick,
}) => {
  if (!visible) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onHardClick && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      onHardClick(e);
      return;
    }
    onMouseDown(e);
  };

  return (
    <div
      className="absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2 cursor-crosshair select-none"
      onMouseDown={handleMouseDown}
    >
      {/* Viền ngoài khi đang drag highlight */}
      {highlight && (
        <div className="absolute inset-0 rounded-sm border-2 border-blue-500 bg-blue-100/30 -m-0.5" />
      )}
      {/* Handle vuông: outline khi hover, solid khi selected */}
      <div
        className={`h-3 w-3 rounded-sm border transition-all ${
          selected
            ? "border-blue-600 bg-blue-600 scale-125"
            : "border-blue-400 bg-blue-400/60 hover:bg-blue-500 hover:scale-125"
        }`}
      />
    </div>
  );
};
