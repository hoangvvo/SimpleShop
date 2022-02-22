import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Linking,
  ListRenderItem,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Card,
  Colors,
  Divider,
  FAB,
  List,
  Text,
  Title,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ParamList, RouteName } from "screens/types";
import { Order } from "services/order";
import { useOrdersQuery } from "services/order/api";
import { TabThemeColor } from "styles/Colors";
import { styles as screenStyles } from "styles/screens";

const styles = StyleSheet.create({
  fab: {
    backgroundColor: TabThemeColor.order,
  },
  listOpaque: {
    opacity: 0.4,
  },
  listSide: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  listStatusIcon: {
    marginRight: 4,
  },
  listTitle: {
    alignItems: "center",
    flexDirection: "row",
  },
  typeTag: {
    borderRadius: 4,
    justifyContent: "center",
    marginRight: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  typeTagText: {
    color: Colors.white,
    fontSize: 12,
  },
  listStatuses: {
    marginLeft: 4,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
});

const openInMap = (q: string) => {
  const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
  Linking.openURL(`${scheme}${q}`);
};

const OrderItem: FC<{ order: Order }> = ({ order }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onEdit = () =>
    navigation.navigate(RouteName.OrderEditor, {
      id: order.id,
      isBuyOrder: false,
    });

  const openMap = useCallback(() => {
    if (order.loc_text) openInMap(order.loc_text);
  }, [order.loc_text]);

  const listRight = useCallback(
    () => (
      <View style={styles.listSide}>
        {Boolean(order.loc_text) && (
          <Card
            style={styles.listStatuses}
            mode="outlined"
            accessibilityLabel={t("order.loc_text")}
            onPress={openMap}
          >
            <Icon style={{ marginTop: 12 }} name="map" size={24} />
          </Card>
        )}
        <Card
          mode="outlined"
          style={[styles.listStatuses, { backgroundColor: Colors.transparent }]}
        >
          <Icon
            style={styles.listStatusIcon}
            name="cash"
            accessibilityLabel={`${t("order.has_paid")}: ${
              order.has_paid ? t("action.yes") : t("action.no")
            }`}
            color={order.has_paid ? Colors.green400 : Colors.red400}
            size={24}
          />
          <Icon
            style={styles.listStatusIcon}
            name="truck-delivery"
            accessibilityLabel={`${t("order.has_delivered")}: ${
              order.has_delivered ? t("action.yes") : t("action.no")
            }`}
            color={order.has_delivered ? Colors.green400 : Colors.red400}
            size={24}
          />
        </Card>
      </View>
    ),
    [t, order, openMap]
  );

  return (
    <List.Item
      style={
        order.has_delivered && order.has_paid ? styles.listOpaque : undefined
      }
      title={
        <View style={styles.listTitle}>
          <View
            style={[
              styles.typeTag,
              {
                backgroundColor: order.is_buy_order
                  ? Colors.red400
                  : Colors.green400,
              },
            ]}
          >
            <Text style={styles.typeTagText}>
              {order.is_buy_order ? t("order.buy") : t("order.sell")}
            </Text>
          </View>
          <Text>{t("order.order_number_num", { id: order.id })}</Text>
        </View>
      }
      description={order.loc_text || " "}
      right={listRight}
      onPress={onEdit}
    />
  );
};

const renderItem: ListRenderItem<Order> = ({ item }) => (
  <OrderItem order={item} />
);

const keyExtractor = (item: Order) => String(item.id);

export const OrdersScreen: FC<
  MaterialBottomTabScreenProps<ParamList, RouteName.Orders>
> = ({ navigation }) => {
  const { t } = useTranslation();

  const { data } = useOrdersQuery();

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
      <View style={[screenStyles.content, screenStyles.contentRoot]}>
        <Title style={screenStyles.title}>{t("order.title_other")}</Title>
        <FlatList
          style={screenStyles.root}
          ItemSeparatorComponent={Divider}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
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
          },
          {
            icon: "package-down",
            label: t("order.buy"),
            onPress: () =>
              navigation.navigate(RouteName.OrderEditor, { isBuyOrder: true }),
            small: false,
          },
        ]}
        onStateChange={({ open }) => setAddBtn(open)}
        fabStyle={styles.fab}
      />
    </SafeAreaView>
  );
};
