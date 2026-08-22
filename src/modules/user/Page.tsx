import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { SearchInput } from "@/shared/components/input";
import { useUserStore } from "./user.store";
import { usePageState } from "@/shared/hooks/usePageState";
import { User } from "./user.model";
import { AddUpdateModal, UserTable } from "./components";
import { ExcelEntityType } from "@/modules/excel/excel.enum";
import { useExcelReload } from "@/shared/hooks/useExcelReload";
import { useUserHandlers } from "./user.handlers";

export const UserPage: React.FC = () => {
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
  } = usePageState<User>();

  const { data, errors, loading, creating, updating, pagination, create, update, remove, getById } =
    useUserStore(
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

  useExcelReload(ExcelEntityType.USER, pageAction.handleReload);

  const { handleOpenAdd, handleOpenEdit, handleDelete } = useUserHandlers({
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
          {/* <ExcelButton
            entityType={ExcelEntityType.USER}
            onSuccess={pageAction.handleReload}
            exportOptions={{ filters: filter, filename: "Danh_sach_nguoi_dung_" }}
          /> */}
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <UserTable
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
