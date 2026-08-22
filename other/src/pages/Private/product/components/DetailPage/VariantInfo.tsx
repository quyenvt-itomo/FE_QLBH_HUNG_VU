import React from "react";
import { Checkbox, Input } from "antd";
import Title from "../../../../../components/display/Title";
import { PartialProps } from "../../DetailPage";
import { InputMoney } from "../../../../../components/input";
import { IProductVariant } from "../../../../../models/product";
import { getVariantOptionContent } from "../../../../../utils/common";
import { useProductVariantData } from "../../../../../hooks/product/useProductVariantData";
import EditableInfoItem from "../../../../../components/display/EditableInfoItem";
import { formatMoney } from "../../../../../utils/formatNumber";
import AvatarUpload from "../../../../../components/upload/AvatarUpload";
import { getMainImage } from "../../../../../utils/fileUtil";
import { FileCategoryEnum, FileEntityEnum } from "../../../../../constants/enum";
import SquareImage from "../../../../../components/image/SquareImage";

export const VariantInfo: React.FC<PartialProps> = ({ data, onReload }) => {
  const variants = data?.variants || [];

  const { updateProductVariant } = useProductVariantData({
    productId: data?.id,
    onCloseModal: () => {
      onReload?.();
    },
  });

  const handleUpdateVariant = updateProductVariant
    ? (updateData: Partial<IProductVariant>) => {
        if (!data) return;
        updateProductVariant(updateData);
      }
    : undefined;

  if (!data) return <></>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <div className="bg-white w-full pt-3">
          <Title content="Thông tin hàng hóa" />
        </div>
        <div className="flex h-4 bg-gradient-to-t from-transparent to-white" />
      </div>
      <div className="w-full h-[calc(100%-100px)] overflow-x-auto border rounded">
        <div className="overflow-y-scroll w-fit min-w-full">
          <table className="w-full min-w-[900px]">
            <colgroup>
              <col />
              <col style={{ width: 36 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 200 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 80 }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-100 h-6 font-medium border-l">
                <th className="px-3 text-left font-medium">Quy cách</th>
                <th className="text-center font-medium border-l">Ảnh</th>
                <th className="px-3 font-medium border-l">SKU</th>
                <th className="px-3 font-medium border-l">Mã vạch</th>
                <th className="px-3 font-medium border-l">Giá nhập</th>
                <th className="px-3 font-medium border-l">Giá bán</th>
                <th className="font-medium border-l">Đang bán</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex flex-col h-[calc(100%-24px)] overflow-y-scroll w-fit min-w-full">
          <table className="w-full min-w-[900px]">
            <colgroup>
              <col />
              <col style={{ width: 36 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 200 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 80 }} />
            </colgroup>
            <tbody>
              {variants.map((variant, index) => (
                <tr key={variant.id} className="hover:bg-gray-50 transition-all ease-in-out">
                  <td className="border-b border-dashed">
                    <div className="px-3">
                      <span className="px-3 py-px bg-slate-100 rounded">
                        {getVariantOptionContent(variants?.[index])}
                      </span>
                    </div>
                  </td>
                  <td className="border-l border-b border-dashed">
                    {handleUpdateVariant ? (
                      <AvatarUpload
                        category={FileCategoryEnum.IMAGE}
                        entity={FileEntityEnum.PRODUCT_VARIANT}
                        oId={variant.id}
                        size={36}
                        defaultFile={getMainImage(variant.image)}
                        isActive
                      />
                    ) : variant.image ? (
                      <SquareImage image={getMainImage(variant.image)} size={36} />
                    ) : null}
                  </td>
                  <td className="border-l border-b border-dashed">
                    <div className="flex-1 flex flex-col p-px">
                      <EditableInfoItem<IProductVariant>
                        value={variant.sku}
                        fieldKey="sku"
                        required={variant.isActive}
                        editComponent={<Input className="h-8" />}
                        onUpdate={
                          handleUpdateVariant
                            ? (data) => handleUpdateVariant({ ...data, id: variant.id })
                            : undefined
                        }
                      />
                    </div>
                  </td>
                  <td className="border-l border-b border-dashed">
                    <div className="flex-1 flex flex-col p-px">
                      <EditableInfoItem<IProductVariant>
                        value={variant.barcode}
                        fieldKey="barcode"
                        editComponent={<Input className="h-8" />}
                        onUpdate={
                          handleUpdateVariant
                            ? (data) => handleUpdateVariant({ ...data, id: variant.id })
                            : undefined
                        }
                      />
                    </div>
                  </td>
                  <td className="border-l border-b border-dashed">
                    <div className="flex-1 flex flex-col p-px">
                      <EditableInfoItem<IProductVariant>
                        value={formatMoney(variant.costPrice)}
                        fieldKey="costPrice"
                        editComponent={<InputMoney />}
                        align="right"
                        onUpdate={
                          handleUpdateVariant
                            ? (data) => handleUpdateVariant({ ...data, id: variant.id })
                            : undefined
                        }
                      />
                    </div>
                  </td>
                  <td className="border-l border-b border-dashed">
                    <div className="flex-1 flex flex-col p-px">
                      <EditableInfoItem<IProductVariant>
                        value={formatMoney(variant.price)}
                        fieldKey="price"
                        editComponent={<InputMoney />}
                        align="right"
                        onUpdate={
                          handleUpdateVariant
                            ? (data) => handleUpdateVariant({ ...data, id: variant.id })
                            : undefined
                        }
                      />
                    </div>
                  </td>
                  <td className="border-l border-b border-dashed">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={variant.isActive}
                        onChange={(e) => {
                          handleUpdateVariant?.({ id: variant.id, isActive: e.target.checked });
                        }}
                        disabled={!variant.sku}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex w-full h-4 bg-gradient-to-t from-white to-transparent" />
        <div className="flex bg-white">
          <p className="italic text-gray-400">
            SKU là bắt buộc đối với sản phẩm đưa vào kinh doanh
          </p>
        </div>
      </div>
    </div>
  );
};
