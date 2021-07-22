import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card, Colors, IconButton, Text, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ParamList, RouteName } from "screens/types";
import { useProfit } from "services/calculate";
import { useOrdersCount } from "services/order/api";
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

export const DashboardScreen: FC<
  MaterialBottomTabScreenProps<ParamList, RouteName.Dashboard>
> = ({ navigation }) => {
  const todayTimestamps = useMemo(
    () => [new Date().setHours(0).valueOf(), Date.now()],
    []
  );
  const { t } = useTranslation();
  const { data: profit } = useProfit(todayTimestamps[0], todayTimestamps[1]);
  const { data: ordersCount } = useOrdersCount(
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
          <Card style={styles.stat}>
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
