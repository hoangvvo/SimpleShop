import type { Product } from "services/product";

export interface OrderProductsStats {
  product_id: Product["id"];
  amount: number;
  revenue: number;
  cost: number;
}

export interface ProductInventoryStat {
  product_id: number;
  inventory: number;
  cost: number;
}

export interface SliceData {
  from: number;
  to: number;
  value: number;
}
