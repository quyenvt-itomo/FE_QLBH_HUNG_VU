import { App, Button } from "antd";
import { useMemo } from "react";
import { usePageState } from "../../../../hooks/core/usePageState";
import { IFund } from "../../../../models/fund";
import { useFundData } from "../../../../hooks/fund/useFundData";
import { FundCardBase } from "../../../../components/card/Fund";
import ModalDelete from "../../../../components/modal/ModalDelete";
import AddUpdateModal from "../components/fund/AddUpdateModal";
import { PlusIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { SortOrderEnum } from "../../../../constants/enum";
import { useClientData } from "../../../../hooks/core/useClientData";
import AddButton from "../../../../components/button/AddButton";

export const FundList: React.FC = () => {
  const { reload, open, setOpen, openDelete, setOpenDelete, rowData, setRowData, pageAction } =
    usePageState<IFund>();
  const { modal } = App.useApp();

  const { funds, errors, addFund, updateFund, deleteFund } = useFundData({
    page: 1,
    size: 9999,
    sortBy: "createdAt",
    sortOrder: SortOrderEnum.ASC,
    reload,
    onCloseModal: () => {
      pageAction.handleClose();
      handleGetInfo();
    },
  });
  const { currentStore, handleGetInfo } = useClientData();

  const isSingleStore = !!currentStore;

  // Group funds theo store (dùng khi ở chế độ toàn hệ thống)
  const fundsByStore = useMemo(() => {
    return funds.reduce(
      (acc, fund) => {
        const storeId = fund.store?.id || "unknown";

        if (!acc[storeId]) {
          acc[storeId] = {
            store: fund.store,
            items: [],
          };
        }

        acc[storeId].items.push(fund);

        return acc;
      },
      {} as Record<string, { store: any; items: IFund[] }>,
    );
  }, [funds]);

  const handleOpenAddModal = addFund
    ? () => {
        setRowData(undefined);
        setOpen(true);
      }
    : undefined;

  const handleCloseModal = () => {
    setOpen(false);
    setRowData(undefined);
  };

  const handleOpenEditModal = updateFund
    ? (record: IFund) => {
        setRowData(record);
        setOpen(true);
      }
    : undefined;

  const handleSetDefault = updateFund
    ? (record: IFund) => {
        modal.confirm({
          title: "Đặt quỹ này làm quỹ mặc định?",
          onOk: () => {
            updateFund({
              id: record.id,
              isDefault: true,
            });
          },
        });
      }
    : undefined;

  const handleOpenDeleteModal = deleteFund
    ? (record: IFund) => {
        setOpenDelete(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = () => {
    if (!rowData || !rowData.id || !deleteFund) return;
    deleteFund(rowData.id);
    setOpenDelete(false);
    setRowData(undefined);
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-[#0D2E6E] mb-2 flex items-center gap-2">
            <BanknotesIcon className="h-6 text-[#0D2E6E]" />
            Danh sách quỹ
          </h2>
          <p className="text-sm text-[#64748B]">
            {isSingleStore
              ? "Quản lý quỹ cho cửa hàng của bạn. Quỹ mặc định sẽ được chọn tự động khi tạo mới hồ sơ."
              : "Quản lý quỹ cho tất cả cửa hàng. Quỹ mặc định sẽ được chọn tự động khi tạo mới hồ sơ."}
          </p>
        </div>

        {/* ✅ Nút thêm tổng */}
        {handleOpenAddModal && (
          <AddButton title="Thêm quỹ" onOpenAdd={() => handleOpenAddModal()} />
        )}
      </div>

      {isSingleStore ? (
        /* CASE 1: HIỂN THỊ TẠI 1 CỬA HÀNG */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {funds.map((item) => (
            <FundCardBase
              key={item.id}
              item={item}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onSetDefault={item.isDefault ? undefined : handleSetDefault}
            />
          ))}
          {handleOpenAddModal && (
            <Button
              type="dashed"
              onClick={handleOpenAddModal}
              className="w-full h-24 flex items-center justify-center rounded-lg border-dashed 
                border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-400"
            >
              <PlusIcon className="h-4" />
              <span>Thêm</span>
            </Button>
          )}
        </div>
      ) : (
        /* CASE 2: HIỂN THỊ TOÀN HỆ THỐNG (ADMIN) */
        <div className="space-y-8">
          {Object.values(fundsByStore).map((group) => (
            <div key={group.store?.id || "unknown"}>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-1 bg-primary rounded-full"></div>
                <span className="text-sm font-semibold text-gray-800">
                  {group.store?.name || "Cửa hàng không xác định"} ({group.items.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.items.map((item) => (
                  <FundCardBase
                    key={item.id}
                    item={item}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                    onSetDefault={item.isDefault ? undefined : handleSetDefault}
                  />
                ))}
              </div>
            </div>
          ))}

          {funds.length === 0 && (
            <div className="text-center py-10 text-gray-400 italic">
              Chưa có quỹ nào được tạo trên toàn hệ thống.
            </div>
          )}
        </div>
      )}

      <AddUpdateModal
        open={open}
        editData={rowData}
        errors={errors}
        onClose={handleCloseModal}
        onAdd={addFund}
        onEdit={updateFund}
      />

      <ModalDelete open={openDelete} setOpen={setOpenDelete} accept={handleDelete} />
    </div>
  );
};
