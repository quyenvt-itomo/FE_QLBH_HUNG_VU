import { RolePage } from "@/modules/role";
import { UserPage } from "@/modules/user";
import { OrderPage } from "@/modules/order";
import { SalePosPage } from "@/modules/order";
import { PurchasePage } from "@/modules/order";
import { InventoryPage } from "@/modules/inventory";
import { InventoryAdjustmentPage } from "@/modules/inventoryAdjustment";
import { IncomeExpensePage } from "@/modules/incomeExpense";
import { FundPage } from "@/modules/fund";
import { FundAdjustmentPage } from "@/modules/fundAdjustment";
import { FundTransferPage } from "@/modules/fundTransfer";
import { PartnerPage } from "@/modules/partner";
import { ProductPage, ProductPriceHistoryPage } from "@/modules/product";
import { NotificationPage } from "@/modules/notification";
import { StorePage } from "@/modules/store";
import { DashboardPage } from "@/modules/dashboard";
import ComingSoonPage from "./ComingSoonPage";

export const desktopPage = { DashboardPage, RolePage, UserPage, OrderPage, SalePosPage, PurchasePage, InventoryPage, InventoryAdjustmentPage, IncomeExpensePage, FundPage, FundAdjustmentPage, FundTransferPage, PartnerPage, ProductPage, ProductPriceHistoryPage, NotificationPage, StorePage, ComingSoonPage };
