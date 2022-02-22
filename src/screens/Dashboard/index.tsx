import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  Banner,
  Card,
  Colors,
  IconButton,
  Text,
  Title,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "react-query";
import type { ParamList } from "screens/types";
import { RouteName } from "screens/types";
import { useProductsStockQuery, useProfitQuery } from "services/calculate";
import { useOrdersCountQuery } from "services/order";
import { styles as screenStyles } from "styles/screens";
import { useNumberFormatCurrency } from "utils/currency";

const styles = StyleSheet.create({
  gutter: {
    width: 8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    flex: 1,
    padding: 12,
  },
  statLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
  },
  statTime: {
    fontSize: 12,
    marginBottom: 6,
  },
  statValue: {
    color: Colors.blue400,
    fontSize: 27,
    fontWeight: "bold",
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

const DashboardScreen: FC<
  MaterialBottomTabScreenProps<ParamList, RouteName.Dashboard>
> = ({ navigation }) => {
  const todayTimestamps = useMemo(todayTiemstampsInit, []);
  const { t } = useTranslation();
  const { data: profit } = useProfitQuery(
    todayTimestamps[0],
    todayTimestamps[1]
  );
  const { data: ordersCount } = useOrdersCountQuery(
    todayTimestamps[0],
    todayTimestamps[1]
  );

  const onPressCog = () => navigation.navigate(RouteName.Settings);
  const onPressCardProfit = () =>
    navigation.navigate(RouteName.DashboardProfit);
  const onPressCardOrders = () => navigation.navigate(RouteName.Orders);

  const { data: stocks } = useProductsStockQuery();
  const hasNegativeStock = useMemo(
    () => !!stocks && Object.values(stocks).some((stock) => stock < 0),
    [stocks]
  );

  const numberFormatProfit = useNumberFormatCurrency(profitFormatOptions);
  const client = useQueryClient();
  const onRefresh = () => {
    client.invalidateQueries();
  };

  return (
    <SafeAreaView style={screenStyles.root}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        style={[screenStyles.content, screenStyles.contentRoot]}
      >
        <View style={styles.header}>
          <Title style={screenStyles.title}>{t("dashboard.title")}</Title>
          <IconButton
            onPress={onPressCog}
            accessibilityLabel={t("settings.title")}
            icon="cog"
          />
        </View>
        <View style={styles.stats}>
          <Card style={styles.stat} onPress={onPressCardProfit}>
            <Text style={styles.statLabel}>{t("stats.profit")}</Text>
            <Text style={styles.statTime}>{t("time.today")}</Text>
            <Text style={styles.statValue}>
              {numberFormatProfit.format(profit || 0)}
            </Text>
          </Card>
          <View style={styles.gutter} />
          <Card style={styles.stat} onPress={onPressCardOrders}>
            <Text style={styles.statLabel}>{t("order.title_other")}</Text>
            <Text style={styles.statTime}>{t("time.today")}</Text>
            <Text style={styles.statValue}>{ordersCount}</Text>
          </Card>
        </View>
        <Banner
          visible={hasNegativeStock}
          icon="alert"
          actions={[
            {
              label: t("action.see_more"),
              onPress: () => navigation.navigate(RouteName.Products),
            },
          ]}
        >
          {t("error.negative_stock")}
        </Banner>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
