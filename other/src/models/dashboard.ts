import { AttributeTypeEnum, OrderTypeEnum } from "../constants/enum";
import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IFile } from "./base/file";
import { IProduct } from "./product";
import { OrderSnapshot } from "./store/order";

// ============= Query Models =============

export interface DashboardQuery extends ApiRequestQuery {
  // Khoảng thời gian cần xem dashboard (bắt buộc để tính toán)
  startDate?: string;
  endDate?: string;

  // Lọc theo cửa hàng (nếu là hệ thống multi-store)
  storeId?: string;

  productId?: string; // Xem chi tiết 1 sản phẩm cụ thể (dùng cho tab Product)
}

// Doanh thu theo thời gian
export interface RevenueByDate {
  date: string; // YYYY-MM-DD
  revenue: number; // Doanh thu ngày đó
  cost: number; // Giá vốn ngày đó
  profit: number; // Lợi nhuận ngày đó
  orders: number; // Số đơn hàng ngày đó
  avgOrderValue: number; // Giá trị đơn hàng trung bình
  productsSold: number; // Số lượng sản phẩm bán ra ngày đó
}

// TODO: ============= Overview Dashboard (Dashboard tổng quan) =============
export interface OverviewMetrics {
  totalRevenue: number; // Tổng doanh thu (sum netAmount của đơn bán)
  revenueGrowth: number; // Tăng trưởng doanh thu so với kỳ trước (%)

  totalOrders: number; // Tổng số đơn hàng bán
  orderGrowth: number; // Tăng trưởng số đơn hàng (%)

  totalProductsSold: number; // Tổng số lượng sản phẩm bán ra (sum quantity)
  productsSoldGrowth: number; // Tăng trưởng số lượng sản phẩm bán (%)

  totalReturnOrders: number; // Tổng số đơn hoàn
  returnOrderGrowth: number; // Tăng trưởng đơn hoàn (%)

  totalReturnValue: number; // Tổng giá trị đơn hoàn
  returnValueGrowth: number; // Tăng trưởng giá trị đơn hoàn (%)

  totalProductsReturned: number; // Tổng số lượng sản phẩm hoàn
  productsReturnedGrowth: number; // Tăng trưởng số lượng sản phẩm hoàn (%)
}

export interface OverviewRevenueByDate {
  date: string; // YYYY-MM-DD
  revenue: number; // Doanh thu ngày đó
  orders: number; // Số đơn hàng ngày đó
}

export interface OverviewIncomeExpenseByAttribute {
  id: string;
  name: string;
  amount: number;
  type: AttributeTypeEnum; // INCOME_CATEGORY hoặc EXPENSE_CATEGORY
}

export interface TopStore {
  id: string;
  name: string;
  code: string;
  image?: IFile[];
  revenue: number; // Doanh thu
  orders: number; // Số đơn hàng
}
export interface TopProduct {
  id: string;
  name: string;
  code: string;
  album?: IFile[];
  revenue: number; // Doanh thu
  quantity: number; // Số lượng bán
}
export interface TopCustomer {
  id: string;
  name: string;
  code: string;
  avatar?: IFile[];
  revenue: number; // Doanh thu
  orders: number; // Số đơn hàng
}
export interface TopEmployee {
  id: string;
  name: string;
  code: string;
  avatar?: IFile[];
  revenue: number;
  orders: number;
  avgOrderValue: number;
  conversionRate: number;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  code: string;
  album?: File[];
  categoryName: string;
  soldQuantity: number; // Số lượng bán ra
  revenue: number; // Doanh thu
  profit: number; // Lợi nhuận
  profitMargin: number; // Tỷ suất lợi nhuận
  stockQty: number; // Tồn kho hiện tại
}

