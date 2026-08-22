import { role } from "../permission";
import { attribute } from "./error/attribute";
import { auth } from "./error/auth";
import { dashboard } from "./error/dashboard";
import { debtAdjustment, debtOffset } from "./error/debt";
import { employee } from "./error/employee";
import { fund, fundAdjustment, fundCategory, fundTransfer, incomeExpense } from "./error/fund";
import {
  inventoryAdjustment,
  inventoryAdjustmentLine,
  storeTransfer,
  storeTransferLine,
} from "./error/inventory";
import {
  purchase,
  purchaseLine,
  purchaseReturn,
  purchaseReturnLine,
  sale,
  saleLine,
  saleReturn,
  saleReturnLine,
} from "./error/order";
import {
  customer,
  customerContact,
  customerSubType,
  partner,
  supplier,
  supplierContact,
  supplierSubType,
} from "./error/partner";
import { product, productOption, productVariant } from "./error/product";
import { setting } from "./error/setting";
import { shift } from "./error/shift";
import { store } from "./error/store";
import { systemRole } from "./error/systemRole";
import { user } from "./error/user";
import { vatAdjustment } from "./error/vat";

export const ERROR = {
  auth,
  dashboard,
  setting,
  excel: {},
  attribute,
  store,

  fund,
  fundCategory,
  incomeExpense,
  fundAdjustment,
  fundTransfer,

  product,
  productOption,
  productVariant,

  customer,
  customerSubType,
  customerContact,

  supplier,
  supplierSubType,
  supplierContact,

  partner,

  shift,
  purchase,
  purchaseLine,
  sale,
  saleLine,
  purchaseReturn,
  purchaseReturnLine,
  saleReturn,
  saleReturnLine,

  inventoryAdjustment,
  inventoryAdjustmentLine,

  storeTransfer,
  storeTransferLine,

  debtAdjustment,
  debtOffset,

  vatAdjustment,

  employee,

  user,
  role,
  systemRole,
} as const;
