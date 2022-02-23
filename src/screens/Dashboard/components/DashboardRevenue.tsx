import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import MoneyChartView from "screens/DashboardStats/components/MoneyChartView";
import { RouteName } from "screens/types";
import { useRevenueQuery, useRevenueSlices } from "services/calculate";

const styles = StyleSheet.create({
  actions: {
    justifyContent: "flex-end",
  },
});

const thisMonthDateInit = () => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  startDate.setDate(1);
  endDate.setDate(endDate.getDate() + 1);
  return {
    from: startDate,
    to: endDate,
  };
};

const DashboardRevenue: FC = () => {
  const { t } = useTranslation();
  const [range, setRange] = useState<{
    from: Date;
    to: Date;
  }>(thisMonthDateInit);

  const slices = useRevenueSlices(range.from, range.to);
  const { data: revenue } = useRevenueQuery(
    range.from.getTime(),
    range.to.getTime()
  );

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
          total={revenue || 0}
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