export interface LowStockProduct {
  id: string;
  name: string;
  code: string;
  album?: File[];
  categoryName: string;
  currentStock: number;
  minimumStock: number;
  avgDailySales: number; // Số lượng bán trung bình mỗi ngày
  daysUntilStockout: number; // Số ngày sẽ hết hàng
  reorderRecommendation: number; // Đề xuất số lượng nên đặt hàng
}

export interface DeadStockProduct {
  id: string;
  name: string;
  album?: File[];
  currentStock: number;
  stockValue: number;
  lastSoldDate: string;
  daysWithoutSale: number;
  recommendation: string; // "Discount", "Clearance", "Return to Supplier"
}

export interface DashboardOverviewData {
  metrics: OverviewMetrics;

  // Biểu đồ doanh thu kỳ hiện tại
  revenueByDate: OverviewRevenueByDate[];

  // Biểu đồ doanh thu kỳ trước (cùng mốc thời gian nhưng trừ đi 1 năm)
  revenueByDateLastYear: OverviewRevenueByDate[];

  // Thu chi
  totalIncome: number; // Tổng thu
  totalExpense: number; // Tổng chi
  incomeByAttribute: OverviewIncomeExpenseByAttribute[]; // Thu theo attribute INCOME_CATEGORY
  expenseByAttribute: OverviewIncomeExpenseByAttribute[]; // Chi theo attribute EXPENSE_CATEGORY

  // Top lists
  recentOrders: OrderSnapshot[]; // 10 đơn bán gần nhất
  topProducts: TopProduct[]; // 5 sản phẩm doanh thu cao nhất
}

// TODO: ============= Profit Dashboard (Dashboard lợi nhuận) =============
export interface ProfitMetrics {
  // === DOANH THU TỪ BÁN HÀNG ===
  totalSalesRevenue: number; // Tổng doanh thu từ bán hàng (tổng netAmount của đơn bán)
  salesRevenueGrowth: number; // Tăng trưởng doanh thu bán hàng so với kỳ trước (%)

  // === DOANH THU TỪ ĐỔI HÀNG ===
  totalReturnRevenue: number; // Tổng doanh thu từ đổi hàng (tổng netAmount của đơn hoàn)
  returnRevenueGrowth: number; // Tăng trưởng doanh thu đổi hàng so với kỳ trước (%)

  // === DOANH THU KHÁC ===
  totalOtherIncome: number; // Tổng doanh thu khác (không phải từ bán hàng)
  otherIncomeGrowth: number; // Tăng trưởng doanh thu khác so với kỳ trước (%)
  // Tính: SUM(incomeExpense.amount) với type = 'income' và partnerId IS NULL

  // === TỔNG DOANH THU ===
  totalRevenue: number; // Tổng doanh thu từ bán hàng (tổng netAmount)
  revenueGrowth: number; // Tăng trưởng doanh thu so với kỳ trước (%)

  // === CHI PHÍ VỐN HÀNG BÁN (COGS) ===
  totalCost: number; // Tổng giá vốn hàng bán
  costGrowth: number; // Tăng trưởng giá vốn so với kỳ trước (%)
  // Tính: tổng amount của inventoryTransaction với type = 'sale' và 'return' trong kỳ
  // đơn hoàn có cả mặt hàng hoàn nên sẽ trừ đi

  // === PHÍ VẬN CHUYỂN ===
  totalShippingExpense: number; // Tổng phí vận chuyển với những đơn miễn phí vận chuyển
  shippingExpenseGrowth: number; // Tăng trưởng phí vận chuyển so với kỳ trước (%)
  // Tính: SUM(order.shippingFee) với order.type = 'sale' hoặc 'return'

  // === CHI PHÍ KHÁC ===
  totalOtherExpense: number; // Tổng chi phí khác (không phải giá vốn và phí vận chuyển)
  otherExpenseGrowth: number; // Tăng trưởng chi phí khác so với kỳ trước (%)
  // Tính: SUM(incomeExpense.amount) với type = 'expense' và partnerId IS NULL

