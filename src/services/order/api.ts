import { useSQLite } from "db";
import type { QueryClient, UseMutationOptions } from "react-query";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { OrderService } from "./service";
import type {
  Order,
  OrderProduct,
  OrderProductWithoutOrderId,
  OrderWithOrderProducts,
} from "./types";

export const invalidateCache = (client: QueryClient, orderId?: Order["id"]) => {
  client.invalidateQueries("orders");
  client.invalidateQueries("orders-count");
  if (orderId) client.invalidateQueries(["order", orderId]);
  client.invalidateQueries("calculate");
};

export const useOrdersQuery = () => {
  const db = useSQLite();
  return useQuery<(Order & { customer_name?: string })[]>("orders", () =>
    OrderService.findAll(db)
  );
};

export const useOrdersQueryByCustomerId = (customerId: number) => {
  const db = useSQLite();
  return useQuery<(Order & { customer_name?: string })[]>(
    "orders",
    async () => {
      const orders = await OrderService.findAll(db);
      return orders.filter((order) => order.customer_id === customerId);
    }
  );
};

export const useOrderProductsQuery = () => {
  const db = useSQLite();
  return useQuery<OrderProduct[]>("order-products", () =>
    OrderService.findAllProducts(db)
  );
};

export const useOrderQuery = (id: Order["id"]) => {
  const db = useSQLite();
  return useQuery<OrderWithOrderProducts | null>(["order", id], () =>
    id === -1 ? null : OrderService.findById(db, id)
  );
};

type OrderCreateMutationResult = Omit<Order, "id" | "created_at"> & {
  order_products?: OrderProductWithoutOrderId[];
};
export const useOrderCreateMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, OrderCreateMutationResult, unknown>,
    "mutationFn"
  >
) => {
  const client = useQueryClient();
  const db = useSQLite();
  return useMutation<void, Error, OrderCreateMutationResult>(async (data) => {
    await OrderService.create(db, data);
    invalidateCache(client);
  }, options);
};

type OrderUpdateMutationResult = Omit<Order, "is_buy_order" | "created_at"> & {
  order_products?: OrderProductWithoutOrderId[];
};
export const useOrderUpdateMutation = (
  options?:
    | Omit<
        UseMutationOptions<void, Error, OrderUpdateMutationResult, unknown>,
        "mutationFn"
      >
    | undefined
) => {
  const db = useSQLite();
  const client = useQueryClient();
  return useMutation<void, Error, OrderUpdateMutationResult>(
    async ({ id, ...data }) => {
      await OrderService.update(db, id, data);
      invalidateCache(client, id);
    },
    options
  );
};

export const useOrderDeleteMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, Pick<Order, "id">, unknown>,
    "mutationFn"
  >
) => {
  const db = useSQLite();
  const client = useQueryClient();
  return useMutation<void, Error, Pick<Order, "id">>(async ({ id }) => {
    await OrderService.delete(db, id);
    invalidateCache(client, id);
  }, options);
};

export const useOrdersCountQuery = (
  fromTimestamp: number,
  toTimestamp: number
) => {
  const db = useSQLite();
  return useQuery(
    ["orders-count", { fromTimestamp, toTimestamp }],
    async () => {
      const orders = await OrderService.findAll(db, {
        from: fromTimestamp,
        to: toTimestamp,
      });
      return orders.filter((order) => !order.is_buy_order).length;
    }
  );
};
