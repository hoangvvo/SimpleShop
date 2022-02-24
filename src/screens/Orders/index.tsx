import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { BackHandler, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Colors,
  Divider,
  FAB,
  Title,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ParamList } from "screens/types";
import { RouteName } from "screens/types";
import type { Order } from "services/order";
import { useOrdersQuery } from "services/order";
import { TabThemeColor } from "styles/Colors";
import { styles as screenStyles } from "styles/screens";
import OrderItem from "./components/OrderItem";

const styles = StyleSheet.create({
  fab: {
    backgroundColor: TabThemeColor.order,
  },
});

const colorBuy = Colors.red400;
const colorSell = Colors.green400;

const renderItem: ListRenderItem<Order> = ({ item }) => (
  <OrderItem key={item.id} order={item} />
);

const keyExtractor = (item: Order) => String(item.id);

const OrdersScreen: FC<
  MaterialBottomTabScreenProps<ParamList, RouteName.Orders>
> = ({ navigation }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useOrdersQuery();
  const sortedData = useMemo(() => [...(data || [])].reverse(), [data]);

  const [addBtn, setAddBtn] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setAddBtn(false);
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (addBtn) {
          setAddBtn(false);
          return true;
        }
        return false;
      });
      return sub.remove;
    }, [addBtn])
  );

  return (
    <SafeAreaView style={screenStyles.root}>
      <Title style={screenStyles.title}>{t("order.title_other")}</Title>
      <FlatList
        style={screenStyles.fill}
        contentContainerStyle={screenStyles.content}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={isLoading ? <ActivityIndicator /> : null}
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <FAB.Group
        accessibilityLabel={t("order_editor.title_create")}
        visible
        open={addBtn}
        icon={addBtn ? "plus" : "plus"}
        actions={[
          {
            icon: "currency-usd",
            label: t("order.sell"),
            onPress: () =>
              navigation.navigate(RouteName.OrderEditor, { isBuyOrder: false }),
            small: false,
            color: colorSell,
          },
          {
            icon: "package-down",
            label: t("order.buy"),
            onPress: () =>
              navigation.navigate(RouteName.OrderEditor, { isBuyOrder: true }),
            small: false,
            color: colorBuy,
          },
        ]}
        onStateChange={({ open }) => setAddBtn(open)}
        fabStyle={styles.fab}
      />
    </SafeAreaView>
  );
};

export default OrdersScreen;
