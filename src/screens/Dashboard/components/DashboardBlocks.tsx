import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { RouteName } from "screens/types";
import { useProfitQuery } from "services/calculate";
import { useOrdersCountQuery } from "services/order";
import { useNumberFormatCurrency } from "utils/currency";
import StatBlock from "./StatBlock";

const styles = StyleSheet.create({
  gutter: {
    width: 8,
  },
  stats: {
    flexDirection: "row",
    paddingVertical: 8,
  },
});

const todayTiemstampsInit = () => {
  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59);
  return [startDate.getTime(), endDate.getTime()];
};

const profitFormatOptions: Intl.NumberFormatOptions = {
  // @ts-ignore
  notation: "compact",
  compactDisplay: "short",
};

const ProfitBlock: FC = () => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const todayTimestamps = useMemo(todayTiemstampsInit, []);
  const { data: profit } = useProfitQuery(
    todayTimestamps[0],
    todayTimestamps[1]
  );

  const numberFormatProfit = useNumberFormatCurrency(profitFormatOptions);

  return (
    <StatBlock
      title={t("stats.profit")}
      subtitle={t("time.today")}
      value={numberFormatProfit.format(profit || 0)}
      onPress={() =>
        navigation.navigate(RouteName.DashboardStats, { tab: "profit" })
      }
    />
  );
};

const OrderCountBlock: FC = () => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const todayTimestamps = useMemo(todayTiemstampsInit, []);
  const { data: ordersCount } = useOrdersCountQuery(
    todayTimestamps[0],
    todayTimestamps[1]
  );

  return (
    <StatBlock
      title={t("order.title_other")}
      subtitle={t("time.today")}
      value={ordersCount || 0}
      onPress={() => navigation.navigate(RouteName.Orders)}
    />
  );
};

export const DashboardBlocks: FC = () => {
  return (
    <View style={styles.stats}>
      <ProfitBlock />
      <View style={styles.gutter} />
      <OrderCountBlock />
    </View>
  );
};