  // === TỔNG CHI PHÍ ===
  totalExpense: number; // Tổng chi phí
  expenseGrowth: number; // Tăng trưởng tổng chi phí so với kỳ trước (%)

  // === LỢI NHUẬN GỘP ===
  grossProfit: number; // Lợi nhuận gộp = totalRevenue - totalCost
  grossProfitGrowth: number;
  grossProfitMargin: number; // (grossProfit / totalRevenue) * 100

  // === ĐIỀU CHỈNH TỒN KHO ===
  totalInventoryAdjustmentValue: number; // Tổng giá trị điều chỉnh tồn kho trong kỳ
  inventoryAdjustmentValueGrowth: number;
  // Tính: SUM(inventoryAdjustment.deltaAmount) trong kỳ

  // === ĐIỀU CHỈNH QUỸ ===
  totalFundAdjustmentValue: number; // Tổng giá trị điều chỉnh quỹ trong kỳ
  fundAdjustmentValueGrowth: number;
  // Tính: SUM(fundAdjustment.deltaAmount) trong kỳ

  // === ĐIỀU CHỈNH CÔNG NỢ KHÁCH HÀNG (RECEIVABLE) ===
  totalReceivableAdjustmentValue: number; // Tổng giá trị điều chỉnh công nợ phải thu trong kỳ
  receivableAdjustmentValueGrowth: number;

  // === LỢI NHUẬN ===
  netProfit: number; // Lợi nhuận ròng = totalRevenue - totalExpense -
  netProfitGrowth: number; // Tăng trưởng lợi nhuận ròng so với kỳ trước (%)
  netProfitMargin: number; // Tỷ suất lợi nhuận ròng (%)
}
export interface RevenueByCategory {
  // Doanh thu theo danh mục sản phẩm (Chỉ lấy những danh mục cấp 1) (doanh thu của chính nó hoặc con cháu của nó)
  id: string;
  name: string;
  revenue: number;
  cost: number;
  grossProfit: number;
  orders: number; // Tổng số đơn hàng
}
export interface RevenueByEmployee {
  id: string;
  name: string;
  code: string;
  avatar?: IFile[];
  revenue: number;
  cost: number;
  grossProfit: number;
  orders: number; // Số đơn hàng
}
export interface RevenueByStore {
  id: string;
  name: string;
  image?: IFile[];
  revenue: number;
  cost: number;
  grossProfit: number;
  orders: number; // Số đơn hàng
}

export interface DashboardProfitData {
  metrics: ProfitMetrics;

  // Biểu đồ doanh thu bán hàng (tổng netAmount của đơn bán + đơn hoàn trong ngày)
  saleRevenueByDate: OverviewRevenueByDate[];

  // Biểu đồ giá vốn bán hàng (tổng giá vốn xuất bán + giá vốn hoàn trong ngày)
  saleCostByDate: OverviewRevenueByDate[];

  // Biểu đồ lợi nhuận gộp trong ngày (doanh thu - giá vốn)
  grossProfitByDate: OverviewRevenueByDate[];

  ortherIncomeDetails: OverviewIncomeExpenseByAttribute[]; // Thu khác theo attribute INCOME_CATEGORY
  otherExpenseDetails: OverviewIncomeExpenseByAttribute[]; // Chi khác theo attribute EXPENSE_CATEGORY

  // Cơ cấu doanh thu theo danh mục sản phẩm
  revenueByCategory: RevenueByCategory[];
  // Cơ cấu doanh thu theo nhân viên
  revenueByEmployee: RevenueByEmployee[];
  // Cơ cấu doanh thu theo đối tác
  revenueByStore?: RevenueByStore[];
}

// TODO: ============= Sales Metrics =============
export interface SalesMetrics {
  // === DOANH THU BÁN HÀNG ===
  totalRevenue: number; // Tổng doanh thu (không bao gồm thuế)
  revenueGrowth: number; // Tăng trưởng doanh thu so với kỳ trước (%)
  // Tính: SUM(orderLine.price * orderLine.quantity) với order.type = 'sale'

