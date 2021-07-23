import { useSQLite } from "db";
import { useQuery } from "react-query";
import { CalculateService } from "./service";

export function useProfitQuery(fromTimestamp: number, toTimestamp: number) {
  const db = useSQLite();
  return useQuery(
    ["calculate", "profit", { fromTimestamp, toTimestamp }],
    () => CalculateService.getProfit(db, fromTimestamp, toTimestamp),
    {
      cacheTime: 0,
    }
  );
}

export function useOrderProductsStatsQuery(
  fromTimestamp: number,
  toTimestamp: number
) {
  const db = useSQLite();
  return useQuery(
    ["calculate", "order-products-stats", { fromTimestamp, toTimestamp }],
    () =>
      CalculateService.getOrderProductsStats(db, fromTimestamp, toTimestamp),
    {
      cacheTime: 0,
    }
  );
}

export function useProductsStockQuery() {
  const db = useSQLite();
  return useQuery(
    ["calculate", "products-stock"],
    () => CalculateService.getProductsStock(db),
    {
      cacheTime: 0,
    }
  );
}
