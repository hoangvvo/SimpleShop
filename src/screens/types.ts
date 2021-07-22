import { ParamListBase } from "@react-navigation/routers";

export enum RouteName {
  Main = "Main",
  Dashboard = "Dashboard",
  Orders = "Orders",
  OrderEditor = "OrderEditor",
  Products = "Products",
  ProductEditor = "ProductEditor",
  Settings = "Settings",
}

export interface ParamList extends ParamListBase {
  [RouteName.Main]: undefined;
  [RouteName.Dashboard]: undefined;
  [RouteName.Orders]: undefined;
  [RouteName.OrderEditor]: { id?: number; isBuyOrder: boolean };
  [RouteName.Products]: undefined;
  [RouteName.ProductEditor]: undefined | { id: number };
  [RouteName.Settings]: undefined;
}
