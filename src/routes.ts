import React from "react";
import { privateRoutesName, publicRoutesName } from "./shared/constants/routerName";
import { desktopPage } from "./shared/pages/Private";
import { publicPage } from "./shared/pages/Public";
import { BlankPage } from "./shared/pages/Public/error/BlankPage";
import ErrorNetworkPage from "./shared/pages/Public/error/ErrorNetwork/ErrorNetworkPage";
import NotFoundPage from "./shared/pages/Public/error/NotFound/NotFoundPage";
import { Navigate } from "react-router-dom";
import { PosPage } from "@/modules/pos";

const HomePage: React.FC = () =>
  React.createElement(Navigate, { to: privateRoutesName.sales.order, replace: true });

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
  { path: publicRoutesName.supplierQuotation, component: publicPage.SupplierQuotationPage },
  {
    path: publicRoutesName.supplierQuotationDetail,
    component: publicPage.SupplierQuotationDetailPage,
  },
  { path: publicRoutesName.quotationRequest, component: publicPage.QuotationRequestPage },
  {
    path: publicRoutesName.quotationRequestDetail,
    component: publicPage.QuotationRequestDetailPage,
  },
];

// Private Routes
const privateRoutes: {
  path: string;
  component: React.FC;
  mobileComponent?: React.FC;
}[] = [
  // ── Dashboard ──
  { path: privateRoutesName.dashboard, component: HomePage },

  // ── Kinh doanh ──
  { path: privateRoutesName.sales.order, component: desktopPage.OrderPage },
  { path: privateRoutesName.sales.quotation, component: desktopPage.QuotationPage },
  { path: privateRoutesName.sales.quotationRequest, component: desktopPage.QuotationRequestPage },
  { path: privateRoutesName.sales.purchaseQuotation, component: desktopPage.PurchaseQuotationPage },
  {
    path: privateRoutesName.sales.purchaseRequisition,
    component: desktopPage.PurchaseRequisitionPage,
  },

  // ── Mua hàng ──
  { path: privateRoutesName.purchases.purchase, component: desktopPage.PurchasePage },

  // ── Sản xuất ──
  { path: privateRoutesName.productions.production, component: desktopPage.ProductionPage },
  { path: privateRoutesName.productions.billOfMaterial, component: desktopPage.BillOfMaterialPage },

  // ── Kho ──
  { path: privateRoutesName.inventories.warehouse, component: desktopPage.WarehousePage },
  { path: privateRoutesName.inventories.stockDocument, component: desktopPage.StockDocumentPage },
  {
    path: privateRoutesName.inventories.warehouseTransfer,
    component: desktopPage.WarehouseTransferPage,
  },
  {
    path: privateRoutesName.inventories.inventoryAdjustment,
    component: desktopPage.InventoryAdjustmentPage,
  },
  {
    path: privateRoutesName.inventories.inventoryConversion,
    component: desktopPage.InventoryConversionPage,
  },
  { path: privateRoutesName.inventories.report, component: desktopPage.InventoryPage },
  { path: privateRoutesName.inventories.gateLog, component: desktopPage.GateLogPage },
  { path: privateRoutesName.inventories.shippingPlan, component: desktopPage.ShippingPlanPage },

  // ── Kế toán ──
  { path: privateRoutesName.accountants.incomeExpense, component: desktopPage.IncomeExpensePage },
  { path: privateRoutesName.accountants.fund, component: desktopPage.FundPage },
  { path: privateRoutesName.accountants.fundAdjustment, component: desktopPage.FundAdjustmentPage },
  { path: privateRoutesName.accountants.fundTransfer, component: desktopPage.FundTransferPage },
  {
    path: privateRoutesName.accountants.fundBalanceReport,
    component: desktopPage.FundBalanceReportPage,
  },
  { path: privateRoutesName.accountants.invoice, component: desktopPage.InvoicePage },
  { path: privateRoutesName.accountants.paymentRequest, component: desktopPage.PaymentRequestPage },
  {
    path: privateRoutesName.accountants.debtManagerment,
    component: desktopPage.DebtManagermentPage,
  },
  { path: privateRoutesName.accountants.vatDebt, component: desktopPage.VatDebtAdjustmentPage },

  // ── Nhân sự ──

  // ── Thiết lập ──
  { path: privateRoutesName.establish.organization, component: desktopPage.OrganizationPage },
  { path: privateRoutesName.establish.jobPosition, component: desktopPage.JobPositionPage },

  // ── Danh mục ──
  { path: privateRoutesName.categories.paymentTerm, component: desktopPage.PaymentTermPage },
  { path: privateRoutesName.categories.partner, component: desktopPage.PartnerPage },
  { path: privateRoutesName.categories.product, component: desktopPage.ProductPage },
  {
    path: privateRoutesName.categories.priceHistory,
    component: desktopPage.ProductPriceHistoryPage,
  },
  { path: privateRoutesName.categories.service, component: desktopPage.ServicePage },
  { path: privateRoutesName.categories.user, component: desktopPage.UserPage },
  { path: privateRoutesName.categories.permission, component: desktopPage.RolePage },

  // ── Hệ thống ──
  { path: privateRoutesName.system.notification, component: desktopPage.NotificationPage },
  { path: privateRoutesName.system.deviceWhitelist, component: desktopPage.DeviceWhitelistPage },
  { path: privateRoutesName.system.operationLog, component: desktopPage.OperationLogPage },
];

export { publicRoutes, privateRoutes };

export const standalonePrivateRoutes = [
  { path: privateRoutesName.sales.pos, component: PosPage },
];
