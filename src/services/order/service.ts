import { SQLiteDatabase } from "react-native-sqlite-storage";
import * as queries from "./queries.sql";
import {
  Order,
  OrderProduct,
  OrderProductWithoutOrderId,
  OrderWithOrderProducts,
} from "./types";

export class OrderService {
  static async findAll(
    db: SQLiteDatabase,
    filter?: {
      from: number;
      to: number;
    }
  ) {
    const result = await db.executeSql(queries.orderFindAll);
    let orders = result[0].rows.raw() as Order[];
    const filterFrom = filter?.from;
    const filterTo = filter?.to;
    if (filterFrom || filterTo) {
      orders = orders.filter((order) => {
        if (filterFrom && order.created_at < filterFrom) return false;
        if (filterTo && order.created_at > filterTo) return false;
        return true;
      });
    }
    return orders;
  }

  static async findAllProducts(db: SQLiteDatabase) {
    const result = await db.executeSql(queries.orderProductFindAll);
    return result[0].rows.raw() as OrderProduct[];
  }

  static async findById(
    db: SQLiteDatabase,
    id: Order["id"]
  ): Promise<null | OrderWithOrderProducts> {
    const [result, resultProducts] = await Promise.all([
      db.executeSql(queries.orderFindById, [id]),
      db.executeSql(queries.orderProductFindByOrderId, [id]),
    ]);
    if (!result) return null;
    return {
      ...(result[0].rows.item(0) as Order),
      orderProducts: resultProducts[0].rows.raw() as OrderProduct[],
    };
  }

  static async create(
    db: SQLiteDatabase,
    input: Omit<Order, "id" | "created_at"> & {
      order_products?: OrderProductWithoutOrderId[];
    }
  ) {
    // FIXME: This must be in transaction
    // https://github.com/andpor/react-native-sqlite-storage/issues/255

    const result = await db.executeSql(queries.orderCreate, [
      input.is_buy_order,
      input.loc_text,
      input.note,
      input.has_paid,
      input.has_delivered,
    ]);

    const filteredOrderProducts = input.order_products?.filter(
      (op) => op.amount > 0
    );

    if (filteredOrderProducts?.length) {
      await db.executeSql(
        queries.orderProductsInsert(filteredOrderProducts.length),
        filteredOrderProducts
          .map((orderProduct) => [
            result[0].insertId,
            orderProduct.product_id,
            orderProduct.per_price,
            orderProduct.amount,
          ])
          // Array.flat equivalent
          .reduce((acc, val) => acc.concat(val), [])
      );
    }

    return result;
  }

  static async update(
    db: SQLiteDatabase,
    id: Order["id"],
    input: Omit<Order, "id" | "is_buy_order" | "created_at"> & {
      order_products?: OrderProductWithoutOrderId[];
    }
  ) {
    const result = await db.transaction((tx) => {
      tx.executeSql(queries.orderUpdate, [
        input.loc_text,
        input.note,
        input.has_paid,
        input.has_delivered,
        id,
      ]);

      if (input.order_products) {
        tx.executeSql(queries.orderProductsDrop, [id]);
        const filteredOrderProducts = input.order_products.filter(
          (op) => op.amount > 0
        );
        if (filteredOrderProducts.length > 0) {
          tx.executeSql(
            queries.orderProductsInsert(filteredOrderProducts.length),
            filteredOrderProducts
              .map((orderProduct) => [
                id,
                orderProduct.product_id,
                orderProduct.per_price,
                orderProduct.amount,
              ])
              // Array.flat equivalent
              .reduce((acc, val) => acc.concat(val), [])
          );
        }
      }
    });

    return result;
  }

  static async delete(db: SQLiteDatabase, id: Order["id"]) {
    const result = await db.executeSql(queries.orderDelete, [id]);
    return result[0];
  }
}