  totalRevenueWithTax: number; // Tổng doanh thu có thuế
  revenueWithTaxGrowth: number;
  // Tính: totalRevenue + totalSalesTax

  totalSalesTax: number; // Tổng thuế VAT đầu ra từ bán hàng
  salesTaxGrowth: number;
  // Tính: SUM(orderLine.taxAmount) với order.type = 'sale'

  totalCost: number; // Tổng giá vốn hàng bán (COGS - Cost of Goods Sold)
  costGrowth: number;
  // Tính: SUM(orderLine.costPrice * orderLine.quantity) với order.type = 'sale'

  grossProfit: number; // Lợi nhuận gộp
  grossProfitGrowth: number;
  // Tính: totalRevenue - totalCost

  grossProfitMargin: number; // Tỷ suất lợi nhuận gộp (%)
  // Tính: (grossProfit / totalRevenue) * 100

  // === ĐƠN HÀNG ===
  totalOrders: number; // Tổng số đơn hàng bán
  orderGrowth: number; // Tăng trưởng số đơn hàng so với kỳ trước (%)
  // Tính: COUNT(order) với order.type = 'sale'

  avgOrderValue: number; // Giá trị đơn hàng trung bình (AOV - Average Order Value)
  avgOrderValueGrowth: number; // Tăng trưởng AOV so với kỳ trước (%)
  // Tính: totalRevenue / totalOrders

  // === GIẢM GIÁ & KHUYẾN MÃI ===
  totalDiscount: number; // Tổng giá trị giảm giá
  discountGrowth: number; // Tăng trưởng giảm giá so với kỳ trước (%)
  // Tính: SUM(order.discountAmount) với order.type = 'sale'

  discountRate: number; // Tỷ lệ giảm giá trung bình (%)
  // Tính: (totalDiscount / (totalRevenue + totalDiscount)) * 100
}

// TODO: ============= Product Metrics =============
export interface ProductMetrics {
  totalProducts: number; // Tổng số sản phẩm
  productGrowth: number; // Tăng trưởng số sản phẩm so với kỳ trước (%)

  newProducts: number; // Số sản phẩm mới trong kỳ
  newProductGrowth: number; // Tăng trưởng số sản phẩm mới so với kỳ trước (%)

  totalSellingProducts: number; // Số sản phẩm đã bán ra
  sellingProductGrowth: number; // Tăng trưởng số sản phẩm đã bán so với kỳ trước (%)

  totalPurchasedProducts: number; // Số sản phẩm đã mua vào
  purchasedProductGrowth: number; // Tăng trưởng số sản phẩm đã mua so với kỳ trước (%)

  // Tổng số lượng tồn cuối kỳ
  totalEndingInventory: number;
  endingInventoryGrowth: number; // Tăng trưởng số lượng tồn cuối kỳ so với kỳ trước (%)

  // Tổng giá trị tồn cuối kỳ
  totalEndingInventoryValue: number;
  endingInventoryValueGrowth: number; // Tăng trưởng giá trị tồn cuối kỳ so với kỳ trước (%)

  // Điều chỉnh trong kỳ
  totalInventoryAdjustment: number; // Tổng số lượng điều chỉnh tồn kho trong kỳ
  inventoryAdjustmentGrowth: number; // Tăng trưởng số lượng điều chỉnh tồn kho so với kỳ trước (%)

  totalInventoryAdjustmentValue: number; // Tổng giá trị điều chỉnh tồn kho trong kỳ
  inventoryAdjustmentValueGrowth: number; // Tăng trưởng giá trị điều chỉnh tồn kho so với kỳ trước (%)
}

export interface DashboardSalesData {
  metrics: SalesMetrics;

