import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card, Colors, IconButton, Text, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ParamList, RouteName } from "screens/types";
import { useProfitQuery } from "services/calculate";
import { useOrdersCountQuery } from "services/order/api";
import { styles as screenStyles } from "styles/screens";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
  },
  statsTime: {
    fontSize: 12,
    marginBottom: 6,
  },
  statsValue: {
    fontSize: 27,
    color: Colors.blue400,
    fontWeight: "bold",
  },
  stats: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  stat: {
    flex: 1,
    margin: 4,
    padding: 12,
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

export const DashboardScreen: FC<
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

  return (
    <SafeAreaView style={screenStyles.root}>
      <View style={[screenStyles.content, screenStyles.contentRoot]}>
        <View style={styles.header}>
          <Title style={screenStyles.title}>{t("dashboard.title")}</Title>
          <IconButton
            onPress={() => navigation.navigate(RouteName.Settings)}
            accessibilityLabel={t("settings.title")}
            icon="cog"
          />
        </View>
        <View style={styles.stats}>
          <Card
            style={styles.stat}
            onPress={() => navigation.navigate(RouteName.DashboardProfit)}
          >
            <Text style={styles.statsHeader}>{t("stats.profit")}</Text>
            <Text style={styles.statsTime}>{t("time.today")}</Text>
            <Text style={styles.statsValue}>{profit}</Text>
          </Card>
          <Card
            style={styles.stat}
            onPress={() => navigation.navigate(RouteName.Orders)}
          >
            <Text style={styles.statsHeader}>{t("order.title_plural")}</Text>
            <Text style={styles.statsTime}>{t("time.today")}</Text>
            <Text style={styles.statsValue}>{ordersCount}</Text>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
};
