import { SQLiteDatabase } from "react-native-sqlite-storage";
import { Order, OrderService } from "services/order";
import { OrderProductsStats } from "./types";

export class CalculateService {
  static async getOrderProductsStats(
    db: SQLiteDatabase,
    fromTimestamp: number,
    toTimestamp: number
  ) {
    const [allOrders, allOrderProducts] = await Promise.all([
      OrderService.findAll(db, { from: fromTimestamp, to: toTimestamp }),
      OrderService.findAllProducts(db),
    ]);
    const ordersMap = new Map<Order["id"], Order>();
    const productsMap = Object.create({}) as {
      [key: number]: {
        _calc: number;
        amount: number;
        profit: number;
      };
    };
    for (const order of allOrders) {
      ordersMap.set(order.id, order);
    }
    const filteredBuyOrders = allOrderProducts.filter((orderProduct) => {
      const order = ordersMap.get(orderProduct.order_id);
      if (!order) return false;
      if (!(orderProduct.product_id in productsMap))
        productsMap[orderProduct.product_id] = {
          amount: 0,
          profit: 0,
          _calc: 0,
        };
      if (order.is_buy_order) {
        // store for later calculation
        return true;
      }
      // while looping through the array
      // we record the selling orders also
      const productsMapObj = productsMap[orderProduct.product_id];
      productsMapObj.amount += orderProduct.amount;
      productsMapObj._calc += orderProduct.amount;
      productsMapObj.profit += orderProduct.per_price * orderProduct.amount;
      return false;
    });
    for (const filteredBuyOrder of filteredBuyOrders) {
      const subtractableAmount = Math.min(
        filteredBuyOrder.amount,
        productsMap[filteredBuyOrder.product_id]._calc
      );
      productsMap[filteredBuyOrder.product_id]._calc -= subtractableAmount;
      productsMap[filteredBuyOrder.product_id].profit -=
        subtractableAmount * filteredBuyOrder.per_price;
    }
    const arr: OrderProductsStats[] = [];

    for (const [key, value] of Object.entries(productsMap)) {
      arr.push({
        product_id: Number(key),
        amount: value.amount,
        profit: value.profit,
      });
    }

    return arr;
  }

  static async getProfit(
    db: SQLiteDatabase,
    fromTimestamp: number,
    toTimestamp: number
  ) {
    const calculatedOrderProductArr =
      await CalculateService.getOrderProductsStats(
        db,
        fromTimestamp,
        toTimestamp
      );
    return calculatedOrderProductArr.reduce(
      (prev, current) => (prev += current.profit),
      0
    );
  }

  static async getProductsStock(db: SQLiteDatabase) {
    const [allOrders, allOrderProducts] = await Promise.all([
      OrderService.findAll(db),
      OrderService.findAllProducts(db),
    ]);
    const ordersMap = new Map<Order["id"], Order>();
    const productsMap = Object.create({}) as {
      [key: number]: number;
    };
    for (const order of allOrders) {
      ordersMap.set(order.id, order);
    }
    for (const orderProduct of allOrderProducts) {
      const order = ordersMap.get(orderProduct.order_id);
      if (typeof productsMap[orderProduct.product_id] !== "number")
        productsMap[orderProduct.product_id] = 0;
      if (order?.is_buy_order)
        productsMap[orderProduct.product_id] += orderProduct.amount;
      else productsMap[orderProduct.product_id] -= orderProduct.amount;
    }
    return productsMap;
  }
}
