import { useSQLite } from "db";
import type { QueryFunctionContext } from "react-query";
import { useQueries, useQuery } from "react-query";
import type { SliceData } from ".";
import { CalculateService } from "./service";

const ONE_DAY = 86400000;

export function useProfitQuery(fromTimestamp: number, toTimestamp: number) {
  const db = useSQLite();
  return useQuery(["calculate", "profit", { fromTimestamp, toTimestamp }], () =>
    CalculateService.getProfit(db, fromTimestamp, toTimestamp)
  );
}

export function useProfitSlices(from: Date, to: Date) {
  const queryFn = async (
    ctx: QueryFunctionContext<
      {
        fromTimestamp: number;
        toTimestamp: number;
      }[]
    >
  ): Promise<SliceData> => ({
    from: ctx.queryKey[2].fromTimestamp,
    to: ctx.queryKey[2].toTimestamp,
    value: await CalculateService.getProfit(
      db,
      ctx.queryKey[2].fromTimestamp,
      ctx.queryKey[2].toTimestamp
    ),
  });

  const db = useSQLite();
  const queries = [];
  let fromDateObj = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate()
  );
  const toDateObj = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  while (fromDateObj < toDateObj) {
    const nextDateObj = new Date(fromDateObj.getTime() + ONE_DAY - 1);
    queries.push({
      queryKey: [
        "calculate",
        "profit",
        {
          fromTimestamp: fromDateObj.getTime(),
          toTimestamp: nextDateObj.getTime(),
        },
      ],
      queryFn,
    });
    fromDateObj = new Date(fromDateObj.getTime() + ONE_DAY);
  }
  // @ts-ignore
  return useQueries(queries);
}

export function useRevenueQuery(fromTimestamp: number, toTimestamp: number) {
  const db = useSQLite();
  return useQuery(
    ["calculate", "revenue", { fromTimestamp, toTimestamp }],
    () => CalculateService.getRevenue(db, fromTimestamp, toTimestamp)
  );
}

export function useRevenueSlices(from: Date, to: Date) {
  const queryFn = async (
    ctx: QueryFunctionContext<
      {
        fromTimestamp: number;
        toTimestamp: number;
      }[]
    >
  ) => ({
    from: ctx.queryKey[2].fromTimestamp,
    to: ctx.queryKey[2].toTimestamp,
    value: await CalculateService.getRevenue(
      db,
      ctx.queryKey[2].fromTimestamp,
      ctx.queryKey[2].toTimestamp
    ),
  });

  const db = useSQLite();
  const queries = [];
  let fromDateObj = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate()
  );
  const toDateObj = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  while (fromDateObj < toDateObj) {
    const nextDateObj = new Date(fromDateObj.getTime() + ONE_DAY - 1);
    queries.push({
      queryKey: [
        "calculate",
        "revenue",
        {
          fromTimestamp: fromDateObj.getTime(),
          toTimestamp: nextDateObj.getTime(),
        },
      ],
      queryFn,
    });
    fromDateObj = new Date(fromDateObj.getTime() + ONE_DAY);
  }
  // @ts-ignore
  return useQueries(queries);
}

export function useProductsStockQuery() {
  const db = useSQLite();
  return useQuery(["calculate", "products-stock"], () =>
    CalculateService.getProductsStock(db)
  );
}

export function useOrderProductsStatsQuery(
  fromTimestamp: number,
  toTimestamp: number
) {
  const db = useSQLite();
  return useQuery(
    ["calculate", "order-products-stats", { fromTimestamp, toTimestamp }],
    () => CalculateService.getOrderProductsStats(db, fromTimestamp, toTimestamp)
  );
}

export function useInventoryCostsQuery() {
  const db = useSQLite();
  return useQuery(["calculate", "inventory-costs"], () =>
    CalculateService.getInventoryCost(db)
  );
}
