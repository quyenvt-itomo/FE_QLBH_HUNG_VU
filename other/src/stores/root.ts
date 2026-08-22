import { all, fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// TODO: Auth
import { AuthSaga } from "./auth/saga";
import Auth from "./auth/slice";

// TODO: Notification
import { NotificationSaga } from "./notification/saga";
import Notification from "./notification/slice";

// TODO: Setting
import { SettingSaga } from "./setting/saga";
import Setting from "./setting/slice";

// TODO: Dashboard
import { DashboardSaga } from "./dashboard/saga";
import Dashboard from "./dashboard/slice";

// TODO: Excel
import { ExcelSaga } from "./excel/saga";
import Excel from "./excel/slice";

// TODO: Client
import Client from "./client/slice";

// TODO: Attribute
import { AttributeSaga } from "./attribute/saga";
import Attribute from "./attribute/slice";

// TODO: Employee
import { EmployeeSaga } from "./employee/saga";
import Employee from "./employee/slice";

// TODO: User
import { UserSaga } from "./user/saga";
import User from "./user/slice";

// TODO: Role
import { RoleSaga } from "./role/saga";
import Role from "./role/slice";

// TODO: System Role
import { SystemRoleSaga } from "./systemRole/saga";
import SystemRole from "./systemRole/slice";

// TODO: Store
import { StoreSaga } from "./store/saga";
import Store from "./store/slice";

// TODO: Customer
import { CustomerSaga } from "./customer/saga";
import Customer from "./customer/slice";

//TODO: Supplier
import { SupplierSaga } from "./supplier/saga";
import Supplier from "./supplier/slice";
import { SupplierContactSaga } from "./supplier/supplierContact/saga";
import SupplierContact from "./supplier/supplierContact/slice";
import { SupplierSubTypeSaga } from "./supplier/supplierSubType/saga";
import SupplierSubType from "./supplier/supplierSubType/slice";

// TODO: Partner
import { PartnerSaga } from "./partner/saga";
import Partner from "./partner/slice";

// TODO: SubType
import { SubTypeSaga } from "./customer/customerSubType/saga";
import SubType from "./customer/customerSubType/slice";

// TODO: Customer Contact
import { CustomerContactSaga } from "./customer/customerContact/saga";
import CustomerContact from "./customer/customerContact/slice";

// TODO: FundCategory
import { FundCategorySaga } from "./fundCategory/saga";
import FundCategory from "./fundCategory/slice";

// TODO: Product
import { ProductSaga } from "./product/saga";
import Product from "./product/slice";
import { ProductOptionSaga } from "./product/productOption/saga";
import ProductOption from "./product/productOption/slice";
import { ProductVariantSaga } from "./product/productVariant/saga";
import ProductVariant from "./product/productVariant/slice";

// TODO: Purchase
import { PurchaseSaga } from "./purchase/saga";
import Purchase from "./purchase/slice";
import { PurchaseLineSaga } from "./purchase/line/saga";
import PurchaseLine from "./purchase/line/slice";

// TODO: Sale
import { SaleSaga } from "./sale/saga";
import Sale from "./sale/slice";
import { SaleLineSaga } from "./sale/line/saga";
import SaleLine from "./sale/line/slice";

// TODO: PurchaseReturn
import { PurchaseReturnSaga } from "./purchaseReturn/saga";
import PurchaseReturn from "./purchaseReturn/slice";
import { PurchaseReturnLineSaga } from "./purchaseReturn/line/saga";
import PurchaseReturnLine from "./purchaseReturn/line/slice";

// TODO: SaleReturn
import { SaleReturnSaga } from "./saleReturn/saga";
import SaleReturn from "./saleReturn/slice";
import { SaleReturnLineSaga } from "./saleReturn/line/saga";
import SaleReturnLine from "./saleReturn/line/slice";

// TODO: StoreTransfer
import { StoreTransferSaga } from "./storeTransfer/saga";
import StoreTransfer from "./storeTransfer/slice";
import { StoreTransferLineSaga } from "./storeTransfer/storeTransferLine/saga";
import StoreTransferLine from "./storeTransfer/storeTransferLine/slice";

// TODO: InventoryAdjustment
import { InventoryAdjustmentSaga } from "./inventoryAdjustment/saga";
import InventoryAdjustment from "./inventoryAdjustment/slice";
import { InventoryAdjustmentLineSaga } from "./inventoryAdjustment/inventoryAdjustmentLine/saga";
import InventoryAdjustmentLine from "./inventoryAdjustment/inventoryAdjustmentLine/slice";

// TODO: Inventory
import { InventorySaga } from "./inventory/saga";
import Inventory from "./inventory/slice";

// TODO: Fund
import { FundSaga } from "./fund/saga";
import Fund from "./fund/slice";
import { IncomeExpenseSaga } from "./incomeExpense/saga";
import IncomeExpense from "./incomeExpense/slice";
import { FundAdjustmentSaga } from "./fundAdjustment/saga";
import FundAdjustment from "./fundAdjustment/slice";
import { FundTransferSaga } from "./fundTransfer/saga";
import FundTransfer from "./fundTransfer/slice";
import { FundBalanceSaga } from "./fundBalance/saga";
import FundBalance from "./fundBalance/slice";

// TODO: Debt
import { DebtSaga } from "./debt/saga";
import Debt from "./debt/slice";
import { DebtAdjustmentSaga } from "./debtAdjustment/saga";
import DebtAdjustment from "./debtAdjustment/slice";
import { DebtOffsetSaga } from "./debtOffset/saga";
import DebtOffset from "./debtOffset/slice";

// TODO: Thuế VAT
import { VatSaga } from "./vat/saga";
import Vat from "./vat/slice";
import { VatAdjustmentSaga } from "./vatAdjustment/saga";
import VatAdjustment from "./vatAdjustment/slice";

// TODO: Loyalty Point
import { LoyaltyPointSaga } from "./loyaltyPoint/saga";
import LoyaltyPoint from "./loyaltyPoint/slice";

// TODO: Shift
import { ShiftSaga } from "./shift/saga";
import Shift from "./shift/slice";

// * Cahce
import SaleOrderCache from "./cache/saleOrderCache";

const cacheSaleConfig = {
  key: "saleOrderCache",
  storage,
};

export function* rootSaga() {
  yield all([
    fork(AuthSaga),
    fork(NotificationSaga),
    fork(SettingSaga),
    fork(DashboardSaga),
    fork(ExcelSaga),
    fork(AttributeSaga),

    fork(EmployeeSaga),
    fork(UserSaga),
    fork(RoleSaga),
    fork(SystemRoleSaga),
    fork(StoreSaga),

    fork(CustomerSaga),
    fork(CustomerContactSaga),
    fork(SubTypeSaga),

    fork(SupplierSaga),
    fork(SupplierContactSaga),
    fork(SupplierSubTypeSaga),

    fork(PartnerSaga),
    fork(FundCategorySaga),

    fork(ProductSaga),
    fork(ProductOptionSaga),
    fork(ProductVariantSaga),

    fork(PurchaseSaga),
    fork(PurchaseLineSaga),

    fork(SaleSaga),
    fork(SaleLineSaga),

    fork(PurchaseReturnSaga),
    fork(PurchaseReturnLineSaga),

    fork(SaleReturnSaga),
    fork(SaleReturnLineSaga),

    fork(StoreTransferSaga),
    fork(StoreTransferLineSaga),

    fork(InventoryAdjustmentSaga),
    fork(InventoryAdjustmentLineSaga),
    fork(InventorySaga),

    fork(FundSaga),
    fork(IncomeExpenseSaga),
    fork(FundAdjustmentSaga),
    fork(FundTransferSaga),
    fork(FundBalanceSaga),

    fork(DebtSaga),
    fork(DebtAdjustmentSaga),
    fork(DebtOffsetSaga),

    fork(VatSaga),
    fork(VatAdjustmentSaga),

    fork(LoyaltyPointSaga),

    fork(ShiftSaga),
  ]);
}

export const rootReducer = combineReducers({
  Auth,
  Notification,
  Dashboard,
  Setting,
  Excel,
  Client,
  Attribute,

  Employee,
  User,
  Role,
  SystemRole,
  Store,

  Supplier,
  SupplierContact,
  SupplierSubType,

  Customer,
  SubType,
  CustomerContact,

  Partner,
  FundCategory,

  Product,
  ProductOption,
  ProductVariant,

  Purchase,
  PurchaseLine,

  Sale,
  SaleLine,
  SaleOrderCache: persistReducer(cacheSaleConfig, SaleOrderCache),

  PurchaseReturn,
  PurchaseReturnLine,

  SaleReturn,
  SaleReturnLine,

  StoreTransfer,
  StoreTransferLine,

  InventoryAdjustment,
  InventoryAdjustmentLine,
  Inventory,

  Fund,
  IncomeExpense,
  FundAdjustment,
  FundTransfer,
  FundBalance,

  Debt,
  DebtAdjustment,
  DebtOffset,

  Vat,
  VatAdjustment,

  LoyaltyPoint,

  Shift,
});
