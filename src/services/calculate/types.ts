import type { Product } from "services/product";

export interface OrderProductsStats {
  product_id: Product["id"];
  amount: number;
  profit: number;
  revenue: number;
  cost: number;
}
