import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "react-query";
import type { ParamList } from "screens/types";
import { RouteName } from "screens/types";
import { styles as screenStyles } from "styles/screens";
import { DashboardBlocks } from "./components/DashboardBlocks";
import DashboardRevenue from "./components/DashboardRevenue";

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const DashboardScreen: FC<
  MaterialBottomTabScreenProps<ParamList, RouteName.Dashboard>
> = ({ navigation }) => {
  const { t } = useTranslation();

  const onPressCog = () => navigation.navigate(RouteName.Settings);

  const client = useQueryClient();
  const onRefresh = () => {
    client.invalidateQueries();
  };

  return (
    <SafeAreaView style={screenStyles.root}>
      <View style={styles.header}>
        <Title style={screenStyles.title}>{t("dashboard.title")}</Title>
        <IconButton
          onPress={onPressCog}
          accessibilityLabel={t("settings.title")}
          icon="cog"
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        style={screenStyles.fill}
        contentContainerStyle={screenStyles.content}
      >
        <DashboardRevenue />
        <DashboardBlocks />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
