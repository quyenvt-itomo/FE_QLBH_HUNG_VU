import React from "react";
import { Navigate } from "react-router-dom";
import { desktopPage } from "./shared/pages/Private";
import { publicPage } from "./shared/pages/Public";

const HomePage: React.FC = () => React.createElement(Navigate, { to: "/orders", replace: true });
export const publicRoutes = [
  { path: "/login", component: publicPage.LoginPage },
  { path: "/forgot-password", component: publicPage.ForgotPasswordPage },
];
export const privateRoutes = [
  { path: "/", component: HomePage },
  { path: "/orders", component: desktopPage.OrderPage },
  { path: "/inventory", component: desktopPage.InventoryPage },
  { path: "/inventory-adjustments", component: desktopPage.InventoryAdjustmentPage },
  { path: "/partners", component: desktopPage.PartnerPage },
  { path: "/products", component: desktopPage.ProductPage },
  { path: "/products/price-history", component: desktopPage.ProductPriceHistoryPage },
  { path: "/funds", component: desktopPage.FundPage },
  { path: "/fund-adjustments", component: desktopPage.FundAdjustmentPage },
  { path: "/fund-transfers", component: desktopPage.FundTransferPage },
  { path: "/income-expenses", component: desktopPage.IncomeExpensePage },
  { path: "/users", component: desktopPage.UserPage },
  { path: "/roles", component: desktopPage.RolePage },
  { path: "/notifications", component: desktopPage.NotificationPage },
];
export const standalonePrivateRoutes: { path: string; component: React.FC }[] = [];
