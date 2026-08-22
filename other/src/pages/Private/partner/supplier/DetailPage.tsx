import { IPartner } from "../../../../models/partner";
import { FormInstance } from "antd";
import { useEffect } from "react";
import { usePageState } from "../../../../hooks/core/usePageState";
import { CardInfo } from "./components/DetailPage/CardInfo";
import DetailTabs from "./components/DetailPage/DetailTabs";
import { useSupplierData } from "../../../../hooks/partner/useSupplierData";
import { useNotFoundGuard } from "../../../../hooks/core/useNotFoundGuard";
import NotFoundData from "../../../../components/display/NotFoundData";

export interface PartialProps {
  data?: IPartner;
  reload?: boolean;
  form?: FormInstance<IPartner>;
  onReload?: () => void;
  onUpdate?: (data: Partial<IPartner>) => void | Promise<void>;
}

const DetailPage: React.FC = () => {
  const { id, rowData, setRowData, reload, setReload } = usePageState<IPartner>();

  const { supplier, loading, updateSupplier } = useSupplierData({
    id,
    reload,
    isLockHook: true,
    onCloseModal: () => {
      setReload(!reload);
    },
  });

  useEffect(() => {
    if (supplier) {
      setRowData(supplier);
    }
  }, [supplier]);

  const handleUpdate = async (data: Partial<IPartner>) => {
    if (!id) return;
    updateSupplier?.({
      ...data,
      id,
    });
  };

  const showNotFound = useNotFoundGuard({
    id,
    loading,
    data: rowData,
  });

  if (showNotFound) return <NotFoundData />;

  return (
    <div className="flex gap-4 h-full w-full relative">
      <CardInfo supplier={rowData} onUpdate={handleUpdate} onReload={() => setReload(!reload)} />
      <div className="space-y-6 flex-1">
        <DetailTabs
          supplier={rowData}
          onEdit={updateSupplier}
          onReload={() => setReload(!reload)}
        />
      </div>
    </div>
  );
};

export default DetailPage;
