import { useSQLite } from "db";
import { useQuery } from "react-query";
import { CalculateService } from "./service";

export function useProfit(fromTimestamp: number, toTimestamp: number) {
  const db = useSQLite();
  return useQuery(
    ["calculate", "profit", { fromTimestamp, toTimestamp }],
    () => CalculateService.getProfit(db, fromTimestamp, toTimestamp),
    {
      cacheTime: 0,
    }
  );
}

export function useOrderProductsStats(
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
