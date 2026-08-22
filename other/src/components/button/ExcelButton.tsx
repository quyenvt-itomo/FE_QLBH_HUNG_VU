import { Icon } from "@iconify/react";
import { Button, Modal } from "antd";
import ModalImportExcel from "../modal/ModalImportExcel";
import { useExcelData } from "../../hooks/core/useExcelData";
import { useMemo, useState } from "react";
import { ExcelEntityType } from "../../constants/enum";
import { allColumnsExportOption, ExportColumnConfig, ExportOptions } from "../../models/base/excel";
import { ReactSortable } from "react-sortablejs";
import { Checkbox } from "antd";
import Title from "../display/Title";
import { IconReset } from "../icon/Reset";
import { IconGroupColumn } from "../icon/GroupColumn";
import dayjs from "dayjs";

type SortableColumn = ExportColumnConfig & {
  id: string;
};

// const ColumnConfig: React.FC<{
//   columns: SortableColumn[];
//   setColumns: React.Dispatch<React.SetStateAction<SortableColumn[]>>;
// }> = ({ columns, setColumns }) => {
//   return (
//     <ReactSortable
//       list={columns}
//       setList={setColumns} // ✅ TRUYỀN THẲNG
//       animation={200}
//       ghostClass="gu-transit"
//       handle=".drag-handle"
//     >
//       {columns.map((col) => (
//         <div
//           key={col.id} // ✅ key = id
//           className="flex grow items-center drag-handle"
//           style={{
//             cursor: "grab",
//             padding: "6px",
//             marginTop: "5px",
//             borderRadius: "4px",
//             backgroundColor: "#f5f5f5",
//           }}
//         >
//           <Checkbox
//             checked={!col.hidden}
//             onChange={(e) =>
//               setColumns((prev) =>
//                 prev.map((c) => (c.id === col.id ? { ...c, hidden: !e.target.checked } : c)),
//               )
//             }
//           />
//           <span className="font-medium grow pl-2 truncate">{col.header}</span>
//           <IconGroupColumn />
//         </div>
//       ))}
//     </ReactSortable>
//   );
// };

/** Nhóm cột theo sheet */
interface ColumnGroup {
  sheetName: string;
  columns: SortableColumn[];
}

const SHEET_ICONS: Record<string, string> = {
  "Bán hàng": "📊",
  "Lợi nhuận": "💰",
};

/**
 * Render danh sách cột sortable (dùng chung cho cả flat & grouped)
 */
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
            onChange={(e) =>
              setColumns(
                columns.map((c) => (c.id === col.id ? { ...c, hidden: !e.target.checked } : c)),
              )
            }
          />
          <span className="font-medium grow pl-2 truncate">{col.header}</span>
          <IconGroupColumn />
        </div>
      ))}
    </ReactSortable>
  );
};

/**
 * Render khi columns có sheet → hiển thị nhóm theo sheet
 */
const ColumnConfigGrouped: React.FC<{
  groups: ColumnGroup[];
  updateGroupColumns: (sheetName: string, newCols: SortableColumn[]) => void;
}> = ({ groups, updateGroupColumns }) => {
  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.sheetName}>
          {/* Section header */}
          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-md font-semibold text-sm"
            style={{
              backgroundColor: "#eef2ff",
              color: "#4338ca",
            }}
          >
            <span>{SHEET_ICONS[group.sheetName] || "📋"}</span>
            <span>{group.sheetName}</span>
            <span className="ml-auto text-xs text-gray-400 font-normal">
              {group.columns.filter((c) => !c.hidden).length}/{group.columns.length} cột
            </span>
          </div>
          {/* Columns trong group */}
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

  // Nhóm columns theo sheet
  const groups = useMemo<ColumnGroup[]>(() => {
    if (!hasSheets) return [];
    const map = new Map<string, SortableColumn[]>();
    columns.forEach((col) => {
      const sheet = col.sheet || "";
      if (!map.has(sheet)) map.set(sheet, []);
      map.get(sheet)!.push(col);
    });
    return Array.from(map.entries()).map(([sheetName, cols]) => ({
      sheetName,
      columns: cols,
    }));
  }, [columns, hasSheets]);

  // Cập nhật columns của 1 group → merge vào flat list
  const updateGroupColumns = (sheetName: string, newCols: SortableColumn[]) => {
    setColumns((prev) => {
      const otherCols = prev.filter((c) => (c.sheet || "") !== sheetName);
      return [...otherCols, ...newCols];
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Cấu hình cột xuất Excel"
      centered
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="export" type="primary" loading={loading} onClick={onExport}>
          Xuất Excel
        </Button>,
      ]}
    >
      <div className="mt-4 pt-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-2">
          <Title content="Thứ tự cột hiển thị" />
          <Button onClick={onResetColumns} className="p-0 border-0" title="Đặt lại về mặc định">
            <IconReset color="primary" />
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

export const ExcelButton: React.FC<{
  showImport?: boolean;
  showExport?: boolean;
  entityType: ExcelEntityType;
  onSuccess?: () => void;
  exportOptions?: Omit<ExportOptions, "entityType" | "columns">;
}> = ({ showImport, showExport = true, entityType, onSuccess, exportOptions }) => {
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [columns, setColumns] = useState<SortableColumn[]>(
    allColumnsExportOption[entityType].map((col) => ({
      ...col,
      id: col.field,
      hidden: false,
    })),
  );

  const { loading, exportCurrentExcel } = useExcelData();

  const handleReloadColumns = () => {
    setColumns(
      allColumnsExportOption[entityType].map((col) => ({
        ...col,
        id: col.field,
        hidden: false,
      })),
    );
  };

  const handleExport = () => {
    const now = dayjs().format("YYYY-MM-DD_HH-mm");
    exportCurrentExcel({
      entityType,
      ...exportOptions,
      columns: columns.filter((c) => !c.hidden).map(({ hidden, ...rest }) => rest),
      filename: exportOptions?.filename + now + ".xlsx",
    });
    setOpenExport(false);
  };

  return (
    <div className="flex gap-4">
      {exportOptions && showExport && (
        <>
          <Button
            htmlType="button"
            className="h-8 rounded font-light"
            loading={loading}
            onClick={() => setOpenExport(true)}
          >
            <Icon icon="clarity:export-line" width="22" height="22" /> Xuất Excel
          </Button>
          <ExportExcelModal
            open={openExport}
            onClose={() => setOpenExport(false)}
            columns={columns}
            setColumns={setColumns}
            onExport={handleExport}
            loading={loading}
            onResetColumns={handleReloadColumns}
          />
        </>
      )}

      {showImport && (
        <>
          <Button
            htmlType="button"
            className="h-8 rounded font-light"
            onClick={() => setOpenImport(true)}
          >
            <Icon icon="clarity:import-line" width="22" height="22" /> Nhập Excel
          </Button>
          <ModalImportExcel
            open={openImport}
            setClose={() => setOpenImport(false)}
            entityType={entityType}
            onSuccess={onSuccess}
          />
        </>
      )}
    </div>
  );
};
