import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import MoneyChartView from "screens/DashboardStats/components/MoneyChartView";
import { thisMonthDateInit } from "screens/DashboardStats/shared";
import { RouteName } from "screens/types";
import { useRevenueQuery, useRevenueSlices } from "services/calculate";

const styles = StyleSheet.create({
  actions: {
    justifyContent: "flex-end",
  },
});

const DashboardRevenue: FC = () => {
  const { t } = useTranslation();
  const [range, setRange] = useState<{
    from: Date;
    to: Date;
  }>(thisMonthDateInit);

  const slices = useRevenueSlices(range.from, range.to);
  const { data, isLoading } = useRevenueQuery(
    range.from.getTime(),
    range.to.getTime()
  );
  const { data: previousData, isLoading: isLoadingPrev } = useRevenueQuery(
    range.from.getTime() - (range.to.getTime() - range.from.getTime()),
    range.from.getTime()
  );

  const fetching = useMemo(() => {
    if (isLoading || isLoadingPrev) return true;
    return slices.some((slice) => slice.isLoading);
  }, [slices, isLoading, isLoadingPrev]);

  const navigation = useNavigation();

  return (
    <Card>
      <Card.Content>
        <MoneyChartView
          title={t("stats.revenue")}
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
      <Card.Actions style={styles.actions}>
        <Button onPress={() => navigation.navigate(RouteName.DashboardStats)}>
          {t("stats.view_detail")}
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default DashboardRevenue;
