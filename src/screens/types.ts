import type { ParamListBase } from "@react-navigation/routers";

export enum RouteName {
  Main = "Main",
  Dashboard = "Dashboard",
  DashboardStats = "DashboardStats",
  Orders = "Orders",
  OrderEditor = "OrderEditor",
  Products = "Products",
  ProductEditor = "ProductEditor",
  Customers = "Customers",
  CustomerEditor = "CustomerEditor",
  Settings = "Settings",
  Debug = "Debug",
}

export interface ParamList extends ParamListBase {
  [RouteName.Main]: undefined;
  [RouteName.Dashboard]: undefined;
  [RouteName.DashboardStats]:
    | { tab?: "revenue" | "profit" | "inventory" }
    | undefined;
  [RouteName.Orders]: undefined;
  [RouteName.OrderEditor]: { id?: number; isBuyOrder: boolean };
  [RouteName.Products]: undefined;
  [RouteName.ProductEditor]: undefined | { id: number };
  [RouteName.Customers]: undefined;
  [RouteName.CustomerEditor]: undefined | { id: number };
  [RouteName.Settings]: undefined;
  [RouteName.Debug]: undefined;
}
