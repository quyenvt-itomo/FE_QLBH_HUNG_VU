import { Button, Modal, Checkbox, Typography } from "antd";
import { useMemo, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import dayjs from "dayjs";
import { allColumnsExportOption, ColumnOption, ExcelEntityType } from "../excel.enum";
import { useExcelStore } from "../excel.store";
import { ModalImportExcel } from "./ModalImportExcel";
import { ExportColumnConfig, ExportOptions } from "../excel.model";
import { mapEntityTypeToModule } from "../excel.util";
import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

type SortableColumn = ExportColumnConfig & {
  id: string;
  hidden?: boolean;
};

interface ColumnGroup {
  sheetName: string;
  columns: SortableColumn[];
}

// ============================================================
// ColumnList (flat, sortable)
// ============================================================

const ColumnList: React.FC<{
  columns: SortableColumn[];
  setColumns: (newCols: SortableColumn[]) => void;
}> = ({ columns, setColumns }) => {
  return (
    <ReactSortable
      list={columns}
      setList={setColumns}
      animation={200}
      ghostClass="gu-transit"
      handle=".drag-handle"
    >
      {columns.map((col) => (
        <div
          key={col.id}
          className="flex grow items-center drag-handle"
          style={{
            cursor: "grab",
            padding: "6px",
            marginTop: "5px",
            borderRadius: "4px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Checkbox
            checked={!col.hidden}
            onChange={() =>
              setColumns(columns.map((c) => (c.id === col.id ? { ...c, hidden: !c.hidden } : c)))
            }
          />
          <span className="font-medium grow pl-2 truncate">{col.header}</span>
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path
              d="M7.99992 4.66667C7.26354 4.66667 6.66658 4.06971 6.66658 3.33333C6.66658 2.59695 7.26354 2 7.99992 2C8.7363 2 9.33325 2.59695 9.33325 3.33333C9.33325 4.06971 8.7363 4.66667 7.99992 4.66667Z"
              fill="#555555"
            />
            <path
              d="M7.99992 9.33333C7.26354 9.33333 6.66658 8.73638 6.66658 8C6.66658 7.26362 7.26354 6.66667 7.99992 6.66667C8.7363 6.66667 9.33325 7.26362 9.33325 8C9.33325 8.73638 8.7363 9.33333 7.99992 9.33333Z"
              fill="#555555"
            />
            <path
              d="M7.99992 14C7.26354 14 6.66658 13.403 6.66658 12.6667C6.66658 11.9303 7.26354 11.3333 7.99992 11.3333C8.7363 11.3333 9.33325 11.9303 9.33325 12.6667C9.33325 13.403 8.7363 14 7.99992 14Z"
              fill="#555555"
            />
            <path
              d="M13.9999 4.66667C13.2635 4.66667 12.6666 4.06971 12.6666 3.33333C12.6666 2.59695 13.2635 2 13.9999 2C14.7363 2 15.3333 2.59695 15.3333 3.33333C15.3333 4.06971 14.7363 4.66667 13.9999 4.66667Z"
              fill="#555555"
            />
            <path
              d="M13.9999 9.33333C13.2635 9.33333 12.6666 8.73638 12.6666 8C12.6666 7.26362 13.2635 6.66667 13.9999 6.66667C14.7363 6.66667 15.3333 7.26362 15.3333 8C15.3333 8.73638 14.7363 9.33333 13.9999 9.33333Z"
              fill="#555555"
            />
            <path
              d="M13.9999 14C13.2635 14 12.6666 13.403 12.6666 12.6667C12.6666 11.9303 13.2635 11.3333 13.9999 11.3333C14.7363 11.3333 15.3333 11.9303 15.3333 12.6667C15.3333 13.403 14.7363 14 13.9999 14Z"
              fill="#555555"
            />
          </svg>
        </div>
      ))}
    </ReactSortable>
  );
};

// ============================================================
// ColumnConfigGrouped (multi-sheet)
// ============================================================

const ColumnConfigGrouped: React.FC<{
  groups: ColumnGroup[];
  updateGroupColumns: (sheetName: string, newCols: SortableColumn[]) => void;
}> = ({ groups, updateGroupColumns }) => {
  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.sheetName}>
          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-md font-semibold text-sm"
            style={{ backgroundColor: "#eef2ff", color: "#4338ca" }}
          >
            <span>📋</span>
            <span>{group.sheetName}</span>
            <span className="ml-auto text-xs text-gray-400 font-normal">
              {group.columns.filter((c) => !c.hidden).length}/{group.columns.length} cột
            </span>
          </div>
          <div className="mt-1">
            <ColumnList
              columns={group.columns}
              setColumns={(newCols) => updateGroupColumns(group.sheetName, newCols)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// ExportExcelModal
// ============================================================

const ExportExcelModal: React.FC<{
  open: boolean;
  onClose: () => void;
  columns: SortableColumn[];
  setColumns: React.Dispatch<React.SetStateAction<SortableColumn[]>>;
  onExport: () => void;
  loading?: boolean;
  onResetColumns?: () => void;
}> = ({ open, onClose, columns, setColumns, onExport, loading, onResetColumns }) => {
  const hasSheets = useMemo(() => columns.some((col) => col.sheet), [columns]);

  const groups = useMemo<ColumnGroup[]>(() => {
    if (!hasSheets) return [];
    const map = new Map<string, SortableColumn[]>();
    columns.forEach((col) => {
      const sheet = col.sheet || "__main__";
      if (!map.has(sheet)) map.set(sheet, []);
      map.get(sheet)!.push(col);
    });
    return Array.from(map.entries()).map(([sheetName, cols]) => ({
      sheetName: sheetName === "__main__" ? "Chính" : sheetName,
      columns: cols,
    }));
  }, [columns, hasSheets]);

  const updateGroupColumns = (sheetName: string, newCols: SortableColumn[]) => {
    setColumns((prev) => {
      const lookupName = sheetName === "Chính" ? "__main__" : sheetName;
      const otherCols = prev.filter((c) => (c.sheet || "__main__") !== lookupName);
      return [...otherCols, ...newCols];
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Cấu hình cột xuất Excel"
      centered
      destroyOnClose
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="export" type="primary" loading={loading} onClick={onExport}>
          Xuất Excel
        </Button>,
      ]}
    >
      <div className="mt-4 pt-4 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Thứ tự cột hiển thị</span>
          <Button onClick={onResetColumns} size="small" title="Đặt lại về mặc định">
            ↺ Mặc định
          </Button>
        </div>

        {hasSheets ? (
          <ColumnConfigGrouped groups={groups} updateGroupColumns={updateGroupColumns} />
        ) : (
          <ColumnList columns={columns} setColumns={setColumns} />
        )}
      </div>
    </Modal>
  );
};

// ============================================================
// ExcelButton
// ============================================================

export const ExcelButton: React.FC<{
  entityType: ExcelEntityType;
  onSuccess?: () => void;
  exportOptions?: Omit<
    ExportOptions,
    | "entityType"
    | "columns"
    | "extraUnitColumns"
    | "businessStoreColumns"
    | "sheetColumns"
  >;
}> = ({ entityType, onSuccess, exportOptions }) => {
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [columns, setColumns] = useState<SortableColumn[]>(
    (allColumnsExportOption[entityType] || []).map((col: ColumnOption) => ({
      ...col,
      id: (col.sheet || "main") + ":" + col.field,
      hidden: false,
    })),
  );

  const { exporting, exportExcel } = useExcelStore();

  // Kiểm tra quyền import/export Excel giống BE (excelPermissionMiddleware)
  const { info } = useGlobalData();
  const moduleName = mapEntityTypeToModule(entityType);
  const canImport = !!moduleName && info?.importExcel?.includes(moduleName);
  const canExport = !!moduleName && info?.exportExcel?.includes(moduleName);

  const handleReloadColumns = () => {
    setColumns(
      (allColumnsExportOption[entityType] || []).map((col: ColumnOption) => ({
        ...col,
        id: (col.sheet || "main") + ":" + col.field,
        hidden: false,
      })),
    );
  };

  const handleExport = () => {
    const now = dayjs().format("YYYY-MM-DD_HH-mm");
    const visible = columns.filter((c) => !c.hidden);

    // Tách các cột theo sheet để BE tạo đúng từng sheet phụ.
    const mainColumns: ExportColumnConfig[] = [];
    const extraUnitColumns: ExportColumnConfig[] = [];
    const businessStoreColumns: ExportColumnConfig[] = [];
    const sheetColumns: Record<string, ExportColumnConfig[]> = {};

    visible.forEach(({ hidden, id, sheet, ...rest }) => {
      if (sheet === "Đơn vị tính phụ") {
        extraUnitColumns.push(rest);
      } else if (sheet === "Cửa hàng kinh doanh") {
        businessStoreColumns.push(rest);
      } else if (sheet) {
        (sheetColumns[sheet] ||= []).push(rest);
      } else {
        mainColumns.push(rest);
      }
    });

    exportExcel({
      entityType,
      ...exportOptions,
      columns: mainColumns,
      extraUnitColumns: extraUnitColumns.length > 0 ? extraUnitColumns : undefined,
      businessStoreColumns:
        businessStoreColumns.length > 0 ? businessStoreColumns : undefined,
      sheetColumns: Object.keys(sheetColumns).length ? sheetColumns : undefined,
      filename: (exportOptions?.filename || entityType + "_") + now + ".xlsx",
    });
    setOpenExport(false);
  };

  return (
    <div className="flex gap-3">
      {canExport && (
        <Button htmlType="button" onClick={() => setOpenExport(true)}>
          <ArrowRightStartOnRectangleIcon className="w-4 h-4 mr-1" />
          Xuất Excel
        </Button>
      )}
      {canImport && (
        <Button htmlType="button" onClick={() => setOpenImport(true)}>
          <ArrowRightEndOnRectangleIcon className="w-4 h-4 mr-1" />
          Nhập Excel
        </Button>
      )}

      <ExportExcelModal
        open={openExport}
        onClose={() => setOpenExport(false)}
        columns={columns}
        setColumns={setColumns}
        onExport={handleExport}
        loading={exporting}
        onResetColumns={handleReloadColumns}
      />

      <ModalImportExcel
        open={openImport}
        entityType={entityType}
        setClose={() => setOpenImport(false)}
        onSuccess={onSuccess}
      />
    </div>
  );
};
