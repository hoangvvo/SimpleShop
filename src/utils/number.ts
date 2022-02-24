import type { OrderProductsStats } from "services/calculate";

export function isNumeric(str: any) {
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export const calcProfit = (stat: OrderProductsStats) =>
  stat.revenue - stat.cost;
