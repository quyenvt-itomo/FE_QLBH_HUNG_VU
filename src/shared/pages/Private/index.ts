import { RolePage } from "@/modules/role";
import { OrganizationPage } from "@/modules/organization";
import { UserPage } from "@/modules/user";
import { JobPositionPage } from "@/modules/jobPosititon";

// ── Kinh doanh ──
import { OrderPage } from "@/modules/order";
import { QuotationPage } from "@/modules/quotation";
import { QuotationRequestPage } from "@/modules/quotationRequest";
import { PurchaseQuotationPage } from "@/modules/purchaseQuotation";
import { PurchaseRequisitionPage } from "@/modules/purchaseRequisition";

// ── Mua hàng ──
import { PurchasePage } from "@/modules/purchase";

// ── Sản xuất ──
import { ProductionPage } from "@/modules/production";
import { BillOfMaterialPage } from "@/modules/billOfMaterial";

// ── Kho ──
import { StockDocumentPage } from "@/modules/stockDocument";
import { WarehouseTransferPage } from "@/modules/warehouseTransfer";
import { InventoryAdjustmentPage } from "@/modules/inventoryAdjustment";
import { InventoryConversionPage } from "@/modules/inventoryConversion";
import { InventoryPage } from "@/modules/inventory";
import { GateLogPage } from "@/modules/gateLog";
import { ShippingPlanPage } from "@/modules/shippingPlan";

// ── Kế toán ──
import { IncomeExpensePage } from "@/modules/incomeExpense";
import { FundPage } from "@/modules/fund";
import { FundAdjustmentPage } from "@/modules/fundAdjustment";
import { FundTransferPage } from "@/modules/fundTransfer";
import { FundBalanceReportPage } from "@/modules/fundBalanceReport";
import { InvoicePage } from "@/modules/invoice";
import { PaymentRequestPage } from "@/modules/paymentRequest";
import { CommissionDebtAdjustmentPage } from "@/modules/commissionDebtAdjustment";
import { CommissionDebtReportPage } from "@/modules/commissionDebtReport";
import { PartnerDebtAdjustmentPage } from "@/modules/partnerDebtAdjustment";
import { PartnerDebtOffsetPage } from "@/modules/partnerDebtOffset";
import { PartnerDebtReportPage } from "@/modules/partnerDebtReport";
import { VatDebtAdjustmentPage } from "@/modules/vatDebtAdjustment";
import { VatDebtReportPage } from "@/modules/vatDebtReport";

// ── Hệ thống ──
import { NotificationPage } from "@/modules/notification";
import { DeviceWhitelistPage } from "@/modules/deviceWhitelist";
import { OperationLogPage } from "@/modules/operationLog";

// ── Danh mục ──
import { PaymentTermPage } from "@/modules/paymentTerm";
import { PartnerPage } from "@/modules/partner";
import { ProductPage, ProductPriceHistoryPage } from "@/modules/product";
import { WarehousePage } from "@/modules/warehouse";
import { ServicePage } from "@/modules/service";

// More
import { DebtManagermentPage } from "./DebtManagerment";

export const desktopPage = {
  UserPage,
  RolePage,
  OrganizationPage,
  JobPositionPage,

  // Danh mục
  PaymentTermPage,
  PartnerPage,
  ProductPage,
  ProductPriceHistoryPage,
  WarehousePage,
  ServicePage,

  // Kinh doanh
  OrderPage,
  QuotationPage,
  QuotationRequestPage,
  PurchaseQuotationPage,
  PurchaseRequisitionPage,

  // Mua hàng
  PurchasePage,

  // Sản xuất
  ProductionPage,
  BillOfMaterialPage,

  // Kho
  StockDocumentPage,
  WarehouseTransferPage,
  InventoryAdjustmentPage,
  InventoryConversionPage,
  InventoryPage,
  GateLogPage,
  ShippingPlanPage,

  // Kế toán
  IncomeExpensePage,
  FundPage,
  FundAdjustmentPage,
  FundTransferPage,
  FundBalanceReportPage,
  InvoicePage,
  PaymentRequestPage,
  CommissionDebtAdjustmentPage,
  CommissionDebtReportPage,
  PartnerDebtAdjustmentPage,
  PartnerDebtOffsetPage,
  PartnerDebtReportPage,
  VatDebtAdjustmentPage,
  VatDebtReportPage,

  // Hệ thống
  NotificationPage,
  DeviceWhitelistPage,
  OperationLogPage,

  // More
  DebtManagermentPage,
};
