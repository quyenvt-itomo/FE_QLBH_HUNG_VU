import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IProductVariant } from "../../models/product";
import { updateItem, reset } from "../../stores/product/productVariant/slice";
import { useEffect } from "react";
import { UseDataParams } from "../../models/base/interface";
import { useClientData } from "../core/useClientData";
import { checkPermission } from "../../utils/permissionUtils";

interface UseProductVariantDataParams extends UseDataParams {
  productId?: string;
}

export const useProductVariantData = ({ productId, onCloseModal }: UseProductVariantDataParams) => {
  const dispatch = useDispatch();
  const {
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.ProductVariant as BaseState<IProductVariant>,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const canUpdate = checkPermission(permissions, "product", "update");

  const updateProductVariant = canUpdate
    ? (updatedProduct: Partial<IProductVariant>) => {
        if (!productId) return;
        dispatch(updateItem({ ...updatedProduct, productId }));
      }
    : undefined;

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    updateProductVariant,
  };
};
