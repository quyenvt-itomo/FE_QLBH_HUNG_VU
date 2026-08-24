import React from "react";
import { desktopPage } from "./shared/pages/Private";
import { publicPage } from "./shared/pages/Public";
import { privateRoutesName } from "./shared/constants/routerName";

export const publicRoutes = [
  { path: "/login", component: publicPage.LoginPage },
  { path: "/forgot-password", component: publicPage.ForgotPasswordPage },
];
export const privateRoutes = [
  { path: privateRoutesName.dashboard, component: desktopPage.DashboardPage },
  { path: privateRoutesName.sale, component: desktopPage.SalePosPage },
  { path: privateRoutesName.saleReturn, component: desktopPage.SalePosPage },
  { path: privateRoutesName.product, component: desktopPage.ProductPage },
  { path: privateRoutesName.storeTransfer, component: desktopPage.InventoryPage },
  { path: privateRoutesName.inventoryAdjustment, component: desktopPage.InventoryAdjustmentPage },
  { path: privateRoutesName.internalExport, component: desktopPage.ComingSoonPage },
  { path: privateRoutesName.supplier, component: desktopPage.PartnerPage },
  { path: privateRoutesName.purchase, component: desktopPage.PurchasePage },
  { path: privateRoutesName.purchaseReturn, component: desktopPage.PurchasePage },
  { path: privateRoutesName.customer, component: desktopPage.PartnerPage },
  { path: privateRoutesName.incomeExpense, component: desktopPage.IncomeExpensePage },
  { path: privateRoutesName.fund, component: desktopPage.FundPage },
  { path: privateRoutesName.fundAdjustment, component: desktopPage.FundAdjustmentPage },
  { path: privateRoutesName.fundTransfer, component: desktopPage.FundTransferPage },
  { path: privateRoutesName.debtAdjustment, component: desktopPage.ComingSoonPage },
  { path: privateRoutesName.vatAdjustment, component: desktopPage.ComingSoonPage },
  { path: privateRoutesName.setup.store, component: desktopPage.StorePage },
  { path: privateRoutesName.setup.attribute, component: desktopPage.ComingSoonPage },
  { path: privateRoutesName.setup.shipper, component: desktopPage.PartnerPage },
  { path: privateRoutesName.setup.user, component: desktopPage.UserPage },
  { path: privateRoutesName.setup.role, component: desktopPage.RolePage },
];
export const standalonePrivateRoutes: { path: string; component: React.FC }[] = [];
