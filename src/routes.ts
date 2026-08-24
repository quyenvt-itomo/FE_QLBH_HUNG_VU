import React from "react";
import { desktopPage } from "./shared/pages/Private";
import { publicPage } from "./shared/pages/Public";
import { privateRoutesName } from "./shared/constants/routerName";

export const publicRoutes = [
  { path: "/login", component: publicPage.LoginPage },
  { path: "/forgot-password", component: publicPage.ForgotPasswordPage },
];
export const privateRoutes: { path: string; component: React.FC }[] = [
  { path: privateRoutesName.dashboard, component: desktopPage.DashboardPage },
  { path: privateRoutesName.pos, component: desktopPage.PosPage },
  { path: privateRoutesName.sale, component: desktopPage.SalePage },
  { path: privateRoutesName.saleReturn, component: desktopPage.SaleReturnPage },
  { path: privateRoutesName.product, component: desktopPage.ProductPage },
  { path: privateRoutesName.storeTransfer, component: desktopPage.InventoryPage },
  { path: privateRoutesName.inventoryAdjustment, component: desktopPage.InventoryAdjustmentPage },
  { path: privateRoutesName.internalExport, component: desktopPage.ComingSoonPage },
  { path: privateRoutesName.supplier, component: desktopPage.SupplierPage },
  { path: privateRoutesName.purchase, component: desktopPage.PurchasePage },
  { path: privateRoutesName.purchaseReturn, component: desktopPage.PurchaseReturnPage },
  { path: privateRoutesName.customer, component: desktopPage.CustomerPage },
  { path: privateRoutesName.incomeExpense, component: desktopPage.IncomeExpensePage },
  { path: privateRoutesName.fund, component: desktopPage.FundPage },
  { path: privateRoutesName.fundAdjustment, component: desktopPage.FundAdjustmentPage },
  { path: privateRoutesName.fundTransfer, component: desktopPage.FundTransferPage },
  { path: privateRoutesName.debtAdjustment, component: desktopPage.ComingSoonPage },
  { path: privateRoutesName.vatAdjustment, component: desktopPage.ComingSoonPage },
  { path: privateRoutesName.setup.store, component: desktopPage.StorePage },
  { path: privateRoutesName.setup.attribute, component: desktopPage.AttributePage },
  { path: privateRoutesName.setup.shipper, component: desktopPage.ShipperPage },
  { path: privateRoutesName.setup.user, component: desktopPage.UserPage },
  { path: privateRoutesName.setup.role, component: desktopPage.RolePage },
];
export const standalonePrivateRoutes: { path: string; component: React.FC }[] = [];