  // Biểu đồ doanh thu kỳ hiện tại
  revenueByDate: RevenueByDate[];
  // Biểu đồ doanh thu kỳ trước (cùng mốc thời gian nhưng trừ đi 1 năm)
  revenueByDateLastYear: RevenueByDate[];

  // Top lists
  topProducts: TopProduct[]; // 10 sản phẩm doanh thu cao nhất
  topStores: TopStore[]; // 5 cửa hàng doanh thu cao nhất
  topEmployees: TopEmployee[]; // 5 nhân viên doanh thu cao nhất
  topCustomers: TopCustomer[]; // 5 đối tác doanh thu cao nhất

  // Cơ cấu doanh thu theo danh mục sản phẩm
  revenueByCategory: RevenueByCategory[];
  // Cơ cấu doanh thu theo nhân viên
  revenueByEmployee: RevenueByEmployee[];
  // Cơ cấu doanh thu theo cửa hàng (chỉ hiển thị khi xem toàn cục)
  revenueByStore: RevenueByStore[];
}

// TODO: ============= Detail Product Metrics =============
export interface ProductDetailMetrics {
  totalRevenue: number; // Tổng doanh thu của sản phẩm
  revenueGrowth: number; // Tăng trưởng doanh thu so với kỳ trước (%)

  totalQuantitySold: number; // Tổng số lượng bán ra
  quantitySoldGrowth: number; // Tăng trưởng số lượng bán ra so với kỳ trước (%)

  totalCost: number; // Tổng giá vốn của sản phẩm
  costGrowth: number; // Tăng trưởng giá vốn so với kỳ trước (%)

  grossProfit: number; // Lợi nhuận gộp của sản phẩm
  grossProfitGrowth: number; // Tăng trưởng lợi nhuận gộp so với kỳ trước (%)
  grossProfitMargin: number; // Tỷ suất lợi nhuận gộp (%)

  totalSoldOrders: number; // Tổng số đơn hàng có sản phẩm này
  soldOrderGrowth: number; // Tăng trưởng số đơn hàng có sản phẩm này so với kỳ trước (%)

  returnedQuantity: number; // Tổng số lượng hoàn trả
  returnedQuantityGrowth: number; // Tăng trưởng số lượng hoàn trả so với kỳ trước (%)

  returnRate: number; // Tỷ lệ hoàn trả (%)

  averageSellingPrice: number; // Giá bán trung bình
  averageCostPrice: number; // Giá vốn trung bình

  // tồn cuối kỳ
  endingInventory: number; // Số lượng tồn cuối kỳ
  endingInventoryGrowth: number; // Tăng trưởng số lượng tồn cuối kỳ so với kỳ trước (%)

  endingInventoryValue: number; // Giá trị tồn cuối kỳ
  endingInventoryValueGrowth: number; // Tăng trưởng giá trị tồn cuối kỳ so với kỳ trước (%)
}
export interface DashboardDetailProductData {
  data: IProduct;

  metrics: ProductDetailMetrics;

  revenueByDate: RevenueByDate[]; // Doanh thu theo ngày (chỉ tính riêng cho sản phẩm này)

  soldOrders: OrderSnapshot[]; // 10 đơn hàng bán có sản phẩm này gần nhất
}

export interface DashboardProductData {
  metrics: ProductMetrics;

  revenueByDate: RevenueByDate[]; // Doanh thu theo ngày

  topSellingProducts: TopSellingProduct[]; // 10 sản phẩm bán chạy nhất

  lowStockProducts: LowStockProduct[]; // 10 sản phẩm sắp hết hàng tồn < 10 > 0

  deadStockProducts: DeadStockProduct[]; // 10 sản phẩm tồn kho chết (không bán được trong kỳ này và còn tồn kho cuối kỳ)

  revenueByCategory: RevenueByCategory[]; // Doanh thu theo danh mục sản phẩm (chỉ lấy những danh mục cấp 1)
}

// ============= Response Model =============

export interface DashboardResponse extends ApiResponse {}
