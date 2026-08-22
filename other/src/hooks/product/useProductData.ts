import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IProduct } from "../../models/product";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
  deleteItemMany,
} from "../../stores/product/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface ProductDataParams extends UseDataParams {
  offsetAt?: string;
}

export const useProductData = ({
  id,
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
  offsetAt,
  storeId,
  onCloseModal,
}: ProductDataParams) => {
  const dispatch = useDispatch();
  const {
    data: products,
    dataById: product,
    newData: newProduct,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Product as BaseState<IProduct>, shallowEqual);
  const { info, permissions } = useClientData();

  const fetchProductData = () => {
    if (isLockHook || !checkPermission(permissions, "product", "read")) return;
    dispatch(
      getAll({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        status: status === "all" ? undefined : status,
        offsetAt,
        storeId,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addProduct = checkPermission(permissions, "product", "create")
    ? (newProduct: IProduct) => {
        dispatch(addItem(newProduct));
      }
    : undefined;

  const getProduct = checkPermission(permissions, "product", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateProduct = checkPermission(permissions, "product", "update")
    ? (updatedProduct: Partial<IProduct>) => {
        dispatch(updateItem(updatedProduct));
      }
    : undefined;

  const deleteProduct = checkPermission(permissions, "product", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  const deleteProductMany = checkPermission(permissions, "product", "delete")
    ? (ids: string[]) => {
        dispatch(deleteItemMany(ids));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getProduct?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchProductData();
  }, [
    dispatch,
    page,
    size,
    keyword,
    startAt,
    endAt,
    isLockHook,
    status,
    sortBy,
    sortOrder,
    filter,
    reload,
    ranger,
    permissions,
    offsetAt,
    storeId,
  ]);

  useEffect(() => {
    if (!product) return;
    dispatch(resetItem());
  }, [product]);

  useEffect(() => {
    if (!newProduct) return;
    dispatch(resetNewData());
  }, [newProduct]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchProductData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    products,
    product,
    newProduct,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    deleteProductMany,
  };
};
