import { useSQLite } from "db";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { OrderService } from "./service";
import {
  Order,
  OrderProduct,
  OrderProductWithoutOrderId,
  OrderWithOrderProducts,
} from "./types";

const invalidateCache = (client: QueryClient, orderId?: Order["id"]) => {
  client.invalidateQueries("orders");
  client.invalidateQueries("orders-count");
  if (orderId) client.invalidateQueries(["order", orderId]);
  client.invalidateQueries(["calculate", "profit"]);
};

export const useOrdersQuery = () => {
  const db = useSQLite();
  return useQuery<Order[]>("orders", () => OrderService.findAll(db));
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

export const useOrderCreateMutation = () => {
  const client = useQueryClient();
  const db = useSQLite();
  return useMutation<
    void,
    Error,
    Omit<Order, "id" | "created_at"> & {
      order_products?: OrderProductWithoutOrderId[];
    }
  >(async (data) => {
    await OrderService.create(db, data);
    invalidateCache(client);
  });
};

export const useOrderUpdateMutation = () => {
  const db = useSQLite();
  const client = useQueryClient();
  return useMutation<
    void,
    Error,
    Omit<Order, "is_buy_order" | "created_at"> & {
      order_products?: OrderProductWithoutOrderId[];
    }
  >(async ({ id, ...data }) => {
    await OrderService.update(db, id, data);
    invalidateCache(client, id);
  });
};

export const useOrderDeleteMutation = () => {
  const db = useSQLite();
  const client = useQueryClient();
  return useMutation<void, Error, Pick<Order, "id">>(async ({ id }) => {
    await OrderService.delete(db, id);
    invalidateCache(client, id);
  });
};

export const useOrdersCount = (fromTimestamp: number, toTimestamp: number) => {
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
