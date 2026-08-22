import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { ChangeIndexData, CreateManyOptionDto, IProductOption } from "../../models/product";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  deleteItems,
  reset,
  resetItem,
  resetNewData,
  changeIndex,
  addManyItem,
} from "../../stores/product/productOption/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface UseProductOptionDataParams extends UseDataParams {
  productId?: string;
}

export const useProductOptionData = ({
  keyword,
  page,
  size,
  startAt,
  endAt,
  isLockHook,
  status,
  sortBy,
  sortOrder,
  filter,
  ranger,
  search,
  reload,
  productId,
  onCloseModal,
}: UseProductOptionDataParams) => {
  const dispatch = useDispatch();
  const {
    data: productOptions,
    dataById: product,
    newData: newOption,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.ProductOption as BaseState<IProductOption>,
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const canUpdate = checkPermission(permissions, "product", "update");

  const addProductOption = canUpdate
    ? (newProductOptions: Partial<IProductOption>) => {
        if (!productId) return;
        dispatch(
          addItem({
            ...newProductOptions,
            productId,
          }),
        );
      }
    : undefined;

  const addManyProductOption = canUpdate
    ? (data: CreateManyOptionDto) => {
        if (!productId) return;

        dispatch(
          addManyItem({
            ...data,
            productId,
          }),
        );
      }
    : undefined;

  const getProductOption = canUpdate
    ? (id: string) => {
        if (!productId) return;
        dispatch(
          getItem({
            id,
            productId,
          }),
        );
      }
    : undefined;

  const updateProductOption = canUpdate
    ? (updatedProduct: Partial<IProductOption>) => {
        if (!productId) return;
        dispatch(
          updateItem({
            ...updatedProduct,
            productId,
          }),
        );
      }
    : undefined;

  const changeIndexProductOption = canUpdate
    ? (data: ChangeIndexData[]) => {
        if (!productId) return;
        dispatch(
          changeIndex({
            productId,
            data,
          }),
        );
      }
    : undefined;

  const deleteProductOption = canUpdate
    ? (id: string) => {
        if (!productId) return;
        dispatch(
          deleteItem({
            id,
            productId,
          }),
        );
      }
    : undefined;

  const deleteManyProductOption = canUpdate
    ? (typeId: string) => {
        if (!productId) return;
        dispatch(
          deleteItems({
            id: typeId,
            productId,
          }),
        );
      }
    : undefined;

  // useEffect(() => {
  //     fetchOption();
  // }, [
  //     dispatch,
  //     page,
  //     size,
  //     keyword,
  //     startAt,
  //     endAt,
  //     isLockHook,
  //     status,
  //     sortBy,
  //     sortOrder,
  //     filter,
  //     ranger,
  //     search,
  //     reload,
  //     info,
  // ]);

  useEffect(() => {
    if (!product) return;
    dispatch(resetItem());
  }, [product]);

  useEffect(() => {
    if (!newOption) return;
    dispatch(resetNewData());
  }, [newOption]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    // fetchOption();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    productOptions,
    product,
    newOption,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addProductOption,
    addManyProductOption,
    getProductOption,
    updateProductOption,
    changeIndexProductOption,
    deleteProductOption,
    deleteManyProductOption,
  };
};
