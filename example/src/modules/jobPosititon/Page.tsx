import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { SearchInput } from "@/shared/components/input";
import { useJobPositionStore } from "./jobPosition.store";
import { usePageState } from "@/shared/hooks/usePageState";
import { JobPosition } from "./jobPosition.model";
import { AddUpdateModal, JobPositionTable } from "./components";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import { useExcelReload } from "@/shared/hooks/useExcelReload";
import { useJobPositionHandlers } from "./jobPosition.handlers";
import { App } from "antd";

export const JobPositionPage: React.FC = () => {
  const { modal } = App.useApp();
  const {
    keyword,
    page,
    size,
    filter,
    reload,
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<JobPosition>();

  const { data, errors, loading, creating, updating, pagination, create, update, remove, getById } =
    useJobPositionStore(
      {
        keyword,
        page,
        size,
        reload,
        ...filter,
      },
      () => {
        pageAction.handleClose();
      },
    );

  useExcelReload(ExcelEntityType.JOB_POSITION, pageAction.handleReload);

  const { handleOpenAdd, handleOpenEdit, handleDelete } = useJobPositionHandlers({
    create,
    update,
    remove,
    getById,
    setOpen,
    setRowData,
  });

  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
        <div className="flex items-center gap-3">
          <ExcelButton
            entityType={ExcelEntityType.JOB_POSITION}
            onSuccess={pageAction.handleReload}
            exportOptions={{ filename: "Danh_sach_vi_tri_cong_viec_" }}
          />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <JobPositionTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </Panel>

      <AddUpdateModal
        open={open}
        errors={errors}
        loading={creating || updating}
        editData={rowData}
        onAdd={create}
        onEdit={update}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
