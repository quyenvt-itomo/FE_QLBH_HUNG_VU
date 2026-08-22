import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { SearchInput } from "@/shared/components/input";
import { checkSelection } from "@/shared/utils/common.util";
import { useEmployeeStore } from "./employee.store";
import { usePageState } from "@/shared/hooks/usePageState";
import { Employee } from "./employee.model";
import { AddUpdateModal, DetailModal, EmployeeTable } from "./components";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import { useExcelReload } from "@/shared/hooks/useExcelReload";
import { useEmployeeHandlers } from "./employee.handlers";
import { App } from "antd";

export const EmployeePage: React.FC = () => {
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
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<Employee>();

  const { data, errors, loading, creating, updating, pagination, create, update, remove, getById } =
    useEmployeeStore(
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

  // Tự động reload khi import hoàn tất
  useExcelReload(ExcelEntityType.EMPLOYEE, pageAction.handleReload);

  const { handleOpenAdd, handleOpenEdit, handleOpenDetail, handleDelete } = useEmployeeHandlers({
    create,
    update,
    remove,
    getById,
    setOpen,
    setOpenDetail,
    setRowData,
  });

  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
        <div className="flex items-center gap-3">
          <ExcelButton
            entityType={ExcelEntityType.EMPLOYEE}
            onSuccess={pageAction.handleReload}
            exportOptions={{ filters: filter, filename: "Danh_sach_nhan_su_" }}
          />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <EmployeeTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (record.isSummary || checkSelection()) return;
                handleOpenDetail(record);
              },
            };
          }}
        />
      </Panel>

      <AddUpdateModal
        open={open}
        errors={errors}
        loading={creating || updating}
        editData={rowData}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />

      <DetailModal
        open={openDetail}
        data={rowData}
        loading={loading}
        onOpenUpdate={handleOpenEdit}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
