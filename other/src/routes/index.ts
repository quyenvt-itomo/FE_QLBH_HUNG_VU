import { privateRoutesName, publicRoutesName } from "../constants/routerName";
import { BlankPage } from "../pages/Public/error/BlankPage";
import ErrorNetworkPage from "../pages/Public/error/ErrorNetwork/ErrorNetworkPage";
import NotFoundPage from "../pages/Public/error/NotFound/NotFoundPage";

import { publicPage } from "../pages/Public";
import { desktopPage } from "../pages/Private";

// Public Routes
const publicRoutes = [
  { path: publicRoutesName.login, component: publicPage.LoginPage },
  {
    path: publicRoutesName.forgotPassword,
    component: publicPage.ForgotPasswordPage,
  },
  {
    path: publicRoutesName.confirmOtp,
    component: publicPage.ConfirmOtpPage,
  },
  {
    path: publicRoutesName.confirmPassword,
    component: publicPage.ConfirmPasswordPage,
  },
  { path: publicRoutesName.error404, component: NotFoundPage },
  { path: publicRoutesName.errorNetwork, component: ErrorNetworkPage },
  { path: publicRoutesName.blank, component: BlankPage },

  // invite
  {
    path: publicRoutesName.confirmInviteSuccess,
    component: publicPage.ConfirmInviteSuccessPage,
  },
  {
    path: publicRoutesName.confirmInviteFailed,
    component: publicPage.ConfirmInviteFailedPage,
  },
  {
    path: publicRoutesName.auth,
    component: publicPage.AuthPage,
  },
];

// Private Routes
const privateRoutes = [
  {
    path: privateRoutesName.dashboard,
    component: desktopPage.DashboardPage,
  },
  // TODO: Category
  { path: privateRoutesName.categories.store, component: desktopPage.StorePage },
  {
    path: privateRoutesName.categories.user,
    component: desktopPage.UserPage,
  },
  {
    path: privateRoutesName.shift.page,
    component: desktopPage.ShiftPage,
  },
  {
    path: privateRoutesName.categories.permission,
    component: desktopPage.PermissionPage,
  },
  {
    path: privateRoutesName.categories.systemPermission,
    component: desktopPage.SystemPermissionPage,
  },

  // TODO: Product
  {
    path: privateRoutesName.product.page,
    component: desktopPage.ProductPage,
  },
  {
    path: privateRoutesName.product.add,
    component: desktopPage.AddProductPage,
  },
  {
    path: privateRoutesName.product.detail,
    component: desktopPage.DetailProductPage,
  },
  {
    path: privateRoutesName.product.report,
    component: desktopPage.ReportProductPage,
  },

  // TODO: Customer
  {
    path: privateRoutesName.customer.page,
    component: desktopPage.CustomerPage,
  },
  {
    path: privateRoutesName.customer.add,
    component: desktopPage.AddCustomerPage,
  },
  {
    path: privateRoutesName.customer.detail,
    component: desktopPage.DetailCustomerPage,
  },

  // TODO: Supplier
  {
    path: privateRoutesName.supplier.page,
    component: desktopPage.SupplierPage,
  },
  {
    path: privateRoutesName.supplier.add,
    component: desktopPage.AddSupplierPage,
  },
  {
    path: privateRoutesName.supplier.detail,
    component: desktopPage.DetailSupplierPage,
  },

  {
    path: privateRoutesName.import.page,
    component: desktopPage.ImportPage,
  },

  {
    path: privateRoutesName.export.page,
    component: desktopPage.ExportPage,
  },

  {
    path: privateRoutesName.employee.page,
    component: desktopPage.EmployeePage,
  },

  // TODO: Sale
  { path: privateRoutesName.sale.page, component: desktopPage.SalePage },
  {
    path: privateRoutesName.sale.add,
    component: desktopPage.AddSalePage,
  },
  {
    path: privateRoutesName.sale.detail,
    component: desktopPage.DetailSalePage,
  },

  // TODO: Purchase
  {
    path: privateRoutesName.purchase.page,
    component: desktopPage.PurchasePage,
  },
  {
    path: privateRoutesName.purchase.add,
    component: desktopPage.AddPurchasePage,
  },
  {
    path: privateRoutesName.purchase.detail,
    component: desktopPage.DetailPurchasePage,
  },

  // TODO: Sale Return
  {
    path: privateRoutesName.saleReturn.page,
    component: desktopPage.SaleReturnPage,
  },
  {
    path: privateRoutesName.saleReturn.add,
    component: desktopPage.AddSaleReturnPage,
  },
  {
    path: privateRoutesName.saleReturn.detail,
    component: desktopPage.DetailSaleReturnPage,
  },

  // TODO: Purchase Return
  {
    path: privateRoutesName.purchaseReturn.page,
    component: desktopPage.PurchaseReturnPage,
  },
  {
    path: privateRoutesName.purchaseReturn.add,
    component: desktopPage.AddPurchaseReturnPage,
  },
  {
    path: privateRoutesName.purchaseReturn.detail,
    component: desktopPage.DetailPurchaseReturnPage,
  },

  // TODO: Inventory Adjustment
  {
    path: privateRoutesName.inventoryAdjustment.page,
    component: desktopPage.InventoryAdjustmentPage,
  },

  // TODO: Store Transfer
  {
    path: privateRoutesName.storeTransfer.page,
    component: desktopPage.StoreTransferPage,
  },

  // TODO: Inventory
  {
    path: privateRoutesName.inventory.page,
    component: desktopPage.InventoryPage,
  },
  {
    path: privateRoutesName.inventory.detail,
    component: desktopPage.InventoryTransactionPage,
  },

  // TODO: CashBook
  {
    path: privateRoutesName.cashBook.page,
    component: desktopPage.CashbookPage,
  },
  {
    path: privateRoutesName.fundManager.page,
    component: desktopPage.FundManagerPage,
  },
  {
    path: privateRoutesName.debtManager.page,
    component: desktopPage.DebtManagerPage,
  },
  {
    path: privateRoutesName.vatManager.page,
    component: desktopPage.VatManagerPage,
  },

  {
    path: privateRoutesName.setting,
    component: desktopPage.SettingPage,
  },

  {
    path: privateRoutesName.myShift,
    component: desktopPage.MyShiftPage,
  },
];

// Partner Routes

export { publicRoutes, privateRoutes };
