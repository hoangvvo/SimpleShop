import type { FC } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "react-native-paper";
import { useProfitQuery, useProfitSlices } from "services/calculate";
import MoneyChartView from "./components/MoneyChartView";
import ProductRankList from "./components/ProductRankList";
import type { RangeProps } from "./shared";
import { thisMonthDateInit } from "./shared";

const ChartView: FC<RangeProps> = ({ range, setRange }) => {
  const { t } = useTranslation();
  const slices = useProfitSlices(range.from, range.to);
  const { data, isLoading } = useProfitQuery(
    range.from.getTime(),
    range.to.getTime()
  );
  const { data: previousData, isLoading: isLoadingPrev } = useProfitQuery(
    range.from.getTime() - (range.to.getTime() - range.from.getTime()),
    range.from.getTime()
  );

  const fetching = useMemo(() => {
    if (isLoading || isLoadingPrev) return true;
    return slices.some((slice) => slice.isLoading);
  }, [slices, isLoading, isLoadingPrev]);

  return (
    <Card>
      <Card.Content>
        <MoneyChartView
          title={t("stats.profit")}
          range={range}
          setRange={setRange}
          data={
            (slices.filter((v) => !!v.data).map((slice) => slice.data) as {
              from: number;
              to: number;
              value: number;
            }[]) || []
          }
          total={data || 0}
          previousTotal={previousData || 0}
          fetching={fetching}
        />
      </Card.Content>
    </Card>
  );
};

const StatsProfitTab: FC = () => {
  const [range, setRange] = useState<{
    from: Date;
    to: Date;
  }>(thisMonthDateInit);

  return (
    <ProductRankList
      property="profit"
      range={range}
      ListHeaderNode={<ChartView range={range} setRange={setRange} />}
    />
  );
};

export default StatsProfitTab;
