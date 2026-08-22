import { IPartner } from "../../../../models/partner";
import { useEffect } from "react";
import { usePageState } from "../../../../hooks/core/usePageState";
import { CardInfo } from "./components/DetailPage/CardInfo";
import DetailTabs from "./components/DetailPage/DetailTabs";
import { useCustomerData } from "../../../../hooks/partner/useCustomerData";
import { useNotFoundGuard } from "../../../../hooks/core/useNotFoundGuard";
import NotFoundData from "../../../../components/display/NotFoundData";

export interface PartialProps {
  data?: IPartner;
  reload?: boolean;
  onReload?: () => void;
  onUpdate?: (data: Partial<IPartner>) => void | Promise<void>;
}

const DetailPage: React.FC = () => {
  const { id, rowData, setRowData, reload, setReload } = usePageState<IPartner>();
  const { customer, loading, updateCustomer } = useCustomerData({
    id,
    reload,
    isLockHook: true,
    onCloseModal: () => {
      setReload(!reload);
    },
  });

  useEffect(() => {
    if (customer) {
      setRowData(customer);
    }
  }, [customer]);

  const handleUpdate = updateCustomer
    ? async (data: Partial<IPartner>) => {
        if (!id) return;
        updateCustomer({
          ...data,
          id,
        });
      }
    : undefined;

  const showNotFound = useNotFoundGuard({
    id,
    loading,
    data: rowData,
  });

  if (showNotFound) return <NotFoundData />;

  return (
    <div className="flex gap-4 h-full w-full relative">
      <CardInfo
        customer={rowData}
        onUpdate={handleUpdate}
        onReload={() => {
          setReload(!reload);
        }}
      />
      <div className="space-y-6 w-[calc(100%-396px)]">
        <DetailTabs
          customer={rowData}
          onEdit={updateCustomer}
          onReload={() => {
            setReload(!reload);
          }}
        />
      </div>
    </div>
  );
};

export default DetailPage;
