import React, { useEffect, useState } from "react";
import { Button, Checkbox } from "antd";
import { ReactSortable } from "react-sortablejs";
import type { ColumnsType } from "antd/es/table";
import { IconReset } from "../icon/Reset";
import { IconGroupColumn } from "../icon/GroupColumn";

export interface ColumnConfigItem {
  key: string; // Bắt buộc phải có key
  is_hide?: boolean; // Trường ẩn/hiện (tùy chọn)
  can_hide?: boolean;
  title: string;
}

export type ColumnsConfigType<T = any> = (ColumnConfigItem &
  ColumnsType<T>[number])[];

interface ColumnSelectorProps {
  columns: ColumnsConfigType;
  onConfigColumns: (sortedColumns: any) => void;
  onResetColumns: () => void;
}

export const getTextFromReactNode = (node: React.ReactNode): string => {
  if (!node) return "";

  if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  }

  if (Array.isArray(node)) {
    return node.map(getTextFromReactNode).join("");
  }

  if (React.isValidElement(node)) {
    // ✅ Bắt case component có props.title
    if (node.props?.title) {
      return String(node.props.title);
    }

    // fallback: đọc children
    if (node.props?.children) {
      return getTextFromReactNode(node.props.children);
    }
  }

  return "";
};

const HandleColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  onConfigColumns,
  onResetColumns,
}) => {
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [sortedColumns, setSortedColumns] =
    useState<ColumnsConfigType>(columns);

  // Handle changes in the column selection
  const handleCheckboxChange = (checked: boolean, value: string) => {
    setSortedColumns((prev) =>
      prev.map((col) =>
        col.key === value ? { ...col, is_hide: !checked } : col,
      ),
    );
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSortedColumns(
      sortedColumns.map((col) => ({
        ...col,
        is_hide: col.can_hide !== false && !checked,
      })),
    );
  };

  // Lưu danh sách cột đã kéo thả nhưng chưa cập nhật ngay
  const handleColumnSort = (newList: any) => {
    setSortedColumns(newList.map(({ id, ...rest }: any) => rest));
  };

  const hasChanged = (
    columns: ColumnsConfigType,
    sortedColumns: ColumnsConfigType,
  ) => {
    for (let i = 0; i < columns.length; i++) {
      if (
        columns[i].key !== sortedColumns[i].key ||
        columns[i].is_hide !== sortedColumns[i].is_hide
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    setIsChanged(hasChanged(columns, sortedColumns));
  }, [sortedColumns, columns]);

  useEffect(() => {
    if (!hasChanged(columns, sortedColumns)) return;

    setSortedColumns(columns);
  }, [columns]);

  const handleResetColumns = () => {
    onResetColumns();
  };

  // Khi nhấn nút Lưu, cập nhật danh sách cột chính thức
  const handleSaveColumns = () => {
    if (!isChanged) return;

    onConfigColumns(sortedColumns);
  };

  return (
    <div className="flex flex-col w-full pb-12" style={{ maxHeight: "100%" }}>
      {/* <Divider className="my-2" /> */}
      <div
        className="flex grow w-full items-center justify-between mb-2"
        style={{ padding: "4px 6px" }}
      >
        <Checkbox
          onChange={(e) => handleSelectAllChange(e.target.checked)}
          checked={!sortedColumns.some((col) => col.is_hide)}
          className="font-semibold"
        >
          Tất cả
        </Checkbox>
        <div className="flex gap-2">
          <Button
            onClick={handleResetColumns}
            className="p-0 border-0"
            title="Đặt lại về mặc định"
          >
            <IconReset color="primary" />
          </Button>
          <Button
            onClick={handleSaveColumns}
            type={isChanged ? "primary" : "default"}
            title="Lưu"
          >
            Lưu
          </Button>
        </div>
      </div>
      <div
        style={{
          height: "calc(100% - 40px)",
          overflowY: "auto",
        }}
      >
        <ReactSortable
          list={sortedColumns.map((col) => ({ ...col, id: col.key }))}
          setList={handleColumnSort}
          animation={200}
          ghostClass="gu-transit"
          group="icon"
        >
          {sortedColumns.map((item) => (
            <div
              className="flex grow w-96 items-center"
              key={item.key}
              style={{
                cursor: "grab",
                padding: "6px 6px",
                marginTop: "5px",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(e.target.checked, item.key)
                }
                checked={!item.is_hide}
                disabled={item.can_hide === false}
              ></Checkbox>
              <span className="font-medium grow pl-2 truncate">
                {getTextFromReactNode(item.title)}
              </span>
              <IconGroupColumn />
            </div>
          ))}
        </ReactSortable>
      </div>
    </div>
  );
};

export default HandleColumnSelector;
