import { Product } from "services/product";

export interface OrderProductsStats {
  product_id: Product["id"];
  amount: number;
  profit: number;
}
