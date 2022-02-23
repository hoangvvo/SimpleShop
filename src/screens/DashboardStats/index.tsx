import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";
import type {
  NavigationState,
  SceneRendererProps,
} from "react-native-tab-view";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import type { ParamList, RouteName } from "screens/types";
import StatsProfitTab from "./StatsProfitTab";
import StatsRevenueTab from "./StatsRevenueTab";

const renderScene = SceneMap({
  revenue: StatsRevenueTab,
  profit: StatsProfitTab,
});

const ThemedTabbar: FC<
  SceneRendererProps & {
    navigationState: NavigationState<any>;
  }
> = (props) => {
  const theme = useTheme();
  return (
    <TabBar
      {...props}
      style={{
        backgroundColor: theme.dark
          ? theme.colors.surface
          : theme.colors.primary,
      }}
    />
  );
};
const renderTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<any>;
  }
) => <ThemedTabbar {...props} />;

const DashboardStatsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.DashboardStats>
> = ({ route }) => {
  const { t } = useTranslation();
  const layout = useWindowDimensions();

  const routes = useMemo(
    () => [
      { key: "revenue", title: t("stats.revenue") },
      { key: "profit", title: t("stats.profit") },
    ],
    [t]
  );
  const [index, setIndex] = useState(() => {
    const tabParam = route.params?.tab;
    if (!tabParam) return 0;
    return routes.findIndex((r) => r.key === tabParam);
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};

export default DashboardStatsScreen;
