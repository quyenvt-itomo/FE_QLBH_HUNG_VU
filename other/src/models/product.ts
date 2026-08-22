import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IAttribute } from "./base/attribute";
import { IEntity } from "./base/entity";
import { IFile } from "./base/file";

export interface ProductQuery extends ApiRequestQuery {
  moreQuery?: any;
  offsetAt?: string;
}

export interface ProductPartialQuery extends ApiRequestQuery {
  productId: string;
}

export interface IProductVariant extends IEntity {
  image?: IFile[];

  productId: string;
  product?: IProduct;

  options?: IProductOption[];

  sku?: string;
  barcode?: string;

  costPrice?: number;
  price?: number;

  stockQty?: number;
  stockValue?: number;

  isActive: boolean;
}

export interface CreateManyOptionDto {
  productId?: string;
  typeId: string;
  values: string[];
  typeIndex: number;
}

export interface IProductOption {
  id: string;
  tempId?: string;

  productId: string;
  product?: IProduct;

  typeId: string;
  type?: IAttribute;

  value: string;
  typeIndex: number;

  // relations (optional khi API populate)
  variants?: IProductVariant[];

  // base entity fields
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductType extends IEntity {
  productId: string;

  typeId: string;
  type: IAttribute;

  index: number;
  values: string[];
}
export interface ChangeIndexData {
  typeId: string;
  index: number;
}
export interface ChangeOptionIndexPayload {
  productId: string;
  data: ChangeIndexData[];
}

export interface ProductVariantSnapshot {
  id: string;
  image?: IFile[];
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
    hasVariant?: boolean;
    category: {
      id: string;
      name: string;
    };
    unit: {
      id: string;
      name: string;
      type: string;
    };
  };

  costPrice?: number;
  price?: number;
  sku?: string | null;
  barcode?: string | null;
  options?: {
    type: {
      id: string;
      name: string;
    };
    value: string;
    typeIndex: number;
  }[];

  isActive: boolean;
}

export interface IProduct {
  id: string;
  tempId?: string;

  name: string;
  code: string;

  categoryId: string;
  category: IAttribute;

  unitId: string;
  unit: IAttribute;

  taxRate?: number;

  hasVariant: boolean;

  productTypes?: IProductType[];

  // relations (optional – tuỳ API populate)
  options?: IProductOption[];
  variants: IProductVariant[];

  // base entity
  createdAt?: string;
  updatedAt?: string;

  album?: IFile[];

  totalStockQty?: number;
  totalStockValue?: number;

  note?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProductResponse extends ApiResponse {}
