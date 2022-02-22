import type { Product } from "services/product";

export interface Order {
  id: number;
  customer_id: number;
  is_buy_order: boolean;
  loc_text?: string;
  note?: string;
  has_paid: boolean;
  has_delivered: boolean;
  created_at: number;
}

export interface OrderProduct {
  order_id: Order["id"];
  product_id: Product["id"];
  per_price: number;
  amount: number;
}

export type OrderWithOrderProducts = Order & {
  orderProducts: OrderProduct[];
};

export type OrderProductWithoutOrderId = Omit<OrderProduct, "order_id">;
