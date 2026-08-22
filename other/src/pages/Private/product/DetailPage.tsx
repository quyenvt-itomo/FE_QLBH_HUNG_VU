import { useEffect } from "react";
import { usePageState } from "../../../hooks/core/usePageState";
import { useNotFoundGuard } from "../../../hooks/core/useNotFoundGuard";
import { BasicInfo } from "./components/DetailPage/BasicInfo";
import { OptionInfo } from "./components/DetailPage/OptionInfo";
import { VariantInfo } from "./components/DetailPage/VariantInfo";
import { IProduct } from "../../../models/product";
import { useProductData } from "../../../hooks/product/useProductData";
import CustomTitle from "../../../layout/Private/header/components/Title";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import NotFoundData from "../../../components/display/NotFoundData";

export interface PartialProps {
  data?: IProduct;
  reload?: boolean;
  onReload?: () => void;
  onUpdate?: (data: Partial<IProduct>) => void | Promise<void>;
}

const DetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id, rowData, setRowData, reload, setReload, pageAction } = usePageState<IProduct>();

  const { product, loading, updateProduct } = useProductData({
    id,
    reload,
    isLockHook: true,
    onCloseModal: () => {
      setReload(!reload);
    },
  });

  useEffect(() => {
    if (product) {
      setRowData(product);
    }
  }, [product]);

  const handleUpdate = updateProduct
    ? async (data: Partial<IProduct>) => {
        if (!id) return;
        updateProduct({
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
    <div className="flex flex-col w-full h-full gap-3">
      <div className="flex justify-between items-center">
        <CustomTitle />
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
      <div className="flex gap-6 h-[calc(100%-44px)] w-full">
        <div className="w-[684px] h-full bg-white border rounded-lg px-6 pb-12 overflow-y-auto scrollbar-hide">
          <BasicInfo data={rowData} onUpdate={handleUpdate} onReload={pageAction.handleReload} />
          <OptionInfo data={rowData} onReload={pageAction.handleReload} />
        </div>
        <div className="w-[calc(100%-708px)] h-full bg-white border rounded-lg px-6">
          <VariantInfo data={rowData} reload={reload} onReload={pageAction.handleReload} />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
