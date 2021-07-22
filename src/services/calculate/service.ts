import { SQLiteDatabase } from "react-native-sqlite-storage";
import { Order, OrderService } from "services/order";

export class CalculateService {
  static async getProfit(
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
        productsMap[orderProduct.product_id] = { amount: 0, profit: 0 };
      if (order.is_buy_order) {
        // store for later calculation
        return true;
      }
      // while looping through the array
      // we record the selling orders also
      const productsMapObj = productsMap[orderProduct.product_id];
      productsMapObj.amount += orderProduct.amount;
      productsMapObj.profit += orderProduct.per_price * orderProduct.amount;
      return false;
    });
    for (const filteredBuyOrder of filteredBuyOrders) {
      const subtractableAmount = Math.min(
        filteredBuyOrder.amount,
        productsMap[filteredBuyOrder.product_id].amount
      );
      productsMap[filteredBuyOrder.product_id].amount -= subtractableAmount;
      productsMap[filteredBuyOrder.product_id].profit -=
        subtractableAmount * filteredBuyOrder.per_price;
    }
    return Object.values(productsMap).reduce(
      (prev, current) => (prev += current.profit),
      0
    );
  }
}
